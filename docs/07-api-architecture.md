# API Architecture

Principles:

1. **Static first.** Anything derivable from the git corpus is served as static/ISR pages or build artifacts (`public/graph.json` in v1). The JSON API exists for interactivity (search, graph traversal, user data), not for rendering pages that could be static.
2. **Edge by default.** Route handlers run on Vercel Edge (`export const runtime = "edge"`) unless they need Prisma-heavy transactions, in which case Node runtime with `directUrl` pooling (Supabase pgBouncer).
3. **Thin handlers.** Handlers validate (Zod), call a service in `src/server/services/`, and shape the response. No business logic in route files.
4. **Public reads, authenticated writes.** All corpus reads are anonymous and cacheable. Every write requires a Supabase session; role checks per `08-auth-and-contribution.md`.

Base path: `/api/v1/*`. Versioned from day one; breaking changes require `v2`.

---

## 1. Endpoint table

| Method + path | Runtime | Auth | Cache | Purpose |
|---|---|---|---|---|
| `GET /api/v1/search?q=&mode=&limit=` | Edge | — | `s-maxage=60, swr=600` (lexical); `no-store` (semantic) | Unified search (§3). |
| `GET /api/v1/suggest?q=` | Edge | — | `s-maxage=300` | Typeahead for Cmd-K (prefix + trigram). |
| `GET /api/v1/graph?node=&depth=&categories=&edges=` | Edge | — | `s-maxage=300, swr=86400` | Graph neighborhood (§4). |
| `GET /api/v1/graph/full` | Edge | — | `s-maxage=3600, swr=86400`, ETag | Whole-corpus graph for `/explore` (id, title, category, edge list only; ~gzip 150KB budget). |
| `GET /api/v1/articles/{category}/{slug}` | Edge | — | `s-maxage=300, swr=86400` | Article metadata + edges + citations (no body — body is in the page). |
| `GET /api/v1/articles/{...}/related` | Edge | — | `s-maxage=3600` | Typed edges + embedding neighbors, merged and ranked. |
| `GET /api/v1/articles/{...}/revisions` | Node | — | `s-maxage=3600` | Revision list from DB mirror. |
| `GET /api/v1/categories` | Edge | — | `s-maxage=3600` | Category index with counts. |
| `GET /api/v1/paths` / `GET /api/v1/paths/{slug}` | Edge | — | `s-maxage=3600` | Path catalog / outline. |
| `POST /api/v1/ai/ask` | Edge (streaming) | optional | `no-store` | Grounded Q&A ("Ask Equilibrium"), SSE stream (see `09`). |
| `GET /api/v1/ai/summary/{articleId}` | Edge | — | `s-maxage=86400`, keyed by `contentHash` | Cached AI summary. |
| `GET /api/v1/me` | Node | ✅ | `private, no-store` | Session profile + roles. |
| `GET/PATCH /api/v1/me/profile` | Node | ✅ | `no-store` | Profile CRUD. |
| `GET/PUT/DELETE /api/v1/me/bookmarks/{articleId}` | Node | ✅ | `no-store` | Bookmark toggle; `GET /me/bookmarks` lists. |
| `GET/POST/PATCH/DELETE /api/v1/me/notes[...]` | Node | ✅ | `no-store` | Notes CRUD. |
| `GET/POST/DELETE /api/v1/me/highlights[...]` | Node | ✅ | `no-store` | Highlights CRUD. |
| `POST /api/v1/me/progress` | Node | ✅ | `no-store` | Mark step complete `{stepId, score?}`; idempotent. |
| `GET /api/v1/discussions?articleId=` | Edge | — | `s-maxage=30` | Threads + posts (paginated). |
| `POST /api/v1/discussions` / `POST /api/v1/discussions/{id}/posts` | Node | ✅ contributor+ | `no-store` | Create thread / reply. |
| `GET /api/v1/community/feed` | Edge | — | `s-maxage=300` | Merged contributions feed. |
| `GET /api/v1/community/contributors/{handle}` | Edge | — | `s-maxage=300` | Public contributor profile. |
| `POST /api/v1/webhooks/github` | Node | HMAC | `no-store` | PR merged → upsert `Contribution`, trigger content sync + revision mirror. |
| `POST /api/v1/internal/sync` | Node | deploy secret | `no-store` | Post-deploy corpus sync (articles, edges, embeddings). |
| `GET /og/{...slug}` | Edge | — | `immutable` (hash in URL) | OG image generation (`10-seo-strategy.md`). |

Conventions: JSON `{ data, error: null } | { data: null, error: { code, message } }`; cursor pagination (`?cursor=&limit=`, max 50); errors use RFC-ish codes (`not_found`, `unauthorized`, `rate_limited`, `validation_failed` + Zod issues). Rate limits (Upstash Redis, edge): anonymous 60 req/min, `POST /ai/ask` 10 req/min anon / 30 authed, writes 30 req/min.

## 2. Caching strategy

Layered:

1. **Build/ISR** — knowledge pages are static with `generateStaticParams`; content deploys revalidate everything (content is versioned with the build, so stale-page bugs are impossible by construction).
2. **CDN (`Cache-Control: s-maxage` + `stale-while-revalidate`)** — all anonymous GET endpoints per the table. Corpus endpoints additionally send `ETag` derived from the deploy's content hash; clients revalidate cheaply.
3. **Data cache** — service-layer `unstable_cache`/`react-cache` around Prisma reads with tags: `article:{id}`, `graph`, `category:{id}`. The sync job calls `revalidateTag` for exactly what changed.
4. **Client** — TanStack Query for user data (`staleTime: 30s`), optimistic updates for bookmarks/highlights/progress; graph dataset cached in IndexedDB keyed by deploy hash (also powers PWA offline, `12-performance.md`).

Never cached: anything under `/me`, semantic search, AI ask.

## 3. Search API

`GET /api/v1/search` with `mode=auto|lexical|semantic` (default `auto`):

- **Lexical:** Postgres FTS (`websearch_to_tsquery`, weighted `title A, summary B, searchText C`) + `pg_trgm` similarity for fuzzy/typo matches, merged with reciprocal rank fusion. Serves the Cmd-K instant path — target p95 < 120ms at the edge (region-pinned DB read replica).
- **Semantic:** query → embedding (`text-embedding-3-small`, 1536d) → pgvector HNSW cosine top-20 → light rerank (recency + status boost: verified 1.2×). Latency budget p95 < 700ms; only invoked for question-shaped or zero-lexical-result queries in `auto` mode.
- Response items: `{ id, title, slug, category, type, status, snippet (highlighted), score, source: 'lexical'|'semantic' }`, grouped client-side per the IA ordering (`01`).

Full details and the AI layer in `09-search-and-ai.md`.

## 4. Graph API

- `GET /graph/full`: nodes `[{ id, slug, category, title, type, status }]`, edges `[[fromIdx, toIdx, typeCode]]` (index-referenced, compact). Positions are **not** served — layout is computed client-side (deterministic seed per deploy hash so layouts are stable between visits and cacheable in IndexedDB).
- `GET /graph?node={slug}&depth=1..3`: BFS via a recursive CTE capped at 300 nodes; used by `MiniGraph` and deep links. `?categories=` and `?edges=` filter server-side so payloads stay small.
- v1 note: before the DB exists, both shapes are served from build-generated `public/graph.json` + a static per-node neighborhood map — same TypeScript types (`GraphData` in `src/lib/graph/types.ts`), so the swap to DB-backed endpoints is invisible to the client.

## 5. Security

- Supabase JWT verified in edge middleware; role claims injected into request context. RLS is the backstop — handlers use the user-scoped client for user data, service-role only in `internal/*` and webhooks.
- GitHub webhook: HMAC-SHA256 signature check + delivery-id replay guard.
- CORS: API is same-origin only, except `GET /api/v1/graph/full`, `/search`, `/categories` which are public-CORS (`*`) as the open-data surface; a versioned dataset export lands in v3 (`13-roadmap.md`).
- All inputs Zod-validated; no raw string interpolation into SQL (Prisma + parameterized `$queryRaw` for FTS/vector).

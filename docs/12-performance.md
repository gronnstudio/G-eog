# Performance

Target: **Lighthouse 100 / 100 / 100 / 100** on every public route (mobile, throttled), and field CWV green at p75. Performance is a design feature: a calm site is a fast site. Budgets are enforced in CI — a regression fails the build like a broken test.

---

## 1. Budgets (per route, mobile throttled)

| Metric | Budget |
|---|---|
| LCP | ≤ 1.8s lab / ≤ 2.0s field p75 |
| CLS | ≤ 0.02 (yes, stricter than "good") |
| INP | ≤ 150ms field p75 |
| TBT | ≤ 100ms lab |
| First-load JS (route, gzip) | home/knowledge/article ≤ 110KB · learn ≤ 130KB · explore ≤ 210KB (incl. graph engine) |
| HTML document | ≤ 60KB gzip |
| Fonts | ≤ 120KB total (2 variable fonts, subset) |
| Per-page image weight above fold | ≤ 180KB |
| `graph/full` payload | ≤ 150KB gzip |

Enforced by: `next build` bundle analysis diff in CI (fails on > 5% route JS growth without a budget-change commit), Lighthouse CI on the 12-page golden set per deploy.

## 2. Rendering strategy (Server Components + streaming)

- **RSC by default.** Client components only for: palette, theme toggle, graph, TOC observer, bookmarks/notes/highlights, checkpoints, discussion forms. Everything else — article bodies, listings, panels — ships zero JS.
- **Static generation** for all knowledge/learn/about routes via `generateStaticParams`; content changes redeploy (git-based content makes builds deterministic). ISR (1h) only on aggregate pages (home, community feed sections).
- **Streaming:** dynamic islands (discussion, community feed, personal state) wrapped in `Suspense` with geometry-exact skeletons; the article itself never waits on them. `loading.tsx` per route group.
- Personalized bits (bookmark state, progress) hydrate client-side from `/api/v1/me/*` after paint — pages are cacheable for everyone; no per-user server rendering of static content.

## 3. Edge & caching

Per `07-api-architecture.md` §2: static pages on Vercel's CDN; edge runtime for anonymous APIs; `s-maxage + stale-while-revalidate` everywhere cacheable; ETags keyed on deploy content hash. Middleware is minimal (session refresh only, matcher-scoped) — every middleware millisecond taxes all routes.

## 4. Image pipeline

- All raster through **Cloudflare Images** (originals in R2): AVIF→WebP negotiation, exact-width variants (`320/640/960/1280/1920`), `next/image` custom loader.
- LCP images: `priority`, `fetchpriority="high"`, explicit dimensions, no animation (per `04` §4), preconnect to the image host in root layout.
- Everything below fold: `loading="lazy"` + `decoding="async"`. Blur placeholders from 16px LQIP embedded at build (base64 in the content manifest, ~200B each) → CLS 0.
- Duotone treatment applied at upload time (variant), not runtime CSS filters.

## 5. Fonts

`next/font` self-hosted: Inter var (latin subset, ~45KB woff2) + Playfair Display var (latin, ~38KB), `display: swap`, preloaded. Fallbacks metric-adjusted (`adjustFontFallback`) → zero font-swap CLS. No third-party font hosts.

## 6. JS discipline

- `dynamic(() => import(...), { ssr: false })` for: `GraphCanvas` (+ engine), Lenis, checkpoint runner, discussion editor. The graph engine never appears in any non-explore bundle (enforced by bundle-analysis assertion).
- No moment/lodash-class dependencies; date formatting via `Intl`. Framer Motion imported via `m` + `LazyMotion` (domAnimation) — saves ~25KB.
- Third-party scripts: none. Analytics is Vercel's beacon (no blocking script).

## 7. Canvas/graph perf budget

- **Frame budget:** 16.7ms; simulation ≤ 6ms, draw ≤ 8ms, headroom 2.7ms — measured via `performance.mark` in dev HUD.
- **Layout off the main thread:** force simulation runs in a Web Worker (or is pre-warmed from the deterministic seed, `07` §4); main thread only interpolates positions.
- **LOD:** labels only for focused node + neighbors above zoom 0.6; nodes below 2.5px rendered as batched points; edges culled outside viewport + 20% margin; `devicePixelRatio` capped at 2.
- **Idle discipline:** drift animation pauses on `document.hidden`, on reduced motion, and after 30s without interaction (single settled frame, zero CPU).
- **Memory:** typed arrays for positions/edges (no per-node objects in the hot loop); target < 80MB heap at 1,000 nodes / 4,000 edges.
- Interaction: hit-testing via spatial grid, pointer events passive; camera transforms are canvas-internal (no DOM style thrash).
- Fallback ladder: WebGL → Canvas2D (< 300 nodes visible) → static SVG snapshot (no-JS/reduced-data). `MiniGraph` on articles is always the Canvas2D tier, lazy-mounted on intersection.

## 8. PWA & offline

- `manifest.webmanifest` (installable, `display: standalone`, Deep Forest theme color) + service worker (Serwist):
  - **Precache:** app shell, fonts, Tier-0 search index (`09` §1), offline page.
  - **Runtime:** stale-while-revalidate for pages and `graph/full` (IndexedDB, keyed by deploy hash); cache-first for images (LRU 50MB); network-only for `/me/*` and AI.
  - **Offline UX:** previously read articles + bookmarked articles (proactively cached on bookmark) readable offline; `/offline` fallback offers the local search index; progress made offline queues in IndexedDB and syncs via Background Sync when online.
- SW updates: `skipWaiting` prompted via toast ("Updated content available — refresh"), never silent mid-session swap.

## 9. Monitoring & regression control

- **Field:** Vercel Speed Insights (CWV p75 per route group); alert threshold = budget +10%.
- **Lab:** Lighthouse CI per deploy (golden set, mobile throttle); Playwright perf traces for palette-open (< 16ms) and graph first-frame (< 800ms on mid-tier device profile).
- Every PR touching `explore`, images, fonts, or middleware requires a before/after trace in the description.
- Quarterly device-lab pass: real mid-range Android (the honest baseline), throttled 4G.

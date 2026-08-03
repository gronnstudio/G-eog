# Information Architecture & Sitemap

Equilibrium's IA has three navigational modes that all resolve to the same node set:

1. **Hierarchical** — `/knowledge` → category → article (the Library).
2. **Relational** — `/explore` graph traversal (the Graph).
3. **Sequential** — `/learn` paths (the School).

A node (article, species profile, technique) has exactly one canonical URL under `/knowledge/[category]/[slug]`. Graph and learn views deep-link to canonical URLs; they never duplicate content.

---

## 1. Global navigation

**Header (persistent, glass):** Logo → `/` · Explore · Knowledge · Learn · Community · Search trigger (Cmd-K) · Theme picker (Auto · Golden Hour · Blue Hour) · Auth avatar.
**Footer:** About, Contribute, License (CC BY-SA 4.0), GitHub, RSS, Sitemap, GRØNN Studio credit.
**Cmd-K palette:** available on every route; searches articles, categories, paths, and actions ("Switch palette (Auto / Golden Hour / Blue Hour)", "Random article", "Go to graph").

## 2. Complete sitemap

| Route | Params | Rendering | Purpose |
|---|---|---|---|
| `/` | — | Static (ISR 1h) | Editorial home: hero, featured articles, category grid, graph teaser, latest additions, path highlights. |
| `/explore` | `?node=`, `?category=`, `?depth=`, `?edge=` (URL-synced state) | Client canvas + static shell | Full interactive knowledge graph. Query params make any graph view shareable. |
| `/knowledge` | — | Static (ISR 1h) | Category index: all 24 categories with counts, descriptions, cover art. |
| `/knowledge/[category]` | `category` ∈ 24 slugs (below) | Static, `generateStaticParams` | Category landing: intro essay, subtopics, article list (filter: type, verified, updated), related categories. |
| `/knowledge/[category]/[slug]` | `slug` = article slug | Static, `generateStaticParams`, ISR on content deploy | Article page: MDX body, TOC, citations, relationship panel, mini-graph, revisions, discussion, "Improve this page". |
| `/learn` | — | Static (ISR 1h) | Learning path catalog with difficulty, duration, progress (if authed). |
| `/learn/[path]` | `path` slug | Static shell + client progress | Path overview: module list, prerequisites, outcomes, enroll CTA. |
| `/learn/[path]/[step]` | step slug | Static + client progress | A step: embedded article or interstitial, prev/next, checkpoint quiz. |
| `/community` | — | Dynamic (edge) | Contribution hub: recent PRs merged, open review requests, top contributors, discussion activity. |
| `/community/contributors/[handle]` | GitHub/user handle | Dynamic | Contributor profile: merged contributions, expertise badges, achievements. |
| `/about` | — | Static | Mission, philosophy, team, license, methodology, verification policy. |
| `/search` | `?q=` | Dynamic (edge) | Full search results page (fallback/deep-link for the palette; same API). |
| `/profile` | — (auth) | Dynamic | Own profile: bookmarks, notes, highlights, progress, settings. |
| `/profile/bookmarks` · `/profile/notes` · `/profile/progress` | auth | Dynamic | Sub-views of personal library. |
| `/auth/sign-in` · `/auth/callback` | — | Dynamic | Supabase auth entry + OAuth callback. |
| `/api/*` | see `07-api-architecture.md` | Edge/Node handlers | JSON API. |
| `/og/[...slug]` | any node | Edge | Dynamic OG image generation (`@vercel/og`). |
| `/sitemap.xml`, `/sitemap-[n].xml`, `/robots.txt`, `/manifest.webmanifest`, `/rss.xml` | — | Static/generated | SEO + PWA plumbing. |
| `/offline` | — | Static | PWA offline fallback. |
| `/404`, `/500` | — | Static | Error pages with search + graph escape hatches. |

## 3. The 24 categories (canonical slugs)

Ordered by realm; slug = kebab-case; each has a fixed accent tone from the palette ramp.

| Realm | Categories (slug) |
|---|---|
| **Ground** | `soil`, `water`, `hydrology` |
| **Life** | `trees`, `plants`, `botany`, `fungi`, `microbiology`, `animals`, `biodiversity`, `biology` |
| **Systems** | `ecology`, `climate`, `permaculture`, `food-forests`, `circular-systems` |
| **Built** | `construction`, `energy`, `landscape-design`, `urban-ecology` |
| **Science** | `chemistry` |
| **Mind** | `philosophy`, `psychology`, `economics` |

Category set is **closed** — new categories require a maintainer RFC. Subtopics inside a category are open (tag-driven).

## 4. Node types

| Type | Lives at | Notes |
|---|---|---|
| `article` | `/knowledge/[category]/[slug]` | Long-form editorial reference. Default type. |
| `species` | same route, `type: species` frontmatter | Structured profile (taxonomy, range, functions, companions) rendered with the SpeciesCard layout. |
| `technique` | same route | Step-structured guide (materials, steps, cautions). |
| `path` | `/learn/[path]` | Sequenced composition of nodes + interstitials. |
| `category` | `/knowledge/[category]` | Curated landing; also a graph super-node. |

## 5. Relationship taxonomy (edge types)

Edges are directed, typed, and authored in frontmatter (see `05-content-model.md`). Types: `depends-on`, `enables`, `part-of`, `relates-to`, `contrasts-with`, `symbiotic-with` (species), `succeeded-by` (technique/succession). The graph, "Related" panels, and prerequisite logic in `/learn` all consume this single edge set.

## 6. URL & slug rules

- Lowercase kebab-case, ASCII, ≤ 60 chars, no dates, no IDs. Slugs are permanent; renames require a redirect entry in `content/_redirects.json` (compiled to Next `redirects()`).
- Category is part of the canonical path. An article belongs to exactly **one** primary category; cross-category presence is expressed via edges and tags, never duplicate URLs.

## 7. Breadcrumbs & context

Every article renders: `Knowledge → {Category} → {Article}` (with `BreadcrumbList` JSON-LD, see `10-seo-strategy.md`). The relationship panel shows inbound + outbound edges grouped by type; the mini-graph shows depth-1 neighborhood with a "Open in Explore" deep link carrying `?node={slug}`.

## 8. Search IA

Cmd-K result groups, in order: **Actions** (max 3) → **Articles** (max 6) → **Categories** (max 3) → **Learning paths** (max 3) → **Ask Equilibrium** (semantic answer entry, when query is question-shaped). Enter on zero-result state routes to `/search?q=` with semantic fallback.

---

*Any new route requires an entry in this table plus SEO (`10`) and a11y (`11`) review before merge.*

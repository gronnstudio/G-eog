# SEO Strategy

Equilibrium's SEO thesis: **be the canonical, fastest, best-structured source for regenerative knowledge queries.** Long-tail informational queries ("mycorrhizal network nutrient exchange", "black alder nitrogen fixation") are the target; editorial quality + structured data + speed do the work. No dark patterns, no SEO-spam content — ranking is a byproduct of the corpus.

---

## 1. Metadata

Central helper `src/lib/seo.ts` → `buildMetadata()`; every route exports `generateMetadata` through it (no hand-rolled meta anywhere).

- **Titles:** `{Article} — {Category} · Equilibrium` (≤ 60 chars; helper truncates on word boundary). Home: `Equilibrium — The living knowledge ecosystem for regenerative thinking`.
- **Descriptions:** article `summary` frontmatter verbatim (already constrained to 120–200 chars in `05` — one field, three uses: cards, meta, embeddings context).
- **Canonical:** absolute, always the `/knowledge/[category]/[slug]` form; `/explore?node=` and `/learn` step views pointing at article content set canonical to the article.
- **Robots:** index everything public; `noindex` on `/search`, `/profile*`, `/auth/*`, `/offline`, pagination beyond page 1 of listings (`rel=canonical` to page 1).
- Draft-status articles: indexed but with `max-snippet:160` and the draft badge visible — honesty over polish; alternatively flip to `noindex` via a single flag if draft quality dips (maintainer decision, documented here when changed).

## 2. Open Graph / Twitter

- Dynamic OG images at `/og/[...slug]` via `@vercel/og` (edge, Satori): Deep Forest canvas, category tone accent bar, Playfair title, category + verification badge, subtle node-graph motif from the article's actual depth-1 neighborhood (pre-computed positions, drawn as SVG). 1200×630, < 300KB.
- URL includes `contentHash` fragment → `Cache-Control: immutable`.
- `twitter:card = summary_large_image`. Category and path pages get templated variants; home uses a hand-made hero image.

## 3. Structured data (JSON-LD)

Emitted by `<StructuredData>` per page type; validated in CI with `schema-dts` typing + a Rich Results test on the golden set of 10 URLs.

| Page | Types |
|---|---|
| Article | `Article` (headline, author `Person`, dates, publisher `Organization` Equilibrium, `isAccessibleForFree: true`, `license: CC BY-SA 4.0` URL) + `BreadcrumbList` + `speakable` on summary |
| Species | `Article` + `Taxon` (scientificName, taxonRank, parentTaxon via family) — Taxon markup is rare and a differentiator for species queries |
| Technique | `Article` + `HowTo` (steps, materials from `TechniqueSteps` data) |
| Category | `CollectionPage` + `BreadcrumbList` + `ItemList` of top articles |
| Learning path | `Course` (provider Equilibrium, `isAccessibleForFree: true`) + `ItemList` of modules |
| Graph dataset (v3 export) | `Dataset` (distribution: JSON download URL, license, variableMeasured: nodes/edges) on `/about#data` |
| All | `WebSite` with `SearchAction` (`/search?q={search_term_string}`) on home; `Organization` with logo |

## 4. Sitemaps & feeds

- `app/sitemap.ts` generates a sitemap index: `sitemap-knowledge.xml` (all articles, `lastmod` from git `updatedAt`, priority by status: verified 0.9 / reviewed 0.7 / draft 0.5), `sitemap-core.xml` (home, categories, paths, about). Regenerated every deploy; pinged via IndexNow.
- `rss.xml`: new + majorly-updated articles (label-driven per `08` §5); per-category feeds at `/knowledge/[category]/rss.xml`.
- `robots.txt`: allow all, sitemap pointer, explicit allow for AI crawlers on content routes (open knowledge is the mission) — revisit if abuse emerges.

## 5. Internal linking

The edge graph is also the SEO graph: `RelationshipPanel` + inline links give every article rich, typed, crawlable internal links (server-rendered `<a>`, never JS-only). The ≥ 3 edges rule (`05` §3) doubles as a minimum-internal-link rule. Category pages link every child article (paginated listings server-rendered). Breadcrumbs on every article. `/explore` links are supplementary — crawlers get the same connectivity via HTML.

## 6. i18n plan

- **v1–v2:** English only, `lang="en"`, but the frontmatter `lang` field, URL design, and string extraction (`next-intl`) are in place from the start.
- **v3:** Norwegian Bokmål (`nb`) then German (`de`), sub-path locales: `/nb/knowledge/jord/...` (translated category slugs, mapped in `content/i18n/slugs.{locale}.json`).
- Translation model: translated articles are **first-class content files** (`content/knowledge-nb/...`) with `translationOf:` frontmatter — same validation, own review flow (translation-reviewer role variant), never machine-translated pages served raw. Untranslated articles fall back to English with a visible notice, `hreflang` only emitted for genuinely translated pairs (`x-default` = en).
- UI strings translated fully before a locale launches; a locale ships when ≥ 40 verified articles exist in it.

## 7. Measurement

- Search Console per-directory tracking (`/knowledge/{category}/`) to see which realms rank; quarterly content-gap review merges GSC query data into the gap-detection worklist (`09` §4.3).
- Core Web Vitals field data via Vercel Analytics — perf regressions are SEO regressions (`12-performance.md` owns budgets).
- No third-party tracking scripts; analytics stays cookieless.

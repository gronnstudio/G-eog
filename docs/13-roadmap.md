# Roadmap

From the current v1 (static seed corpus, canvas graph, no accounts) to the full living platform (database, auth, AI, community). Each phase ships user-visible value and leaves the system deployable; no phase depends on a future one to be coherent. Dates are targets, not promises — scope is fixed per phase, time flexes.

---

## Phase 1 — Foundation (current → v1.0, Q3 2026)

*Goal: the best static reference site in the space. Everything derivable from git, no backend.*

- [x] Next.js 15 App Router + Tailwind 4 scaffold, design tokens (`02`), core primitives.
- [x] 24 category structure, MDX pipeline, frontmatter schema + `validate-content.ts` (`05`).
- [ ] Seed corpus: ≥ 120 articles across all categories (≥ 3 per category), ≥ 600 authored edges, all with citations.
- [ ] `/`, `/knowledge`, category pages, article pages (TOC, citations, relationship panel, mini-graph).
- [ ] `/explore` canvas graph v1: full corpus from `public/graph.json`, filters, node preview, URL-synced state, keyboard parity + `GraphA11yList` (`11` §3).
- [ ] Cmd-K with local MiniSearch index (Tier 0 only).
- [ ] `/about`, static `/learn` preview (2 paths, progress in localStorage), `/community` as contribution explainer.
- [ ] SEO complete: metadata, OG generation, JSON-LD, sitemaps, RSS (`10`).
- [ ] PWA + offline shell; Lighthouse 100×4 on golden set; a11y CI green (`11`, `12`).
- [ ] "Improve this page" → GitHub edit flow live; CONTRIBUTING.md; validation CI on external PRs.

**Exit criteria:** corpus targets met; budgets green; 5 external PRs merged during beta.

## Phase 2 — Memory (v1.5, Q4 2026)

*Goal: the platform remembers — database, auth, personal library.*

- Supabase project: Postgres + Prisma schema (`06`), RLS, auth (GitHub/Google/magic link), `/auth/*` + middleware (`08` §1).
- Post-deploy content sync job (`internal/sync`): articles, edges, revisions mirrored to DB; `graph/full` + neighborhood endpoints move from static JSON to API with identical types (`07` §4).
- Personal library: bookmarks, notes, highlights (text-quote anchors), `/profile*` routes; signed-out → sign-in replay + localStorage progress migration.
- Server search Tier 1: Postgres FTS + trigram, `/api/v1/search` lexical, `/search` page; golden-set MRR gate in CI (`09` §6).
- GitHub webhook → `Contribution` rows, contributor auto-promotion, `/community` feed + contributor profiles.

**Exit criteria:** 1,000 registered users without incident; search p95 < 120ms; zero RLS findings in security review.

## Phase 3 — School (v2.0, Q1 2027)

*Goal: learning paths as a first-class product.*

- Full `/learn`: path catalog, outlines with prerequisite locks, step frames, checkpoints, synced progress, enrollments, completion achievements (`03` §5, `06`).
- 5 complete paths (Soil Fundamentals, Water in the Landscape, Food Forest Design, Reading Ecosystems, Circular Systems 101) — authored and expert-verified.
- Reviewer role + peer-review pipeline formalized; CODEOWNERS per category; verification badges + revision history UI (`08`).
- i18n plumbing (next-intl, string extraction) — English-only still, but translation-ready (`10` §6).

**Exit criteria:** ≥ 500 path enrollments, ≥ 35% path completion rate on the beginner path; ≥ 25 total external contributors.

## Phase 4 — Intelligence (v2.5, Q2 2027)

*Goal: semantic layer and assistant, with the guardrails of `09` in full force.*

- Embeddings pipeline (pgvector, chunking, HNSW) in the sync job; semantic search + `auto` mode; section-anchored deep links.
- AI summaries (contentHash-cached), related-suggestion panel (edges + neighbors), enrichment PRs (tag/edge suggestions, human-reviewed).
- Gap detection job → "Wanted articles" board on `/community`.
- Ask Equilibrium: grounded streaming Q&A with citation enforcement + low-confidence refusal state; tutor mode inside `/learn`.
- Eval harness: golden Q&A set, citation-validity scoring, cost dashboards.

**Exit criteria:** semantic search live under latency budget; ask-feature citation validity ≥ 95% on eval; token spend within monthly ceiling for 2 consecutive months.

## Phase 5 — Commons (v3.0, Q3–Q4 2027)

*Goal: self-sustaining community and open data.*

- Per-article discussions (threads, single-level replies, moderation tools), review queue UI for reviewers/experts.
- Expert program at scale: ≥ 12 categories with named experts; stale-verification automation (24-month re-attestation issues).
- Achievements system; contributor reputation surfaced (merged counts, expertise badges — no gamified points economy).
- Open data: versioned dataset export (nodes/edges/citations as JSON + `Dataset` JSON-LD), public read API documented, CORS-open corpus endpoints (`07` §5).
- i18n launch: Norwegian Bokmål, then German (translation review flow, per-locale sitemaps/hreflang).
- Governance hardening: maintainer group beyond GRØNN Studio, RFC process battle-tested, sustainability plan (grants/donations) published on `/about`.

**Exit criteria:** 100k monthly readers; ≥ 40 verified nb articles (locale launch bar); ≥ 3 non-studio maintainers.

## Continuous tracks (every phase)

- **Corpus growth:** editorial calendar targets +15 articles/month from Phase 2; gap-detection worklist drives commissioning.
- **Quality gates:** Lighthouse 100×4, a11y CI, contrast audit, search MRR, bundle budgets — never traded for features.
- **Design integrity:** any new surface passes design review against `02`–`04` before build.

## Explicit deferrals (revisit only with evidence)

Native apps (PWA is the bet) · real-time collaboration on notes · federated/ActivityPub features · user-generated public articles outside the PR flow · monetization of any kind.

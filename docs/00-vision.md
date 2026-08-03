# Equilibrium (EOG) — Vision

> **The world's living knowledge ecosystem for regenerative thinking.**

Equilibrium is an open-source knowledge hub for regenerative and ecological knowledge, built and maintained as a side brand of GRØNN Studio. It exists to make humanity's ecological knowledge **freely accessible, beautifully organized, and endlessly connected**.

---

## 1. Mission

Ecological knowledge is scattered — across paywalled journals, forgotten forums, out-of-print books, and the heads of practitioners. Equilibrium collects, curates, and connects that knowledge into a single, open, living system.

Concretely, we exist to:

1. **Open** — every article, dataset, and learning path is free, forever, under an open license (CC BY-SA 4.0 for content, MIT for code).
2. **Organize** — 24 interlinked categories spanning soil to psychology, curated with editorial rigor, not wiki sprawl.
3. **Connect** — knowledge is a graph, not a filing cabinet. Every article declares its relationships; the graph is a first-class, explorable interface.
4. **Teach** — structured learning paths turn a reference library into a school.
5. **Grow** — contribution is git-native, peer-reviewed, and expert-verified, so the corpus compounds in quality, not just quantity.

## 2. Philosophy — "Everything is connected"

Knowledge should behave like nature. Each principle below is a product constraint, not a slogan:

| Principle | Product consequence |
|---|---|
| **Interconnected** | No orphan pages. Every article has ≥3 typed relationships (see `05-content-model.md`). The graph view (`/explore`) is a primary navigation surface, not a gimmick. |
| **Evolving** | Content is versioned in git. Revisions, review states, and verification badges are visible on every page. Nothing pretends to be finished. |
| **Adaptive** | The system learns: reading history informs suggestions, gap detection finds missing links, learning paths adapt to progress. |
| **Discoverable** | Search is instant (Cmd-K), lexical **and** semantic. You can ask a question in plain language and land on the right node. |
| **Beautiful** | Editorial, premium design (Apple × National Geographic × Linear × Arc × Obsidian). Beauty is a retention strategy: people return to places that feel good. |
| **Open** | Open source, open content, open data (public API + dataset exports). Forkable by design. |

## 3. Product pillars

### Pillar 1 — The Library (`/knowledge`)
A curated, category-organized reference: long-form editorial articles, species profiles, technique guides. Dense with citations, verified by domain experts. The canonical record.

### Pillar 2 — The Graph (`/explore`)
An interactive canvas/WebGL knowledge graph of every node and typed edge. Filter by category, relationship type, or depth. The graph is the honest representation of the corpus — the library is one projection of it.

### Pillar 3 — The School (`/learn`)
Sequenced learning paths (e.g. "Soil Fundamentals", "Design a Food Forest") composed from library articles plus path-specific interstitials, with progress tracking, checkpoints, and completion achievements.

### Pillar 4 — The Commons (`/community`)
Contribution, discussion, and stewardship. GitHub-based editing flow ("Improve this page" → PR → peer review → expert verification), per-article discussions, contributor profiles and reputation.

### Pillar 5 — The Assistant (search + AI)
Semantic search, AI summaries, related-content suggestions, knowledge-gap detection, and a grounded tutor — always cited, always subordinate to human-verified content (guardrails in `09-search-and-ai.md`).

## 4. Audience

1. **Practitioners** — permaculturists, farmers, landscape designers, builders. Need: fast, trustworthy answers with sources.
2. **Learners** — students and career-changers. Need: structured paths, not a pile of links.
3. **Researchers & educators** — need: citations, data exports, stable URLs.
4. **Contributors** — domain experts and writers. Need: a contribution flow that respects their time and credits their work.

## 5. Non-goals

- **Not a wiki.** Anyone can propose; editors and experts decide. Quality over coverage.
- **Not a social network.** Discussion serves articles; there is no feed, no follower economy.
- **Not an AI content farm.** AI assists tagging, linking, and summarizing of human-authored, human-verified content. AI never publishes.
- **Not a marketplace.** No ads, no paywalls, no sponsored content. Funding via GRØNN Studio, grants, and donations.

## 6. Success criteria (v1 → v3)

| Horizon | Signal |
|---|---|
| v1 (launch) | 24 categories seeded, ≥120 articles, graph with ≥600 edges, Lighthouse 100/100/100/100, Cmd-K search < 50 ms perceived. |
| v2 | Auth + progress live; ≥25 external contributors merged; 5 complete learning paths; semantic search shipped. |
| v3 | Expert-verification program running in ≥12 categories; public API + dataset export; i18n (nb, de) live; 100k monthly readers. |

## 7. Brand relationship

Equilibrium is designed, engineered, and stewarded by **GRØNN Studio**, but is an independent, open project: its content, data model, and codebase must survive without the studio. Governance details live in `08-auth-and-contribution.md`.

---

*Document owner: GRØNN Studio · Status: living · See `13-roadmap.md` for phasing.*

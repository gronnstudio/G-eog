# Content Model & Pipeline

Content is **markdown-first and git-based**: the `content/` directory in this repository is the canonical corpus. The database (`06-database-schema.md`) indexes and augments it (search, edges, user data) but never owns article text. If the database vanished, the knowledge survives.

```
content/
  knowledge/
    soil/
      soil-food-web.mdx
      ...
    water/ ... (one dir per category, 24 total)
  paths/
    soil-fundamentals/
      path.yaml
      steps/01-intro.mdx        # interstitials only; most steps reference articles
  glossary.yaml
  citations/                     # shared BibTeX-style sources
    sources.bib
  _redirects.json
```

---

## 1. Pipeline

1. **Author** writes MDX + frontmatter on a branch (or via GitHub web editor from "Improve this page").
2. **Validate** — CI runs `scripts/validate-content.ts`: schema, links, edges, citations (see §4). PRs fail fast with human-readable errors.
3. **Review** — peer review → expert verification per `08-auth-and-contribution.md`.
4. **Merge → build** — Next.js build compiles MDX (via `@next/mdx` + remark/rehype pipeline), regenerates the graph dataset (`public/graph.json` in v1; DB sync job in v2+), computes reading time, extracts headings/TOC, and generates OG images.
5. **Sync** — post-deploy job upserts article metadata, edges, and embeddings into Postgres (v2+), keyed by `slug` with `contentHash` for change detection.

MDX is restricted: only components registered in `knowledge/` MDX map (`Callout`, `Figure`, `DataTable`, `SpeciesCard`, `TechniqueSteps`, `CitationRef`). Arbitrary JSX in content fails validation.

## 2. Frontmatter schemas (Zod-enforced)

### 2.1 Article (`type: article`, default)

```yaml
---
title: "The Soil Food Web"
slug: soil-food-web            # must match filename
type: article                  # article | species | technique
category: soil                 # exactly one of the 24 slugs
summary: >-                    # 120–200 chars; used for cards, meta description, embeddings
  How bacteria, fungi, protozoa and nematodes cycle nutrients ...
tags: [soil-biology, nutrient-cycling, composting]   # 2–8, kebab-case, open vocabulary
status: verified               # draft | reviewed | verified
authors: [elena-vogt]          # contributor handles
reviewedBy: [j-okafor]         # required for status >= reviewed
verifiedBy: m-lindqvist        # expert handle; required for status = verified
verifiedAt: 2026-05-12
difficulty: intermediate       # beginner | intermediate | advanced
cover: soil/soil-food-web-hero # Cloudflare Images ID
coverCredit: "Elena Vogt / CC BY-SA"
relationships:
  - { to: soil/composting-fundamentals, type: enables }
  - { to: microbiology/mycorrhizal-networks, type: relates-to }
  - { to: soil/soil-structure, type: part-of }
sources: [ingham2000, lowenfels2010, fao-soil-2015]  # keys into citations/sources.bib
publishedAt: 2026-02-01
updatedAt: 2026-05-12
lang: en
---
```

### 2.2 Species (`type: species`) — adds:

```yaml
species:
  scientificName: "Alnus glutinosa"
  commonNames: ["Black alder", "Svartor"]
  family: Betulaceae
  nativeRange: "Europe, W. Asia, N. Africa"
  hardinessZones: [3, 7]        # [min, max] USDA
  layers: [canopy, sub-canopy]  # food-forest layers
  functions: [nitrogen-fixer, windbreak, biomass]
  companions: [trees/willow, plants/comfrey]   # rendered as symbiotic-with edges
  cautions: ["Suckers in wet soils"]
```

### 2.3 Learning path (`paths/*/path.yaml`)

```yaml
title: "Soil Fundamentals"
slug: soil-fundamentals
summary: "From bedrock to biology: understand what soil is and how to build it."
difficulty: beginner
estimatedHours: 6
outcomes: ["Read a soil test", "Build a compost system", "..."]
prerequisites: []              # other path slugs
modules:
  - title: "What soil is"
    steps:
      - { ref: knowledge/soil/what-is-soil }          # article step
      - { file: steps/01-intro.mdx }                  # interstitial step
      - { checkpoint: checkpoints/module-1.yaml }     # quiz step
```

## 3. Relationship (edge) rules

- Types: `depends-on`, `enables`, `part-of`, `relates-to`, `contrasts-with`, `symbiotic-with`, `succeeded-by`. Directed; the build derives inverse labels for display ("enabled by", etc.) — inverses are never authored.
- Every published article needs **≥ 3 outbound edges**; `depends-on` must be acyclic (validated); max 15 outbound edges (curation, not link spam).
- Edge targets are `category/slug` refs; broken refs fail CI.

## 4. Validation (`scripts/validate-content.ts`, runs in CI + pre-commit)

1. **Schema:** Zod parse of all frontmatter; filename ↔ slug ↔ directory ↔ category coherence.
2. **Graph:** edge targets exist; `depends-on` acyclicity (topological check); orphan detection (0 inbound + 0 outbound = error); min/max edge counts.
3. **Links:** all internal markdown links resolve to canonical routes or `_redirects.json`; external links get a HEAD-check (warning, not failure — link rot report generated weekly).
4. **Citations:** every `sources` key exists in `sources.bib`; every `<CitationRef id/>` in the body maps to a listed source; articles with `status: verified` require ≥ 3 sources of which ≥ 1 is `@article`/`@book` (not just URLs); DOIs are format-validated and resolved via doi.org HEAD-check.
5. **Prose:** summary length, single H1 (from title only — H1 in body is an error), heading level continuity, alt text on every `Figure`, no raw `<img>`/`<a>` HTML.
6. **Species/technique:** type-specific required blocks present.

## 5. AI-assisted tagging & relationship generation

AI proposes; humans dispose. Pipeline (`scripts/enrich-content.ts`, run locally or as a labeled CI job):

1. **Tag suggestion** — embeds the article (see `09-search-and-ai.md`), compares against the existing tag vocabulary + tag co-occurrence, proposes up to 5 tags with confidence scores.
2. **Edge suggestion** — nearest-neighbor search over article embeddings + an LLM pass that must justify each proposed edge with a quoted passage from *both* articles and choose a type from the taxonomy. Proposals below 0.75 confidence are dropped.
3. **Gap detection** — flags: concepts referenced ≥ 3 times across the corpus with no article ("missing node"), category pairs with anomalously low edge density, and `depends-on` chains ending at nonexistent fundamentals.
4. **Output** — a draft PR (`chore/enrichment-YYYY-MM-DD`) editing frontmatter only, with the justification quotes in the PR description. These PRs follow the normal review flow; AI suggestions never merge unreviewed and never touch body prose.

## 6. Licensing & provenance

All content CC BY-SA 4.0; `authors` frontmatter + git history are the attribution record. Imported/adapted material must carry `adaptedFrom` frontmatter (source, license, URL) — validator requires it when a `## Adapted from` section exists. Images require `coverCredit`/`Figure credit` with license.

# Equilibrium — architecture of an ecological knowledge operating system

This document is the analysis the TERRA master build prompt (§41) asks for:
risks, contradictions, the entity model, the target database schema, routing,
component hierarchy, MVP scope, and what is deliberately deferred. It records
decisions; the code is the implementation.

The product ships under the **Equilibrium** brand. TERRA names the
architecture, not the product — the earlier brand discovery report found the
TERRA mark crowded, and all product identity flows through `src/lib/brand.ts`
so a rename remains a one-file change.

## The one principle

**Finite hierarchy. Infinite relationships.**

Folders organise; relationships connect. The navigation layer is bounded on
purpose (≤10 root domains, ≤5 levels, ≤99 items per view) because those are
limits on what a person can hold in their head. The knowledge model underneath
is unbounded: any node may relate to any other node through typed,
evidence-graded relationships. These limits live in `src/lib/site-tree.ts` as
*warnings*, never as schema constraints.

## Current state (what exists and is reused)

| Spec concept | Existing implementation |
| --- | --- |
| Typed relationships (§05) | `src/lib/knowledge/relationships.ts` — 97 edges, 22 verbs, direction, description, evidence level |
| Evidence system (§11) | `EvidenceLevel` (strong/moderate/emerging/limited/contested/hypothesis) + `/evidence` honesty panel + source registry (`sources.ts`, 80 sources, verified-DOI-only policy) |
| Explorer (§07) | `src/components/knowledge/explorer.tsx` — Finder-style shelves/contents/path, mobile drill-down |
| Graph view (§06) | `src/components/graph/knowledge-graph.tsx` (canvas map) + `graph-browser.tsx` (accessible browse) |
| Search (§08) | `src/components/search/command-palette.tsx` — ⌘K, articles/domains/paths |
| Learning (§16) | `LEARNING_PATHS` with steps over existing nodes |
| Ask (§25 precursor) | `/diagnose` — symptom → causal-verb walk over the graph, citing edges |
| Discovery (§19) | `discover.ts` — date-seeded daily edge + 2-hop horizon suggestions |
| Nav single-source (§02) | `SITE_TREE` — header, pill, mega menu all derive from it |

## Risks and contradictions in the spec, and the calls made

1. **Static site vs. accounts/community/premium.** The deploy is fully static
   with no backend credentials. Building auth, observations, review queues or
   entitlements against a fake API is exactly the "placeholder architecture
   pretending to be production-ready" §39 forbids. Call: static open core now,
   schema on paper (below), community contribution flows through GitHub (the
   repo *is* the database and pull requests *are* the review workflow — §13's
   observation → contribution → review → canonical pipeline already exists as
   Git).
2. **"10 root domains" vs. "don't hard-code the taxonomy."** The domains are
   data (`KNOWLEDGE_GROUPS`), not routes or types. Regrouping shelves touches
   one file and zero content.
3. **Nodes vs. articles.** The spec's NODE is broader than today's Article
   (species, people, places, datasets). The static MVP keeps Article as the
   one authored node type; the schema below models `nodes`/`node_types` so
   new types are rows, not migrations of the app.
4. **AI layer (§25).** Deliberately last: an AI that answers from the graph is
   only as credible as the sources, and 74 of 80 sources still lack verified
   identifiers. Resolving those (Crossref pass) gates the AI layer.
5. **Relationships shelf.** A domain named "Relationships" containing typed
   edges would conflate folders with the graph. It ships as a *system shelf*
   that opens the graph, not a folder of edges.

## Entity model

```
NODE (today: Article; future: Species, Place, Person, Dataset, …)
 ├── CONTENT        structured sections (heading, body, embeds)
 ├── METADATA       type, domain, difficulty, tags, timestamps → "Knowledge DNA"
 ├── RELATIONSHIPS  typed, directed, evidence-graded edges (first-class)
 ├── EVIDENCE       per-edge evidence level; per-claim citations
 ├── SOURCES        registry entries; verified identifiers only
 ├── CONTRIBUTIONS  Git history (authors, diffs, review)
 └── HISTORY        Git commits, line-anchored source links
```

## Target relational schema (future backend, on paper)

Written for PostgreSQL (Supabase-compatible). Not implemented in the static
MVP; recorded so the flat-file model migrates cleanly.

```sql
-- identity
users(id, email, created_at)
profiles(user_id fk, handle unique, display_name, bio)
roles(id, name)                              -- viewer/contributor/curator/admin
user_roles(user_id fk, role_id fk)

-- taxonomy: navigation only, never a constraint on knowledge
domains(id, ordinal, slug unique, title jsonb, blurb jsonb)          -- ≤10 by policy
folders(id, domain_id fk, parent_id fk null, slug, title jsonb)      -- depth ≤5 by policy

-- knowledge
node_types(id, name unique, schema jsonb)     -- Article, Species, Place, …
nodes(id, type_id fk, slug unique, title, summary, folder_id fk,
      difficulty, status, created_at, updated_at)
node_content(node_id fk, position, block_type, payload jsonb)        -- block system (§10)

-- the graph: first-class, unbounded
relationship_types(id, verb unique, inverse_label, causal bool)
relationships(id, source_node fk, target_node fk, type_id fk,
              description, evidence evidence_level, strength numeric null,
              created_at, updated_at,
              unique(source_node, target_node, type_id))

-- evidence
sources(id, key unique, title, authors, year, container, identifier null,
        identifier_kind null)                 -- identifier only when verified
claims(id, node_id fk, text, evidence evidence_level)
claim_sources(claim_id fk, source_id fk)

-- community (deferred features)
observations(id, node_id fk, user_id fk, location geography null,
             observed_at, conditions jsonb, body, status)            -- §12
revisions(id, node_id fk, user_id fk, diff jsonb, note, created_at)  -- §14
comments(id, node_id fk, user_id fk, body, created_at)
annotations(id, node_id fk, block_position, user_id fk, body)

-- purpose layers
collections(id, slug unique, title, summary, kind)                   -- §15
collection_items(collection_id fk, position, node_id fk, note)
projects(id, user_id fk, title)                                      -- §17
project_items(project_id fk, position, node_id fk null, task, done)

-- monetisation (deferred)
entitlements(id, key unique)                  -- open/member/pro/professional/team
subscriptions(user_id fk, entitlement_id fk, active, period_end)
feature_entitlements(feature_key, entitlement_id fk)                 -- §26
```

Row-level security: nodes/relationships/sources world-readable; writes through
contributor role + review status transitions; observations owned by author
until accepted.

## Routing

Human-readable, stable, slug-based (§34–35):

```
/                      explorer-first home
/knowledge             the archive (explorer, ?d=<domain>&c=<category>)
/knowledge/[category]  one domain shelf
/knowledge/[category]/[slug]   a knowledge node (research object)
/explore               the graph (browse + map, ?c=<slug>)
/diagnose              ask: symptom → causal chains
/learn                 learning paths
/apply                 practice: /seasonal /partners /contribute
/evidence              research: source registry + honesty stats
/community /about      the project itself
```

## Component hierarchy (client boundaries)

```
layout (server)
 ├── Header            ← SITE_TREE
 ├── CommandPalette    (client; ⌘K; articles/domains/paths/sources)
 ├── page content
 │    ├── KnowledgeExplorer (client; URL-driven; favourites/recents)
 │    ├── Graph: ExploreView → GraphBrowser | KnowledgeGraph (client)
 │    └── Node page (server)
 │         ├── DnaPanel          metadata as data (§21)
 │         ├── ConnectionList    "why is this related?" disclosures (§20)
 │         ├── CitationList / CitedBy / HorizonBlock
 │         └── source-linked history (GitHub line anchors)
 └── MobileDock + MobileMegaMenu ← SITE_TREE
```

## MVP scope (this codebase, static)

Have: explorer, 10 domains, knowledge nodes, structured content, typed
relationships, search, breadcrumbs, sources, responsive design, version
history (Git), knowledge graph, favourites/recents, command palette,
contributions (GitHub), evidence states, DNA metadata, why-related.

Deferred, with reasons: auth/accounts, observation submission, review
queues, collections-as-data, projects, location intelligence, premium
entitlements, block editor, map/timeline views, AI layer (gated on source
resolution). Each needs a real backend or content operation a static deploy
cannot honestly provide.

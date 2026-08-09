# Equilibrium — working memory

## The master plan (TERRA architecture, Equilibrium brand)

One idea governs everything: **finite hierarchy, infinite relationships.**
Folders organise, relationships connect, evidence builds trust, learning
paths teach, collections/projects apply, open source evolves it. The full
analysis — entity model, target Postgres schema, routing, deferrals —
lives in `docs/ARCHITECTURE.md`; read it before structural changes.

Standing decisions (confirmed with the owner, do not relitigate):

- **Brand stays Equilibrium.** TERRA names the architecture, not the
  product. All identity flows through `src/lib/brand.ts` (one-file rename).
- **Static open core.** No Supabase/auth until credentials exist; per-user
  state (favourites, recents, searches) is localStorage; contribution and
  review flow through GitHub. Never fake backend features (§39).
- **Limits are navigation guidance, never schema.** ≤10 root domains,
  ≤5 levels, ≤99 per view — `console.warn` in `src/lib/site-tree.ts`,
  never a build failure, never a constraint on the knowledge model.
- **Merges need the owner's explicit "Merge".** Draft PR → CI green → wait.

## Build state (phases from the master prompt)

Done: architecture record; 10 root domains (6 category shelves + 4 system
shelves in `src/lib/knowledge/taxonomy.ts`); explorer-first home with URL
state, favourites, recents (`explorer.tsx`, `src/lib/pins.ts`); typed
relationship graph (97 edges, 22 verbs, evidence levels); Knowledge DNA
panel + "trace in graph" on articles; evidence registry (/evidence);
diagnose engine (/diagnose); daily discovery + horizon; command palette
with sources/tags/recent-searches; mega menu + switches pill.

Next in line: collections (§15, purpose-driven sequences over existing
nodes); Crossref pass to resolve the 74 unlinked sources — this **gates
the AI layer** (§25); then observations/projects/premium only when a
backend exists.

## House rules learned the hard way

- Single nav source: header, pill, mega menu all derive from `SITE_TREE`.
- One knowledge truth: articles/relationships/sources in
  `src/lib/knowledge/*`; views never duplicate data.
- Evidence honesty: only verified DOIs get identifiers; a wrong link is
  worse than none.
- i18n: UI strings via dictionary keys (11 locales) or `useT({en,nl})`;
  content stays English until content-level localization exists.
- Test mobile with real `touchscreen.tap` in Playwright (synthetic
  `el.click()` missed a main-thread freeze); verify before pushing:
  `npm run lint && npx tsc --noEmit && npm run build`.

# Component Library

All components live under `src/components/`, grouped by domain. Server Components by default; `"use client"` only for interaction (see `12-performance.md`). Props are TypeScript-strict; sketches below show the load-bearing props, not exhaustive signatures.

Conventions:
- One component per file, PascalCase, colocated `*.test.tsx`.
- Styling via Tailwind 4 utilities + semantic tokens only — no raw hex in components.
- Variants via `cva` (class-variance-authority). No boolean-prop styling explosions.
- Every interactive component ships keyboard + `prefers-reduced-motion` behavior on day one.

```
src/components/
  layout/      primitives/   knowledge/   graph/
  learning/    community/    search/      icons/
```

---

## 1. Layout components (`layout/`)

| Component | Props sketch | Rules |
|---|---|---|
| `SiteHeader` | — (reads route + session) | Sticky glass (only glass surface besides palette/HUD). Collapses to icon nav < 768px. |
| `SiteFooter` | — | Static, server-rendered. |
| `CommandPalette` | controlled by `useCommandPalette()` store | Cmd-K/Ctrl-K. Renders `search/` result groups. Focus-trapped dialog. |
| `PageShell` | `{ width: 'prose' \| 'wide' \| 'full' }` | prose = 68ch article measure; wide = 1200px; full = graph. |
| `Section` | `{ eyebrow?, title?, children }` | Owns section rhythm spacing; never nest Sections. |
| `Breadcrumbs` | `{ trail: {label, href}[] }` | Emits BreadcrumbList JSON-LD. |
| `ThemeToggle` | — | Palette picker: Auto / Golden Hour / Blue Hour. Auto follows the clock (07:00–19:00 = Golden Hour); picking a palette writes `"eog-theme-mode": "manual"` permanently until Auto is re-selected. No flash (pre-paint script in root layout); `ThemeModeProvider` re-syncs every 60s and on `visibilitychange` while auto. |
| `SkipLink` | — | First focusable element on every page. |

## 2. Primitives (`primitives/`)

The UI kit — the only place raw interactive HTML gets wrapped.

| Component | Props sketch | Rules |
|---|---|---|
| `Button` | `{ variant: 'primary'\|'secondary'\|'ghost'\|'danger', size: 'sm'\|'md'\|'lg', asChild? }` | Primary = `--accent` fill with `--on-accent` text (flips per palette: deep green/cream in Golden Hour, pale sage/indigo in Blue Hour). One primary per view region. |
| `IconButton` | `{ label: string /* required, aria */ }` | Never without `label`. |
| `Link` | wraps `next/link` | External links get `rel="noopener"` + arrow-up-right glyph. |
| `Input`, `Textarea` | `{ error?: string }` | 1px `--border-strong`, focus `--ring` 2px offset 2px. |
| `Select`, `Combobox` | Radix-based | Native `<select>` < 640px. |
| `Dialog`, `Drawer`, `Popover`, `Tooltip` | Radix-based | Tooltip delay 300ms; never contains interactive children. |
| `Tabs` | `{ items, syncToUrl? }` | URL-synced on category pages. |
| `Badge` | `{ tone: 'neutral'\|'category'\|'verified'\|'draft'\|'warning', categorySlug? }` | Category tone from `category-tones.ts`. |
| `Card` | `{ interactive?: boolean }` | Interactive cards: whole-card link, single tab stop. |
| `Avatar`, `Skeleton`, `Progress`, `Kbd`, `Divider`, `Toast` | standard | Skeletons match final layout exactly (no CLS). |
| `Prose` | `{ children /* MDX output */ }` | Typography wrapper for MDX; owns all article text styles. |

## 3. Knowledge components (`knowledge/`)

| Component | Props sketch | Purpose |
|---|---|---|
| `ArticleHeader` | `{ article: ArticleMeta }` | Title (Playfair), category badge, verification badge, reading time, updated date, authors. |
| `ArticleBody` | MDX render | Wraps `Prose`; registers MDX components below. |
| `TableOfContents` | `{ headings }` | Sticky ≥ 1024px, IntersectionObserver active state, collapses to disclosure on mobile. |
| `CitationList` / `CitationRef` | `{ citations }` / `{ id }` | Superscript refs, hover popover with full source, list at foot. Keys are BibTeX-style ids. |
| `RelationshipPanel` | `{ edges: Edge[] }` | Inbound/outbound grouped by edge type; each row links canonically. |
| `MiniGraph` | `{ nodeId, depth: 1 }` | Lazy canvas, depth-1 neighborhood, "Open in Explore →". Static fallback image for reduced-motion/no-JS. |
| `CategoryCard` / `CategoryGrid` | `{ category }` | Duotone cover, count, tone accent. |
| `ArticleCard` | `{ article, layout: 'row'\|'tile' }` | Used in listings, related, search. |
| `SpeciesCard` | `{ species }` | Structured header for `type: species`: taxonomy, zones, functions, companions. |
| `TechniqueSteps` | `{ steps }` | Numbered steps with materials + cautions callouts. |
| `Callout` (MDX) | `{ tone: 'note'\|'principle'\|'caution'\|'field-note' }` | The only colored boxes allowed in articles. |
| `Figure` (MDX) | `{ src, caption, credit }` | Cloudflare image, required caption + credit. |
| `DataTable` (MDX) | — | Horizontal-scroll container, tabular-nums. |
| `RevisionHistory` | `{ nodeId }` | Git-derived revision list with diff links. |
| `ImprovePageCTA` | `{ filePath }` | Deep link to GitHub edit flow (`08-auth-and-contribution.md`). |
| `VerifiedBadge` | `{ verification }` | States: `draft`, `reviewed`, `verified` (+ expert, date). Tooltip explains methodology. |

## 4. Graph components (`graph/`)

| Component | Props sketch | Purpose |
|---|---|---|
| `GraphCanvas` | `{ data: GraphData, focus?, filters, onSelect }` | The canvas/WebGL renderer (client-only, `dynamic()` import). Owns simulation, LOD, hit-testing. See perf budget in `12`. |
| `GraphHUD` | `{ filters, onChange }` | Glass control cluster: category filter, edge-type filter, depth slider, reset. |
| `GraphSearch` | — | Inline node finder; Enter focuses node with camera fly-to. |
| `NodePreview` | `{ node }` | Side panel on select: excerpt, badges, edges, "Read article". |
| `GraphLegend` | — | Edge-type key; toggles double as filters. |
| `GraphA11yList` | `{ data, focus }` | Visually-hidden-but-focusable structured list mirror of the visible graph (see `11-accessibility.md`). Required whenever `GraphCanvas` renders. |

## 5. Learning components (`learning/`)

| Component | Props sketch | Purpose |
|---|---|---|
| `PathCard` | `{ path, progress? }` | Catalog tile: difficulty, duration, module count, progress ring. |
| `PathOutline` | `{ path, progress? }` | Module/step tree with completion states + prerequisite locks. |
| `StepFrame` | `{ step, prev?, next? }` | Wraps step content with path context bar + prev/next. |
| `Checkpoint` | `{ questions }` | Lightweight quiz; local until authed, synced when signed in. |
| `ProgressRing` | `{ value: 0–1, size }` | SVG; animated only on change, not on mount. |
| `AchievementToast` | `{ achievement }` | Fired on unlock; queued via `Toast`. |

## 6. Community components (`community/`)

| Component | Props sketch | Purpose |
|---|---|---|
| `DiscussionThread` | `{ nodeId }` | Per-article discussion; flat with single-level replies. |
| `ContributionFeed` | `{ limit }` | Recently merged PRs with contributor credit. |
| `ContributorCard` | `{ profile }` | Avatar, expertise badges, merged count. |
| `ReviewQueue` | `{ role }` | Open PRs awaiting peer/expert review (reviewer+ roles). |
| `ExpertiseBadge` | `{ category, level }` | Granted per `08-auth-and-contribution.md`; never self-assigned. |

## 7. Search components (`search/`)

`SearchInput`, `ResultGroup`, `ResultItem` (with match highlighting), `AskEquilibrium` (semantic answer block with citation chips — see `09-search-and-ai.md`), `EmptyState` (offers semantic fallback + random article).

## 8. Composition rules

1. Pages compose from `layout/` + domain components; pages never contain raw markup beyond glue.
2. Domain components may use `primitives/`; primitives never import domain components (enforced by ESLint `import/no-restricted-paths`).
3. Client boundaries live as low as possible — e.g. `ArticleHeader` is server, only its bookmark button is client.
4. Every component with a loading state exports a `.Skeleton` matching its final geometry.
5. New primitives require a design-system doc update in the same PR.

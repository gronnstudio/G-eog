# Equilibrium (EOG)

**The world's living knowledge ecosystem for regenerative thinking.**

Equilibrium makes humanity's ecological knowledge freely accessible, beautifully
organized and endlessly connected. It is a side brand of [GRØNN Studio](https://gronn.studio).

This is not a blog. This is not documentation. It is a living ecosystem of
knowledge — where every concept is a node and every relationship is a living
thread, organized the way nature organizes itself: interconnected, evolving,
adaptive, discoverable, beautiful and open.

## The experience

- **Home** — an immersive introduction with an animated ecosystem field and a live knowledge-graph preview.
- **Explore** (`/explore`) — the crown jewel: an interactive, force-directed knowledge graph. Zoom, pan, filter by domain, hover to reveal relationships, click any node to open the article.
- **Knowledge** (`/knowledge`) — 24 domains, from Soil and Water to Philosophy and Circular Systems, each with its own cover, statistics and articles.
- **Articles** (`/knowledge/[category]/[slug]`) — an editorial reading experience with reading progress, a sticky table of contents, citations, contributors, connected articles and open-source page actions.
- **Learn** (`/learn`) — curated learning paths that follow the grain of nature.
- **Community** (`/community`) — the open-source contribution flow, from a first edit to peer review and expert verification.
- **⌘K search** — an instant, keyboard-driven command palette across the whole ecosystem.

## Design language

Apple × National Geographic × Linear × Arc × Obsidian. Minimal, premium,
editorial, immersive, organic, scientific, calm. **Dark mode first** (Deep
Forest), with a fully audited light mode (Daylight).

- **Palette** — Deep Forest `#0D1B14`, Moss `#1F5136`, Fern `#4D8B63`, Sage `#B8D8C2`, Stone `#EDEDE8`, Warm White `#FAFAF7`; Sky / Amber / Rust accents only where necessary.
- **Typography** — Playfair Display headings, Inter body, JetBrains Mono for technical annotations, on a fluid `clamp()` scale.
- **Motion** — one small vocabulary of physics-based easings, 60fps, always purposeful, always honouring `prefers-reduced-motion`.

Full design system lives in [`docs/02-design-system.md`](docs/02-design-system.md).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion ·
Lenis smooth scroll · canvas-rendered knowledge graph · `next/og` OpenGraph
images · PWA with an offline fallback. See [`TECH-STACK.md`](TECH-STACK.md).

The current release ships a fully static, git-based content layer
(`src/lib/knowledge`) so the whole site prerenders and scores toward a perfect
Lighthouse. The roadmap to a database-backed, authenticated, AI-augmented
platform is in [`docs/13-roadmap.md`](docs/13-roadmap.md).

## Architecture

```
src/
  app/                       # App Router routes
    page.tsx                 # Home
    explore/                 # Interactive knowledge graph
    knowledge/               # Category index
      [category]/            # Category page
        [slug]/              # Article reading experience
    learn/ community/ about/ # Editorial pages
    opengraph-image.tsx      # Dynamic OG image
    sitemap.ts robots.ts manifest.ts
  components/
    graph/                   # Knowledge-graph canvas
    home/                    # Hero + ecosystem field
    knowledge/               # Article & category cards, reading UI
    search/                  # ⌘K command palette
    layout/ motion/ ui/      # Chrome, motion primitives, UI kit
  lib/
    knowledge/               # Content model: categories, articles, paths, graph
    motion.ts utils.ts
docs/                        # Vision, IA, design system, schema, roadmap …
```

The complete design + architecture suite (information architecture, component
library, content model, database schema, API design, auth/contribution flow,
search & AI, SEO, accessibility and performance strategies) lives in
[`docs/`](docs/).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Contribute

Equilibrium is open source and built in public. Every article carries
_Improve this page_, _View source_, _Discussion_ and _Version history_ links.
Contributions flow through GitHub: fork → edit Markdown → pull request → peer
review → expert verification → merge. See [`/community`](src/app/community) and
[`docs/08-auth-and-contribution.md`](docs/08-auth-and-contribution.md).

## Licence

Content is published under **CC BY-SA 4.0**. The platform code is open source.

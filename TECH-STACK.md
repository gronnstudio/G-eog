# Equilibrium — Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15+ (App Router, Turbopack), React 19, TypeScript strict |
| Styling | Tailwind CSS 4, semantic tokens in `src/app/globals.css` (see docs/02) |
| Motion | Framer Motion (LazyMotion), Lenis smooth scroll (see docs/04) |
| Graph | Custom canvas/WebGL renderer, worker-based force layout (see docs/12 §7) |
| Content | MDX, git-based in `content/`, Zod-validated frontmatter (see docs/05) |
| Database | PostgreSQL (Supabase) + Prisma, pgvector + pg_trgm (see docs/06) |
| Auth | Supabase Auth (GitHub/Google OAuth, magic link) (see docs/08) |
| Media | Cloudflare Images + R2 |
| Hosting | Vercel (Edge runtime for anonymous APIs), PWA via Serwist |
| Search/AI | Postgres FTS + trigram, pgvector semantic, grounded RAG (see docs/09) |
| Testing | Playwright + axe-core, Lighthouse CI, content validation CI |

Architecture details: `docs/07-api-architecture.md`. Performance budgets: `docs/12-performance.md`.

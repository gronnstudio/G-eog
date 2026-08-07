import Link from "next/link"
import { ArrowRight, GitFork, Network, Sparkles } from "lucide-react"

import { FlowCore } from "@/components/home/flow-core"
import { Hero } from "@/components/home/hero"
import { KnowledgeGraph } from "@/components/graph/knowledge-graph"
import { CategoryCard } from "@/components/knowledge/category-card"
import { ArticleCard } from "@/components/knowledge/article-card"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { DomainsMarquee } from "@/components/play/domains-marquee"
import { SuccessionTimeline } from "@/components/play/succession-timeline"
import { ARTICLES, CATEGORIES, LEARNING_PATHS, totalStats } from "@/lib/knowledge"

export default function HomePage() {
  const stats = totalStats()
  const featured = ARTICLES.slice(0, 6)
  const previewCats = CATEGORIES.slice(0, 8)

  return (
    <>
      <FlowCore />
      <Hero stats={stats} />

      {/* Living graph */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>The crown jewel</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-heading text-4xl text-foreground sm:text-5xl">
              Every idea is a node. Every relationship, a living thread.
            </h2>
            <Link
              href="/explore"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <Network className="h-4 w-4 text-accent" />
              Open full graph
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <KnowledgeGraph height={560} />
        </Reveal>
      </section>

      {/* Philosophy strip */}
      <section className="border-y border-line bg-surface/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          {[
            { icon: Network, title: "Everything is connected", body: "No page is an island. Each concept links outward, so curiosity always has somewhere to go." },
            { icon: Sparkles, title: "Knowledge behaves like nature", body: "Interconnected, evolving, adaptive and beautiful — organized the way an ecosystem organizes itself." },
            { icon: GitFork, title: "Open by design", body: "Every article is editable on GitHub, peer-reviewed and freely licensed. This is knowledge as a commons." },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <p.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-heading text-2xl text-foreground">{p.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Living ribbon */}
      <section className="border-y border-line bg-surface/20 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionLabel>Living ribbon</SectionLabel>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">
              Every domain, drifting past like a current. Hover to pause and pick a thread.
            </p>
          </Reveal>
        </div>
        <div className="mt-6">
          <DomainsMarquee />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>Twenty-four domains</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              Begin anywhere. Arrive everywhere.
            </h2>
            <Link href="/knowledge" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              All categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewCats.map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 0.05}>
              <CategoryCard category={c} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured articles */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>From the field</SectionLabel>
          <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
            Reading that rewards the curious.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.06}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ecological succession timeline */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>How ecosystems assemble</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              From bare ground to forest.
            </h2>
            <Link
              href="/knowledge/ecology/ecological-succession"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Read the full article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
            Scroll to watch a landscape rebuild itself, one stage at a time — the slow choreography of ecological succession.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <SuccessionTimeline />
        </Reveal>
      </section>

      {/* Learning paths */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>Guided journeys</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              Learning paths that follow the grain of nature.
            </h2>
            <Link href="/learn" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              All paths
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {LEARNING_PATHS.map((path, i) => (
            <Reveal key={path.slug} delay={(i % 2) * 0.06}>
              <Link
                href={`/learn#${path.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-surface/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-float"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  {path.hours} hours · {path.steps.length} steps
                </p>
                <h3 className="mt-3 font-heading text-2xl text-foreground">{path.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted">{path.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent">
                  Begin the path
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="eog-aurora relative overflow-hidden rounded-3xl border border-line px-8 py-20 text-center sm:px-16">
            <h2 className="mx-auto max-w-3xl font-heading text-4xl text-foreground sm:text-5xl">
              Help grow the world&rsquo;s knowledge of living systems.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted">
              Equilibrium is open source and built in public. Write, edit, review or translate — every
              contribution strengthens the whole ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/community" className="rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]">
                Become a contributor
              </Link>
              <Link href="/explore" className="rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2">
                Wander the graph
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

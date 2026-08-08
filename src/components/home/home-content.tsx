"use client"

import Link from "next/link"
import { ArrowRight, GitFork, Network, Sparkles } from "lucide-react"

import { Hero } from "@/components/home/hero"
import { CategoryCard } from "@/components/knowledge/category-card"
import { ArticleCard } from "@/components/knowledge/article-card"
import { useT, useUI } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { DomainsMarquee } from "@/components/play/domains-marquee"
import { SuccessionTimeline } from "@/components/play/succession-timeline"
import { ARTICLES, CATEGORIES, LEARNING_PATHS, getCategory, totalStats } from "@/lib/knowledge"

/**
 * The home page body, client-rendered so every heading, label and CTA
 * resolves through the UI dictionary — the page used to hardcode
 * English in the server component, so switching to Dutch (or any other
 * locale) only translated the nav and hero. Article/category CONTENT
 * remains English until content-level localization exists.
 */
export function HomeContent() {
  const ui = useUI()
  const t = useT()
  const stats = totalStats()
  const recent = [...ARTICLES]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 4)
  const featured = ARTICLES.slice(0, 6)
  const previewCats = CATEGORIES.slice(0, 8)

  return (
    <>
      <Hero stats={stats} />

      {/* Living graph */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>{ui("crownJewel")}</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-heading text-4xl text-foreground sm:text-5xl">
              {ui("graphHeadline")}
            </h2>
            <Link
              href="/explore"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              <Network className="h-4 w-4 text-accent" />
              {ui("openFullGraph")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Philosophy strip */}
      <section className="border-y border-line bg-surface/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          {[
            { icon: Network, title: ui("phil1t"), body: ui("phil1b") },
            { icon: Sparkles, title: ui("phil2t"), body: ui("phil2b") },
            { icon: GitFork, title: ui("phil3t"), body: ui("phil3b") },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
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
            <SectionLabel>{ui("ribbonLabel")}</SectionLabel>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">
              {ui("ribbonBody")}
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
          <SectionLabel>{ui("domainsLabel")}</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              {ui("domainsHeadline")}
            </h2>
            <Link href="/knowledge" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              {ui("allCategories")}
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
          <SectionLabel>{ui("featuredLabel")}</SectionLabel>
          <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
            {ui("featuredHeadline")}
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
          <SectionLabel>{ui("successionLabel")}</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              {ui("successionHeadline")}
            </h2>
            <Link
              href="/knowledge/ecology/ecological-succession"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {ui("readFullArticle")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
            {ui("successionBody")}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <SuccessionTimeline />
        </Reveal>
      </section>

      {/* Learning paths */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>{ui("pathsLabel")}</SectionLabel>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-heading text-4xl text-foreground sm:text-5xl">
              {ui("pathsHeadline")}
            </h2>
            <Link href="/learn" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              {ui("allPaths")}
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
                  {path.hours} {ui("hours")} · {path.steps.length} {ui("steps")}
                </p>
                <h3 className="mt-3 font-heading text-2xl text-foreground">{path.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted">{path.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent">
                  {ui("beginPath")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recently grown */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionLabel>{t({ en: "Recently grown", nl: "Onlangs gegroeid" })}</SectionLabel>
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/40">
            {recent.map((a) => {
              const cat = getCategory(a.category)
              return (
                <div
                  key={a.slug}
                  className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6"
                >
                  <time dateTime={a.updated} className="w-28 shrink-0 font-mono text-xs text-faint">
                    {a.updated}
                  </time>
                  <Link
                    href={`/knowledge/${a.category}/${a.slug}`}
                    className="flex-1 font-heading text-lg text-foreground transition-colors hover:text-accent"
                  >
                    {a.title}
                  </Link>
                  <span className="w-fit rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {cat?.title ?? a.category}
                  </span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="eog-aurora relative overflow-hidden rounded-3xl border border-line px-8 py-20 text-center sm:px-16">
            <h2 className="mx-auto max-w-3xl font-heading text-4xl text-foreground sm:text-5xl">
              {ui("ctaHeadline")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted">
              {ui("ctaBody")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/community" className="rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]">
                {ui("becomeContributor")}
              </Link>
              <Link href="/explore" className="rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2">
                {ui("wanderGraph")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

export default HomeContent

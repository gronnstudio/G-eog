"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Hero } from "@/components/home/hero"
import { CategoryCard } from "@/components/knowledge/category-card"
import { ArticleCard } from "@/components/knowledge/article-card"
import { useT, useUI } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { ARTICLES, CATEGORIES, LEARNING_PATHS, totalStats } from "@/lib/knowledge"
import { PARTNERS } from "@/lib/knowledge/partners"
import { DailyDiscoveryCard } from "@/components/discover/daily-discovery"

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
  const featured = ARTICLES.slice(0, 3)
  const previewCats = CATEGORIES.slice(0, 8)

  return (
    <>
      <Hero stats={stats} />

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

      {/* One shared discovery per day — a reason to come back */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <DailyDiscoveryCard />
        </Reveal>
      </section>

      {/* Knowledge in practice — the practitioner layer */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-line bg-surface/40 p-8 sm:p-12">
            <SectionLabel>
              {t({ en: "Knowledge in practice", nl: "Kennis in de praktijk" })}
            </SectionLabel>
            <h2 className="max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
              {t({
                en: "Theory is only half of it.",
                nl: "Theorie is maar de helft.",
              })}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {t({
                en: "Meet the organisations applying this knowledge on real ground — their methods, and the concepts behind them.",
                nl: "Maak kennis met de organisaties die deze kennis op echte grond toepassen — hun methodes, en de concepten erachter.",
              })}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {PARTNERS.map((p) => (
                <span
                  key={p.slug}
                  className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted"
                >
                  {p.name}
                </span>
              ))}
            </div>
            <Link
              href="/partners"
              className="group mt-7 inline-flex items-center gap-2 text-sm text-accent"
            >
              {t({ en: "See the partners", nl: "Bekijk de partners" })}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
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

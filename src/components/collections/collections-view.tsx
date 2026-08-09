"use client"

import Link from "next/link"
import { ArrowRight, Clock, Compass, Hammer, Map } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import {
  COLLECTIONS,
  collectionMinutes,
  resolvedSteps,
  type CollectionKind,
} from "@/lib/knowledge/collections"

/**
 * Collections: purpose drawn across the archive.
 *
 * Each collection is rendered whole on this one page — numbered steps with
 * the reason each is there, linking into the articles. No per-collection
 * routes yet: three collections do not need a router level, and a flat
 * page keeps every step one tap from its knowledge.
 */

const KIND_ICON: Record<CollectionKind, typeof Hammer> = {
  project: Hammer,
  guide: Compass,
  route: Map,
}

export function CollectionsView() {
  const t = useT()

  const kindLabel: Record<CollectionKind, string> = {
    project: t({ en: "Project", nl: "Project" }),
    guide: t({ en: "Guide", nl: "Gids" }),
    route: t({ en: "Route", nl: "Route" }),
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel>{t({ en: "Collections", nl: "Collecties" })}</SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        {t({ en: "Knowledge with a purpose.", nl: "Kennis met een doel." })}
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        {t({
          en: "Folders organise knowledge; collections organise intent. Each one is an ordered route through existing articles — with the reason every step is there.",
          nl: "Mappen ordenen kennis; collecties ordenen bedoeling. Elk is een geordende route door bestaande artikelen — met de reden waarom elke stap er staat.",
        })}
      </p>

      <div className="mt-14 space-y-10">
        {COLLECTIONS.map((c, ci) => {
          const Icon = KIND_ICON[c.kind]
          const steps = resolvedSteps(c)
          return (
            <Reveal key={c.slug} delay={ci * 0.05}>
              <section
                id={c.slug}
                className="scroll-mt-28 rounded-3xl border border-line bg-surface/40 p-6 sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {kindLabel[c.kind]}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    ~{collectionMinutes(c)} min
                  </span>
                  <span>
                    {steps.length} {t({ en: "steps", nl: "stappen" })}
                  </span>
                </div>

                <h2 className="mt-4 font-heading text-3xl text-foreground sm:text-4xl">
                  {t(c.title)}
                </h2>
                <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
                  {t(c.summary)}
                </p>

                <ol className="mt-8 space-y-3">
                  {steps.map(({ article, note }, i) => (
                    <li key={article.slug}>
                      <Link
                        href={`/knowledge/${article.category}/${article.slug}`}
                        className="group flex items-start gap-4 rounded-2xl border border-line bg-surface/40 p-4 transition-colors hover:border-ember/40 sm:p-5"
                      >
                        <span className="mt-0.5 font-mono text-xs tabular-nums text-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-lg text-foreground">
                            {article.title}
                          </span>
                          <span className="mt-1 block text-pretty text-sm leading-relaxed text-muted">
                            {t(note)}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default CollectionsView

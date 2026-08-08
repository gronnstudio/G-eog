"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { getCategory } from "@/lib/knowledge"
import { SEASONAL } from "@/lib/knowledge/seasonal"
import { cn } from "@/lib/utils"

/**
 * The seasonal guide: opens on the current month (client clock), with
 * a twelve-chip picker to roam the year. Task copy is bilingual at the
 * data level; chrome strings resolve through useT.
 */
export function SeasonalView() {
  const t = useT()
  // SSR renders month 1; after hydration snap once to the visitor's
  // clock (rAF defers the setState out of the effect's synchronous
  // phase, keeping hydration mismatch-free and the linter happy).
  const [month, setMonth] = useState(1)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMonth(new Date().getMonth() + 1))
    return () => cancelAnimationFrame(id)
  }, [])

  const data = SEASONAL.find((m) => m.month === month) ?? SEASONAL[0]

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <Reveal>
        <SectionLabel>{t({ en: "The living calendar", nl: "De levende kalender" })}</SectionLabel>
        <h1 className="max-w-2xl font-heading text-4xl text-foreground sm:text-6xl">
          {t({ en: "What to do now.", nl: "Wat je nu kunt doen." })}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          {t({
            en: "Ecological work follows the year, not the to-do app. Four or five things that matter this month, for a Western-European climate.",
            nl: "Ecologisch werk volgt het jaar, niet de takenapp. Vier of vijf dingen die er deze maand toe doen, voor een West-Europees klimaat.",
          })}
        </p>
      </Reveal>

      {/* Month picker */}
      <div
        role="tablist"
        aria-label={t({ en: "Month", nl: "Maand" })}
        className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
      >
        {SEASONAL.map((m) => (
          <button
            key={m.month}
            role="tab"
            aria-selected={m.month === month}
            onClick={() => setMonth(m.month)}
            className={cn(
              "tap-target shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
              m.month === month
                ? "border-transparent bg-gronn-green text-gronn-white"
                : "border-line text-muted hover:bg-surface-2 hover:text-foreground"
            )}
          >
            {t(m.name)}
          </button>
        ))}
      </div>

      {/* The month */}
      <div className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ember-text">
          {t(data.name)} — {t(data.theme)}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data.tasks.map((task, i) => {
            const cats = task.domains
              .map((d) => getCategory(d))
              .filter((c): c is NonNullable<typeof c> => Boolean(c))
            return (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-line bg-surface/40 p-6"
              >
                <div className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: `hsl(${c.hue} 45% 60%)` }}
                    >
                      {c.title}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 font-heading text-xl text-foreground">{t(task.title)}</h2>
                <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted">
                  {t(task.body)}
                </p>
                {task.articleSlug && task.articleCategory && (
                  <Link
                    href={`/knowledge/${task.articleCategory}/${task.articleSlug}`}
                    className="group mt-4 inline-flex items-center gap-2 text-sm text-accent"
                  >
                    {t({ en: "Go deeper", nl: "Verdiep je" })}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SeasonalView

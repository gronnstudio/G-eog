"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { useT } from "@/components/language-provider"
import { getCategory, RELATIONSHIP_LABEL } from "@/lib/knowledge"
import { dailyDiscovery, type DailyDiscovery as Discovery } from "@/lib/knowledge/discover"

/**
 * One edge of the graph per day, the same for every visitor.
 *
 * The date is read on the client after mount — the site is statically
 * generated, so baking today's date into the build would freeze the
 * discovery at whenever the last deploy happened. SSR renders nothing and
 * the card appears with hydration, same pattern as the seasonal month.
 */
export function DailyDiscoveryCard() {
  const t = useT()
  const [d, setD] = useState<Discovery | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setD(dailyDiscovery(new Date().toISOString().slice(0, 10))),
    )
    return () => cancelAnimationFrame(id)
  }, [])

  if (!d) return null
  const fromCat = getCategory(d.from.category)
  const toCat = getCategory(d.to.category)

  return (
    <div className="rounded-3xl border border-line bg-surface/40 p-8 sm:p-12">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ember-text">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {t({ en: "Today's discovery", nl: "Ontdekking van vandaag" })}
      </p>

      {/* The edge, as a sentence — two domains that turn out to touch */}
      <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <Link
          href={`/knowledge/${d.from.category}/${d.from.slug}`}
          className="font-heading text-2xl text-foreground underline-offset-4 hover:underline sm:text-3xl"
        >
          {d.from.title}
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-ember-text">
          {RELATIONSHIP_LABEL[d.relationship.type]}
        </span>
        <Link
          href={`/knowledge/${d.to.category}/${d.to.slug}`}
          className="font-heading text-2xl text-foreground underline-offset-4 hover:underline sm:text-3xl"
        >
          {d.to.title}
        </Link>
      </p>

      <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
        {d.relationship.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {[fromCat, toCat].map(
          (c) =>
            c && (
              <span
                key={c.id}
                className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                style={{ color: `hsl(${c.hue} 45% 60%)` }}
              >
                {c.title}
              </span>
            ),
        )}
        <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          {t({ en: "Evidence", nl: "Bewijs" })}: {d.relationship.evidence}
        </span>
      </div>

      <Link
        href={`/knowledge/${d.from.category}/${d.from.slug}`}
        className="group mt-6 inline-flex items-center gap-2 text-sm text-accent"
      >
        {t({ en: "Follow the thread", nl: "Volg de draad" })}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

export default DailyDiscoveryCard

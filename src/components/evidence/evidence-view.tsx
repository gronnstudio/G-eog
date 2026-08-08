"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { repoUrl } from "@/lib/brand"
import { getArticle } from "@/lib/knowledge"
import {
  SOURCES,
  isResolved,
  sourceHref,
  sourceStats,
} from "@/lib/knowledge/sources"
import { cn } from "@/lib/utils"

const FILTERS = ["all", "paper", "book", "report", "institutional", "unresolved"] as const
type Filter = (typeof FILTERS)[number]

/**
 * The evidence surface: every source behind the knowledge base, what cites
 * it, and — deliberately — whether it can actually be followed. Listing the
 * unresolved ones is the point. A bibliography that looks complete while
 * being unverifiable is worse than one that admits its gaps, and the gaps
 * are exactly the work a contributor can pick up.
 */
export function EvidenceView() {
  const t = useT()
  const [filter, setFilter] = useState<Filter>("all")
  const stats = useMemo(() => sourceStats(), [])

  const shown = useMemo(
    () =>
      SOURCES.filter((s) => {
        if (filter === "all") return true
        if (filter === "unresolved") return !isResolved(s)
        return s.type === filter
      }),
    [filter],
  )

  const label: Record<Filter, string> = {
    all: t({ en: "All", nl: "Alles" }),
    paper: t({ en: "Papers", nl: "Artikelen" }),
    book: t({ en: "Books", nl: "Boeken" }),
    report: t({ en: "Reports", nl: "Rapporten" }),
    institutional: t({ en: "Institutional", nl: "Institutioneel" }),
    unresolved: t({ en: "Needs a link", nl: "Mist een link" }),
  }

  const pct = Math.round((stats.resolved / stats.total) * 100)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <Reveal>
        <SectionLabel>{t({ en: "Evidence", nl: "Onderbouwing" })}</SectionLabel>
        <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
          {t({ en: "Everything this rests on.", nl: "Alles waar dit op rust." })}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {t({
            en: "Every source cited anywhere in the knowledge base, and whether you can actually follow it. We show the gaps rather than hiding them — a reference you cannot check is not yet evidence.",
            nl: "Elke bron die ergens in de kennisbank wordt aangehaald, en of je die daadwerkelijk kunt volgen. We laten de gaten zien in plaats van ze te verbergen — een verwijzing die je niet kunt controleren is nog geen bewijs.",
          })}
        </p>
      </Reveal>

      {/* Honesty panel */}
      <Reveal>
        <div className="mt-10 rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {[
              { n: stats.total, l: t({ en: "Sources", nl: "Bronnen" }) },
              { n: stats.citations, l: t({ en: "Citations", nl: "Citaties" }) },
              { n: stats.resolved, l: t({ en: "Linked", nl: "Gelinkt" }) },
              { n: stats.unresolved, l: t({ en: "Not yet linked", nl: "Nog niet gelinkt" }) },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-heading text-3xl tabular-nums text-foreground">{s.n}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Progress toward a fully resolvable bibliography */}
          <div
            className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-line"
            role="img"
            aria-label={`${pct}% of sources have a resolvable link`}
          >
            <div className="h-full rounded-full bg-ember" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {t({
              en: `${pct}% of sources carry a verified DOI or link. The rest are real references that simply haven't been resolved yet — we add an identifier only after checking it against the publisher record, because a wrong DOI points you confidently at the wrong paper.`,
              nl: `${pct}% van de bronnen heeft een geverifieerde DOI of link. De rest zijn echte verwijzingen die alleen nog niet zijn opgezocht — we voegen pas een identifier toe na controle bij de uitgever, want een verkeerde DOI verwijst je met stelligheid naar het verkeerde artikel.`,
            })}
          </p>
          <a
            href={repoUrl("issues/new?labels=sources&title=Source:%20")}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target mt-5 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm text-foreground transition-colors hover:border-ember/40"
          >
            {t({ en: "Help resolve a source", nl: "Help een bron vinden" })}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      {/* Filters */}
      <div
        role="tablist"
        aria-label={t({ en: "Filter sources", nl: "Bronnen filteren" })}
        className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={f === filter}
            onClick={() => setFilter(f)}
            className={cn(
              "tap-target shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
              f === filter
                ? "border-transparent bg-gronn-green text-gronn-white"
                : "border-line text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {label[f]}
            {f === "unresolved" && stats.unresolved > 0 && (
              <span className="ml-2 font-mono text-xs tabular-nums opacity-70">
                {stats.unresolved}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* The bibliography */}
      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/40">
        {shown.map((s) => {
          const href = sourceHref(s)
          return (
            <li key={s.id} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xs tabular-nums text-faint">{s.year}</span>
                <span className="text-sm text-muted">{s.authors}</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    href
                      ? "border-gronn-green/40 text-gronn-green"
                      : "border-line text-faint",
                  )}
                >
                  {href ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {s.doi ? "DOI" : t({ en: "Link", nl: "Link" })}
                    </span>
                  ) : (
                    t({ en: "No link yet", nl: "Nog geen link" })
                  )}
                </span>
              </div>

              <p className="mt-1.5 text-pretty font-heading text-lg leading-snug text-foreground">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
              </p>
              <p className="mt-1 text-sm italic text-muted">{s.publication}</p>

              {/* What cites it — the graph, read from the evidence side */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {t({ en: "Cited by", nl: "Aangehaald door" })}
                </span>
                {s.citedBy.map((slug) => {
                  const a = getArticle(slug)
                  if (!a) return null
                  return (
                    <Link
                      key={slug}
                      href={`/knowledge/${a.category}/${a.slug}`}
                      className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition-colors hover:border-ember/40 hover:text-foreground"
                    >
                      {a.title}
                    </Link>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default EvidenceView

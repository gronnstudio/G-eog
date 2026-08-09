"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, CornerUpLeft, Search, X } from "lucide-react"

import { useT } from "@/components/language-provider"
import {
  ARTICLES,
  RELATIONSHIP_LABEL,
  getCategory,
  relationshipsFor,
} from "@/lib/knowledge"
import type { Article, EvidenceLevel, RelationshipType } from "@/lib/knowledge"
import { EVIDENCE_TONE } from "@/lib/knowledge/evidence-ui"
import { cn } from "@/lib/utils"

/** Degree per concept, used to suggest good places to start. */
const DEGREE = new Map<string, number>(
  ARTICLES.map((a) => [a.slug, relationshipsFor(a.slug).length]),
)

/**
 * The knowledge graph as something you can actually operate.
 *
 * The canvas view is a picture of the graph: nodes drift, labels collide,
 * and hit targets move under the pointer — fine as an overview, hostile as
 * a tool, and worse on a phone. This is the same data as a browser. You
 * stand on one concept, read its connections grouped by what they mean,
 * and step to the next one. Nothing moves unless you move it.
 *
 * It is also the text alternative the visual graph needs: every node and
 * every typed edge is reachable by keyboard, in the DOM, without a canvas.
 */
export function GraphBrowser({ activeCategory }: { activeCategory?: string | null }) {
  const t = useT()
  const [focus, setFocus] = useState<string>("soil-food-web")
  const [trail, setTrail] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [jumping, setJumping] = useState(false)

  // Deep links (?c=slug) make any position in the graph shareable — and
  // give crawlers a real URL for a view that is otherwise pure state.
  // rAF defers the setState out of the effect's synchronous phase, which
  // keeps hydration clean (the server can't know the query string here).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c")
    if (!c || !ARTICLES.some((a) => a.slug === c)) return
    const id = requestAnimationFrame(() => setFocus(c))
    return () => cancelAnimationFrame(id)
  }, [])

  const go = useCallback(
    (slug: string) => {
      setTrail((tr) => [...tr, focus])
      setFocus(slug)
      setQuery("")
      setJumping(false)
      const url = new URL(window.location.href)
      url.searchParams.set("c", slug)
      window.history.replaceState(null, "", url)
    },
    [focus],
  )

  const back = useCallback(() => {
    setTrail((tr) => {
      if (tr.length === 0) return tr
      const prev = tr[tr.length - 1]
      setFocus(prev)
      const url = new URL(window.location.href)
      url.searchParams.set("c", prev)
      window.history.replaceState(null, "", url)
      return tr.slice(0, -1)
    })
  }, [])

  const article = ARTICLES.find((a) => a.slug === focus) ?? ARTICLES[0]
  const cat = getCategory(article.category)

  // Connections grouped by what the relationship means, so the list reads
  // as structure rather than as an undifferentiated pile of links.
  const groups = useMemo(() => {
    const conns = relationshipsFor(article.slug).filter(({ other }) =>
      activeCategory ? other.category === activeCategory : true,
    )
    const byType = new Map<
      RelationshipType,
      { other: Article; inbound: boolean; description: string; evidence: EvidenceLevel }[]
    >()
    for (const { relationship, other, inbound } of conns) {
      const list = byType.get(relationship.type) ?? []
      list.push({
        other,
        inbound,
        description: relationship.description,
        evidence: relationship.evidence,
      })
      byType.set(relationship.type, list)
    }
    return [...byType.entries()]
      .map(([type, items]) => ({
        type,
        items: items.sort((a, b) => a.other.title.localeCompare(b.other.title)),
      }))
      .sort((a, b) => b.items.length - a.items.length)
  }, [article.slug, activeCategory])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return [...ARTICLES]
        .sort((a, b) => (DEGREE.get(b.slug) ?? 0) - (DEGREE.get(a.slug) ?? 0))
        .slice(0, 8)
    }
    return ARTICLES.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [query])

  return (
    <div className="rounded-2xl border border-line bg-surface/40">
      {/* Where you are */}
      <div className="border-b border-line p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {trail.length > 0 && (
            <button
              type="button"
              onClick={back}
              className="tap-target inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              <CornerUpLeft className="h-3.5 w-3.5" />
              {t({ en: "Back", nl: "Terug" })}
            </button>
          )}
          {cat && (
            <span
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{ color: `hsl(${cat.hue} 45% 60%)` }}
            >
              {cat.title}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            {total} {t({ en: "connections", nl: "verbindingen" })}
          </span>

          <button
            type="button"
            onClick={() => setJumping((v) => !v)}
            className="tap-target ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            {jumping ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
            {jumping ? t({ en: "Close", nl: "Sluiten" }) : t({ en: "Jump to…", nl: "Ga naar…" })}
          </button>
        </div>

        {/* Jump-to picker: start anywhere without hunting on a canvas */}
        {jumping && (
          <div className="mt-4">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({ en: "Search concepts…", nl: "Zoek concepten…" })}
              aria-label={t({ en: "Search concepts", nl: "Zoek concepten" })}
              className="w-full appearance-none rounded-xl border border-line bg-surface px-4 py-2.5 text-foreground placeholder:text-faint"
              style={{ outline: "none", boxShadow: "none" }}
            />
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {matches.map((a) => (
                <li key={a.slug}>
                  <button
                    type="button"
                    onClick={() => go(a.slug)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-left text-sm text-muted transition-colors hover:border-ember/40 hover:text-foreground"
                  >
                    <span className="min-w-0 truncate">{a.title}</span>
                    <span className="shrink-0 font-mono text-[10px] text-faint">
                      {DEGREE.get(a.slug) ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="mt-4 text-balance font-heading text-3xl text-foreground sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted">{article.summary}</p>
        <Link
          href={`/knowledge/${article.category}/${article.slug}`}
          className="group mt-4 inline-flex items-center gap-2 text-sm text-accent"
        >
          <BookOpen className="h-4 w-4" />
          {t({ en: "Read the full article", nl: "Lees het volledige artikel" })}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Where you can go */}
      {total === 0 ? (
        <p className="p-7 text-muted">
          {t({
            en: "No connections in this domain. Clear the filter to see everything this concept touches.",
            nl: "Geen verbindingen in dit domein. Wis het filter om alles te zien wat dit concept raakt.",
          })}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {groups.map((g) => (
            <li key={g.type} className="p-5 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-text">
                {RELATIONSHIP_LABEL[g.type]}
                <span className="ml-2 text-faint">{g.items.length}</span>
              </p>
              <ul className="mt-3 grid gap-2 lg:grid-cols-2">
                {g.items.map(({ other, inbound, description, evidence }) => (
                  <li key={other.slug}>
                    <button
                      type="button"
                      onClick={() => go(other.slug)}
                      className="group flex h-full w-full flex-col rounded-xl border border-line p-4 text-left transition-colors hover:border-ember/40"
                    >
                      <span className="flex items-center gap-2">
                        {inbound && (
                          <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
                        )}
                        <span className="min-w-0 font-heading text-base text-foreground">
                          {other.title}
                        </span>
                        {!inbound && (
                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        )}
                      </span>
                      <span className="mt-1.5 text-sm leading-relaxed text-muted">
                        {description}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                            EVIDENCE_TONE[evidence],
                          )}
                        >
                          {evidence}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                          {inbound
                            ? t({ en: "points here", nl: "wijst hierheen" })
                            : t({ en: "leads on", nl: "leidt verder" })}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GraphBrowser

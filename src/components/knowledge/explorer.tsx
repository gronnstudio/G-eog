"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, CornerUpLeft, FileText, Folder, FolderOpen } from "lucide-react"

import { useT } from "@/components/language-provider"
import { articlesInCategory } from "@/lib/knowledge"
import {
  KNOWLEDGE_GROUPS,
  articlesInGroup,
  categoriesInGroup,
  type KnowledgeGroup,
} from "@/lib/knowledge/taxonomy"
import { cn } from "@/lib/utils"

/**
 * The knowledge collection as a file explorer.
 *
 * People already know how to operate a filesystem, so the browsing layer
 * borrows the metaphor: shelves on the left, contents on the right, a path
 * showing where you are. What it does *not* borrow is the filesystem's
 * biggest limitation — an article lives on exactly one shelf here, but its
 * relationships to everything else are unbounded and live in the graph.
 * Folders organise; relationships connect. Conflating the two is what
 * makes wikis sprawl.
 *
 * Two panes on desktop, one with drill-down on phones, because a sidebar
 * and a content pane cannot both be useful in 390 points of width.
 */
export function KnowledgeExplorer() {
  const t = useT()
  const [groupId, setGroupId] = useState(KNOWLEDGE_GROUPS[0].id)
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const group =
    KNOWLEDGE_GROUPS.find((g) => g.id === groupId) ?? KNOWLEDGE_GROUPS[0]
  const categories = useMemo(() => categoriesInGroup(group), [group])
  const category = categories.find((c) => c.id === categoryId) ?? null
  const articles = useMemo(
    () => (category ? articlesInCategory(category.id) : []),
    [category],
  )

  const openGroup = (g: KnowledgeGroup) => {
    setGroupId(g.id)
    setCategoryId(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
      {/* Path — always visible, so "where am I" never needs guessing */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-faint sm:px-5">
        <span>{t({ en: "Knowledge", nl: "Kennis" })}</span>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={cn("transition-colors hover:text-foreground", !category && "text-foreground")}
        >
          {t(group.title)}
        </button>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-foreground">{category.title}</span>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Shelves. Hidden on phones once you're inside one — the path
            above and the back control are the way out there. */}
        <nav
          aria-label={t({ en: "Knowledge groups", nl: "Kennisgroepen" })}
          className={cn(
            "border-line lg:block lg:border-r",
            category ? "hidden lg:block" : "block",
          )}
        >
          <ul className="p-2">
            {KNOWLEDGE_GROUPS.map((g) => {
              const open = g.id === group.id
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => openGroup(g)}
                    aria-current={open ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                      open ? "bg-accent-soft text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {open ? (
                      <FolderOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                    ) : (
                      <Folder className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                    )}
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {g.ordinal}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">{t(g.title)}</span>
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {articlesInGroup(g).length}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Contents */}
        <div className="min-w-0 p-4 sm:p-6">
          {!category ? (
            <>
              <h2 className="font-heading text-2xl text-foreground">{t(group.title)}</h2>
              <p className="mt-1.5 max-w-xl text-pretty leading-relaxed text-muted">
                {t(group.blurb)}
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {categories.map((c) => {
                  const n = articlesInCategory(c.id).length
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setCategoryId(c.id)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-line px-4 py-3 text-left transition-colors hover:border-ember/40"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: `hsl(${c.hue} 50% 58%)` }}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-foreground">{c.title}</span>
                          <span className="block truncate text-xs text-muted">{c.tagline}</span>
                        </span>
                        <span className="font-mono text-[10px] tabular-nums text-faint">{n}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:text-foreground lg:hidden"
              >
                <CornerUpLeft className="h-3.5 w-3.5" />
                {t(group.title)}
              </button>

              <h2 className="font-heading text-2xl text-foreground">{category.title}</h2>
              <p className="mt-1.5 max-w-xl text-pretty leading-relaxed text-muted">
                {category.description}
              </p>

              {articles.length === 0 ? (
                <p className="mt-6 text-sm text-muted">
                  {t({
                    en: "No articles in this domain yet — a good place to contribute.",
                    nl: "Nog geen artikelen in dit domein — een goede plek om bij te dragen.",
                  })}
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-line rounded-xl border border-line">
                  {articles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/knowledge/${a.category}/${a.slug}`}
                        className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-foreground">{a.title}</span>
                          <span className="block truncate text-xs text-muted">{a.summary}</span>
                        </span>
                        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint sm:block">
                          {a.readingMinutes} min
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeExplorer

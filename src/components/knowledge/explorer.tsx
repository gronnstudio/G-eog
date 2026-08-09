"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  ChevronRight,
  CornerUpLeft,
  FileText,
  Folder,
  FolderOpen,
  History,
  Star,
} from "lucide-react"

import { useT } from "@/components/language-provider"
import { ARTICLES, articlesInCategory } from "@/lib/knowledge"
import {
  CATEGORY_GROUPS,
  KNOWLEDGE_GROUPS,
  articlesInGroup,
  categoriesInGroup,
  type KnowledgeGroup,
} from "@/lib/knowledge/taxonomy"
import { toggleFavourite, useFavourites, useRecent } from "@/lib/pins"
import { cn } from "@/lib/utils"

/**
 * The knowledge collection as a file explorer — the primary surface of the
 * archive.
 *
 * People already know how to operate a filesystem, so the browsing layer
 * borrows the metaphor: shelves on the left, contents on the right, a path
 * showing where you are. What it does *not* borrow is the filesystem's
 * biggest limitation — an article lives on exactly one shelf here, but its
 * relationships to everything else are unbounded and live in the graph.
 * Folders organise; relationships connect. Conflating the two is what
 * makes wikis sprawl.
 *
 * Ten shelves: six hold categories, four are system shelves that open the
 * graph, the evidence registry, the learning paths and the project itself.
 * Where you are is mirrored into the URL (?d=…&c=…) so positions survive
 * reload and can be shared; starred and recently-opened articles live on
 * the device (no accounts in the static open core).
 *
 * Two panes on desktop, one with drill-down on phones, because a sidebar
 * and a content pane cannot both be useful in 390 points of width.
 */

const ARTICLE_BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

function readParams(): { d: string | null; c: string | null } {
  if (typeof window === "undefined") return { d: null, c: null }
  const p = new URLSearchParams(window.location.search)
  return { d: p.get("d"), c: p.get("c") }
}

export function KnowledgeExplorer() {
  const t = useT()
  const [groupId, setGroupId] = useState(CATEGORY_GROUPS[0].id)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  // Phones drill down one level at a time — shelves, THEN a shelf's
  // contents — never both stacked. `entered` is that mobile position;
  // desktop shows the two panes side by side and ignores it.
  const [entered, setEntered] = useState(false)
  const favourites = useFavourites()
  const recent = useRecent()
  const rootRef = useRef<HTMLDivElement>(null)

  // Adopt a shared/reloaded position once, on mount. rAF defers the
  // setState out of the effect's synchronous phase, which keeps hydration
  // clean — the server can't know the query string here.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const { d, c } = readParams()
      const g = d && CATEGORY_GROUPS.find((x) => x.id === d)
      if (g) {
        setGroupId(g.id)
        setEntered(true)
        if (c && g.categories.includes(c as (typeof g.categories)[number])) {
          setCategoryId(c)
        }
      }
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // Mirror the position back out, replacing rather than pushing — browsing
  // the archive should not bury the back button under every click.
  useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (!entered || (groupId === CATEGORY_GROUPS[0].id && !categoryId)) {
      url.searchParams.delete("d")
      url.searchParams.delete("c")
    } else {
      url.searchParams.set("d", groupId)
      if (categoryId) url.searchParams.set("c", categoryId)
      else url.searchParams.delete("c")
    }
    window.history.replaceState(null, "", url)
  }, [groupId, categoryId, entered])

  const group =
    CATEGORY_GROUPS.find((g) => g.id === groupId) ?? CATEGORY_GROUPS[0]
  const categories = categoriesInGroup(group)
  const category = categories.find((c) => c.id === categoryId) ?? null
  const articles = category ? articlesInCategory(category.id) : []

  const openGroup = (g: KnowledgeGroup) => {
    setGroupId(g.id)
    setCategoryId(null)
    setEntered(true)
  }

  // Backspace = up one level, the explorer gesture people's hands know.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Backspace") return
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, [contenteditable]")) return
      if (categoryId) {
        e.preventDefault()
        setCategoryId(null)
      } else if (entered) {
        e.preventDefault()
        setEntered(false)
      }
    },
    [categoryId, entered],
  )

  const recentArticles = recent
    .map((s) => ARTICLE_BY_SLUG.get(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 4)

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-2xl border border-line bg-surface/40"
    >
      {/* Path — always visible, so "where am I" never needs guessing */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-faint sm:px-5">
        <span className={cn(!entered && "text-foreground")}>
          {t({ en: "Knowledge", nl: "Kennis" })}
        </span>
        <ChevronRight className={cn("h-3 w-3", !entered && "hidden lg:block")} aria-hidden />
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={cn(
            "transition-colors hover:text-foreground",
            !category && "text-foreground",
            !entered && "hidden lg:block",
          )}
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
          aria-label={t({ en: "Knowledge shelves", nl: "Kennisplanken" })}
          className={cn(
            "border-line lg:block lg:border-r",
            entered ? "hidden lg:block" : "block",
          )}
        >
          <ul className="p-2">
            {KNOWLEDGE_GROUPS.map((g) => {
              const open = !g.href && g.id === group.id
              const row = (
                <>
                  {open ? (
                    <FolderOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  ) : (
                    <Folder className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                  )}
                  <span className="font-mono text-[10px] tabular-nums text-faint">
                    {g.ordinal}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{t(g.title)}</span>
                  {g.href ? (
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
                  ) : (
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {articlesInGroup(g).length}
                    </span>
                  )}
                </>
              )
              return (
                <li key={g.id}>
                  {g.href ? (
                    // A system shelf opens another surface of the site —
                    // the graph is not a folder, and is not pretended into one.
                    <Link
                      href={g.href}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-muted transition-colors hover:text-foreground"
                    >
                      {row}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openGroup(g)}
                      aria-current={open ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                        open ? "bg-accent-soft text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      {row}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Contents — on phones this pane exists only after entering a
            shelf, so exactly one level is ever in view. */}
        <div className={cn("min-w-0 p-4 sm:p-6", !entered && "hidden lg:block")}>
          {!category ? (
            <>
              <button
                type="button"
                onClick={() => setEntered(false)}
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:text-foreground lg:hidden"
              >
                <CornerUpLeft className="h-3.5 w-3.5" />
                {t({ en: "All shelves", nl: "Alle planken" })}
              </button>
              <h2 className="font-heading text-2xl text-foreground">{t(group.title)}</h2>
              <p className="mt-1.5 max-w-xl text-pretty leading-relaxed text-muted">
                {t(group.blurb)}
              </p>

              {recentArticles.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                    <History className="h-3.5 w-3.5" aria-hidden />
                    {t({ en: "Recent", nl: "Recent" })}
                  </span>
                  {recentArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/knowledge/${a.category}/${a.slug}`}
                      className="max-w-[16rem] truncate rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-ember/40 hover:text-foreground"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              )}

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
                  {articles.map((a) => {
                    const starred = favourites.includes(a.slug)
                    return (
                      <li key={a.slug} className="flex items-center">
                        <Link
                          href={`/knowledge/${a.category}/${a.slug}`}
                          className="group flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2"
                        >
                          <FileText className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-foreground">{a.title}</span>
                            <span className="block truncate text-xs text-muted">{a.summary}</span>
                          </span>
                          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint sm:block">
                            {a.readingMinutes} min
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleFavourite(a.slug)}
                          aria-pressed={starred}
                          aria-label={
                            starred
                              ? t({ en: "Remove favourite", nl: "Favoriet verwijderen" })
                              : t({ en: "Add favourite", nl: "Favoriet toevoegen" })
                          }
                          className="tap-target mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-2"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              starred ? "fill-amber text-amber" : "text-faint",
                            )}
                            aria-hidden
                          />
                        </button>
                      </li>
                    )
                  })}
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

"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { BookMarked, CornerDownLeft, FileText, FolderOpen, History, Route, Search, Sparkles } from "lucide-react"

import { useT, useUI } from "@/components/language-provider"
import { ARTICLES, CATEGORIES, LEARNING_PATHS, getCategory } from "@/lib/knowledge"
import { SOURCES } from "@/lib/knowledge/sources"
import { EASE_ORGANIC } from "@/lib/motion"

type Ctx = { open: () => void }
const PaletteContext = createContext<Ctx>({ open: () => {} })
export const useCommandPalette = () => useContext(PaletteContext)

const TRENDING = ["mycorrhizal-networks", "the-water-cycle", "keyline-design", "rewilding"]

/**
 * Recent searches, on the device. Once history exists it replaces the
 * hardcoded trending list — what you looked for beats what we guessed.
 */
const RECENT_SEARCH_KEY = "eog-recent-search"
const RECENT_SEARCH_LIMIT = 5

function readRecentSearches(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCH_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

function recordSearch(slug: string) {
  try {
    const next = [slug, ...readRecentSearches().filter((s) => s !== slug)].slice(
      0,
      RECENT_SEARCH_LIMIT,
    )
    window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next))
  } catch {
    // History is a convenience; losing it costs nothing.
  }
}

type SuggestionKind = "article" | "category" | "path" | "source"

interface Suggestion {
  kind: SuggestionKind
  key: string
  href: string
  /** Primary line shown to the user. */
  title: string
  /** Secondary line (summary / tagline), when available. */
  sub?: string
  /** Category chip for articles. */
  chip?: string
  /** Where the query matched, for highlighting. */
  matchField: "title" | "sub"
  matchStart: number
  matchLen: number
}

/**
 * Google-style live suggestions: prefix + substring matching over article
 * titles/summaries/tags, category titles, learning-path titles and source
 * titles. Rank: title prefix (0) > title substring (1) > sub/tag (2).
 */
function buildSuggestions(query: string): Suggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: { s: Suggestion; score: number }[] = []

  const consider = (
    kind: SuggestionKind,
    key: string,
    href: string,
    title: string,
    sub: string | undefined,
    chip: string | undefined,
  ) => {
    const titleLower = title.toLowerCase()
    const ti = titleLower.indexOf(q)
    if (ti === 0) {
      scored.push({ score: 0, s: { kind, key, href, title, sub, chip, matchField: "title", matchStart: 0, matchLen: q.length } })
      return
    }
    if (ti > 0) {
      scored.push({ score: 1, s: { kind, key, href, title, sub, chip, matchField: "title", matchStart: ti, matchLen: q.length } })
      return
    }
    if (sub) {
      const si = sub.toLowerCase().indexOf(q)
      if (si >= 0) {
        scored.push({ score: 2, s: { kind, key, href, title, sub, chip, matchField: "sub", matchStart: si, matchLen: q.length } })
      }
    }
  }

  for (const a of ARTICLES) {
    consider("article", `a:${a.slug}`, `/knowledge/${a.category}/${a.slug}`, a.title, a.summary, getCategory(a.category)?.title)
    // Tags match as a fallback tier, so "#compost" style vocabulary finds
    // articles whose title and summary use different words.
    if (!scored.some((r) => r.s.key === `a:${a.slug}`) && a.tags.some((tag) => tag.toLowerCase().includes(q))) {
      scored.push({
        score: 2,
        s: { kind: "article", key: `a:${a.slug}`, href: `/knowledge/${a.category}/${a.slug}`, title: a.title, sub: a.tags.map((tag) => `#${tag}`).join("  "), chip: getCategory(a.category)?.title, matchField: "sub", matchStart: -1, matchLen: 0 },
      })
    }
  }
  for (const c of CATEGORIES) {
    consider("category", `c:${c.id}`, `/knowledge/${c.id}`, c.title, c.tagline, undefined)
  }
  for (const p of LEARNING_PATHS) {
    consider("path", `p:${p.slug}`, `/learn#${p.slug}`, p.title, p.summary, undefined)
  }
  for (const s of SOURCES) {
    consider("source", `s:${s.id}`, "/evidence", s.title, `${s.authors} · ${s.year}`, undefined)
  }

  // Grouped: the best articles first, then a few of each other kind, so
  // results read in sections rather than one interleaved pile.
  const byKind = (kind: SuggestionKind, take: number) =>
    scored
      .filter((r) => r.s.kind === kind)
      .sort((x, y) => x.score - y.score || x.s.title.localeCompare(y.s.title))
      .slice(0, take)
      .map((r) => r.s)

  return [
    ...byKind("article", 5),
    ...byKind("category", 2),
    ...byKind("path", 2),
    ...byKind("source", 2),
  ]
}

/** Highlight the matched substring in ember. */
function Highlighted({ text, start, len }: { text: string; start: number; len: number }) {
  if (len <= 0 || start < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent font-semibold text-ember-text">{text.slice(start, start + len)}</mark>
      {text.slice(start + len)}
    </>
  )
}

const KIND_ICON: Record<SuggestionKind, typeof FileText> = {
  article: FileText,
  category: FolderOpen,
  path: Route,
  source: BookMarked,
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const ui = useUI()
  const t = useT()

  const kindLabel: Record<SuggestionKind, string> = {
    article: t({ en: "Article", nl: "Artikel" }),
    category: t({ en: "Category", nl: "Categorie" }),
    path: t({ en: "Learning path", nl: "Leerpad" }),
    source: t({ en: "Source", nl: "Bron" }),
  }

  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setCursor(0)
  }, [])

  // Global ⌘K / Ctrl-K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  const [recent, setRecent] = useState<string[]>([])

  // rAF defers the setState out of the effect's synchronous phase — same
  // hydration-safe pattern as the graph browser's deep-link adoption.
  useEffect(() => {
    if (!isOpen) return
    const id = requestAnimationFrame(() => {
      setRecent(readRecentSearches())
      inputRef.current?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [isOpen])

  const hasQuery = query.trim().length > 0

  /**
   * Unified item list the keyboard cursor walks over: live suggestions when
   * typing, trending articles otherwise — mapped into the same shape.
   */
  const items = useMemo<Suggestion[]>(() => {
    if (hasQuery) return buildSuggestions(query)
    // Your history beats our guess, once you have one.
    const idle = recent.length > 0 ? recent : TRENDING
    return idle.map((s) => ARTICLES.find((a) => a.slug === s))
      .filter((a): a is (typeof ARTICLES)[number] => Boolean(a))
      .map((a) => ({
        kind: "article" as const,
        key: `a:${a.slug}`,
        href: `/knowledge/${a.category}/${a.slug}`,
        title: a.title,
        sub: a.summary,
        chip: getCategory(a.category)?.title,
        matchField: "title" as const,
        matchStart: -1,
        matchLen: 0,
      }))
  }, [hasQuery, query, recent])

  const choose = useCallback(
    (item: Suggestion) => {
      if (item.kind === "article") recordSearch(item.key.slice(2))
      close()
    },
    [close],
  )

  const onEnter = () => {
    const item = items[cursor]
    if (item) {
      router.push(item.href)
      choose(item)
    }
  }

  return (
    <PaletteContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label={ui("palClose")}
              className="absolute inset-0 bg-forest/70 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={ui("palDialogLabel")}
              className="eog-glass relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-float"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.32, ease: EASE_ORGANIC }}
            >
              <div className="border-b border-line px-4 pb-3 pt-4">
                {/* Ember rim glow — matches the mobile dock pill's orbit-ring accent. */}
                <div className="relative flex items-center gap-3 rounded-full border border-line px-4 py-2.5 transition-colors duration-200 focus-within:border-ember/40">
                  {/* The dock pill's ember comet, orbiting the field —
                      the shared signature of primary navigation surfaces. */}
                  <span aria-hidden className="orbit-ring pointer-events-none absolute inset-0 rounded-full" />
                  <Search className="h-5 w-5 shrink-0 text-muted" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setCursor(0)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, items.length - 1)) }
                      if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
                      if (e.key === "Enter") onEnter()
                    }}
                    placeholder={ui("palPlaceholder")}
                    // appearance-none + inline outline kill iOS Safari's
                    // native green text-field ring inside the pill
                    className="w-full appearance-none border-0 bg-transparent text-lg text-foreground outline-none focus:outline-none focus-visible:outline-none placeholder:text-faint"
                    style={{ WebkitAppearance: "none", outline: "none", boxShadow: "none" }}
                  />
                  <kbd className="hidden rounded border border-line px-2 py-1 font-mono text-xs text-faint sm:block">
                    ESC
                  </kbd>
                </div>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {!hasQuery && (
                  <p className="flex items-center gap-2 px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-widest text-faint">
                    {recent.length > 0 ? (
                      <>
                        <History className="h-3 w-3" /> {t({ en: "Recent", nl: "Recent" })}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" /> {ui("palTrending")}
                      </>
                    )}
                  </p>
                )}
                {items.length === 0 && (
                  <p className="px-4 py-10 text-center text-muted">
                    {ui("palEmpty")}
                  </p>
                )}
                {items.map((s, i) => {
                  const Icon = KIND_ICON[s.kind]
                  return (
                    <Link
                      key={s.key}
                      href={s.href}
                      onClick={() => choose(s)}
                      onMouseEnter={() => setCursor(i)}
                      className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors ${
                        i === cursor ? "bg-accent-soft" : "hover:bg-surface-2"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon aria-label={kindLabel[s.kind]} className="h-4 w-4 shrink-0 text-muted" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {s.matchField === "title" ? (
                              <Highlighted text={s.title} start={s.matchStart} len={s.matchLen} />
                            ) : (
                              s.title
                            )}
                          </span>
                          {s.sub && (
                            <span className="block truncate text-sm text-muted">
                              {s.matchField === "sub" ? (
                                <Highlighted text={s.sub} start={s.matchStart} len={s.matchLen} />
                              ) : (
                                s.sub
                              )}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                          {s.chip ?? kindLabel[s.kind]}
                        </span>
                        {i === cursor && <CornerDownLeft className="h-4 w-4 text-accent" />}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaletteContext.Provider>
  )
}

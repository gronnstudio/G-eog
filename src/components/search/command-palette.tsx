"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { CornerDownLeft, Search, Sparkles } from "lucide-react"

import { useUI } from "@/components/language-provider"
import { ARTICLES, searchArticles, getCategory } from "@/lib/knowledge"
import { EASE_ORGANIC } from "@/lib/motion"

type Ctx = { open: () => void }
const PaletteContext = createContext<Ctx>({ open: () => {} })
export const useCommandPalette = () => useContext(PaletteContext)

const TRENDING = ["mycorrhizal-networks", "the-water-cycle", "keyline-design", "rewilding"]

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const ui = useUI()

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

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => inputRef.current?.focus())
  }, [isOpen])

  const results = useMemo(() => {
    if (!query.trim()) {
      return TRENDING.map((s) => ARTICLES.find((a) => a.slug === s)!).filter(Boolean)
    }
    return searchArticles(query)
  }, [query])

  const hrefFor = (slug: string) => {
    const a = ARTICLES.find((x) => x.slug === slug)
    return a ? `/knowledge/${a.category}/${a.slug}` : "/knowledge"
  }

  const onEnter = () => {
    const item = results[cursor]
    if (item) {
      router.push(hrefFor(item.slug))
      close()
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
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Search className="h-5 w-5 shrink-0 text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setCursor(0)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)) }
                    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
                    if (e.key === "Enter") onEnter()
                  }}
                  placeholder={ui("palPlaceholder")}
                  className="w-full bg-transparent text-lg text-foreground outline-none placeholder:text-faint"
                />
                <kbd className="hidden rounded border border-line px-2 py-1 font-mono text-xs text-faint sm:block">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <p className="flex items-center gap-2 px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-widest text-faint">
                    <Sparkles className="h-3 w-3" /> {ui("palTrending")}
                  </p>
                )}
                {results.length === 0 && (
                  <p className="px-4 py-10 text-center text-muted">
                    {ui("palEmpty")}
                  </p>
                )}
                {results.map((a, i) => {
                  const cat = getCategory(a.category)
                  return (
                    <Link
                      key={a.slug}
                      href={hrefFor(a.slug)}
                      onClick={close}
                      onMouseEnter={() => setCursor(i)}
                      className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors ${
                        i === cursor ? "bg-accent-soft" : "hover:bg-surface-2"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">{a.title}</span>
                        <span className="block truncate text-sm text-muted">{a.summary}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                          {cat?.title}
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

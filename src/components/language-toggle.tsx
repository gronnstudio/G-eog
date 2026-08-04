"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Flag } from "@/components/flag"
import { useLanguage, useT } from "@/components/language-provider"
import { LOCALES, LOCALE_BY_CODE } from "@/lib/i18n"
import { useMounted } from "@/lib/use-mounted"
import { cn } from "@/lib/utils"

const PANEL_W = 240
const PANEL_MAX_H = 288

/**
 * Language switcher as a flag dropdown across the world's most-spoken
 * languages. A compact trigger (flag · code · chevron) opens a scrollable
 * panel listing every locale by flag, endonym and code. The panel is
 * positioned with fixed coordinates computed from the trigger and clamped
 * to the viewport, so it never spills off-screen — whether it lives in
 * the top-right header, the curtain menu or the bottom dock sheet (where
 * it opens upward).
 */
export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()
  const t = useT()
  const mounted = useMounted()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number; maxH: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)

  const current = LOCALE_BY_CODE.get(locale) ?? LOCALES[0]

  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const gap = 8
    const margin = 8
    // Horizontal: prefer aligning the panel's right edge to the trigger's
    // (so it hangs left under a right-side control), but clamp into view.
    let left = r.right - PANEL_W
    left = Math.min(Math.max(margin, left), vw - PANEL_W - margin)
    // Vertical: open downward if there's room, else upward.
    const below = vh - r.bottom - gap - margin
    const above = r.top - gap - margin
    const openUp = below < 200 && above > below
    const maxH = Math.min(PANEL_MAX_H, Math.max(140, openUp ? above : below))
    const top = openUp ? r.top - gap - maxH : r.bottom + gap
    setPos({ left, top, maxH })
  }

  useLayoutEffect(() => {
    if (open) place()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      )
        return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const reflow = () => place()
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    window.addEventListener("resize", reflow)
    window.addEventListener("scroll", reflow, true)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", reflow)
      window.removeEventListener("scroll", reflow, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t({ en: "Language", nl: "Taal" })}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="tap-target flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-2"
      >
        <Flag code={mounted ? current.locale : "en"} />
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          {mounted ? current.locale : "en"}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-faint transition-transform", open && "rotate-180")}
        />
      </button>

      {open && pos && (
        <ul
          ref={panelRef}
          role="listbox"
          aria-label={t({ en: "Language", nl: "Taal" })}
          dir="ltr"
          style={{
            position: "fixed",
            left: pos.left,
            top: pos.top,
            width: PANEL_W,
            maxHeight: pos.maxH,
          }}
          className="no-scrollbar z-[90] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-float"
        >
          {LOCALES.map((l) => {
            const active = mounted && l.locale === locale
            return (
              <li key={l.locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(l.locale)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    active ? "bg-accent-soft" : "hover:bg-surface-2",
                  )}
                >
                  <Flag code={l.locale} />
                  <span className="flex-1 truncate text-sm text-foreground">{l.name}</span>
                  {active ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
                      {l.locale}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

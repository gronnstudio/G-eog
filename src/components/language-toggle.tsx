"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { useLanguage, useT } from "@/components/language-provider"
import { LOCALES, LOCALE_BY_CODE } from "@/lib/i18n"
import { useMounted } from "@/lib/use-mounted"
import { cn } from "@/lib/utils"

/**
 * Language switcher as a flag dropdown across the world's most-spoken
 * languages. A compact trigger (flag · code · chevron) opens a scrollable
 * panel listing every locale by flag, endonym and code — the pattern from
 * the design reference. Selecting one persists it, flips the active pill,
 * and (for Arabic) turns the whole document RTL via the provider.
 */
export function LanguageToggle({ align = "end" }: { align?: "start" | "end" }) {
  const { locale, setLocale } = useLanguage()
  const t = useT()
  const mounted = useMounted()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALE_BY_CODE.get(locale) ?? LOCALES[0]

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t({ en: "Language", nl: "Taal" })}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="tap-target flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-2"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          {mounted ? current.locale : "en"}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-faint transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t({ en: "Language", nl: "Taal" })}
          dir="ltr"
          className={cn(
            "eog-glass no-scrollbar absolute z-[80] mt-2 max-h-72 w-60 overflow-y-auto rounded-2xl p-1.5 shadow-float",
            align === "end" ? "right-0" : "left-0",
          )}
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
                  <span className="text-lg leading-none">{l.flag}</span>
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
    </div>
  )
}

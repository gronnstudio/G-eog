"use client"

import { useLanguage, useT } from "@/components/language-provider"
import { LOCALES } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Language switcher, taken over from the Equilibrium/GRØNN base — but as
 * a scrollable pill rail rather than the sliding two-segment control: the
 * languages sit on one horizontally scrollable, snap-aligned track (room
 * for more locales later), and the active one is a tinted pill. No thumb,
 * no slider — selection is a plain tap.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage()
  const t = useT()

  return (
    <div
      role="group"
      aria-label={t({ en: "Language", nl: "Taal" })}
      className={cn(
        "no-scrollbar flex max-w-44 snap-x snap-mandatory items-center gap-1 overflow-x-auto rounded-full border border-line p-1",
        className,
      )}
    >
      {LOCALES.map((option) => (
        <button
          key={option.locale}
          type="button"
          onClick={() => setLocale(option.locale)}
          aria-pressed={locale === option.locale}
          aria-label={option.name}
          className={cn(
            "tap-target min-w-11 shrink-0 snap-start rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
            locale === option.locale
              ? "bg-accent text-on-accent"
              : "text-muted hover:text-foreground active:text-foreground",
          )}
        >
          {option.locale}
        </button>
      ))}
    </div>
  )
}

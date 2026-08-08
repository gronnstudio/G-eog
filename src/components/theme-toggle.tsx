"use client"

import { useTheme } from "next-themes"
import { Clock3, Moon, Sun } from "lucide-react"

import { useUI } from "@/components/language-provider"
import { useThemeMode } from "@/components/theme-mode-provider"
import { DAY_THEME, NIGHT_THEME, THEME_OPTIONS } from "@/lib/themes"
import { useMounted } from "@/lib/use-mounted"
import { cn } from "@/lib/utils"

/** Quick header control: flips Golden Hour ↔ Blue Hour (writes manual). */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const { chooseTheme } = useThemeMode()
  const mounted = useMounted()
  const ui = useUI()

  const isNight = resolvedTheme !== DAY_THEME

  return (
    <button
      type="button"
      aria-label={isNight ? ui("themeSwitchDay") : ui("themeSwitchNight")}
      onClick={() => chooseTheme(isNight ? DAY_THEME : NIGHT_THEME)}
      className={`tap-target grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-foreground ${className}`}
    >
      {mounted ? (
        isNight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  )
}

/**
 * Full picker for the curtain menu and dock sheet: Auto (follow the
 * clock) plus the two Hours, with pre-hydration-safe swatches.
 */
export function ThemeModePicker() {
  const { resolvedTheme } = useTheme()
  const { mode, enableAuto, chooseTheme } = useThemeMode()
  const mounted = useMounted()
  const ui = useUI()

  // The option labels live in lib/themes.ts (chrome-agnostic); the picker
  // resolves them through the UI dictionary here.
  const optionLabel = (name: string) =>
    name === DAY_THEME ? ui("themeGoldenHour") : ui("themeBlueHour")

  const pill =
    "tap-target inline-flex min-w-11 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors duration-300"

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-4" role="group" aria-label={ui("theme")}>
      <button
        type="button"
        onClick={enableAuto}
        aria-pressed={mounted && mode === "auto"}
        className={cn(
          pill,
          mounted && mode === "auto"
            ? "border-accent/50 bg-accent-soft text-foreground"
            : "border-line text-muted hover:text-foreground",
        )}
      >
        <Clock3 className="h-3.5 w-3.5" /> {ui("auto")}
      </button>
      {THEME_OPTIONS.map((option) => {
        const active = mounted && mode === "manual" && resolvedTheme === option.name
        return (
          <button
            key={option.name}
            type="button"
            onClick={() => chooseTheme(option.name)}
            aria-pressed={active}
            className={cn(
              pill,
              active
                ? "border-accent/50 bg-accent-soft text-foreground"
                : "border-line text-muted hover:text-foreground",
            )}
          >
            <span
              aria-hidden
              className="grid h-4 w-4 place-items-center rounded-full border border-line"
              style={{ background: option.bg }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: option.dot }} />
            </span>
            {optionLabel(option.name)}
          </button>
        )
      })}
    </div>
  )
}

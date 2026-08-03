// The time-of-day theme system, ported from GRØNN Studio.
//
// Two palettes: Golden Hour (day) and Blue Hour (night). By default the
// site follows the visitor's own clock — warm ground by day, deep indigo
// after dark. The visitor can always overrule it; overruling is permanent
// until they choose Auto again.

/** localStorage flag: has the visitor overruled the clock? */
export const THEME_MODE_KEY = "eog-theme-mode"
/** next-themes' own storage key — pre-seeded in the boot script. */
export const THEME_KEY = "theme"

export type ThemeMode = "auto" | "manual"

export const DAY_THEME = "goldenhour"
export const NIGHT_THEME = "bluehour"

// Local clock, not sunrise tables (GRØNN base note): real sunrise needs
// the visitor's latitude, and asking for location permission to pick a
// colour would be a wildly disproportionate trade. These boundaries are
// the single source of truth — the pre-paint boot script in layout.tsx
// is generated from them.
export const DAY_START_HOUR = 7
export const NIGHT_START_HOUR = 19

/** Which palette the visitor's clock calls for. */
export function resolveAutoTheme(now: Date = new Date()): string {
  const hour = now.getHours()
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR
    ? DAY_THEME
    : NIGHT_THEME
}

export type ThemeOption = {
  name: string
  label: string
  /** Swatch values duplicated from globals.css on purpose: the switcher
      paints them before hydration, when a not-yet-applied theme's custom
      properties cannot be read. Keep in step with the token blocks. */
  bg: string
  dot: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { name: DAY_THEME, label: "Golden Hour", bg: "#f8efdc", dot: "#175c3d" },
  { name: NIGHT_THEME, label: "Blue Hour", bg: "#10152e", dot: "#bfe3d0" },
]

export const ALL_THEME_NAMES = THEME_OPTIONS.map((o) => o.name)

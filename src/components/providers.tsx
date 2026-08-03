"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

import { ThemeModeProvider } from "@/components/theme-mode-provider"
import { ALL_THEME_NAMES, NIGHT_THEME } from "@/lib/themes"

/**
 * Time-of-day theming (GRØNN base): Golden Hour by day, Blue Hour after
 * dark, following the visitor's clock unless they overrule it. The
 * pre-paint script in layout.tsx has already seeded next-themes' storage,
 * so defaultTheme is only what a storage-less browser gets.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      themes={ALL_THEME_NAMES}
      defaultTheme={NIGHT_THEME}
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </ThemeProvider>
  )
}

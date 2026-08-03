"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

/**
 * Dark mode first: the resting theme is "dark" (Deep Forest). Visitors can
 * switch to "light" (Daylight); next-themes persists the choice and the
 * pre-paint script in layout.tsx prevents any flash of the wrong ground.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      themes={["dark", "light"]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

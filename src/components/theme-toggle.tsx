"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { useMounted } from "@/lib/use-mounted"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to daylight" : "Switch to deep forest"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-foreground ${className}`}
    >
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  )
}

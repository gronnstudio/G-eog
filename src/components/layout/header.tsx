"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Search, X } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { useCommandPalette } from "@/components/search/command-palette"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
]

export function Header() {
  const pathname = usePathname()
  const { open } = useCommandPalette()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    // Sync once on the next frame rather than synchronously in the effect
    // body, so a deep-linked page still reflects its initial scroll.
    const id = requestAnimationFrame(onScroll)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])


  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
            scrolled ? "eog-glass shadow-soft" : "bg-transparent",
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Equilibrium home">
            <EquilibriumMark />
            <span className="font-heading text-lg tracking-tight text-foreground">Equilibrium</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={open}
              aria-label="Search"
              className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] text-faint lg:inline">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted md:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menu && (
          <nav className="eog-glass mt-2 space-y-1 rounded-2xl p-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenu(false)}
                className="block rounded-xl px-4 py-3 text-foreground hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function EquilibriumMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.5" />
        <circle cx="16" cy="9" r="2.4" fill="var(--color-accent)" />
        <circle cx="9" cy="21" r="2.4" fill="var(--color-fern)" />
        <circle cx="23" cy="21" r="2.4" fill="var(--color-sage)" />
        <path d="M16 9 L9 21 M16 9 L23 21 M9 21 L23 21" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
      </svg>
    </span>
  )
}

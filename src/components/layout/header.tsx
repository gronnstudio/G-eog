"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"

import { LanguageToggle } from "@/components/language-toggle"
import { useUI } from "@/components/language-provider"
import { LetterFlip } from "@/components/motion/letter-flip"
import { ThemeModePicker } from "@/components/theme-toggle"
import { useCommandPalette } from "@/components/search/command-palette"
import { ARTICLES, getCategory, totalStats } from "@/lib/knowledge"
import { DURATION_CURTAIN, EASE_CURTAIN } from "@/lib/motion"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", key: "nav_home" },
  { href: "/explore", key: "nav_explore" },
  { href: "/knowledge", key: "nav_knowledge" },
  { href: "/learn", key: "nav_learn" },
  { href: "/community", key: "nav_community" },
  { href: "/about", key: "nav_about" },
] as const

// Topographic contour lines for the menu backdrop (GRØNN base).
const CONTOURS = [
  "M-100 520 C200 420 500 620 800 520 C1100 420 1400 600 1700 500",
  "M-100 620 C250 520 550 700 850 610 C1150 520 1450 690 1700 600",
  "M-100 720 C300 640 600 790 900 710 C1200 630 1500 780 1700 700",
  "M-100 420 C220 340 520 500 820 420 C1120 340 1420 480 1700 400",
]

export function Header() {
  const pathname = usePathname()
  const ui = useUI()
  const { open: openSearch } = useCommandPalette()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    const id = requestAnimationFrame(onScroll)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Phones: the wordmark comes and goes with scroll direction — the same
  // horizontal fold language as the dock below (GRØNN base).
  const [logoHidden, setLogoHidden] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (y < 80) setLogoHidden(false)
      else if (dy > 4) setLogoHidden(true)
      else if (dy < -4) setLogoHidden(false)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the curtain on navigation (reset-on-prop-change pattern); lock
  // scroll while open.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const headerRef = useRef<HTMLElement>(null)
  useFocusTrap(headerRef, open, () => setOpen(false))

  const featured = ARTICLES[1] ?? ARTICLES[0]
  const featuredCat = featured ? getCategory(featured.category) : undefined
  const stats = totalStats()

  return (
    <header
      ref={headerRef}
      className={cn(
        // On phones the header is just the floating wordmark (the pill
        // dock owns navigation there); the glass bar, MENU button and
        // curtain are desktop chrome, from md up.
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-colors duration-500 md:pointer-events-auto",
        scrolled && !open ? "md:glass" : "bg-transparent",
      )}
    >
      <div className="relative z-50 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label={ui("menuHomeAria")}
          inert={open || undefined}
          className={cn(
            "group pointer-events-auto flex items-center gap-2.5",
            reduced
              ? "transition-none"
              : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            logoHidden &&
              "pointer-events-none -translate-x-12 opacity-0 blur-[2px] md:pointer-events-auto md:translate-x-0 md:opacity-100 md:blur-none",
          )}
        >
          {/* Animated brand lockup (self-animating SMIL SVG: stroke draws,
              fill blooms). White artwork on the dark Hours; the ink variant
              carries Golden Hour. The header uses the STILL variants —
              the SMIL draw loop lives in the intro only; here it kept
              replaying and its stroke pass overlapped the wordmark. */}
          <Image
            src="/brand/logo-still.svg"
            alt=""
            width={814}
            height={165}
            priority
            unoptimized
            draggable={false}
            className="hidden h-9 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03] dark:block"
          />
          <Image
            src="/brand/logo-still-ink.svg"
            alt=""
            width={814}
            height={165}
            priority
            unoptimized
            draggable={false}
            className="h-9 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03] dark:hidden"
          />
          <span className="sr-only">{ui("menuHomeAria")}</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-2 lg:gap-4">
          <div inert={open || undefined} className="flex items-center gap-2 lg:gap-4">
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.slice(1, -1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group/nav text-sm tracking-wide",
                    pathname.startsWith(item.href) ? "text-foreground" : "text-muted",
                  )}
                >
                  <span className="sr-only">{ui(item.key)}</span>
                  <LetterFlip text={ui(item.key)} />
                </Link>
              ))}
            </nav>

            <span className="hidden sm:block">
              <LanguageToggle />
            </span>

            <button
              type="button"
              onClick={openSearch}
              className="tap-target hidden items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition-colors hover:text-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">{ui("search")}</span>
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] text-faint lg:inline">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/explore"
              className="tap-target hidden rounded-full bg-gronn-green px-5 py-2.5 text-sm font-medium text-gronn-white transition-transform hover:scale-[1.03] sm:inline-block"
            >
              {ui("exploreGraph")}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="tap-target glass hidden items-center gap-2.5 rounded-full px-4 py-2.5 text-sm text-foreground transition-colors hover:text-accent md:flex"
          >
            {/* Hamburger that morphs into a cross */}
            <span aria-hidden className="relative block h-2.5 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ease-out",
                  open && "top-1/2 -translate-y-1/2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-all duration-300 ease-out",
                  open && "bottom-auto top-1/2 -translate-y-1/2 -rotate-45",
                )}
              />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider">
              {open ? ui("close") : ui("menu")}
            </span>
          </button>
        </div>
      </div>

      {/* ── Full-screen spatial menu ─────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={ui("menuSiteMenu")}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: DURATION_CURTAIN, ease: EASE_CURTAIN }}
            className="fixed inset-0 top-0 z-40 overflow-y-auto bg-background"
          >
            {/* Topographic backdrop, drawing itself in */}
            <svg
              aria-hidden
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMax slice"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {CONTOURS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity="0.12"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, delay: 0.2 + i * 0.15 }}
                />
              ))}
            </svg>

            <div className="relative mx-auto grid min-h-svh w-full max-w-7xl gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
              {/* Main pages */}
              <nav className="flex flex-col justify-center gap-1">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + 0.05 * i, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-baseline gap-4 py-2 font-heading text-4xl font-semibold tracking-tight transition-colors sm:text-5xl",
                        pathname === item.href
                          ? "text-accent"
                          : "text-foreground hover:text-accent",
                      )}
                    >
                      <span className="font-mono text-xs tracking-[0.25em] text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {ui(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Featured knowledge + controls */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col justify-center gap-8"
              >
                {featured && (
                  <Link
                    href={`/knowledge/${featured.category}/${featured.slug}`}
                    className="group block overflow-hidden rounded-lg border border-line"
                  >
                    <div
                      className="relative aspect-[16/9] overflow-hidden"
                      style={{
                        background: `radial-gradient(80% 100% at 30% 20%, hsl(${featuredCat?.hue ?? 150} 45% 30%), var(--color-surface))`,
                      }}
                    >
                      <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.22em] text-sage/80">
                        {featuredCat?.title}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                        {ui("featuredArticle")}
                      </p>
                      <p className="mt-2 font-heading text-lg font-semibold group-hover:text-accent">
                        {featured.title}
                      </p>
                    </div>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    openSearch()
                  }}
                  className="group border-l-2 border-accent pl-5 text-left"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                    {ui("searchEcosystem")}
                  </p>
                  <p className="mt-2 font-heading text-lg font-semibold leading-snug group-hover:text-accent">
                    {stats.articles} {ui("statArticles")} · {stats.connections} {ui("statConnections")} · ⌘K
                  </p>
                </button>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-5 text-sm text-muted">
                  <a
                    href="https://github.com/gronnstudio/g-eog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target underline-draw hover:text-foreground"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://gronn.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target underline-draw hover:text-foreground"
                  >
                    GRØNN Studio
                  </a>
                  <span>CC BY-SA 4.0</span>
                </div>

                <div className="flex flex-col gap-4">
                  <ThemeModePicker />
                  <LanguageToggle />
                </div>

                <Link
                  href="/explore"
                  className="inline-block w-fit rounded-full bg-gronn-green px-7 py-3.5 text-sm font-medium text-gronn-white transition-transform hover:scale-[1.02]"
                >
                  {ui("exploreGraph")}
                </Link>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function EquilibriumMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.5" />
      <circle cx="16" cy="9" r="2.4" fill="var(--color-ember)" />
      <circle cx="9" cy="21" r="2.4" fill="var(--color-fern)" />
      <circle cx="23" cy="21" r="2.4" fill="var(--color-sage)" />
      <path d="M16 9 L9 21 M16 9 L23 21 M9 21 L23 21" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

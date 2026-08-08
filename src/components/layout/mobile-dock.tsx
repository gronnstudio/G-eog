"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import type Lenis from "lenis"

import { LanguageToggle } from "@/components/language-toggle"
import { useUI } from "@/components/language-provider"
import { ThemeModePicker } from "@/components/theme-toggle"
import { useCommandPalette } from "@/components/search/command-palette"
import { EASE_REVEAL } from "@/lib/motion"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// The mobile dock, ported from the GRØNN base: a floating glass pill
// within thumb reach, phones only (the desktop keeps the header). Five
// slots — home, knowledge, a prominent explore-the-graph centre, learn,
// and a grid button that opens a slide-up sheet with the remaining pages
// plus search and the theme control. A viewport deep, the grid slot
// hands its place to a back-to-top arrow with a pulsing accent ring.

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
}

const icons = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" {...stroke} />
    </svg>
  ),
  // An open field-guide — the knowledge library.
  knowledge: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 5.5C10.5 4 8 3.5 4.5 3.5v14c3.5 0 6 .5 7.5 2 1.5-1.5 4-2 7.5-2v-14c-3.5 0-6 .5-7.5 2Z" {...stroke} />
      <path d="M12 5.5v14" {...stroke} />
    </svg>
  ),
  // A sprouting seedling — the learning paths.
  learn: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21v-8" {...stroke} />
      <path d="M12 13C12 9.5 9.5 7 5.5 7c0 4 2.5 6.5 6.5 6Z" {...stroke} />
      <path d="M12 10.5c0-3 2-5.5 6.5-5.5 0 4.5-2.5 6.5-6.5 6Z" {...stroke} />
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <circle cx="5.5" cy="5.5" r="2" /><circle cx="12" cy="5.5" r="2" /><circle cx="18.5" cy="5.5" r="2" />
      <circle cx="5.5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18.5" cy="12" r="2" />
      <circle cx="5.5" cy="18.5" r="2" /><circle cx="12" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" />
    </svg>
  ),
  // The graph — three connected nodes, the centre slot's identity.
  graph: (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="5" r="2.4" {...stroke} />
      <circle cx="5.5" cy="18" r="2.4" {...stroke} />
      <circle cx="18.5" cy="18" r="2.4" {...stroke} />
      <path d="M10.8 7 6.8 16M13.2 7l4 9M8 18h8" {...stroke} />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="6.5" {...stroke} />
      <path d="m20 20-4.4-4.4" {...stroke} />
    </svg>
  ),
}

const PRIMARY = [
  { href: "/knowledge", key: "nav_knowledge" },
  { href: "/learn", key: "nav_learn" },
  { href: "/community", key: "nav_community" },
  { href: "/about", key: "nav_about" },
] as const

const SECONDARY = [
  { href: "/explore", key: "ftKnowledgeGraph" },
  { href: "/knowledge/soil", key: "dockSoil" },
  { href: "/knowledge/water", key: "dockWater" },
  { href: "/knowledge/fungi", key: "dockFungi" },
  { href: "/knowledge/permaculture", key: "dockPermaculture" },
] as const

export function MobileDock() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const ui = useUI()
  const { open: openSearch } = useCommandPalette()

  // A viewport deep → the back-to-top arrow takes the grid slot.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 1.1)
    window.addEventListener("scroll", onScroll, { passive: true })
    const id = requestAnimationFrame(onScroll)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Instagram-style tuck: reading (scrolling down) shrinks the pill
  // toward the bottom edge; scrolling back up restores it.
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (y < 80) setCompact(false)
      else if (dy > 4) setCompact(true)
      else if (dy < -4) setCompact(false)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // The header's full-screen menu locks scroll on <html>; the dock steps
  // aside while it is open instead of floating over it.
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  useEffect(() => {
    const read = () =>
      setHeaderMenuOpen(document.documentElement.style.overflow === "hidden")
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })
    const id = requestAnimationFrame(read)
    return () => {
      cancelAnimationFrame(id)
      observer.disconnect()
    }
  }, [])

  // Close the sheet whenever navigation happens (reset-on-prop-change).
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  const sheetRef = useRef<HTMLDivElement>(null)
  useFocusTrap(sheetRef, menuOpen, () => setMenuOpen(false))

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    if (lenis && !reduced) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
  }

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  // While reading near the top the wings fold away (the Instagram tuck).
  // But once a viewport deep, keep them open — the right wing holds the
  // back-to-top arrow, and folding it away is exactly what made the
  // grid→arrow switchout invisible while scrolling. Deep = wings stay,
  // arrow shows; near the top = tuck as before.
  const wingsHidden = compact && !menuOpen && !scrolled
  // 2 slots × 56px + the 6px gap between them.
  const WING = 118

  const slot =
    "flex h-11 w-14 items-center justify-center rounded-full transition-all duration-300 active:scale-90"
  // Active wing icon carries GRØNN's ember, matching gronn.studio's dock.
  const slotActive = "bg-foreground/10 text-ember"
  const swapSlot =
    "absolute inset-0 flex items-center justify-center rounded-full transition-colors duration-300 active:scale-90"

  if (headerMenuOpen) return null

  return (
    <>
      {/* Slide-up sheet with the remaining pages + site controls */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-[60] bg-forest/60 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              ref={sheetRef}
              id="dock-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={ui("dockSheetLabel")}
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE_REVEAL }}
              onClick={(e) => e.stopPropagation()}
              className="safe-x absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-y-auto rounded-t-3xl bg-background/70 pt-7 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.12)] backdrop-blur-2xl backdrop-saturate-150"
              style={{
                paddingBottom: "max(6.5rem, calc(env(safe-area-inset-bottom) + 6rem))",
              }}
            >
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                {ui("navigate")}
              </p>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-1">
                {PRIMARY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 font-heading text-2xl font-semibold tracking-tight transition-colors duration-300",
                      active(item.href) ? "text-accent" : "text-foreground",
                    )}
                  >
                    {ui(item.key)}
                  </Link>
                ))}
              </nav>
              <div className="mx-3 mb-4 mt-6 border-t border-line" />
              <nav className="flex flex-wrap gap-x-2 gap-y-4 px-3">
                {SECONDARY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "tap-target rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors duration-300",
                      active(item.href) && item.href !== "/explore"
                        ? "border-accent/50 bg-accent-soft text-accent"
                        : "border-line text-muted hover:border-accent/40 hover:text-foreground active:border-accent/40 active:text-foreground",
                    )}
                  >
                    {ui(item.key)}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    openSearch()
                  }}
                  className="tap-target flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs tracking-wide text-muted transition-colors duration-300 hover:border-accent/40 hover:text-foreground active:border-accent/40 active:text-foreground"
                >
                  {icons.search} {ui("search")}
                </button>
              </nav>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-4 border-t border-line px-3 pt-5">
                <ThemeModePicker />
                <LanguageToggle />
                <a
                  href="https://github.com/gronnstudio/g-eog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target text-xs tracking-wide text-muted underline-draw"
                >
                  GitHub
                </a>
                <a
                  href="https://gronn.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target text-xs tracking-wide text-muted underline-draw"
                >
                  GRØNN Studio
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive blur film beneath the pill (GRØNN base). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[59] md:hidden"
        style={{ height: "calc(env(safe-area-inset-bottom) + 8.5rem)" }}
      >
        {[
          { blur: 2, from: 0, to: 45 },
          { blur: 4, from: 30, to: 70 },
          { blur: 8, from: 55, to: 100 },
        ].map(({ blur, from, to }) => {
          const mask = `linear-gradient(to bottom, transparent ${from}%, black ${to}%)`
          return (
            <div
              key={blur}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
      </div>

      {/* The floating pill */}
      <nav
        aria-label={ui("dockLabel")}
        className="safe-x fixed inset-x-0 z-[61] flex justify-center md:hidden"
        style={{
          bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
        }}
      >
        <motion.div
          animate={
            compact && !menuOpen && !reduced
              ? { scale: 0.9, y: 6, opacity: 0.96 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE_REVEAL }}
          style={{ transformOrigin: "50% 100%" }}
          className="relative"
        >
          <div className="relative flex items-center overflow-hidden rounded-full bg-background/25 p-2 shadow-[0_10px_36px_-10px_rgba(10,21,16,0.45)] ring-1 ring-inset ring-white/10 backdrop-blur-lg backdrop-saturate-150">
            {/* Liquid-glass top light */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/12 via-transparent to-white/5"
            />
            {/* Accent comet orbiting the rim */}
            <span aria-hidden className="orbit-ring pointer-events-none absolute inset-0 rounded-full" />
            <motion.div
              initial={false}
              animate={{
                width: wingsHidden ? 0 : WING,
                opacity: wingsHidden ? 0 : 1,
                marginRight: wingsHidden ? 0 : 6,
              }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE_REVEAL }}
              inert={wingsHidden || undefined}
              className="flex items-center justify-end gap-1.5 overflow-hidden"
            >
              <Link href="/" aria-label={ui("nav_home")} className={cn(slot, active("/") ? slotActive : "text-muted")}>
                {icons.home}
              </Link>
              <Link
                href="/knowledge"
                aria-label={ui("nav_knowledge")}
                className={cn(slot, active("/knowledge") ? slotActive : "text-muted")}
              >
                {icons.knowledge}
              </Link>
            </motion.div>
            <Link
              href="/explore"
              aria-label={ui("exploreGraph")}
              className={cn(
                "flex h-11 w-14 shrink-0 items-center justify-center rounded-full transition duration-300 active:scale-90",
                active("/explore")
                  ? "bg-ember-strong text-white"
                  : "bg-gronn-green text-gronn-white hover:bg-ember-strong hover:text-white active:bg-ember-strong active:text-white",
              )}
            >
              {icons.graph}
            </Link>
            <motion.div
              initial={false}
              animate={{
                width: wingsHidden ? 0 : WING,
                opacity: wingsHidden ? 0 : 1,
                marginLeft: wingsHidden ? 0 : 6,
              }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE_REVEAL }}
              inert={wingsHidden || undefined}
              className="flex items-center justify-start gap-1.5 overflow-hidden"
            >
              <Link
                href="/learn"
                aria-label={ui("nav_learn")}
                className={cn(slot, active("/learn") ? slotActive : "text-muted")}
              >
                {icons.learn}
              </Link>
              {/* Shared last slot: grid button normally, back-to-top once
                  a viewport deep. */}
              <div className="relative h-11 w-14">
                <AnimatePresence initial={false}>
                  {scrolled && !menuOpen ? (
                    <motion.button
                      key="top"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                      transition={{ duration: reduced ? 0 : 0.25, ease: EASE_REVEAL }}
                      type="button"
                      onClick={toTop}
                      aria-label={ui("dockBackToTop")}
                      className={cn(swapSlot, "text-foreground/80")}
                    >
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span aria-hidden className="ring-pulse absolute inset-0 rounded-full border-2 border-ember" />
                        <svg aria-hidden width="15" height="15" viewBox="0 0 14 14" fill="none">
                          <path d="M7 12V2M7 2 2.5 6.5M7 2l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      key="menu"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                      transition={{ duration: reduced ? 0 : 0.25, ease: EASE_REVEAL }}
                      type="button"
                      aria-label={ui("navigate")}
                      aria-expanded={menuOpen}
                      aria-controls="dock-sheet"
                      onClick={() => setMenuOpen((v) => !v)}
                      className={cn(swapSlot, menuOpen ? slotActive : "text-muted")}
                    >
                      {icons.menu}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </nav>
    </>
  )
}

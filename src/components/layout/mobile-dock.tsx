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
import { DOCK_CENTRE, DOCK_WINGS } from "@/lib/site-tree"
import { MobileMegaMenu } from "@/components/layout/mobile-mega-menu"
import { EASE_REVEAL } from "@/lib/motion"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// The mobile dock, ported from the GRØNN base: a floating glass pill
// within thumb reach, phones only (the desktop keeps the header). Seven
// slots — home, knowledge, community, a prominent explore-the-graph
// centre, learn, search, and a grid button that opens a slide-up sheet
// with everything the pill lacks: seasonal guide, contribution wizard,
// about, category quick links, external links and the site controls.
// A viewport deep, the grid slot
// hands its place to a back-to-top arrow with a pulsing accent ring.

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
}

const icons = {
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
  // Two figures side by side — the community.
  community: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <circle cx="9" cy="8.5" r="3" {...stroke} />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" {...stroke} />
      <circle cx="16.5" cy="9.5" r="2.4" {...stroke} />
      <path d="M16 14.6c2.6.3 4.5 2.1 4.5 4.6" {...stroke} />
    </svg>
  ),
  // Apply — a watering can. The trowel shape read as a download arrow.
  apply: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 10h9v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7Z" {...stroke} />
      <path d="M13 12.5 20 9v6l-7-3.5" {...stroke} />
      <path d="M6.5 10V8.5a2.5 2.5 0 0 1 5 0V10" {...stroke} />
    </svg>
  ),
  // Evidence — a document with a check.
  evidence: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 3.5h8l4 4v13H6z" {...stroke} />
      <path d="M14 3.5v4h4" {...stroke} />
      <path d="m9 14 2 2 4-4" {...stroke} />
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <circle cx="5.5" cy="5.5" r="2" /><circle cx="12" cy="5.5" r="2" /><circle cx="18.5" cy="5.5" r="2" />
      <circle cx="5.5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18.5" cy="12" r="2" />
      <circle cx="5.5" cy="18.5" r="2" /><circle cx="12" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" />
    </svg>
  ),
  // Home — a seedling breaking ground.
  home: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 20v-7" {...stroke} />
      <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" {...stroke} />
      <path d="M12 15c0-2.4-1.6-4-4-4 0 2.4 1.6 4 4 4Z" {...stroke} />
      <path d="M5 20h14" {...stroke} />
    </svg>
  ),
  // Sections — soil horizons, the archive read as strata.
  strata: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 7c3-1.6 6-1.6 9 0s6 1.6 9 0" {...stroke} />
      <path d="M3 12c3-1.6 6-1.6 9 0s6 1.6 9 0" {...stroke} />
      <path d="M3 17c3-1.6 6-1.6 9 0s6 1.6 9 0" {...stroke} />
    </svg>
  ),
  // Ask — a fern crozier: a question mark that grows.
  ask: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 21c0-7 1.5-12 5.5-14.5C15.8 4.4 19 5.6 19 8.8c0 2.6-2.2 4.2-4.3 4.2-1.8 0-3.2-1.2-3.2-2.8 0-1.3 1-2.3 2.2-2.3" {...stroke} />
    </svg>
  ),
  // Display — sun over a horizon line.
  horizon: (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="11" r="3.6" {...stroke} />
      <path d="M12 3.5v1.6M12 16.9v1.1M4.6 11h1.6M17.8 11h1.6M6.8 5.8l1.1 1.1M16.1 5.8l-1.1 1.1" {...stroke} />
      <path d="M3 20.5h18" {...stroke} />
    </svg>
  ),
  // The graph — mycelial nodes, the centre slot's identity.
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

// Only destinations the pill itself lacks — the sheet is "everything else".
export function MobileDock() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [switchesOpen, setSwitchesOpen] = useState(false)
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

  // The header's full-screen menu: the dock steps aside while it is open.
  // Detected via an explicit data attribute the header sets — NOT by
  // sniffing overflow:hidden, because the dock's own mega menu locks
  // scroll the same way and the dock would mistake its own menu for the
  // header's and unmount it in a loop.
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  useEffect(() => {
    const read = () =>
      setHeaderMenuOpen(document.documentElement.hasAttribute("data-header-menu"))
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-header-menu"],
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
  useFocusTrap(sheetRef, switchesOpen, () => setSwitchesOpen(false))

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
  // Fold on downward scroll at ANY depth — the old `&& !scrolled` guard
  // pinned the pill fully open once past ~1.1 viewports, which on
  // today's longer pages read as "the menu stopped shrinking".
  // Scrolling up unfolds it (and deep pages then show back-to-top).
  const wingsHidden = compact && !menuOpen
  // 2 slots × 56px + the 6px gap between them.
  // Two 44px slots + one 6px gap per wing. This was 144 (sized for three
  // slots) after the pill slimmed to five items, which spread the icons
  // across dead space — the pill should hug its contents.
  const WING = 94

  const slot =
    "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 active:scale-90"
  // Active wing icon carries GRØNN's ember, matching gronn.studio's dock.
  const slotActive = "bg-foreground/10 text-ember"
  const swapSlot =
    "absolute inset-0 flex items-center justify-center rounded-full transition-colors duration-300 active:scale-90"

  /** Wing slot: a destination links, an action slot opens a panel. */
  const renderSlot = (n: (typeof DOCK_WINGS)[number]) => {
    if (n.href === "#menu") {
      return (
        <button
          key={n.href}
          type="button"
          aria-label={ui("navigate")}
          aria-expanded={menuOpen}
          aria-controls="site-mega-menu"
          onClick={() => setMenuOpen(true)}
          className={cn(slot, menuOpen ? slotActive : "text-muted")}
        >
          {icons.strata}
        </button>
      )
    }
    if (n.href === "#switches") {
      return (
        <button
          key={n.href}
          type="button"
          aria-label={`${ui("theme")} & ${ui("language")}`}
          aria-expanded={switchesOpen}
          aria-controls="dock-sheet"
          onClick={() => setSwitchesOpen(true)}
          className={cn(slot, switchesOpen ? slotActive : "text-muted")}
        >
          {icons.horizon}
        </button>
      )
    }
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-label={ui(n.key)}
        className={cn(slot, active(n.href) ? slotActive : "text-muted")}
      >
        {icons[n.icon!]}
      </Link>
    )
  }

  if (headerMenuOpen) return null

  return (
    <>
      {/* Full-screen mega menu: the site structure, one level visible. */}
      <MobileMegaMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenSearch={openSearch}
        onOpenSwitches={() => setSwitchesOpen(true)}
      />

      {/* Slide-up sheet — switches only. */}
      <AnimatePresence>
        {switchesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-[75] bg-forest/60 backdrop-blur-sm md:hidden"
            onClick={() => setSwitchesOpen(false)}
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
              {/* Switches only. Navigation moved to the mega menu — the
                  sheet was trying to be a nav list and a settings panel at
                  once, and neither had room. */}
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                {ui("theme")} &amp; {ui("language")}
              </p>

              <div className="space-y-6 px-1">
                <div>
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                    {ui("theme")}
                  </p>
                  <ThemeModePicker />
                </div>
                <div>
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                    {ui("language")}
                  </p>
                  <LanguageToggle />
                </div>

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
              {/* Home, then the whole structure. The mega menu opens from
                  a slot of its own rather than a grid icon tacked on the
                  end — it is a destination, not an overflow bin. */}
              {DOCK_WINGS.slice(0, 2).map(renderSlot)}
            </motion.div>
            <Link
              href={DOCK_CENTRE.href}
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
              {DOCK_WINGS.slice(2, 3).map(renderSlot)}
              {/* Shared last slot: display switches normally, back-to-top
                  once a viewport deep. The mega menu used to live here;
                  it has its own slot now, so this one carries the toggles. */}
              <div className="relative h-11 w-11">
                <AnimatePresence initial={false}>
                  {scrolled && !menuOpen && !switchesOpen ? (
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
                      aria-label={`${ui("theme")} & ${ui("language")}`}
                      aria-expanded={switchesOpen}
                      aria-controls="dock-sheet"
                      onClick={() => setSwitchesOpen(true)}
                      className={cn(swapSlot, switchesOpen ? slotActive : "text-muted")}
                    >
                      {icons.horizon}
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

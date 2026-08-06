"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { useReducedMotion } from "../hooks/use-reduced-motion"

// The window.__lenis contract was an undeclared cross-repo protocol —
// both apps published the instance there and four components consumed
// it. This module makes it typed and official.
declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function getLenis(): Lenis | undefined {
  if (typeof window === "undefined") return undefined
  return window.__lenis
}

// Reduced-motion-aware scroll to top — Lenis when it's driving,
// native otherwise. Was duplicated verbatim in four files across the
// two repos (back-to-top and mobile-dock in each).
export function scrollToTop(reduced = false) {
  const lenis = getLenis()
  if (lenis && !reduced) lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
}

// Buttery inertia scroll for the whole site. Lenis drives native
// scrollTop, so framer-motion's useScroll stays accurate without any
// extra wiring. No-ops entirely under reduced-motion.
//
// Defaults are gronn-studio's raf-driven setup (no gsap dependency).
// Equilibrium hands the frame loop to gsap instead — pass `driveRaf:
// false` plus `onScroll` and call `lenis.raf` from gsap.ticker via
// `getLenis()`.
export function SmoothScroll({
  duration = 1.1,
  easing = (t: number) => 1 - Math.pow(1 - t, 3),
  touchMultiplier,
  driveRaf = true,
  onScroll,
  children,
}: {
  duration?: number
  easing?: (t: number) => number
  touchMultiplier?: number
  driveRaf?: boolean
  onScroll?: (lenis: Lenis) => void
  children?: React.ReactNode
}) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel: true,
      ...(touchMultiplier !== undefined ? { touchMultiplier } : {}),
    })
    // Published for imperative scrolls (dock/back-to-top) — a
    // window.scrollTo would fight Lenis while it is driving scrollTop.
    window.__lenis = lenis

    if (onScroll) lenis.on("scroll", () => onScroll(lenis))

    let frame: number
    if (driveRaf) {
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    }

    return () => {
      if (driveRaf) cancelAnimationFrame(frame)
      lenis.destroy()
      delete window.__lenis
    }
    // Options are start-up config; changing them mid-session isn't a
    // supported use — only reduced-motion re-creates the instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return <>{children}</>
}

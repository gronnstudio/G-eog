"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"

import { useReducedMotion } from "../hooks/use-reduced-motion"
import { scrollToTop } from "../lenis"
import { EASE_REVEAL } from "../motion/constants"

// Back-to-top button that joins the page once you've scrolled a viewport
// deep. Merge of the two apps' siblings: gronn-studio's structure
// (safe-area insets, reduced-motion variants, label as a prop instead of
// a hardcoded aria-label) plus equilibrium's scroll-progress ring as an
// opt-in. All colour comes from `currentColor` / the caller's className
// — no theme tokens leak into the package.
export function BackToTop({
  label,
  threshold = 1.1,
  showProgress = false,
  className,
  children,
}: {
  /** Accessible name, e.g. t({ en: "Back to top", nl: "Terug naar boven" }) */
  label: string
  /** Viewport-heights scrolled before the button appears */
  threshold?: number
  /** Draw equilibrium's progress ring around the arrow */
  showProgress?: boolean
  className?: string
  /** Replaces the default rings + arrow */
  children?: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  })

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => scrollToTop(reduced)}
          aria-label={label}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE_REVEAL }}
          className={className}
          // md still reaches iPads, which have a home indicator in
          // landscape; the 1.5rem floor is what every other device had.
          style={{
            position: "fixed",
            bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
            right: "max(1.5rem, env(safe-area-inset-right))",
          }}
        >
          {children ?? (
            <>
              {showProgress && (
                <svg
                  aria-hidden
                  viewBox="0 0 48 48"
                  fill="none"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ pathLength, rotate: -90, transformOrigin: "center" }}
                  />
                </svg>
              )}
              <svg aria-hidden width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 12V2M7 2 2.5 6.5M7 2l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  )
}

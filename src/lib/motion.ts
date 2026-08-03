/**
 * Motion tokens for Equilibrium.
 *
 * Everything on the site borrows from the same small vocabulary so the
 * whole experience moves like one organism. Durations are in seconds
 * (Framer Motion's unit); easings are cubic-bézier arrays.
 */

/** Signature ease — a calm, organic settle. Used for reveals and cards. */
export const EASE_ORGANIC = [0.22, 1, 0.36, 1] as const

/** Snappier ease for interface feedback (buttons, toggles, tabs). */
export const EASE_CRISP = [0.4, 0, 0.2, 1] as const

/** Gentle ease-in for elements leaving the viewport. */
export const EASE_EXIT = [0.4, 0, 1, 1] as const

/** Expo-out reveal, shared with the GRØNN base components. */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

/** The curtain menu's open/close sweep (GRØNN base). */
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const
export const DURATION_CURTAIN = 0.7

export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  base: 0.5,
  slow: 0.8,
  ambient: 1.6,
} as const

/** A reveal that rises and fades — the site's default entrance. */
export const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_ORGANIC },
  },
}

/** Stagger container for lists of revealing children. */
export const stagger = (delayChildren = 0.05, staggerChildren = 0.08) => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
})

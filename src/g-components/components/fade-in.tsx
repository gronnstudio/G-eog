"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

import { useReducedMotion } from "../hooks/use-reduced-motion"
import { EASE_REVEAL } from "../motion/constants"

// Scroll-triggered fade-and-rise for section content. The workhorse
// reveal. Equilibrium repeats this exact initial/whileInView/viewport
// triple inline across ~10 section components with ease
// [0.22, 1, 0.36, 1] — pass that as `ease` to keep its current feel.
export function FadeIn({
  children,
  delay = 0,
  className,
  y = 24,
  duration = 0.7,
  ease = EASE_REVEAL,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
  duration?: number
  ease?: readonly [number, number, number, number]
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

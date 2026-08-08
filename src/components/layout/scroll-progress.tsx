"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Reading progress as a hairline ember bar along the top edge —
 * ported from the equilibrium reference. Springed so it glides rather
 * than ticks. Replaces the backdrop-blur top veil, which smeared the
 * header area on phones.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-ember"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgress

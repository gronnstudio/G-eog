"use client"

import { motion, useScroll, useSpring } from "framer-motion"

// Hairline reading-progress bar pinned to the top of the viewport
// (equilibrium's ScrollProgress, with colour via the caller's className
// instead of a theme token).
export function useScrollProgress(
  springConfig = { stiffness: 90, damping: 26, mass: 0.4 }
) {
  const { scrollYProgress } = useScroll()
  return useSpring(scrollYProgress, springConfig)
}

export function ScrollProgressBar({ className }: { className?: string }) {
  const scaleX = useScrollProgress()

  return (
    <motion.div
      aria-hidden
      className={className}
      style={{
        position: "fixed",
        insetInline: 0,
        top: 0,
        height: 1,
        transformOrigin: "left",
        backgroundColor: "currentColor",
        scaleX,
      }}
    />
  )
}

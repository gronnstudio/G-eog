"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

import { useReducedMotion } from "../hooks/use-reduced-motion"

// Wraps a CTA so it pulls subtly toward the cursor on hover, then springs
// back on leave. Pure presentation — wrap any button/link, it doesn't
// change their behavior. Disabled outright under reduced-motion.
// (gronn-studio's generic wrapper; equilibrium's MagneticButton is
// <Magnetic><a …/></Magnetic> with strength 0.28.)
export function Magnetic({
  children,
  strength = 0.4,
  spring = { stiffness: 150, damping: 15, mass: 0.2 },
  className,
}: {
  children: ReactNode
  strength?: number
  spring?: { stiffness: number; damping: number; mass: number }
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, spring)
  const springY = useSpring(y, spring)

  const classes = className ? `g-magnetic ${className}` : "g-magnetic"

  if (reduced) {
    return (
      <div className={classes} style={{ display: "inline-block" }}>
        {children}
      </div>
    )
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={classes}
      style={{ display: "inline-block", x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

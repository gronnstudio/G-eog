"use client"

import { useRef, type PointerEvent as ReactPointerEvent } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

interface MagneticProps {
  children: React.ReactNode
  /** How strongly the content pulls toward the cursor (0–1-ish). */
  strength?: number
  className?: string
}

/**
 * Subtly pulls its single child toward the cursor on hover. Desktop
 * fine-pointer only; a plain wrapper under reduced motion or coarse
 * pointers. Click/tap pass straight through.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: MagneticProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 200, damping: 18, mass: 0.3 }
  const sx = useSpring(x, springConfig)
  const sy = useSpring(y, springConfig)

  if (reduced) {
    return <span className={cn("inline-block", className)}>{children}</span>
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn(
        "inline-block [@media(pointer:coarse)]:!translate-x-0 [@media(pointer:coarse)]:!translate-y-0",
        className
      )}
    >
      {children}
    </motion.span>
  )
}

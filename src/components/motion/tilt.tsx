"use client"

import { useRef, type PointerEvent as ReactPointerEvent } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

interface TiltProps {
  children: React.ReactNode
  className?: string
  /** Max rotation in degrees on each axis. */
  max?: number
  /** Soft radial glare highlight following the cursor. */
  glare?: boolean
}

/**
 * A subtle 3D tilt-on-hover. Desktop fine-pointer only; a plain wrapper
 * under reduced motion or coarse pointers. Doesn't force overflow, so the
 * child keeps its own rounding.
 */
export function Tilt({ children, className, max = 6, glare = false }: TiltProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const gOpacity = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 20, mass: 0.4 }
  const srx = useSpring(rx, springConfig)
  const sry = useSpring(ry, springConfig)
  const sgx = useSpring(gx, springConfig)
  const sgy = useSpring(gy, springConfig)
  const sgOpacity = useSpring(gOpacity, springConfig)

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${sgx}% ${sgy}%, rgba(255,255,255,0.35), transparent 60%)`

  if (reduced) {
    return <div className={cn(className)}>{children}</div>
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rx.set((0.5 - py) * max * 2)
    ry.set((px - 0.5) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
    gOpacity.set(1)
  }

  function reset() {
    rx.set(0)
    ry.set(0)
    gOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{
        perspective: 800,
        transformStyle: "preserve-3d",
        rotateX: srx,
        rotateY: sry,
      }}
      className={cn("relative", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          style={{ background: glareBackground, opacity: sgOpacity }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
        />
      )}
    </motion.div>
  )
}

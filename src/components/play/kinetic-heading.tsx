"use client"

import { motion, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

import { EASE_ORGANIC } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { usePointerFine } from "@/lib/use-pointer-fine"
import { cn } from "@/lib/utils"

interface KineticHeadingProps {
  text: string
  className?: string
  as?: "h1" | "h2"
}

/** A single word that settles into place and, on desktop, drifts toward the cursor. */
function DriftWord({
  word,
  index,
  drift,
  reduced,
}: {
  word: string
  index: number
  drift: boolean
  reduced: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // Springs give the magnetic pull its smooth, physical settle.
  const x = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 })
  const y = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 })

  useEffect(() => {
    if (!drift) return
    const el = ref.current
    if (!el) return

    function onMove(e: PointerEvent) {
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const radius = 220
      if (dist > radius) {
        x.set(0)
        y.set(0)
        return
      }
      // Closer cursor → stronger, capped pull (a few px only).
      const pull = (1 - dist / radius) * 6
      x.set((dx / (dist || 1)) * pull)
      y.set((dy / (dist || 1)) * pull)
    }
    function reset() {
      x.set(0)
      y.set(0)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", reset)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", reset)
    }
  }, [drift, x, y])

  if (reduced) {
    return (
      <motion.span
        aria-hidden="true"
        className="inline-block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {word}
      </motion.span>
    )
  }

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className="inline-block will-change-transform"
      style={drift ? { x, y } : undefined}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.8,
        ease: EASE_ORGANIC,
        delay: index * 0.06,
      }}
    >
      {word}
    </motion.span>
  )
}

/**
 * A display heading that reveals word-by-word with an organic settle, and —
 * on fine-pointer desktops with motion enabled — lets each word drift a few
 * pixels toward the cursor. The wrapper carries the full text as its
 * accessible name; the animated word pieces are hidden from assistive tech.
 */
export function KineticHeading({
  text,
  className,
  as = "h2",
}: KineticHeadingProps) {
  const reduced = useReducedMotion()
  const fine = usePointerFine()
  const drift = !reduced && fine

  // Split on whitespace, keeping the separators so spacing is preserved.
  const parts = text.split(/(\s+)/)

  const Tag = motion[as]

  return (
    <Tag
      aria-label={text}
      className={cn("font-heading text-foreground", className)}
    >
      {parts.map((part, i) =>
        /\s+/.test(part) ? (
          <span key={i} aria-hidden="true">
            {part}
          </span>
        ) : (
          <DriftWord
            key={i}
            word={part}
            index={i}
            drift={drift}
            reduced={reduced}
          />
        )
      )}
    </Tag>
  )
}

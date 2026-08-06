"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { usePointerFine } from "@/lib/use-pointer-fine"

/**
 * A soft trailing cursor dot for desktop fine-pointer devices. It eases
 * toward the cursor and, over any element carrying `data-cursor`, grows and
 * reveals that attribute's value as a label. Purely decorative:
 * pointer-events-none, hidden on touch and under reduced motion.
 */
export function CursorCompanion() {
  const reduced = useReducedMotion()
  const fine = usePointerFine()
  const enabled = !reduced && fine
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 })

  const labelRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }

    function onOver(e: PointerEvent) {
      const target = (e.target as Element | null)?.closest?.("[data-cursor]")
      const next = target?.getAttribute("data-cursor") ?? null
      if (next !== labelRef.current) {
        labelRef.current = next
        setLabel(next)
      }
    }

    function onLeave() {
      setVisible(false)
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerover", onOver)
    document.addEventListener("pointerleave", onLeave)
    return () => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const active = label !== null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={cn(
          "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gronn-green/70 text-gronn-white backdrop-blur-sm",
          active ? "px-3 py-1.5 text-xs font-medium" : "blur-[1px]"
        )}
        animate={
          active
            ? { width: "auto", height: "auto" }
            : { width: 14, height: 14 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {active ? <span className="whitespace-nowrap">{label}</span> : null}
      </motion.div>
    </motion.div>
  )
}

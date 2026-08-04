"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

interface CountUpProps {
  to: number
  from?: number
  /** Seconds. */
  duration?: number
  className?: string
  format?: (n: number) => string
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString("en-US")

/** Easing that matches EASE_ORGANIC's calm settle for the tween. */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Counts from `from` → `to` the first time it scrolls into view. The final
 * value is always exposed to screen readers via aria-label; reduced motion
 * renders it immediately with no tween.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  className,
  format = defaultFormat,
}: CountUpProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [value, setValue] = useState(from)

  useEffect(() => {
    // The reduced / no-duration case renders `to` directly below — no
    // state write here, so we never setState synchronously in the effect.
    if (!inView || reduced || duration <= 0) return

    let raf = 0
    let start: number | null = null
    const durationMs = duration * 1000

    function tick(now: number) {
      if (start === null) start = now
      const t = Math.min((now - start) / durationMs, 1)
      setValue(from + (to - from) * easeOut(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, from, to, duration])

  const display = reduced || duration <= 0 ? to : value

  return (
    <span ref={ref} className={cn(className)} aria-label={format(to)}>
      <span aria-hidden="true">{format(display)}</span>
    </span>
  )
}

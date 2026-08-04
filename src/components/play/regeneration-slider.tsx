"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Side = {
  label: string
  /** Inline background art (gradient string). */
  background: string
}

const DEFAULT_AFTER: Side = {
  label: "After · restored",
  background:
    "radial-gradient(120% 90% at 30% 20%, hsl(135 55% 55% / 0.9), transparent 60%)," +
    "radial-gradient(90% 80% at 80% 70%, hsl(150 50% 40% / 0.85), transparent 55%)," +
    "linear-gradient(160deg, hsl(135 45% 30%), hsl(140 55% 22%))",
}

const DEFAULT_BEFORE: Side = {
  label: "Before · degraded",
  background:
    "radial-gradient(110% 80% at 70% 30%, hsl(40 18% 55% / 0.6), transparent 60%)," +
    "radial-gradient(90% 90% at 20% 80%, hsl(30 15% 38% / 0.7), transparent 55%)," +
    "linear-gradient(160deg, hsl(35 12% 52%), hsl(30 10% 32%))",
}

export type RegenerationSliderProps = {
  before?: Side
  after?: Side
}

export function RegenerationSlider({ before, after }: RegenerationSliderProps = {}) {
  const reduced = useReducedMotion()
  const afterSide = after ?? DEFAULT_AFTER
  const beforeSide = before ?? DEFAULT_BEFORE

  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [split, setSplit] = useState(50)

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setSplit(Math.min(100, Math.max(0, pct)))
  }, [])

  // Pointer drag (mouse + touch via pointer events).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      setFromClientX(e.clientX)
    }
    const onUp = () => {
      draggingRef.current = false
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [setFromClientX])

  // One-time inviting auto-nudge.
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const start = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // 50 → 58 → 50 sine bump
      const eased = Math.sin(t * Math.PI)
      setSplit(50 + eased * 8)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setSplit((s) => Math.max(0, s - 2))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setSplit((s) => Math.min(100, s + 2))
    } else if (e.key === "Home") {
      e.preventDefault()
      setSplit(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setSplit(100)
    }
  }

  return (
    <div
      ref={trackRef}
      className="relative aspect-[16/9] w-full max-w-full select-none overflow-hidden rounded-2xl border border-line"
      onPointerDown={(e) => {
        draggingRef.current = true
        setFromClientX(e.clientX)
      }}
    >
      {/* After (restored) — underneath */}
      <div className="absolute inset-0" style={{ background: afterSide.background }} aria-hidden="true">
        <span className="absolute bottom-3 end-3 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {afterSide.label}
        </span>
      </div>

      {/* Before (degraded) — clipped on top */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ background: beforeSide.background }} />
        <span className="absolute bottom-3 start-3 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {beforeSide.label}
        </span>
      </div>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Reveal restored ecosystem"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        aria-valuetext={`${Math.round(split)}% degraded shown`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.stopPropagation()
          draggingRef.current = true
        }}
        className={cn(
          "absolute top-0 bottom-0 z-10 flex w-0 cursor-ew-resize items-center justify-center",
          "focus-visible:outline-none"
        )}
        style={{ left: `${split}%` }}
      >
        {/* Vertical divider — a hair thinner and softer than pure white */}
        <span className="absolute inset-y-0 w-px -translate-x-1/2 bg-white/75 shadow-[0_0_6px_rgba(0,0,0,0.25)]" />
        {/* Circular grip — outward chevrons with a clear gap, accent-tinted */}
        <span className="relative grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-white/60 bg-surface shadow-float ring-1 ring-black/10 [div[role=slider]:focus-visible_&]:ring-2 [div[role=slider]:focus-visible_&]:ring-accent">
          <span className="flex items-center gap-0.5 text-accent">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </div>
    </div>
  )
}

export default RegenerationSlider

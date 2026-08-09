"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { useReducedMotion } from "@/lib/use-reduced-motion"

// Edge-swipe history navigation for the installed PWA, the same gesture
// Chrome and Safari provide in a browser tab: drag in from the left edge
// to go back, from the right edge to go forward. Standalone display mode
// has no browser chrome and therefore no native gesture — this restores
// it. In a normal tab it renders nothing, so the native gesture is never
// doubled.
//
// Same discipline as pull-to-refresh: touch only, must begin in a narrow
// edge zone (so horizontal scrollers, the graph canvas and sliders are
// untouched), must stay horizontal, and commits only past a threshold.

const EDGE = 28 // px from either edge where the gesture may begin
const THRESHOLD = 72 // horizontal travel that commits the navigation
const MAX_PULL = 120

export function EdgeSwipeBack() {
  const router = useRouter()
  const reduced = useReducedMotion()

  const [standalone, setStandalone] = useState(false)
  const [pull, setPull] = useState(0)
  const [side, setSide] = useState<"left" | "right" | null>(null)

  const start = useRef<{ x: number; y: number; side: "left" | "right" } | null>(null)
  const engaged = useRef(false)
  const pullNow = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)")
    const ios = (navigator as Navigator & { standalone?: boolean }).standalone === true
    const read = () => setStandalone(mq.matches || ios)
    read()
    mq.addEventListener("change", read)
    return () => mq.removeEventListener("change", read)
  }, [])

  useEffect(() => {
    if (!standalone) return

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const x = e.touches[0].clientX
      const w = window.innerWidth
      const at: "left" | "right" | null = x <= EDGE ? "left" : x >= w - EDGE ? "right" : null
      if (
        !at ||
        // Full-screen menu locks <html>; its own close controls apply there.
        document.documentElement.style.overflow === "hidden" ||
        document.documentElement.hasAttribute("data-header-menu") ||
        (e.target as Element | null)?.closest(
          ".overflow-y-auto, .overflow-x-auto, canvas, input, textarea, [data-lenis-prevent]",
        )
      )
        return
      start.current = { x, y: e.touches[0].clientY, side: at }
      engaged.current = false
    }

    const onMove = (e: TouchEvent) => {
      if (!start.current || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - start.current.x
      const dy = e.touches[0].clientY - start.current.y
      const inward = start.current.side === "left" ? dx : -dx
      if (!engaged.current) {
        // Commit to the gesture only once it is clearly horizontal.
        if (Math.abs(dy) > 14 && Math.abs(dy) > inward) {
          start.current = null
          return
        }
        if (inward < 10) return
        engaged.current = true
        setSide(start.current.side)
      }
      const next = Math.max(0, Math.min(inward, MAX_PULL))
      pullNow.current = next
      setPull(next)
    }

    const finish = () => {
      if (!start.current) return
      const commit = engaged.current && pullNow.current >= THRESHOLD
      const at = start.current.side
      start.current = null
      engaged.current = false
      pullNow.current = 0
      setPull(0)
      if (commit) {
        if (at === "left") router.back()
        else router.forward()
      }
      // Keep the arrow visible through the navigation frame, then clear.
      window.setTimeout(() => setSide(null), commit ? 350 : 150)
    }

    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchmove", onMove, { passive: true })
    window.addEventListener("touchend", finish, { passive: true })
    window.addEventListener("touchcancel", finish, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", finish)
      window.removeEventListener("touchcancel", finish)
    }
  }, [standalone, router])

  if (!standalone || !side) return null

  const progress = Math.min(pull / THRESHOLD, 1)
  const armed = progress >= 1
  const Icon = side === "left" ? ArrowLeft : ArrowRight

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 z-[95] -translate-y-1/2"
      style={{
        [side]: 0,
        transform: `translateY(-50%) translateX(${
          (side === "left" ? 1 : -1) * (reduced ? (armed ? 16 : 0) : pull * 0.4 - 44)
        }px)`,
        opacity: reduced ? (armed ? 1 : 0) : Math.min(progress * 1.4, 1),
        transition: pull === 0 ? "transform 200ms ease, opacity 200ms ease" : "none",
      } as React.CSSProperties}
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-full border shadow-float backdrop-blur-sm transition-colors ${
          armed
            ? "border-ember/60 bg-ember/15 text-ember-text"
            : "border-line bg-surface/80 text-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
  )
}

export default EdgeSwipeBack

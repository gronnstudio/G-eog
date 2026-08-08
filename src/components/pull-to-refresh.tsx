"use client"

import { useEffect, useRef, useState } from "react"

import { useUI } from "@/components/language-provider"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Pull-to-refresh for the installed PWA, ported from GRØNN Studio. The
// manifest opens Equilibrium in standalone display mode, which has no
// browser chrome — so the familiar drag-down-to-reload gesture is
// missing. This restores it: touch only, active only when launched from
// the home screen, and only when the page sits at the very top. In a
// normal browser tab it renders nothing and the native gesture is left
// untouched.

const THRESHOLD = 70 // pull distance (after resistance) that arms a reload
const MAX_PULL = 110
const RESISTANCE = 0.45

export function PullToRefresh() {
  const ui = useUI()
  const reduced = useReducedMotion()

  const [standalone, setStandalone] = useState(false)
  const [pull, setPull] = useState(0)
  const [phase, setPhase] = useState<"idle" | "pulling" | "refreshing">("idle")

  const start = useRef<{ x: number; y: number } | null>(null)
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
      if (
        e.touches.length !== 1 ||
        window.scrollY > 0 ||
        pullNow.current > 0 ||
        // Full-screen menu locks <html>; sheets/graph scroll themselves.
        document.documentElement.style.overflow === "hidden" ||
        (e.target as Element | null)?.closest(
          ".overflow-y-auto, .overflow-x-auto, canvas, [data-lenis-prevent]",
        )
      )
        return
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      engaged.current = false
    }

    const onMove = (e: TouchEvent) => {
      if (!start.current) return
      const dx = e.touches[0].clientX - start.current.x
      const dy = e.touches[0].clientY - start.current.y

      if (!engaged.current) {
        // Only claim clearly vertical downward pulls that begin at the
        // top; sideways drags and upward scrolls go back to the browser.
        if (dy < 0 || Math.abs(dx) > 16 || window.scrollY > 0) {
          start.current = null
          return
        }
        if (dy > 12 && dy > Math.abs(dx) * 1.5) engaged.current = true
        else return
      }

      e.preventDefault()
      const next = Math.max(0, Math.min(MAX_PULL, dy * RESISTANCE))
      pullNow.current = next
      setPull(next)
      setPhase("pulling")
    }

    const onEnd = () => {
      if (!start.current) return
      start.current = null
      engaged.current = false
      if (pullNow.current >= THRESHOLD) {
        setPhase("refreshing")
        setPull(THRESHOLD)
        window.location.reload()
      } else {
        pullNow.current = 0
        setPull(0)
        setPhase("idle")
      }
    }

    document.addEventListener("touchstart", onStart, { passive: true })
    document.addEventListener("touchmove", onMove, { passive: false })
    document.addEventListener("touchend", onEnd)
    document.addEventListener("touchcancel", onEnd)
    return () => {
      document.removeEventListener("touchstart", onStart)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("touchend", onEnd)
      document.removeEventListener("touchcancel", onEnd)
    }
  }, [standalone])

  if (!standalone) return null

  const progress = Math.min(1, pull / THRESHOLD)
  const armed = progress >= 1

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[70] flex flex-col items-center md:hidden"
      style={{
        top: "env(safe-area-inset-top)",
        transform: `translateY(${pull - 72}px)`,
        opacity: phase === "idle" ? 0 : Math.min(1, progress * 1.6),
        transition:
          phase === "pulling" || reduced
            ? "none"
            : "transform 0.3s var(--ease-organic), opacity 0.3s",
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-background/90 shadow-float backdrop-blur-md">
        {phase === "refreshing" ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={reduced ? "text-accent" : "animate-spin text-accent"}
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            className="text-accent"
            style={{
              transform: `rotate(${armed ? 180 : progress * 180}deg)`,
              transition: reduced ? "none" : "transform 0.2s",
            }}
          >
            <path
              d="M7 2v10M7 12l4.5-4.5M7 12 2.5 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {phase === "refreshing"
          ? ui("pwaRefreshing")
          : armed
            ? ui("pwaReleaseRefresh")
            : ui("pwaPullRefresh")}
      </p>
    </div>
  )
}

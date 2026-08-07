"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

import { useReducedMotion } from "@/lib/use-reduced-motion"

const SeedScene = dynamic(() => import("./seed-scene"), { ssr: false })

/**
 * Fixed full-viewport layer hosting the Living Seed — the 3D companion
 * that morphs into a different ecological form as the home page scrolls.
 *
 * Deliberately scoped: tablet-landscape and up only (≥1024px wide AND
 * landscape aspect), never under reduced motion, never without WebGL.
 * Phones and portrait tablets get nothing — no canvas, no cost.
 */
export function SeedCore() {
  const reduced = useReducedMotion()
  const [eligible, setEligible] = useState(false)
  const progressRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (orientation: landscape)")
    const check = () => {
      let webgl = false
      try {
        const c = document.createElement("canvas")
        webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"))
      } catch {
        webgl = false
      }
      setEligible(mq.matches && webgl)
    }
    check()
    mq.addEventListener("change", check)
    return () => mq.removeEventListener("change", check)
  }, [])

  useEffect(() => {
    if (!eligible) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [eligible])

  if (reduced || !eligible) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] opacity-70">
      <SeedScene progressRef={progressRef} />
    </div>
  )
}

export default SeedCore

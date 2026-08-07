"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

import { useReducedMotion } from "@/lib/use-reduced-motion"

const FlowScene = dynamic(() => import("./flow-scene"), { ssr: false })

/**
 * Fixed full-viewport layer hosting the light-through-the-network scene.
 * Tablet-landscape and up only (≥1024px AND landscape), never under
 * reduced motion, never without WebGL — phones and portrait tablets get
 * no canvas at all.
 */
export function FlowCore() {
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
    // Negative z: the conduits live BEHIND the page — visible in the open
    // air between sections and through transparent grounds, never over
    // cards or copy.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 opacity-80">
      <FlowScene progressRef={progressRef} />
    </div>
  )
}

export default FlowCore

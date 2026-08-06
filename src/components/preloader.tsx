"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * Opening sequence, GRØNN-style: the brand icon draws itself in stroke
 * (white + ember), the fill blooms in, then the veil lifts to reveal the
 * site. The artwork is a self-animating SVG (SMIL) served from /brand, so
 * it plays with zero JS the moment the image loads — React's only job is
 * lifting and removing the spent veil.
 *
 * Plays once per session and is skipped under reduced motion; both
 * decisions are made pre-paint by an inline script in the root layout that
 * stamps `data-intro="1"` on <html>, so the veil is in the first paint (no
 * flash of content) and repeat pages never show it. The mark is white
 * artwork, so the veil is a fixed deep ground the way GRØNN's opener is.
 */
export function Preloader() {
  const [state, setState] = useState<"pending" | "lifting" | "gone">("pending")

  useEffect(() => {
    // No intro this load (seen this session or reduced motion): drop the
    // veil. Scheduled via rAF so we never setState synchronously in-effect.
    if (document.documentElement.getAttribute("data-intro") !== "1") {
      const id = requestAnimationFrame(() => setState("gone"))
      return () => cancelAnimationFrame(id)
    }
    // The SVG's own timeline is 3s (2s draw + 1s fill); lift just after.
    const t = window.setTimeout(() => setState("lifting"), 3200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (state !== "lifting") return
    const t = window.setTimeout(() => {
      document.documentElement.removeAttribute("data-intro")
      setState("gone")
    }, 650)
    return () => window.clearTimeout(t)
  }, [state])

  if (state === "gone") return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        "preloader-veil fixed inset-0 z-[120] items-center justify-center bg-[#0a1510]",
        "transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        state === "lifting" && "opacity-0"
      )}
    >
      <Image
        src="/brand/icon-intro.svg"
        alt=""
        width={359}
        height={208}
        priority
        unoptimized
        draggable={false}
        className="h-auto w-44 select-none sm:w-56"
      />
    </div>
  )
}

export default Preloader

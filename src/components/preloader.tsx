"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

// Footage credit (Pexels licence — free to use, attribution appreciated).
// Shown subtly in the corner of the opener as a small avatar + name.
const CREDIT = {
  author: "Alper Adıgüzel",
  initials: "AA",
  source: "@alponfly",
  href: "https://www.instagram.com/alponfly",
}

/**
 * Opening sequence, GRØNN-style: a full-bleed river clip runs under a soft
 * scrim while the brand icon draws itself in, then the veil lifts to reveal
 * the site. The video is muted, looping and plays inline; if it fails to
 * load, the deep ground and drawing icon stand on their own.
 *
 * Plays once per session and is skipped under reduced motion (there the
 * video never autoplays) — both decided pre-paint by the layout boot script
 * stamping `data-intro="1"` on <html>, so the veil is in the first paint
 * (no flash of content) and repeat pages never see it.
 */
export function Preloader() {
  const [state, setState] = useState<"pending" | "lifting" | "gone">("pending")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (document.documentElement.getAttribute("data-intro") !== "1") {
      const id = requestAnimationFrame(() => setState("gone"))
      return () => cancelAnimationFrame(id)
    }
    videoRef.current?.play().catch(() => {
      // Autoplay blocked — the scrim + icon carry the opener regardless.
    })
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
        "preloader-veil fixed inset-0 z-[120] items-center justify-center overflow-hidden bg-[#0a1510]",
        "transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        state === "lifting" && "opacity-0"
      )}
    >
      {/* Full-bleed river footage */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/brand/loader-river.mp4"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
      />
      {/* Scrim so the white mark reads over the water */}
      <div className="absolute inset-0 bg-[#0a1510]/55" />

      {/* Brand mark drawing in over the footage */}
      <Image
        src="/brand/icon-intro.svg"
        alt=""
        width={359}
        height={208}
        priority
        unoptimized
        draggable={false}
        className="relative h-auto w-44 select-none sm:w-56"
      />

      {/* Subtle footage credit — small avatar + creator name */}
      <a
        href={CREDIT.href}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 backdrop-blur-sm"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-ember to-ember-strong text-[9px] font-semibold text-white">
          {CREDIT.initials}
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] font-medium text-white/80">{CREDIT.author}</span>
          <span className="block font-mono text-[8px] tracking-wide text-white/45">
            {CREDIT.source}
          </span>
        </span>
      </a>
    </div>
  )
}

export default Preloader

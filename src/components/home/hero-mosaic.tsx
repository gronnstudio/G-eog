"use client"

import { useEffect, useState } from "react"

import { useOnScreen } from "@/lib/use-on-screen"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Hero mosaic — recreated from the equilibrium "pink" hero. A tightly-packed
 * diagonal wall of portrait imagery in perpetual motion: three big rows on a
 * steeply tilted plane, the top travelling right, the middle left, the bottom
 * right. Each row loops seamlessly (content duplicated, the track translated
 * 50%), under EOG's time-of-day wash with an ember light-leak.
 *
 * Pure CSS drift (no GSAP) — the same seamless-loop technique as the domains
 * marquee. Reduced motion freezes the wall. Placeholder imagery is local
 * abstract nature renders with ecological labels; curated nature photography
 * can be swapped in per tile later.
 */

type Tile = { id: string; label: string; src: string }

// Portrait placeholders (local abstract nature renders in /public/mosaic).
// Swap `src` for curated ecological photography when available; the labels
// are the intended subjects.
const TILES: Tile[] = [
  { id: "01", label: "Moss colonies", src: "/mosaic/tile-01.jpg" },
  { id: "02", label: "Living water", src: "/mosaic/tile-02.jpg" },
  { id: "03", label: "Mycelium web", src: "/mosaic/tile-03.jpg" },
  { id: "04", label: "Root systems", src: "/mosaic/tile-04.jpg" },
  { id: "05", label: "Leaf structure", src: "/mosaic/tile-05.jpg" },
  { id: "06", label: "Food-forest layers", src: "/mosaic/tile-06.jpg" },
  { id: "07", label: "Seed heads", src: "/mosaic/tile-07.jpg" },
  { id: "08", label: "Pollinator habitat", src: "/mosaic/tile-08.jpg" },
  { id: "09", label: "Topographic memory", src: "/mosaic/tile-09.jpg" },
  { id: "10", label: "Regenerative garden", src: "/mosaic/tile-10.jpg" },
]

// 1:1 with the equilibrium reference: three full-height rows on the
// tilted plane — top travels right, middle left, bottom right — all at
// the same steady 74s cruise.
const ROW_STYLES = [
  { dir: "right" as const, dur: 74 },
  { dir: "left" as const, dur: 74 },
  { dir: "right" as const, dur: 74 },
]

const ROW_COUNT = 3

/**
 * Phones can't afford the desktop wall: three perpetually-animated GPU
 * layers, each 2 copies × 8 full-res tiles wide on a plane 2.4× the
 * viewport, at 3× DPR — that's what made scrolling crawl. On small
 * screens the loop carries 5 tiles (a narrower plane needs fewer to
 * wrap seamlessly).
 */
function useIsSmall(): boolean {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const read = () => setSmall(mq.matches)
    read()
    mq.addEventListener("change", read)
    return () => mq.removeEventListener("change", read)
  }, [])
  return small
}

/** Deterministic tile list for a row: rotate the archive by the row index. */
function rowTiles(row: number, perRow: number): Tile[] {
  return Array.from({ length: perRow }, (_, i) => TILES[(row * 3 + i) % TILES.length])
}

function Row({ row, reduced, small }: { row: number; reduced: boolean; small: boolean }) {
  const tiles = rowTiles(row, small ? 5 : 8)
  const { dir, dur } = ROW_STYLES[row % ROW_STYLES.length]
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div
        className={cn(
          "flex h-full w-max items-stretch gap-[1.6vw]",
          !reduced && (dir === "right" ? "eog-mosaic-right" : "eog-mosaic-left")
        )}
        style={reduced ? undefined : ({ "--mosaic-dur": `${dur}s` } as React.CSSProperties)}
      >
        {/* Two copies so a 50% translate wraps seamlessly. */}
        {[0, 1].map((copy) =>
          tiles.map((t, i) => (
            <figure
              key={`${row}-${copy}-${i}`}
              className="relative h-full shrink-0 overflow-hidden rounded-lg bg-surface-2"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* Plain img: local placeholders in /public/mosaic, no next
                  config needed. Decorative background — no alt (see
                  aria-hidden wrapper), so a slow/failed load never leaks a
                  broken label. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.src}
                alt=""
                // the second loop copy scrolls in later — no need to
                // compete with the first paint
                loading={copy === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </figure>
          ))
        )}
      </div>
    </div>
  )
}

export function HeroMosaic({ reducedOverride }: { reducedOverride?: boolean }) {
  const reduced = useReducedMotion() || Boolean(reducedOverride)
  const small = useIsSmall()
  const { ref, onScreen } = useOnScreen<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 overflow-hidden", !onScreen && "eog-anim-paused")}
      aria-hidden="true"
    >
      {/* Steeply tilted, oversized so rotated corners never show. Phones
          get a tighter bleed (-45% covers the -24° rotation on tall
          screens) so the animated layers stay much smaller. */}
      <div
        className="absolute -inset-x-[45%] -inset-y-[42%] flex flex-col justify-center gap-[1.6vw] md:-inset-x-[70%]"
        style={{ transform: "rotate(-24deg)" }}
      >
        {Array.from({ length: ROW_COUNT }, (_, row) => (
          <Row key={row} row={row} reduced={reduced} small={small} />
        ))}
      </div>

      {/* EOG wash: a green hue unifies the tiles, a warm light-leak blooms
          top-left, deep ground gathers at the bottom, ember glow bottom-right. */}
      <div className="pointer-events-none absolute inset-0 bg-forest/40 mix-blend-color" />
      <div className="pointer-events-none absolute inset-0 bg-background/40 mix-blend-multiply" />
      {/* Theme-aware veil + text-side scrim: the wall stays visible at the
          edges while the content column reads clearly in both Hours. */}
      <div className="pointer-events-none absolute inset-0 bg-background/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/75 via-background/35 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(95% 75% at 8% -4%, rgba(249,90,8,0.28), rgba(249,90,8,0.06) 38%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
      <div className="pointer-events-none absolute bottom-[22%] right-[12%] h-56 w-56 rounded-full bg-ember/15 blur-[120px]" />
    </div>
  )
}

export default HeroMosaic

"use client"

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
 * marquee. Reduced motion freezes the wall. Placeholder imagery is Lorem
 * Picsum with ecological labels; curated nature photography can be swapped in
 * per tile later.
 */

type Tile = { id: string; label: string; src: string }

// Portrait placeholders (Lorem Picsum). Swap `src` for curated ecological
// photography when available; the labels are the intended subjects.
const TILES: Tile[] = [
  { id: "01", label: "Moss colonies", src: "https://picsum.photos/id/28/600/800" },
  { id: "02", label: "Living water", src: "https://picsum.photos/id/15/600/800" },
  { id: "03", label: "Mycelium web", src: "https://picsum.photos/id/18/600/800" },
  { id: "04", label: "Root systems", src: "https://picsum.photos/id/10/600/800" },
  { id: "05", label: "Leaf structure", src: "https://picsum.photos/id/17/600/800" },
  { id: "06", label: "Food-forest layers", src: "https://picsum.photos/id/11/600/800" },
  { id: "07", label: "Seed heads", src: "https://picsum.photos/id/14/600/800" },
  { id: "08", label: "Pollinator habitat", src: "https://picsum.photos/id/19/600/800" },
  { id: "09", label: "Topographic memory", src: "https://picsum.photos/id/29/600/800" },
  { id: "10", label: "Regenerative garden", src: "https://picsum.photos/id/12/600/800" },
]

const ROWS = [
  { dir: "right" as const, dur: 74 },
  { dir: "left" as const, dur: 88 },
  { dir: "right" as const, dur: 80 },
]

/** Deterministic tile list for a row: rotate the archive by the row index. */
function rowTiles(row: number): Tile[] {
  return Array.from({ length: 8 }, (_, i) => TILES[(row * 3 + i) % TILES.length])
}

function Row({ row, reduced }: { row: number; reduced: boolean }) {
  const tiles = rowTiles(row)
  const { dir, dur } = ROWS[row]
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
              {/* Plain img: remote picsum placeholders, no next config
                  needed. Decorative background — no alt (see aria-hidden
                  wrapper), so a slow/failed load never leaks a broken label. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.src}
                alt=""
                loading="eager"
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

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Steeply tilted, oversized so rotated corners never show. */}
      <div
        className="absolute -inset-[60%] flex flex-col justify-center gap-[1.6vw]"
        style={{ transform: "rotate(-24deg)" }}
      >
        {ROWS.map((_, row) => (
          <Row key={row} row={row} reduced={reduced} />
        ))}
      </div>

      {/* EOG wash: a green hue unifies the tiles, a warm light-leak blooms
          top-left, deep ground gathers at the bottom, ember glow bottom-right. */}
      <div className="pointer-events-none absolute inset-0 bg-forest/40 mix-blend-color" />
      <div className="pointer-events-none absolute inset-0 bg-background/40 mix-blend-multiply" />
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

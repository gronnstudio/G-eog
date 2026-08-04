"use client"

import Link from "next/link"
import { useId } from "react"

import { CATEGORIES } from "@/lib/knowledge"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

/** One pill chip: a hue dot + the category title, linking to its page. */
function Chip({
  id,
  title,
  hue,
  ariaHidden,
}: {
  id: string
  title: string
  hue: number
  ariaHidden?: boolean
}) {
  return (
    <Link
      href={`/knowledge/${id}`}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
      className={cn(
        "group/chip inline-flex shrink-0 items-center gap-2 rounded-full border border-line",
        "bg-surface/60 px-4 py-2 text-sm text-foreground whitespace-nowrap",
        "transition-colors hover:border-accent hover:bg-surface-2 hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      )}
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ background: `hsl(${hue} 55% 55%)` }}
      />
      {title}
    </Link>
  )
}

/**
 * A seamless, full-bleed marquee ribbon of every knowledge domain.
 *
 * Motion path: the chip list is rendered twice inside one flex track and the
 * track is translated −50% via a CSS keyframe, so the second copy is exactly
 * where the first began — an invisible seam. Hovering pauses the drift.
 *
 * Reduced-motion path: no auto-scroll. The ribbon becomes an ordinary
 * horizontally-scrollable row the reader drives themselves.
 */
export function DomainsMarquee({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const rawId = useId()
  const cls = `marquee-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`

  const mask =
    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)"

  if (reduced) {
    return (
      <div
        className={cn("w-full", className)}
        role="region"
        aria-label="Knowledge domains"
      >
        <div
          className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-1"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {CATEGORIES.map((c) => (
            <Chip key={c.id} id={c.id} title={c.title} hue={c.hue} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("group w-full overflow-hidden", className)}
      role="region"
      aria-label="Knowledge domains"
    >
      <style>{`
        @keyframes ${cls}-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .${cls}-track {
          animation: ${cls}-scroll 40s linear infinite;
          width: max-content;
        }
        .group:hover .${cls}-track { animation-play-state: paused; }
      `}</style>
      <div
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        className="px-4 py-1"
      >
        <div className={cn(cls + "-track", "flex gap-3")}>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} id={c.id} title={c.title} hue={c.hue} />
          ))}
          {CATEGORIES.map((c) => (
            <Chip
              key={`dup-${c.id}`}
              id={c.id}
              title={c.title}
              hue={c.hue}
              ariaHidden
            />
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { EASE_ORGANIC } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Hotspot = {
  id: string
  label: string
  /** Position as a percentage of the diagram box. */
  x: number
  y: number
  blurb: string
  href?: string
}

/**
 * The seven vertical layers of a food forest, seeded with accurate blurbs.
 * Positions are tuned to the SVG cross-section drawn below.
 */
const HOTSPOTS: Hotspot[] = [
  {
    id: "canopy",
    label: "Canopy",
    x: 26,
    y: 12,
    blurb:
      "The tallest fruit & nut trees form the roof of the forest — full-sized standards like chestnut, walnut and pecan that capture the most light.",
    href: "/knowledge/food-forests/seven-layer-food-forest",
  },
  {
    id: "sub-canopy",
    label: "Sub-canopy",
    x: 62,
    y: 26,
    blurb:
      "Dwarf and semi-dwarf fruit trees — apple, pear, plum, mulberry — thrive in the dappled light beneath the standards.",
  },
  {
    id: "shrub",
    label: "Shrub layer",
    x: 20,
    y: 46,
    blurb:
      "Woody berry bushes — currants, gooseberries, blueberries, hazel — fill the mid-storey with soft fruit.",
  },
  {
    id: "herbaceous",
    label: "Herbaceous layer",
    x: 74,
    y: 52,
    blurb:
      "Non-woody perennials — comfrey, rhubarb, herbs and nitrogen-fixers — that die back and return each year.",
  },
  {
    id: "ground-cover",
    label: "Ground cover",
    x: 46,
    y: 70,
    blurb:
      "Low, spreading plants like strawberry, clover and creeping thyme that blanket the soil, holding moisture and suppressing weeds.",
  },
  {
    id: "rhizosphere",
    label: "Rhizosphere",
    x: 30,
    y: 86,
    blurb:
      "The root zone — tubers, rhizomes and the teeming soil food web of fungi, bacteria and roots trading sugars for nutrients.",
    href: "/knowledge/soil/soil-food-web",
  },
  {
    id: "vertical",
    label: "Vertical layer",
    x: 84,
    y: 34,
    blurb:
      "Climbers and vines — grapes, kiwi, hops — that scramble up the trunks, using vertical space the trees leave open.",
  },
]

function Hotspots() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-2xl border border-line bg-surface/40",
        "aspect-[16/10]"
      )}
      role="group"
      aria-label="Interactive cross-section of a seven-layer food forest"
    >
      {/* Vector cross-section. */}
      <svg
        viewBox="0 0 160 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-forest"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="eh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(200 45% 42%)" stopOpacity="0.35" />
            <stop offset="1" stopColor="hsl(135 30% 40%)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="eh-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(28 40% 32%)" stopOpacity="0.55" />
            <stop offset="1" stopColor="hsl(28 45% 18%)" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="eh-crown" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="hsl(130 45% 55%)" stopOpacity="0.9" />
            <stop offset="1" stopColor="hsl(130 45% 30%)" stopOpacity="0.7" />
          </radialGradient>
          <radialGradient id="eh-crown2" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="hsl(110 42% 58%)" stopOpacity="0.85" />
            <stop offset="1" stopColor="hsl(110 42% 32%)" stopOpacity="0.65" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="160" height="78" fill="url(#eh-sky)" />
        {/* Soil */}
        <rect x="0" y="76" width="160" height="24" fill="url(#eh-soil)" />
        <path
          d="M0 76 Q40 72 80 76 T160 76 L160 78 L0 78 Z"
          fill="hsl(28 40% 28%)"
          opacity="0.6"
        />

        {/* Canopy standard (left) */}
        <g>
          <rect x="24" y="30" width="4" height="48" rx="2" fill="hsl(28 40% 30%)" />
          <ellipse cx="26" cy="24" rx="22" ry="18" fill="url(#eh-crown)" />
        </g>
        {/* Sub-canopy dwarf tree (centre-right) */}
        <g>
          <rect x="60" y="42" width="3.4" height="36" rx="1.7" fill="hsl(28 40% 32%)" />
          <ellipse cx="61.6" cy="38" rx="15" ry="12" fill="url(#eh-crown2)" />
        </g>
        {/* Vertical climber on right trunk */}
        <g stroke="hsl(95 40% 50%)" strokeWidth="1" fill="none" opacity="0.8">
          <path d="M61 74 Q66 64 62 54 Q58 46 63 40" />
          <circle cx="63" cy="42" r="1.4" fill="hsl(300 35% 55%)" stroke="none" />
          <circle cx="60" cy="50" r="1.2" fill="hsl(300 35% 55%)" stroke="none" />
        </g>

        {/* Shrubs */}
        <g fill="hsl(130 38% 42%)" opacity="0.85">
          <circle cx="16" cy="70" r="7" />
          <circle cx="24" cy="72" r="5" />
          <circle cx="9" cy="72" r="4.5" />
        </g>
        {/* Herbaceous clumps */}
        <g stroke="hsl(110 45% 52%)" strokeWidth="1.2" strokeLinecap="round">
          <path d="M116 78 L114 66 M119 78 L120 64 M122 78 L124 68" />
          <path d="M100 78 L99 68 M103 78 L104 66 M106 78 L107 70" />
        </g>
        {/* Ground cover band */}
        <path
          d="M0 74 Q30 70 70 74 T160 73 L160 78 L0 78 Z"
          fill="hsl(120 40% 40%)"
          opacity="0.5"
        />
        {/* Roots into soil */}
        <g stroke="hsl(28 45% 24%)" strokeWidth="1" fill="none" opacity="0.8">
          <path d="M26 78 Q22 86 18 94 M26 78 Q30 86 34 92 M26 78 L26 96" />
          <path d="M61 78 Q57 85 54 92 M61 78 Q65 85 68 90" />
        </g>
        {/* Mycelial threads */}
        <g stroke="hsl(32 45% 60%)" strokeWidth="0.5" fill="none" opacity="0.5">
          <path d="M14 88 Q40 84 80 90 T150 86" />
          <path d="M20 94 Q60 90 100 95 T150 92" />
        </g>
      </svg>

      {/* Hotspots */}
      {HOTSPOTS.map((h) => {
        const isActive = active === h.id
        return (
          <div
            key={h.id}
            className={cn("absolute", isActive ? "z-30" : "z-10")}
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <button
              type="button"
              aria-label={h.label}
              aria-expanded={isActive}
              onClick={() => setActive((cur) => (cur === h.id ? null : h.id))}
              // Hover-to-open on mouse only. On touch the synthesized
              // mouseenter used to fire alongside the tap and cancel it
              // out, so a tap opened then instantly closed the card.
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(h.id)
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setActive((cur) => (cur === h.id ? null : cur))
              }}
              className={cn(
                "relative grid h-5 w-5 place-items-center rounded-full transition-opacity duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                // Fade the other dots while a card is open so they don't
                // clutter or bleed through the reading surface.
                active && !isActive && "opacity-30",
              )}
            >
              {/* Pulse / static ring */}
              {reduced ? (
                <span className="absolute inline-flex h-full w-full rounded-full border border-accent/70" />
              ) : (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-gronn-green/40"
                  animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full bg-gronn-green ring-2 ring-background transition-transform",
                  isActive && "scale-125"
                )}
              />
            </button>

            {/* Tooltip */}
            {isActive && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: EASE_ORGANIC }}
                role="tooltip"
                className={cn(
                  // Solid, opaque surface — the translucent glass was
                  // unreadable over the busy diagram.
                  "absolute z-30 w-56 max-w-[70vw] rounded-xl border border-line bg-surface px-4 py-3 text-start shadow-float",
                  h.y > 60 ? "bottom-4" : "top-4"
                )}
                style={h.x > 60 ? { right: "1.5rem" } : { left: "1.5rem" }}
              >
                <p className="text-sm font-semibold text-foreground">{h.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/75">{h.blurb}</p>
                {h.href && (
                  <Link
                    href={h.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    Read more
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function EcosystemHotspots() {
  return <Hotspots />
}

export default EcosystemHotspots

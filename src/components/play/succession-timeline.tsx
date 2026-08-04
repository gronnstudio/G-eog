"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"
import { EASE_ORGANIC } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

type Stage = {
  id: string
  title: string
  years: string
  description: string
}

const STAGES: Stage[] = [
  {
    id: "bare-rock",
    title: "Bare rock & disturbance",
    years: "0 yrs",
    description:
      "A fresh surface — scoured rock, cooled lava or bare glacial till — with no soil and no life to begin from.",
  },
  {
    id: "pioneers",
    title: "Pioneers: lichens & mosses",
    years: "0–5 yrs",
    description:
      "Lichens and mosses colonise the rock, secreting acids that crack it into the first thin, mineral soil.",
  },
  {
    id: "grasses",
    title: "Grasses & herbs",
    years: "5–20 yrs",
    description:
      "Wind-borne seeds of grasses and fast herbs take root in the shallow soil, adding organic matter as they die back.",
  },
  {
    id: "shrubs",
    title: "Shrubs",
    years: "20–50 yrs",
    description:
      "Deeper-rooted woody shrubs move in, shading out the grasses and building soil structure and moisture.",
  },
  {
    id: "pioneer-trees",
    title: "Pioneer trees",
    years: "50–150 yrs",
    description:
      "Fast, light-loving trees like birch and pine form the first canopy, creating shade and a cooler microclimate.",
  },
  {
    id: "climax",
    title: "Climax forest",
    years: "150+ yrs",
    description:
      "Shade-tolerant hardwoods mature into a stable, self-renewing community — the ecosystem in dynamic equilibrium.",
  },
]

export function SuccessionTimeline() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={ref}
      aria-label="Stages of ecological succession"
      className="relative mx-auto w-full max-w-3xl py-8"
    >
      {/* The drawing line — left rail on mobile, centre on desktop. */}
      <div
        className="absolute top-0 bottom-0 w-px bg-line/60 start-3 sm:start-1/2 sm:-translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-x-0 top-0 w-full origin-top bg-accent"
          style={{ scaleY: reduced ? 1 : scaleY, height: "100%" }}
        />
      </div>

      <ol className="relative space-y-10 sm:space-y-16">
        {STAGES.map((stage, i) => {
          const rightSide = i % 2 === 1
          return (
            <li
              key={stage.id}
              className={cn(
                "relative ps-10 sm:ps-0",
                "sm:grid sm:grid-cols-2 sm:gap-10"
              )}
            >
              {/* Node */}
              <span
                className="absolute z-10 start-3 top-1.5 -translate-x-1/2 sm:start-1/2"
                aria-hidden="true"
              >
                <motion.span
                  className="block h-4 w-4 rounded-full border-2 border-accent bg-background"
                  initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                  whileInView={
                    reduced
                      ? { opacity: 1 }
                      : { scale: [0.4, 1.3, 1], opacity: 1, backgroundColor: "var(--color-accent)" }
                  }
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.5, ease: EASE_ORGANIC }}
                />
              </span>

              {/* Card */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                transition={{ duration: 0.6, ease: EASE_ORGANIC }}
                className={cn(
                  "rounded-2xl border border-line bg-surface/60 p-5 shadow-sm",
                  rightSide
                    ? "sm:col-start-2 sm:text-start"
                    : "sm:col-start-1 sm:text-end"
                )}
              >
                <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {stage.years}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {stage.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {stage.description}
                </p>
              </motion.div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default SuccessionTimeline

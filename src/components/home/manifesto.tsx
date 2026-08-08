"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { useOnScreen } from "@/lib/use-on-screen"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Pinned manifesto, ported from the equilibrium reference: the section
 * is tall, its stage is sticky, and three statements surface one after
 * another as the reader scrolls — read-on-scroll — over mycelium lines
 * pulsing behind the typography. GSAP scrub re-created with
 * framer-motion's useScroll + useTransform.
 *
 * Reduced motion: no pin, the three statements simply stack.
 */

const LINES = [
  "M0 620 C 240 560, 380 700, 600 640 S 980 500, 1200 560",
  "M0 700 C 200 760, 460 620, 700 720 S 1040 760, 1200 680",
  "M100 800 C 260 640, 420 660, 560 520 S 760 300, 900 180",
  "M480 800 C 560 660, 700 620, 820 500 S 1000 320, 1200 280",
]

export function Manifesto() {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const { ref: screenRef, onScreen } = useOnScreen<HTMLDivElement>()
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  })

  // statement choreography: in from deep water, hold, sink away
  const o1 = useTransform(scrollYProgress, [0.02, 0.16, 0.3, 0.4], [0, 1, 1, 0.06])
  const y1 = useTransform(scrollYProgress, [0.02, 0.16, 0.3, 0.4], [90, 0, 0, -70])
  const o2 = useTransform(scrollYProgress, [0.34, 0.48, 0.6, 0.7], [0, 1, 1, 0.06])
  const y2 = useTransform(scrollYProgress, [0.34, 0.48, 0.6, 0.7], [90, 0, 0, -70])
  const o3 = useTransform(scrollYProgress, [0.64, 0.8], [0, 1])
  const y3 = useTransform(scrollYProgress, [0.64, 0.8], [90, 0])

  const statements = (
    <>
      <motion.div
        style={reduced ? undefined : { opacity: o1, y: y1 }}
        className={reduced ? "" : "[grid-area:1/1]"}
      >
        <p className="font-heading text-[clamp(2rem,5.8vw,5rem)] leading-[0.95] text-foreground">
          Nature is
          <span className="mt-3 block italic text-ember-text">infrastructure.</span>
        </p>
      </motion.div>
      <motion.div
        style={reduced ? undefined : { opacity: o2, y: y2 }}
        className={reduced ? "mt-10" : "[grid-area:1/1] opacity-0"}
      >
        <p className="font-heading text-[clamp(1.5rem,3.8vw,3.2rem)] leading-tight text-foreground">
          Living systems learn from <em className="text-ember-text">relationships</em>, not
          isolated parts.
        </p>
      </motion.div>
      <motion.div
        style={reduced ? undefined : { opacity: o3, y: y3 }}
        className={reduced ? "mt-10" : "[grid-area:1/1] opacity-0"}
      >
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted md:text-2xl">
          Equilibrium exists to make ecological intelligence{" "}
          <span className="text-ember-text">accessible</span>, structured, beautiful and
          practical.
        </p>
      </motion.div>
    </>
  )

  if (reduced) {
    return (
      <section className="relative px-4 py-24 text-center sm:px-6">
        <div className="mx-auto max-w-5xl">{statements}</div>
      </section>
    )
  }

  return (
    <section ref={section} className="relative h-[320vh]">
      <div
        ref={screenRef}
        className={cn(
          "sticky top-0 flex h-screen items-center justify-center overflow-hidden",
          !onScreen && "eog-anim-paused"
        )}
      >
        {/* deep-water movement — desktop only, the giant animated blurs
            are exactly the kind of layer phones choke on */}
        <div className="absolute -left-1/4 top-0 hidden h-[80vh] w-[80vh] animate-[eog-waterA_26s_ease-in-out_infinite] rounded-full bg-forest/40 blur-[140px] md:block" />
        <div className="absolute -right-1/4 bottom-0 hidden h-[70vh] w-[70vh] animate-[eog-waterB_32s_ease-in-out_infinite] rounded-full bg-forest/30 blur-[120px] md:block" />

        {/* mycelium lines pulsing behind the typography */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {LINES.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" className="text-foreground" />
              <path
                d={d}
                stroke={i % 2 ? "#f95a08" : "#2f8552"}
                strokeOpacity="0.7"
                strokeWidth="1.4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.05 0.95"
                className="animate-[eog-pulseline_7s_linear_infinite]"
                style={{ animationDelay: `${i * 1.8}s` }}
              />
            </g>
          ))}
        </svg>

        <div className="relative z-10 grid max-w-5xl place-items-center px-6 text-center md:px-12">
          {statements}
        </div>
      </div>
    </section>
  )
}

export default Manifesto

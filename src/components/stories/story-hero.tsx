"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MapPin } from "lucide-react"

import { StoryAtmosphere } from "./story-atmosphere"
import { EASE_ORGANIC } from "@/lib/motion"
import type { StoryStat } from "@/lib/knowledge"

/** The cinematic opening of a Field Story: parallax atmosphere, oversized
 *  title, place, standfirst and a strip of headline stats. */
export function StoryHero({
  hue,
  title,
  subtitle,
  place,
  lead,
  stats,
}: {
  hue: number
  title: string
  subtitle: string
  place: string
  lead: string
  stats: StoryStat[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const yArt = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <header ref={ref} className="relative flex min-h-[92svh] items-end overflow-hidden">
      {/* Atmosphere + wash */}
      <motion.div style={{ y: yArt }} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(80% 70% at 50% 0%, hsl(${hue} 45% 22%), transparent 60%), radial-gradient(90% 80% at 80% 100%, hsl(${hue} 40% 16%), transparent 55%)`,
          }}
        />
        <StoryAtmosphere hue={hue} />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent" />

      <motion.div
        style={{ y: yText, opacity: fade }}
        className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-40 sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_ORGANIC }}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted"
        >
          <MapPin className="h-3.5 w-3.5" style={{ color: `hsl(${hue} 50% 65%)` }} />
          {place} · Field Story
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE_ORGANIC, delay: 0.1 }}
          className="mt-6 max-w-4xl font-heading text-[clamp(2.75rem,8vw,6rem)] leading-[0.98] text-foreground"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_ORGANIC, delay: 0.35 }}
          className="mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-muted"
        >
          {subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85"
        >
          {lead}
        </motion.p>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</dt>
              <dd className="mt-1 font-heading text-2xl text-foreground sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </header>
  )
}

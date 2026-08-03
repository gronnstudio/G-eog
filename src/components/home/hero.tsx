"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Compass, Sparkles } from "lucide-react"

import { EcosystemField } from "./ecosystem-field"
import { useLanguage, useUI } from "@/components/language-provider"
import { EASE_ORGANIC } from "@/lib/motion"

export function Hero({ stats }: { stats: { articles: number; categories: number; connections: number } }) {
  const { locale } = useLanguage()
  const ui = useUI()
  // Split the localized headline into words for the staggered reveal —
  // works for any language and word count.
  const words = ui("heroHeadline").split(" ")
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="eog-aurora absolute inset-0" />
      <EcosystemField />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_ORGANIC }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {ui("heroKicker")}
        </motion.p>

        <h1 className="max-w-4xl font-heading text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] text-foreground">
          {words.map((word, i) => (
            <motion.span
              key={`${locale}-${i}`}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE_ORGANIC, delay: 0.15 + i * 0.08 }}
              className="mr-[0.28em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_ORGANIC, delay: 0.7 }}
          className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
        >
          {ui("heroBody")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_ORGANIC, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-on-accent transition-transform hover:scale-[1.02]"
          >
            <Compass className="h-4 w-4" />
            {ui("exploreGraph")}
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            {ui("startLearning")}
          </Link>
          <Link
            href="/community"
            className="group inline-flex items-center gap-1 px-2 py-3 text-muted transition-colors hover:text-foreground"
          >
            {ui("contribute")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 flex flex-wrap gap-x-12 gap-y-4"
        >
          {[
            { k: ui("statArticles"), v: stats.articles },
            { k: ui("statDomains"), v: stats.categories },
            { k: ui("statConnections"), v: stats.connections },
          ].map((s) => (
            <div key={s.k}>
              <dt className="font-mono text-xs uppercase tracking-widest text-faint">{s.k}</dt>
              <dd className="font-heading text-3xl text-foreground">{s.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"

import { HeroMosaic } from "@/components/concept/hero-mosaic"
import { SectionLabel } from "@/components/ui/badges"

export const metadata: Metadata = {
  title: "Hero Mosaic — Concept",
  description: "A drifting mosaic hero, recreated for Equilibrium.",
  robots: { index: false, follow: false },
}

/**
 * Concept preview of the drifting-mosaic hero (recreated from the
 * equilibrium "pink" hero). Hidden from indexing and nav; here to feel the
 * motion and wash before deciding whether it graduates to the live hero.
 */
export default function HeroMosaicConceptPage() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroMosaic />

      {/* Content over the wall — headline anchored lower. */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-end px-4 pb-24 pt-28 sm:px-6">
        <SectionLabel>The living knowledge ecosystem</SectionLabel>
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="max-w-3xl font-heading text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.02] text-foreground sm:leading-[0.98] [@media(max-height:600px)]:text-[clamp(1.75rem,6.5vh,3rem)]">
            Knowledge grows when everything connects.
          </h1>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" /> Explore the graph
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-6 py-3 font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-surface-2"
            >
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

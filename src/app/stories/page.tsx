import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { STORIES, getCategory } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Field Stories",
  description:
    "Immersive, place-based stories of regeneration in the real world — where the science of Equilibrium becomes a living landscape you can walk through.",
}

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel>Field stories</SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        Where the knowledge becomes a place.
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        Reference articles explain the concepts. Field Stories walk you through real landscapes
        where those concepts come alive — the ground, the species, and the people who tend them.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {STORIES.map((story, i) => {
          const cat = getCategory(story.category)
          return (
            <Reveal key={story.slug} delay={(i % 2) * 0.08}>
              <Link
                href={`/stories/${story.slug}`}
                className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-line p-8 transition-transform duration-500 hover:-translate-y-1"
              >
                {/* Ambient art */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background: `radial-gradient(70% 60% at 30% 20%, hsl(${story.hue} 45% 30%), transparent 60%), radial-gradient(80% 70% at 90% 100%, hsl(${story.hue} 40% 18%), var(--color-surface))`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />

                <div className="relative">
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sage/90">
                    <MapPin className="h-3.5 w-3.5" /> {story.place} · {cat?.title}
                  </p>
                  <h2 className="mt-3 font-heading text-3xl text-warm">{story.title}</h2>
                  <p className="mt-2 max-w-md text-pretty text-sage/85">{story.subtitle}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-warm">
                    Read the story
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

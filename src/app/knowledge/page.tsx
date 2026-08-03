import type { Metadata } from "next"

import { CategoryCard } from "@/components/knowledge/category-card"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { CATEGORIES } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Knowledge — All Domains",
  description:
    "Browse all 24 domains of the Equilibrium ecosystem, from soil and water to philosophy and circular systems.",
}

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel>The library</SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        Twenty-four domains, one connected whole.
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        Each domain is a doorway. Follow the one that calls to you — every path eventually meets
        the others.
      </p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.04}>
            <CategoryCard category={c} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

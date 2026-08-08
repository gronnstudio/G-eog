import type { Metadata } from "next"

import { CategoryCard } from "@/components/knowledge/category-card"
import { KnowledgeExplorer } from "@/components/knowledge/explorer"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"
import { CATEGORIES } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Knowledge — All Domains",
  description:
    "Browse all 24 domains of the Equilibrium ecosystem, from soil and water to philosophy and circular systems.",
}

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel><UIText k="knLibrary" /></SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        <UIText k="knHeadline" />
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        <UIText k="knBody" />
      </p>
      {/* Browse the collection like a filesystem — shelves, contents,
          and a path. Relationships stay in the graph, not the folders. */}
      <div className="mt-14">
        <KnowledgeExplorer />
      </div>

      {/* Every domain, flat, for when you already know what you want. */}
      <h2 className="mt-20 font-heading text-2xl text-foreground sm:text-3xl">
        <UIText k="allCategories" />
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.04}>
            <CategoryCard category={c} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

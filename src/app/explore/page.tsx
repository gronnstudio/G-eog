import type { Metadata } from "next"

import { ExploreView } from "./explore-view"
import { ExploreIntro } from "./explore-intro"
import { SectionLabel } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"
import { totalStats } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Explore the Knowledge Graph",
  description:
    "Wander Equilibrium's living knowledge graph — every ecological concept and the relationships that connect them. Zoom, pan, filter and follow your curiosity.",
}

export default function ExplorePage() {
  const stats = totalStats()
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel><UIText k="expLabel" /></SectionLabel>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h1 className="max-w-2xl font-heading text-4xl text-foreground sm:text-6xl">
          <UIText k="expHeadline" />
        </h1>
        <ExploreIntro
          articles={stats.articles}
          connections={stats.connections}
          categories={stats.categories}
        />
      </div>
      <div className="mt-12">
        <ExploreView />
      </div>
    </div>
  )
}

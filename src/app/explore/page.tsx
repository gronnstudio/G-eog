import type { Metadata } from "next"

import { ExploreView } from "./explore-view"
import { SectionLabel } from "@/components/ui/badges"
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
      <SectionLabel>Knowledge graph</SectionLabel>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <h1 className="max-w-2xl font-heading text-4xl text-foreground sm:text-6xl">
          The whole ecosystem, in one view.
        </h1>
        <p className="max-w-sm text-pretty text-muted">
          {stats.articles} concepts woven by {stats.connections} relationships across {stats.categories}{" "}
          domains. Filter by domain, then follow the threads.
        </p>
      </div>
      <div className="mt-12">
        <ExploreView />
      </div>
    </div>
  )
}

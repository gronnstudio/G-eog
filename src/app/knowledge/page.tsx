import type { Metadata } from "next"

import { KnowledgeExplorer } from "@/components/knowledge/explorer"
import { SectionLabel } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"

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
          and a path. Relationships stay in the graph, not the folders.
          The explorer already holds every domain, so there is no second
          flat grid repeating all 24 below it. */}
      <div className="mt-14">
        <KnowledgeExplorer />
      </div>
    </div>
  )
}

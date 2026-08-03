"use client"

import { useState } from "react"

import { KnowledgeGraph } from "@/components/graph/knowledge-graph"
import { CATEGORIES, buildGraph } from "@/lib/knowledge"

export function ExploreView() {
  const [active, setActive] = useState<string | null>(null)
  const graph = buildGraph()
  const present = new Set(graph.nodes.map((n) => n.category))
  const cats = CATEGORIES.filter((c) => present.has(c.id))

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            active === null ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted hover:text-foreground"
          }`}
        >
          All domains
        </button>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(active === c.id ? null : c.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active === c.id ? "border-accent text-foreground" : "border-line text-muted hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${c.hue} 50% 58%)` }} />
            {c.title}
          </button>
        ))}
      </div>
      <KnowledgeGraph height={640} activeCategory={active} />
    </div>
  )
}

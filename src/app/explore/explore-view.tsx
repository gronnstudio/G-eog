"use client"

import { useState } from "react"
import { Map, Rows3 } from "lucide-react"

import { GraphBrowser } from "@/components/graph/graph-browser"
import { KnowledgeGraph } from "@/components/graph/knowledge-graph"
import { CATEGORIES, buildGraph } from "@/lib/knowledge"
import { useT, useUI } from "@/components/language-provider"
import { cn } from "@/lib/utils"

/**
 * Two ways to read the same graph.
 *
 * "Browse" is the default and the one built for actually getting somewhere:
 * a concept, its typed connections, and a step to the next. "Map" keeps the
 * force-directed canvas for the overview it is genuinely good at — the
 * shape and density of the whole thing — without asking it to be the
 * primary navigation, which is where it was failing.
 */
export function ExploreView() {
  const ui = useUI()
  const t = useT()
  const [active, setActive] = useState<string | null>(null)
  const [mode, setMode] = useState<"browse" | "map">("browse")
  const graph = buildGraph()
  const present = new Set(graph.nodes.map((n) => n.category))
  const cats = CATEGORIES.filter((c) => present.has(c.id))

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* 24 domains wrapped into six rows on a phone and pushed the actual
            content below the fold. One scrollable row on small screens;
            wraps normally once there's width for it. */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          <button
            onClick={() => setActive(null)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active === null ? "border-accent bg-accent-soft text-foreground" : "border-line text-muted hover:text-foreground"
            }`}
          >
            {ui("allDomains")}
          </button>
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(active === c.id ? null : c.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active === c.id ? "border-accent text-foreground" : "border-line text-muted hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${c.hue} 50% 58%)` }} />
              {c.title}
            </button>
          ))}
        </div>

        {/* View switch */}
        <div
          role="tablist"
          aria-label={t({ en: "Graph view", nl: "Graafweergave" })}
          className="flex shrink-0 gap-1 rounded-full border border-line p-1"
        >
          {(
            [
              { k: "browse", icon: Rows3, label: t({ en: "Browse", nl: "Bladeren" }) },
              { k: "map", icon: Map, label: t({ en: "Map", nl: "Kaart" }) },
            ] as const
          ).map(({ k, icon: Icon, label }) => (
            <button
              key={k}
              role="tab"
              aria-selected={mode === k}
              onClick={() => setMode(k)}
              className={cn(
                "tap-target inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors",
                mode === k
                  ? "bg-gronn-green text-gronn-white"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "browse" ? (
        <GraphBrowser activeCategory={active} />
      ) : (
        <KnowledgeGraph height={640} activeCategory={active} />
      )}
    </div>
  )
}

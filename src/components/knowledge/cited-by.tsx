"use client"

import { Link2 } from "lucide-react"

import type { Article } from "@/lib/knowledge"
import { ArticleCard } from "@/components/knowledge/article-card"
import { useT } from "@/components/language-provider"

/**
 * "Cited by" backlinks — articles whose `related` edges point at the
 * current one. The list itself is computed server-side (page.tsx) from
 * the knowledge graph; this client leaf only handles the localized
 * chrome around the shared ArticleCard grid.
 */
export function CitedBy({ articles }: { articles: Article[] }) {
  const t = useT()
  if (articles.length === 0) return null

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-faint">
          <Link2 className="h-3.5 w-3.5 text-accent" />
          {t({ en: "Incoming links", nl: "Inkomende links" })}
        </p>
        <h2 className="font-heading text-3xl text-foreground">
          {t({ en: "Cited by", nl: "Geciteerd door" })}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {t({
            en: "Other articles in the knowledge graph that link here.",
            nl: "Andere artikelen in de kennisgraaf die hierheen linken.",
          })}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  )
}

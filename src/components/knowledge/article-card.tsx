"use client"

import Link from "next/link"
import { ArrowUpRight, Clock, Link2 } from "lucide-react"

import { getCategory, type Article } from "@/lib/knowledge"
import { DifficultyBadge } from "@/components/ui/badges"
import { useUI } from "@/components/language-provider"

export function ArticleCard({ article }: { article: Article }) {
  const cat = getCategory(article.category)
  const ui = useUI()
  return (
    <Link
      href={`/knowledge/${article.category}/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-float"
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, hsl(${cat?.hue ?? 150} 45% 55%), transparent)` }}
      />
      <div className="mb-4 flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ background: `hsl(${cat?.hue ?? 150} 40% 55% / 0.14)`, color: `hsl(${cat?.hue ?? 150} 45% 68%)` }}
        >
          {cat?.title}
        </span>
        <ArrowUpRight className="h-4 w-4 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <h3 className="font-heading text-xl leading-snug text-foreground">{article.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{article.summary}</p>
      <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-xs text-faint">
        <DifficultyBadge level={article.difficulty} />
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} {ui("knMin")}
        </span>
        <span className="inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" /> {article.related.length}
        </span>
      </div>
    </Link>
  )
}

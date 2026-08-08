"use client"

import Link from "next/link"
import * as Icons from "lucide-react"

import { categoryStats, type Category } from "@/lib/knowledge"
import { useUI } from "@/components/language-provider"

type IconName = keyof typeof Icons

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const stats = categoryStats(category.id)
  const ui = useUI()
  const Icon = (Icons[category.icon as IconName] ?? Icons.Circle) as React.ComponentType<{
    className?: string
  }>
  const hue = category.hue

  return (
    <Link
      href={`/knowledge/${category.id}`}
      className="group relative flex flex-col rounded-2xl border border-line bg-surface/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-float"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Corner glow as a painted radial-gradient, not a blurred child:
          iOS Safari lets filter() output bleed past a rounded
          overflow-hidden clip no matter the compositing hints, so the
          soft falloff is baked into the gradient itself — clipping is
          then just ordinary painting. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(140px 140px at calc(100% - 8px) 8px, hsl(${hue} 50% 45% / 0.30), hsl(${hue} 50% 45% / 0.10) 55%, transparent 75%)`,
        }}
      />
      <div
        className="relative mb-5 grid h-12 w-12 place-items-center rounded-xl"
        style={{ background: `hsl(${hue} 45% 50% / 0.16)`, color: `hsl(${hue} 50% 66%)` }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="relative font-heading text-xl text-foreground">{category.title}</h3>
      <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-muted">{category.tagline}</p>
      <p className="relative mt-5 font-mono text-xs text-faint">
        {stats.articles} {ui(stats.articles === 1 ? "knArticleWord" : "knArticlesWord")} ·{" "}
        {stats.connections} {ui("knLinksWord")}
      </p>
    </Link>
  )
}

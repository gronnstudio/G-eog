import Link from "next/link"
import * as Icons from "lucide-react"

import { categoryStats, type Category } from "@/lib/knowledge"

type IconName = keyof typeof Icons

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const stats = categoryStats(category.id)
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
      {/* Dedicated clip layer for the corner glow. A blurred child is not
          clipped by a plain overflow-hidden+rounded parent on iOS Safari
          (the blur box bleeds past the corner); translateZ forces a
          compositing layer that respects the rounding. Kept off the card's
          hover transform, and separate so the card's box-shadow still shows. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl [transform:translateZ(0)]">
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: `hsl(${hue} 50% 45%)` }}
        />
      </div>
      <div
        className="relative mb-5 grid h-12 w-12 place-items-center rounded-xl"
        style={{ background: `hsl(${hue} 45% 50% / 0.16)`, color: `hsl(${hue} 50% 66%)` }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="relative font-heading text-xl text-foreground">{category.title}</h3>
      <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-muted">{category.tagline}</p>
      <p className="relative mt-5 font-mono text-xs text-faint">
        {stats.articles} article{stats.articles === 1 ? "" : "s"} · {stats.connections} links
      </p>
    </Link>
  )
}

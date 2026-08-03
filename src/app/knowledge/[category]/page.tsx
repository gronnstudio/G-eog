import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import * as Icons from "lucide-react"

import { ArticleCard } from "@/components/knowledge/article-card"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import {
  CATEGORIES,
  articlesInCategory,
  categoryStats,
  getCategory,
  type CategoryId,
} from "@/lib/knowledge"

type IconName = keyof typeof Icons

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}
  return {
    title: `${cat.title} — ${cat.tagline}`,
    description: cat.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const articles = articlesInCategory(category as CategoryId)
  const stats = categoryStats(category as CategoryId)
  const related = CATEGORIES.filter((c) => c.id !== cat.id).slice(0, 6)
  const Icon = (Icons[cat.icon as IconName] ?? Icons.Circle) as React.ComponentType<{
    className?: string
  }>

  return (
    <div className="pt-32">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{ background: `radial-gradient(60% 60% at 20% 0%, hsl(${cat.hue} 50% 40%), transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <Link href="/knowledge" className="text-sm text-muted transition-colors hover:text-foreground">
            ← All domains
          </Link>
          <div className="mt-8 flex items-start gap-5">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
              style={{ background: `hsl(${cat.hue} 45% 50% / 0.16)`, color: `hsl(${cat.hue} 50% 66%)` }}
            >
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-heading text-5xl text-foreground sm:text-6xl">{cat.title}</h1>
              <p className="mt-2 text-lg text-muted">{cat.tagline}</p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {cat.description}
          </p>
          <dl className="mt-8 flex gap-10">
            {[
              { k: "Articles", v: stats.articles },
              { k: "Connections", v: stats.connections },
              { k: "Reading", v: `${stats.minutes} min` },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-mono text-xs uppercase tracking-widest text-faint">{s.k}</dt>
                <dd className="font-heading text-2xl text-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Articles */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionLabel>Articles</SectionLabel>
        {articles.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.05}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-muted">
              This domain is still taking root. Seed articles are on the way —{" "}
              <Link href="/community" className="text-accent underline">
                contribute the first one
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      {/* Related domains */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionLabel>Related domains</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {related.map((c) => (
            <Link
              key={c.id}
              href={`/knowledge/${c.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${c.hue} 50% 58%)` }} />
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  BookMarked,
  Clock,
  FileText,
  GitPullRequest,
  History,
  Link2,
  MessageSquare,
  Users,
} from "lucide-react"

import { ReadingProgress } from "@/components/knowledge/reading-progress"
import { ArticleCard } from "@/components/knowledge/article-card"
import { DifficultyBadge } from "@/components/ui/badges"
import {
  ARTICLES,
  getArticle,
  getCategory,
  relatedArticles,
} from "@/lib/knowledge"

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  return {
    title: a.title,
    description: a.summary,
    openGraph: { title: a.title, description: a.summary, type: "article" },
  }
}

const GH = "https://github.com/gronnstudio/g-eog"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const cat = getCategory(article.category)
  const related = relatedArticles(article)
  const sourcePath = `content/${article.category}/${article.slug}.mdx`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.updated,
    dateModified: article.updated,
    author: article.contributors.map((name) => ({ "@type": "Person", name })),
    articleSection: cat?.title,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
  }

  const actions = [
    { icon: GitPullRequest, label: "Improve this page", href: `${GH}/edit/main/${sourcePath}` },
    { icon: FileText, label: "View source", href: `${GH}/blob/main/${sourcePath}` },
    { icon: History, label: "Version history", href: `${GH}/commits/main/${sourcePath}` },
    { icon: MessageSquare, label: "Discussion", href: `${GH}/discussions` },
  ]

  return (
    <article className="pt-24">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 blur-3xl"
          style={{ background: `radial-gradient(50% 60% at 50% 0%, hsl(${cat?.hue ?? 150} 50% 40%), transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/knowledge" className="hover:text-foreground">Knowledge</Link>
            <span className="text-faint">/</span>
            <Link href={`/knowledge/${article.category}`} className="hover:text-foreground">
              {cat?.title}
            </Link>
          </nav>
          <h1 className="mt-6 text-balance font-heading text-4xl leading-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-pretty text-xl leading-relaxed text-muted">{article.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-4 text-sm text-muted">
            <DifficultyBadge level={article.difficulty} />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readingMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Link2 className="h-4 w-4" /> {article.related.length} connections
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {article.contributors.length} contributors
            </span>
            <span className="ml-auto font-mono text-xs text-faint">
              Updated {new Date(article.updated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </header>

      {/* Body + rail */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="eog-prose min-w-0">
          {article.sections.map((section, i) => (
            <section key={i}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </section>
          ))}

          {/* Citations */}
          {article.citations.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <h2 className="!mt-0 flex items-center gap-2 font-heading text-2xl">
                <BookMarked className="h-5 w-5 text-accent" /> References
              </h2>
              <ol className="mt-4 space-y-3">
                {article.citations.map((c) => (
                  <li key={c.id} className="text-sm leading-relaxed text-muted">
                    {c.authors} ({c.year}). <span className="text-foreground">{c.title}</span>. <em>{c.source}</em>
                    {c.url && (
                      <>
                        {" "}
                        <a href={c.url} className="text-accent underline">
                          link
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">On this page</p>
              <ul className="mt-3 space-y-2 border-l border-line">
                {article.sections
                  .filter((s) => s.heading)
                  .map((s, i) => (
                    <li key={i} className="-ml-px border-l border-transparent pl-4 text-sm text-muted hover:border-accent hover:text-foreground">
                      {s.heading}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">Contributors</p>
              <ul className="mt-3 space-y-2">
                {article.contributors.map((name) => (
                  <li key={name} className="flex items-center gap-2 text-sm text-muted">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-medium text-on-accent"
                      style={{ background: `hsl(${cat?.hue ?? 150} 45% 62%)` }}
                    >
                      {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">Open source</p>
              <ul className="mt-3 space-y-1.5">
                {actions.map((a) => (
                  <li key={a.label}>
                    <a
                      href={a.href}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <a.icon className="h-4 w-4" /> {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Connections */}
      {related.length > 0 && (
        <section className="border-t border-line bg-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">
              Everything is connected
            </p>
            <h2 className="font-heading text-3xl text-foreground">Follow the threads</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  ChevronRight,
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
import { ArticleEmbed } from "@/components/knowledge/article-embed"
import { DifficultyBadge } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"
import {
  ARTICLES,
  articleNeighbors,
  getArticle,
  getCategory,
  relatedArticles,
} from "@/lib/knowledge"

const SITE = "https://equilibrium.gronn.studio"

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
  const { prev, next } = articleNeighbors(article)
  const sourcePath = `content/${article.category}/${article.slug}.mdx`

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Knowledge", item: `${SITE}/knowledge` },
      { "@type": "ListItem", position: 2, name: cat?.title, item: `${SITE}/knowledge/${article.category}` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE}/knowledge/${article.category}/${article.slug}` },
    ],
  }

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
    { icon: GitPullRequest, k: "artImprove", href: `${GH}/edit/main/${sourcePath}` },
    { icon: FileText, k: "artViewSource", href: `${GH}/blob/main/${sourcePath}` },
    { icon: History, k: "artHistory", href: `${GH}/commits/main/${sourcePath}` },
    { icon: MessageSquare, k: "artDiscussion", href: `${GH}/discussions` },
  ] as const

  return (
    <article className="pt-24">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 blur-3xl"
          style={{ background: `radial-gradient(50% 60% at 50% 0%, hsl(${cat?.hue ?? 150} 50% 40%), transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <Link href="/" className="hover:text-foreground"><UIText k="nav_home" /></Link>
            <ChevronRight className="h-3.5 w-3.5 text-faint" />
            <Link href="/knowledge" className="hover:text-foreground"><UIText k="nav_knowledge" /></Link>
            <ChevronRight className="h-3.5 w-3.5 text-faint" />
            <Link href={`/knowledge/${article.category}`} className="hover:text-foreground">
              {cat?.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-faint" />
            <span className="truncate text-foreground" aria-current="page">{article.title}</span>
          </nav>
          <h1 className="mt-6 text-balance font-heading text-4xl leading-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-pretty text-xl leading-relaxed text-muted">{article.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-4 text-sm text-muted">
            <DifficultyBadge level={article.difficulty} />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readingMinutes} <UIText k="artMinRead" />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Link2 className="h-4 w-4" /> {article.related.length} <UIText k="artConnectionsWord" />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {article.contributors.length} <UIText k="artContributorsWord" />
            </span>
            <span className="ml-auto font-mono text-xs text-faint">
              <UIText k="artUpdated" /> {new Date(article.updated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </header>

      {/* Body + rail */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="eog-prose">
          {article.sections.map((section, i) => (
            <section key={i}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              {section.embed && (
                <ArticleEmbed name={section.embed} caption={section.embedCaption} />
              )}
            </section>
          ))}

          {/* Citations */}
          {article.citations.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <h2 className="!mt-0 flex items-center gap-2 font-heading text-2xl">
                <BookMarked className="h-5 w-5 text-accent" /> <UIText k="artReferences" />
              </h2>
              <ol className="mt-4 space-y-3">
                {article.citations.map((c) => (
                  <li key={c.id} className="text-sm leading-relaxed text-muted">
                    {c.authors} ({c.year}). <span className="text-foreground">{c.title}</span>. <em>{c.source}</em>
                    {c.url && (
                      <>
                        {" "}
                        <a href={c.url} className="text-accent underline">
                          <UIText k="artSourceLink" />
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

          {/* Contribute — the sticky rail is desktop-only, so mobile
              readers get their own on-ramp to editing this page. */}
          <div className="mt-10 rounded-2xl border border-line bg-surface/40 p-5 lg:hidden">
            <p className="flex items-center gap-2 font-heading text-lg text-foreground">
              <GitPullRequest className="h-5 w-5 text-accent" /> <UIText k="artImprove" />
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              <UIText k="artImproveBody" />
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`${GH}/edit/main/${sourcePath}`}
                className="inline-flex items-center gap-2 rounded-full bg-gronn-green px-4 py-2 text-sm font-medium text-gronn-white"
              >
                <GitPullRequest className="h-4 w-4" /> <UIText k="artEditGitHub" />
              </a>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <UIText k="artHowContrib" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sticky rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-faint"><UIText k="artOnThisPage" /></p>
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
              <p className="font-mono text-xs uppercase tracking-widest text-faint"><UIText k="artContributors" /></p>
              <ul className="mt-3 space-y-2">
                {article.contributors.map((name) => (
                  <li key={name} className="flex items-center gap-2 text-sm text-muted">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-medium text-gronn-white"
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
              <p className="font-mono text-xs uppercase tracking-widest text-faint"><UIText k="artOpenSource" /></p>
              <ul className="mt-3 space-y-1.5">
                {actions.map((a) => (
                  <li key={a.k}>
                    <a
                      href={a.href}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <a.icon className="h-4 w-4" /> <UIText k={a.k} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Prev / next pager — sequential movement through the domain */}
      {(prev || next) && (
        <nav
          aria-label="Article navigation"
          className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 pb-4 sm:gap-4 sm:px-6"
        >
          {prev ? (
            <Link
              href={`/knowledge/${prev.category}/${prev.slug}`}
              className="group flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface-2 sm:p-5"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent sm:h-5 sm:w-5" />
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-faint">
                  <UIText k="previous" />
                </span>
                <span className="mt-0.5 block font-heading text-sm leading-snug text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-lg">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/knowledge/${next.category}/${next.slug}`}
              className="group flex min-w-0 items-center justify-end gap-3 rounded-2xl border border-line bg-surface/40 p-4 text-right transition-colors hover:border-accent/40 hover:bg-surface-2 sm:p-5"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-faint">
                  <UIText k="next" />
                </span>
                <span className="mt-0.5 block font-heading text-sm leading-snug text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden sm:text-lg">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent sm:h-5 sm:w-5" />
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}

      {/* Connections */}
      {related.length > 0 && (
        <section className="border-t border-line bg-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">
              <UIText k="phil1t" />
            </p>
            <h2 className="font-heading text-3xl text-foreground"><UIText k="artFollowThreads" /></h2>
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

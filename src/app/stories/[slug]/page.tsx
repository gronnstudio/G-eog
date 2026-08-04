import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ChevronRight, Leaf, Sprout, Users } from "lucide-react"

import { StoryHero } from "@/components/stories/story-hero"
import { ReadingProgress } from "@/components/knowledge/reading-progress"
import { ArticleCard } from "@/components/knowledge/article-card"
import { Reveal } from "@/components/motion/reveal"
import { STORIES, getStory, getArticle, getCategory } from "@/lib/knowledge"

const SITE = "https://equilibrium.gronn.studio"

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = getStory(slug)
  if (!s) return {}
  return {
    title: `${s.title} — Field Story`,
    description: s.subtitle,
    openGraph: { title: s.title, description: s.subtitle, type: "article" },
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) notFound()

  const cat = getCategory(story.category)
  const related = story.related.map((s) => getArticle(s)).filter(Boolean)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.subtitle,
    datePublished: story.updated,
    articleSection: cat?.title,
    contentLocation: { "@type": "Place", name: story.place },
    author: story.guardians.map((g) => ({ "@type": "Person", name: g.name })),
    isAccessibleForFree: true,
    url: `${SITE}/stories/${story.slug}`,
  }

  return (
    <article>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto flex max-w-5xl items-center gap-2 px-4 pt-24 text-sm text-muted sm:px-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 text-faint" />
        <Link href="/stories" className="hover:text-foreground">Stories</Link>
        <ChevronRight className="h-3.5 w-3.5 text-faint" />
        <span className="truncate text-foreground" aria-current="page">{story.title}</span>
      </nav>

      <StoryHero
        hue={story.hue}
        title={story.title}
        subtitle={story.subtitle}
        place={story.place}
        lead={story.lead}
        stats={story.stats}
      />

      {/* Chapters */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {story.chapters.map((chapter, i) => (
          <section key={i} className="border-t border-line py-16 first:border-t-0">
            <Reveal>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                <span style={{ color: `hsl(${story.hue} 50% 62%)` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {chapter.title}
              </p>
            </Reveal>
            <div className="eog-prose">
              {chapter.paragraphs.map((p, j) => (
                <Reveal key={j} delay={j * 0.05}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            {chapter.pullQuote && (
              <Reveal>
                <blockquote
                  className="my-4 border-l-2 pl-6 font-heading text-2xl italic leading-snug text-foreground sm:text-3xl"
                  style={{ borderColor: `hsl(${story.hue} 50% 55%)` }}
                >
                  {chapter.pullQuote}
                </blockquote>
              </Reveal>
            )}
          </section>
        ))}
      </div>

      {/* Species strip */}
      <section className="border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-faint">
              <Sprout className="h-4 w-4" style={{ color: `hsl(${story.hue} 50% 62%)` }} />
              What lives here
            </p>
            <h2 className="font-heading text-3xl text-foreground">The community, by name</h2>
          </Reveal>
          <div className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto pb-2">
            {story.species.map((sp, i) => (
              <Reveal key={sp.latin} delay={(i % 6) * 0.04}>
                <div className="w-56 shrink-0 snap-start rounded-2xl border border-line bg-surface/50 p-5">
                  <div
                    className="mb-4 grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: `hsl(${story.hue} 45% 50% / 0.16)`, color: `hsl(${story.hue} 50% 66%)` }}
                  >
                    <Leaf className="h-5 w-5" />
                  </div>
                  <p className="font-heading text-lg text-foreground">{sp.common}</p>
                  <p className="mt-0.5 text-sm italic text-muted">{sp.latin}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wide text-faint">{sp.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guardians */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-faint">
            <Users className="h-4 w-4" style={{ color: `hsl(${story.hue} 50% 62%)` }} />
            Guardians
          </p>
          <h2 className="font-heading text-3xl text-foreground">The hands that tend it</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {story.guardians.map((g, i) => (
            <Reveal key={g.name} delay={(i % 3) * 0.05}>
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface/40 p-5">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-heading text-sm text-on-accent"
                  style={{ background: `hsl(${story.hue} 45% 60%)` }}
                >
                  {g.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{g.name}</p>
                  <p className="truncate text-sm text-muted">{g.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Go deeper */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <Reveal>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">Go deeper</p>
            <h2 className="font-heading text-3xl text-foreground">The science behind the story</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => a && <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <Link href="/stories" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
          <ArrowRight className="h-4 w-4 rotate-180" />
          All field stories
        </Link>
      </div>
    </article>
  )
}

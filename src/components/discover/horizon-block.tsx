"use client"

import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"

import { useT } from "@/components/language-provider"
import { getCategory } from "@/lib/knowledge"
import { horizon } from "@/lib/knowledge/discover"

/**
 * "You might explore" — the concepts exactly two hops from this article.
 *
 * One hop is already on the page as the connection list. Two hops out is
 * where serendipity lives: connected to what you're reading through
 * something else, but never directly, so the reader hasn't seen it in the
 * connections and wouldn't have thought to look. Each card names the
 * stepping stone, because an unexplained suggestion is an ad; an explained
 * one is a path.
 */
export function HorizonBlock({ slug }: { slug: string }) {
  const t = useT()
  const suggestions = horizon(slug)
  if (suggestions.length === 0) return null

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-faint">
          <Compass className="h-3.5 w-3.5" aria-hidden />
          {t({ en: "Two steps away", nl: "Twee stappen verderop" })}
        </p>
        <h2 className="font-heading text-3xl text-foreground">
          {t({ en: "You might explore", nl: "Misschien wil je verkennen" })}
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map(({ article, via }) => {
            const cat = getCategory(article.category)
            return (
              <Link
                key={article.slug}
                href={`/knowledge/${article.category}/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line p-5 transition-colors hover:border-ember/40"
              >
                {cat && (
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: `hsl(${cat.hue} 45% 60%)` }}
                  >
                    {cat.title}
                  </span>
                )}
                <span className="mt-2 flex-1 font-heading text-lg leading-snug text-foreground">
                  {article.title}
                </span>
                <span className="mt-3 text-xs leading-relaxed text-faint">
                  {t({ en: "via", nl: "via" })}{" "}
                  <span className="text-muted">{via.title}</span>
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent">
                  {t({ en: "Wander over", nl: "Dwaal erheen" })}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HorizonBlock

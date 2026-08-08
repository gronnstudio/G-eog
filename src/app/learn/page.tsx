import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel, DifficultyBadge } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"
import { LEARNING_PATHS, getArticle } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Learn — Guided Paths",
  description:
    "Guided learning paths through Equilibrium: soil, water, forests and systems thinking, each a curated sequence with progress and connections.",
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel><UIText k="pathsLabel" /></SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        <UIText k="learnHeadline" />
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        <UIText k="learnBody" />
      </p>

      <div className="mt-16 space-y-6">
        {LEARNING_PATHS.map((path, idx) => (
          <Reveal key={path.slug} delay={idx * 0.05}>
            <section
              id={path.slug}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface/40"
            >
              <div className="flex flex-col gap-4 border-b border-line p-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <h2 className="font-heading text-2xl text-foreground">{path.title}</h2>
                  </div>
                  <p className="mt-2 max-w-xl text-pretty text-muted">{path.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <DifficultyBadge level={path.difficulty} />
                  <p className="font-mono text-xs text-faint">
                    {path.hours} <UIText k="hours" /> · {path.steps.length} <UIText k="steps" />
                  </p>
                </div>
              </div>
              <ol className="divide-y divide-line">
                {path.steps.map((step, i) => {
                  const article = getArticle(step.slug)
                  const inner = (
                    <div className="flex items-center gap-4 px-7 py-4 transition-colors hover:bg-surface-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-muted">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {article?.title ??
                            step.slug
                              .split("-")
                              .map((w) => w[0].toUpperCase() + w.slice(1))
                              .join(" ")}
                          {!article && (
                            <span className="ml-2 rounded-full border border-line px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wide text-faint">
                              <UIText k="learnSoon" />
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-muted">{step.note}</p>
                      </div>
                      {article ? (
                        <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-faint opacity-40" />
                      )}
                    </div>
                  )
                  return (
                    <li key={step.slug}>
                      {article ? (
                        <Link href={`/knowledge/${article.category}/${article.slug}`}>{inner}</Link>
                      ) : (
                        inner
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

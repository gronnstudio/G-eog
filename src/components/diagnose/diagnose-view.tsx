"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CornerDownRight, Search, Sparkles } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { getCategory } from "@/lib/knowledge"
import { RELATIONSHIP_LABEL } from "@/lib/knowledge"
import type { EvidenceLevel } from "@/lib/knowledge"
import {
  SYMPTOMS,
  conceptsFor,
  explain,
  matchSymptoms,
  type Symptom,
} from "@/lib/knowledge/diagnose"
import { cn } from "@/lib/utils"

const EVIDENCE_TONE: Record<EvidenceLevel, string> = {
  strong: "border-gronn-green/40 text-gronn-green",
  moderate: "border-accent/40 text-accent",
  emerging: "border-ember/40 text-ember-text",
  limited: "border-line text-faint",
  contested: "border-ember/60 text-ember-text",
  hypothesis: "border-line text-faint",
}

/**
 * Ask the graph a question in the form people actually have one: a
 * problem, not a topic.
 *
 * The answer is assembled from typed relationships, so every sentence
 * shown was authored on an edge and carries its own evidence level. It
 * reasons; it does not generate. That is the point — it can be wrong about
 * which mechanism matters most in a given garden, but it cannot invent a
 * mechanism that isn't in the graph.
 */
export function DiagnoseView() {
  const t = useT()
  const [query, setQuery] = useState("")
  const [chosen, setChosen] = useState<Symptom | null>(null)

  const suggestions = useMemo(() => matchSymptoms(query).slice(0, 6), [query])
  const mechanisms = useMemo(() => (chosen ? explain(chosen, 7) : []), [chosen])
  const concepts = useMemo(() => (chosen ? conceptsFor(chosen).slice(0, 8) : []), [chosen])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      <Reveal>
        <SectionLabel>{t({ en: "Ask the graph", nl: "Vraag het de graaf" })}</SectionLabel>
        <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
          {t({ en: "What's going wrong?", nl: "Wat gaat er mis?" })}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {t({
            en: "Describe the problem in your own words. You'll get the mechanisms this knowledge base documents — how they connect, how strong the evidence is, and what to read. Not a product recommendation.",
            nl: "Beschrijf het probleem in je eigen woorden. Je krijgt de mechanismen die deze kennisbank documenteert — hoe ze samenhangen, hoe sterk het bewijs is, en wat je kunt lezen. Geen productadvies.",
          })}
        </p>
      </Reveal>

      {/* The question */}
      <Reveal>
        <div className="relative mt-10 flex items-center gap-3 rounded-full border border-line px-5 py-3.5 focus-within:border-ember/40">
          <span aria-hidden className="orbit-ring pointer-events-none absolute inset-0 rounded-full" />
          <Search className="h-5 w-5 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({
              en: "e.g. my soil is hard and water just sits on top",
              nl: "bijv. mijn grond is hard en water blijft erop staan",
            })}
            aria-label={t({ en: "Describe the problem", nl: "Beschrijf het probleem" })}
            className="w-full appearance-none border-0 bg-transparent text-foreground placeholder:text-faint"
            style={{ WebkitAppearance: "none", outline: "none", boxShadow: "none" }}
          />
        </div>
      </Reveal>

      {/* Symptom chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(query ? suggestions : SYMPTOMS).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setChosen(s)}
            className={cn(
              "tap-target rounded-full border px-4 py-2 text-left text-sm transition-colors",
              chosen?.id === s.id
                ? "border-transparent bg-gronn-green text-gronn-white"
                : "border-line text-muted hover:border-ember/40 hover:text-foreground",
            )}
          >
            {t(s.label)}
          </button>
        ))}
        {query && suggestions.length === 0 && (
          <p className="text-sm text-muted">
            {t({
              en: "Nothing in the graph matches that yet. Try different words, or pick one below.",
              nl: "Daar past nog niets in de graaf bij. Probeer andere woorden of kies er hieronder een.",
            })}
          </p>
        )}
      </div>

      {/* The answer */}
      {chosen && (
        <div className="mt-12">
          <Reveal>
            <div className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ember-text">
                <Sparkles className="h-3.5 w-3.5" />
                {t({ en: "How the graph reads this", nl: "Hoe de graaf dit leest" })}
              </p>
              <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-foreground">
                {t(chosen.lead)}
              </p>
            </div>
          </Reveal>

          <h2 className="mt-12 font-heading text-2xl text-foreground sm:text-3xl">
            {t({ en: "Mechanisms to look at", nl: "Mechanismen om naar te kijken" })}
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted">
            {t({
              en: "Each of these is a path through the knowledge graph. Follow one to read the concepts it runs through.",
              nl: "Elk hiervan is een pad door de kennisgraaf. Volg er een om de concepten te lezen waar het doorheen loopt.",
            })}
          </p>

          <ol className="mt-6 grid gap-3">
            {mechanisms.map((m, i) => (
              <li
                key={i}
                className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-6"
              >
                {/* The chain, as a sentence you can walk */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Link
                    href={`/knowledge/${m.steps[0].from.category}/${m.steps[0].from.slug}`}
                    className="font-heading text-base text-foreground underline-offset-4 hover:underline"
                  >
                    {m.steps[0].from.title}
                  </Link>
                  {m.steps.map((s, j) => (
                    <span key={j} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ember-text">
                        {RELATIONSHIP_LABEL[s.type]}
                      </span>
                      <Link
                        href={`/knowledge/${s.to.category}/${s.to.slug}`}
                        className="font-heading text-base text-foreground underline-offset-4 hover:underline"
                      >
                        {s.to.title}
                      </Link>
                    </span>
                  ))}
                </div>

                {/* Why each hop holds */}
                <ul className="mt-3 space-y-1.5">
                  {m.steps.map((s, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-muted">
                      <CornerDownRight className="mt-1 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
                      <span>{s.description}</span>
                    </li>
                  ))}
                </ul>

                <span
                  className={cn(
                    "mt-4 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    EVIDENCE_TONE[m.confidence],
                  )}
                >
                  {t({ en: "Evidence", nl: "Bewijs" })}: {m.confidence}
                </span>
              </li>
            ))}
          </ol>

          {/* Reading list */}
          <h2 className="mt-12 font-heading text-2xl text-foreground sm:text-3xl">
            {t({ en: "Read these", nl: "Lees dit" })}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {concepts.map((a) => (
              <Link
                key={a.slug}
                href={`/knowledge/${a.category}/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-line p-5 transition-colors hover:border-ember/40"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                  {getCategory(a.category)?.title}
                </span>
                <span className="mt-2 font-heading text-lg text-foreground">{a.title}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
                  {t({ en: "Read", nl: "Lezen" })}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          {/* What this is and isn't */}
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-faint">
            {t({
              en: "This reasons over the knowledge graph rather than generating text: every sentence above was written on a relationship and reviewed, and nothing here is invented. It cannot see your site, so treat these as mechanisms worth investigating, not a diagnosis — and check the evidence label before acting on any of them.",
              nl: "Dit redeneert over de kennisgraaf in plaats van tekst te genereren: elke zin hierboven is bij een relatie geschreven en nagekeken, niets is verzonnen. Het kan jouw terrein niet zien, dus behandel dit als mechanismen die het onderzoeken waard zijn, niet als diagnose — en kijk naar het bewijslabel voordat je ernaar handelt.",
            })}
          </p>
        </div>
      )}
    </div>
  )
}

export default DiagnoseView

"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, Handshake, Sparkles, Sprout } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { SEASONAL } from "@/lib/knowledge/seasonal"
import { PARTNERS } from "@/lib/knowledge/partners"

/**
 * Apply — where the knowledge stops being reading and starts being work.
 *
 * The site had grown three separate "do something" destinations (the
 * seasonal calendar, partners, the contribution wizard) with no shared
 * home, so each was reachable only from a mega-menu list. This is the
 * hub that gives them one.
 *
 * The month card is resolved on the server-rendered default and corrected
 * on the client, so this page always opens on something actionable today
 * rather than a generic index.
 */
export function ApplyView() {
  const t = useT()
  const month = SEASONAL[new Date().getMonth()] ?? SEASONAL[0]
  const taskCount = SEASONAL.reduce((n, m) => n + m.tasks.length, 0)

  const cards = [
    {
      href: "/diagnose",
      icon: Sparkles,
      eyebrow: t({ en: "Start here", nl: "Begin hier" }),
      title: t({ en: "Ask the graph", nl: "Vraag het de graaf" }),
      body: t({
        en: "Describe what is going wrong and get the mechanisms behind it, with evidence levels — reasoned from the graph, not generated.",
        nl: "Beschrijf wat er misgaat en krijg de mechanismen erachter, met bewijsniveaus — geredeneerd uit de graaf, niet gegenereerd.",
      }),
      meta: t({ en: "No account, no cost", nl: "Geen account, geen kosten" }),
      cta: t({ en: "Ask", nl: "Vragen" }),
    },
    {
      href: "/seasonal",
      icon: CalendarDays,
      eyebrow: t({ en: "This month", nl: "Deze maand" }),
      title: t(month.name),
      body: t(month.theme),
      meta: t({ en: `${taskCount} tasks across the year`, nl: `${taskCount} taken door het jaar` }),
      cta: t({ en: "Open the calendar", nl: "Open de kalender" }),
    },
    {
      href: "/partners",
      icon: Handshake,
      eyebrow: t({ en: "In practice", nl: "In de praktijk" }),
      title: t({ en: "Practitioners", nl: "Vakmensen" }),
      body: t({
        en: "Organisations restoring real ground, their methods described from their own material and linked back to the science.",
        nl: "Organisaties die echte grond herstellen, met methodes beschreven vanuit hun eigen materiaal en gekoppeld aan de wetenschap.",
      }),
      meta: t({
        en: `${PARTNERS.length} ${PARTNERS.length === 1 ? "partner" : "partners"}`,
        nl: `${PARTNERS.length} ${PARTNERS.length === 1 ? "partner" : "partners"}`,
      }),
      cta: t({ en: "Meet them", nl: "Maak kennis" }),
    },
    {
      href: "/contribute",
      icon: Sprout,
      eyebrow: t({ en: "Give back", nl: "Draag bij" }),
      title: t({ en: "Add what you know", nl: "Voeg toe wat jij weet" }),
      body: t({
        en: "Field observations, a missing connection, a source we haven't resolved — the commons grows from what practitioners notice.",
        nl: "Veldwaarnemingen, een ontbrekende verbinding, een bron die we niet konden vinden — het collectief groeit door wat vakmensen opmerken.",
      }),
      meta: t({ en: "Takes about a minute", nl: "Kost ongeveer een minuut" }),
      cta: t({ en: "Start", nl: "Beginnen" }),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <Reveal>
        <SectionLabel>{t({ en: "Apply", nl: "Toepassen" })}</SectionLabel>
        <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
          {t({ en: "Knowledge, put to work.", nl: "Kennis, aan het werk." })}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {t({
            en: "Understanding a system is only half of it. This is where the graph meets ground: what to do this month, who is already doing it, and how to add what you learn back.",
            nl: "Een systeem begrijpen is maar de helft. Hier raakt de graaf de grond: wat je deze maand kunt doen, wie het al doet, en hoe je toevoegt wat je leert.",
          })}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Reveal key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface/40 p-6 transition-colors hover:border-ember/40"
            >
              <c.icon className="h-6 w-6 text-ember-text" aria-hidden />
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                {c.eyebrow}
              </p>
              <h2 className="mt-1.5 font-heading text-2xl text-foreground">{c.title}</h2>
              <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted">{c.body}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {c.meta}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm text-accent">
                {c.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default ApplyView

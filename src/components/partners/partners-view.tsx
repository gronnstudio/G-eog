"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, Handshake } from "lucide-react"

import { useT } from "@/components/language-provider"
import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { getArticle, getCategory } from "@/lib/knowledge"
import { PARTNERS } from "@/lib/knowledge/partners"
import { repoUrl } from "@/lib/brand"

const GH_ISSUES = repoUrl("issues/new")

/**
 * Partners — the practitioner layer of the knowledge base. Each profile is
 * built from the partner's own public material, links out to them, and
 * threads back into the articles that explain the science they work with.
 */
export function PartnersView() {
  const t = useT()

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <Reveal>
        <SectionLabel>{t({ en: "Knowledge in practice", nl: "Kennis in de praktijk" })}</SectionLabel>
        <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
          {t({ en: "The people doing the work.", nl: "De mensen die het werk doen." })}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {t({
            en: "An article can tell you why soil life matters. A partner is someone restoring it on real ground, this season, for a paying client. These are organisations whose practice runs along the same grain as this knowledge base — described from their own public material, and linked back into the concepts behind their work.",
            nl: "Een artikel kan uitleggen waarom bodemleven ertoe doet. Een partner is iemand die het herstelt op echte grond, dit seizoen, voor een betalende klant. Dit zijn organisaties wier praktijk dezelfde richting op loopt als deze kennisbank — beschreven vanuit hun eigen publieke materiaal, en teruggekoppeld aan de concepten achter hun werk.",
          })}
        </p>
      </Reveal>

      {PARTNERS.map((p) => (
        <article key={p.slug} className="mt-16" id={p.slug}>
          {/* Identity */}
          <Reveal>
            <div
              className="rounded-3xl border border-line p-6 sm:p-10"
              style={{
                backgroundImage: `radial-gradient(600px 240px at 12% 0%, hsl(${p.hue} 45% 50% / 0.12), transparent 70%)`,
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {p.domains.map((d) => {
                  const c = getCategory(d)
                  if (!c) return null
                  return (
                    <span
                      key={d}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: `hsl(${c.hue} 45% 60%)` }}
                    >
                      {c.title}
                    </span>
                  )
                })}
              </div>

              <h2 className="mt-5 font-heading text-3xl text-foreground sm:text-5xl">{p.name}</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                {p.legalName ? `${p.legalName} · ` : ""}
                {p.place}
              </p>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-ember-text">
                {t(p.tagline)}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm text-muted transition-colors hover:border-ember/40 hover:text-foreground"
                  >
                    {t(l.label)}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Who they are */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Reveal>
              <div className="max-w-2xl space-y-5">
                {p.intro.map((para, i) => (
                  <p key={i} className="text-pretty text-lg leading-relaxed text-muted">
                    {t(para)}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Facts */}
            <Reveal>
              <dl className="divide-y divide-line rounded-2xl border border-line bg-surface/40">
                {p.facts.map((f, i) => (
                  <div key={i} className="p-5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                      {t(f.label)}
                    </dt>
                    <dd className="mt-1.5 text-pretty leading-relaxed text-foreground">
                      {t(f.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Method */}
          <Reveal>
            <div className="mt-14">
              <h3 className="font-heading text-2xl text-foreground sm:text-3xl">
                {t(p.methodTitle)}
              </h3>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
                {t(p.methodIntro)}
              </p>

              <ol className="mt-8 grid gap-4 md:grid-cols-3">
                {p.method.map((step, i) => (
                  <li
                    key={step.name}
                    className="flex flex-col rounded-2xl border border-line bg-surface/40 p-6"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-text">
                      {String(i + 1).padStart(2, "0")} · {t(step.role)}
                    </span>
                    <h4 className="mt-3 font-heading text-xl text-foreground">{step.name}</h4>
                    <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted">
                      {t(step.body)}
                    </p>
                  </li>
                ))}
              </ol>

              {p.practice && (
                <p className="mt-6 max-w-2xl border-l-2 border-ember/50 pl-5 text-pretty leading-relaxed text-muted">
                  {t(p.practice)}
                </p>
              )}
            </div>
          </Reveal>

          {/* Audience */}
          <Reveal>
            <p className="mt-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {t(p.audience)}
            </p>
          </Reveal>

          {/* Back into the graph */}
          {p.related.length > 0 && (
            <Reveal>
              <div className="mt-14">
                <SectionLabel>
                  {t({ en: "The science behind it", nl: "De wetenschap erachter" })}
                </SectionLabel>
                <p className="mb-6 max-w-2xl text-pretty leading-relaxed text-muted">
                  {t({
                    en: "Read the concepts this practice rests on — independent of any product.",
                    nl: "Lees de concepten waar deze praktijk op rust — los van welk product dan ook.",
                  })}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {p.related.map((slug) => {
                    const a = getArticle(slug)
                    if (!a) return null
                    return (
                      <Link
                        key={slug}
                        href={`/knowledge/${a.category}/${a.slug}`}
                        className="group flex min-w-0 flex-col rounded-2xl border border-line p-5 transition-colors hover:border-ember/40"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                          {getCategory(a.category)?.title}
                        </span>
                        <span className="mt-2 font-heading text-lg text-foreground">{a.title}</span>
                        <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                          {a.summary}
                        </span>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
                          {t({ en: "Read", nl: "Lezen" })}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {/* Independence note */}
          <Reveal>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-faint">
              {t({
                en: "Equilibrium is an open knowledge commons, not a shop. This profile describes a partner's own publicly stated method and product range; figures are theirs, not our measurements. Nothing here is a paid placement or an endorsement of a specific purchase.",
                nl: "Equilibrium is een open kennisplatform, geen winkel. Dit profiel beschrijft de eigen, publiek gepubliceerde methode en het assortiment van een partner; genoemde cijfers zijn van hen, niet onze metingen. Niets hiervan is een betaalde plaatsing of een aanbeveling om iets te kopen.",
              })}
            </p>
          </Reveal>
        </article>
      ))}

      {/* Become a partner */}
      <Reveal>
        <div className="mt-20 rounded-3xl border border-line bg-surface/40 p-8 sm:p-12">
          <Handshake className="h-7 w-7 text-ember-text" aria-hidden />
          <h2 className="mt-5 max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
            {t({ en: "Work this way? Join us.", nl: "Werk je zo? Sluit je aan." })}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {t({
              en: "We list organisations whose practice is evidence-led, ecologically honest and open about method. If that is you — a nursery, a landscape practice, a grower, a research group — tell us what you do and which part of the graph it touches.",
              nl: "We nemen organisaties op wier praktijk onderbouwd, ecologisch eerlijk en open over methode is. Ben jij dat — een kwekerij, een hoveniersbedrijf, een teler, een onderzoeksgroep — vertel ons wat je doet en welk deel van de graaf het raakt.",
            })}
          </p>
          <a
            href={`${GH_ISSUES}?labels=partner&title=${encodeURIComponent("Partner: ")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target mt-7 inline-flex items-center gap-2 rounded-full bg-gronn-green px-6 py-3 text-gronn-white transition-opacity hover:opacity-90"
          >
            {t({ en: "Propose a partner", nl: "Stel een partner voor" })}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  )
}

export default PartnersView

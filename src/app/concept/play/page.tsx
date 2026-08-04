import type { Metadata } from "next"

import { EcosystemHotspots } from "@/components/play/ecosystem-hotspots"
import { SuccessionTimeline } from "@/components/play/succession-timeline"
import { RegenerationSlider } from "@/components/play/regeneration-slider"
import { DomainsMarquee } from "@/components/play/domains-marquee"
import { KineticHeading } from "@/components/play/kinetic-heading"
import { PeekCard } from "@/components/play/peek-card"
import { Accordion } from "@/components/play/accordion"
import { Magnetic } from "@/components/motion/magnetic"
import { CountUp } from "@/components/motion/count-up"
import { Tilt } from "@/components/motion/tilt"
import { CursorCompanion } from "@/components/play/cursor-companion"
import { SectionLabel } from "@/components/ui/badges"
import { CATEGORIES, articlesInCategory, totalStats } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "Play — Interactive Concepts",
  description: "A sandbox of intuitive, interactive components for Equilibrium.",
  robots: { index: false, follow: false },
}

const FAQ = [
  { q: "What is a Field Story?", a: "A place-based, immersive account of regeneration in the real world — the science of a domain made tangible as a landscape you can walk through." },
  { q: "Is everything really free?", a: "Yes. All content is published under CC BY-SA 4.0 — free to read, share and adapt, forever, with attribution." },
  { q: "How do I contribute?", a: "Every page has an “Improve this page” link that opens the source on GitHub. Edit in Markdown, open a pull request, and it flows through peer review to publication." },
]

export default function PlayPage() {
  const stats = totalStats()
  const peekCats = CATEGORIES.slice(0, 3)

  return (
    <div className="pb-24 pt-28">
      {/* Scoped to this concept sandbox so production stays untouched. */}
      <CursorCompanion />
      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionLabel>Interactive sandbox</SectionLabel>
        <KineticHeading
          as="h1"
          text="Knowledge you can play with."
          className="max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98]"
        />
        <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
          A concept sandbox of intuitive, tactile components — hotspots, timelines, sliders and
          micro-delights — all inside Equilibrium&rsquo;s design system.
        </p>

        {/* Count-up stats + magnetic CTA */}
        <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-4">
          {[
            { k: "Articles", v: stats.articles },
            { k: "Domains", v: stats.categories },
            { k: "Connections", v: stats.connections },
          ].map((s) => (
            <div key={s.k}>
              <dt className="font-mono text-xs uppercase tracking-widest text-faint">{s.k}</dt>
              <dd className="font-heading text-4xl text-foreground">
                <CountUp to={s.v} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <Magnetic>
            <a
              href="/explore"
              data-cursor="Explore"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-on-accent"
            >
              A magnetic button
            </a>
          </Magnetic>
        </div>
      </section>

      {/* Domains marquee */}
      <section className="mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionLabel>Living ribbon · marquee</SectionLabel>
        </div>
        <div className="mt-6">
          <DomainsMarquee />
        </div>
      </section>

      {/* Ecosystem hotspots */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <SectionLabel>Explorable diagram · hotspots</SectionLabel>
        <h2 className="mb-8 max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
          The seven layers of a food forest.
        </h2>
        <EcosystemHotspots />
      </section>

      {/* Regeneration slider */}
      <section className="mx-auto mt-24 max-w-4xl px-4 sm:px-6">
        <SectionLabel>Before / after · drag</SectionLabel>
        <h2 className="mb-8 max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
          Drag to watch a landscape heal.
        </h2>
        <RegenerationSlider />
      </section>

      {/* Succession timeline */}
      <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
        <SectionLabel>Scroll-driven · timeline</SectionLabel>
        <h2 className="mb-12 max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
          How bare ground becomes forest.
        </h2>
        <SuccessionTimeline />
      </section>

      {/* Peek cards + tilt */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <SectionLabel>Hover to peek · tilt</SectionLabel>
        <h2 className="mb-8 max-w-2xl font-heading text-3xl text-foreground sm:text-4xl">
          Cards that show you what&rsquo;s inside.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {peekCats.map((c) => (
            <Tilt key={c.id} glare>
              <PeekCard
                category={c}
                articles={articlesInCategory(c.id).slice(0, 3).map((a) => ({ slug: a.slug, title: a.title }))}
              />
            </Tilt>
          ))}
        </div>
      </section>

      {/* Accordion */}
      <section className="mx-auto mt-24 max-w-3xl px-4 sm:px-6">
        <SectionLabel>Animated toggle · accordion</SectionLabel>
        <h2 className="mb-8 font-heading text-3xl text-foreground sm:text-4xl">Questions, answered.</h2>
        <Accordion items={FAQ} />
      </section>
    </div>
  )
}

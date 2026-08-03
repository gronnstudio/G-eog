import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { totalStats } from "@/lib/knowledge"

export const metadata: Metadata = {
  title: "About — Our Mission",
  description:
    "Equilibrium is a living knowledge ecosystem for regenerative thinking, and a side brand of GRØNN Studio. Read our mission, principles and licence.",
}

const PRINCIPLES = [
  "Everything is connected — no page is an island.",
  "Knowledge should behave like nature: interconnected, evolving, adaptive, open.",
  "Whitespace is a feature; clarity is a form of respect.",
  "Every animation has a purpose, or it does not exist.",
  "Free to read, free to fork, free forever.",
]

export default function AboutPage() {
  const stats = totalStats()
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel>The mission</SectionLabel>
      <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-6xl">
        Make humanity&rsquo;s ecological knowledge freely accessible, beautifully organized and
        endlessly connected.
      </h1>

      <div className="eog-prose mt-12">
        <p>
          Equilibrium is a living ecosystem of knowledge — not a blog, not documentation. It is the
          Wikipedia, GitHub, Notion and Obsidian of ecology, regenerative design, permaculture,
          biology, soil science, food forests, climate adaptation and systems thinking, gathered
          into a single connected whole.
        </p>
        <p>
          We believe knowledge should behave like nature: interconnected, evolving, adaptive,
          discoverable, beautiful and open. Every page should feel like discovering a hidden
          ecosystem — and every discovery should lead to the next.
        </p>

        <h2>A side brand of GRØNN Studio</h2>
        <p>
          Equilibrium is stewarded by{" "}
          <a href="https://gronn.studio">GRØNN Studio</a>, an ecological design practice. Where the
          studio designs living landscapes in the world, Equilibrium tends the knowledge that makes
          that work possible — and gives it away.
        </p>

        <h2>Principles</h2>
        <ul>
          {PRINCIPLES.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <h2 id="license">Licence</h2>
        <p>
          All content is published under{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons BY-SA 4.0</a>:
          free to share and adapt, with attribution, forever. The platform itself is open source on{" "}
          <a href="https://github.com/gronnstudio/g-eog">GitHub</a>.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { k: "Articles", v: stats.articles },
          { k: "Domains", v: stats.categories },
          { k: "Connections", v: stats.connections },
          { k: "Paths", v: stats.paths },
        ].map((s, i) => (
          <Reveal key={s.k} delay={i * 0.05}>
            <div className="rounded-2xl border border-line bg-surface/40 p-6 text-center">
              <p className="font-heading text-3xl text-foreground">{s.v}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-faint">{s.k}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/explore" className="rounded-full bg-accent px-6 py-3 font-medium text-on-accent transition-transform hover:scale-[1.02]">
          Enter the ecosystem
        </Link>
      </div>
    </div>
  )
}

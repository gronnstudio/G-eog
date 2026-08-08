import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"
import { totalStats } from "@/lib/knowledge"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = {
  title: "About — Our Mission",
  description:
    "Equilibrium is a living knowledge ecosystem for regenerative thinking, and a side brand of GRØNN Studio. Read our mission, principles and licence.",
}

const PRINCIPLES = ["abPrin1", "abPrin2", "abPrin3", "abPrin4", "abPrin5"] as const

export default function AboutPage() {
  const stats = totalStats()
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel><UIText k="abLabel" /></SectionLabel>
      <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-6xl">
        <UIText k="abHeadline" />
      </h1>

      <div className="eog-prose mt-12">
        <p>
          <UIText k="abP1" />
        </p>
        <p>
          <UIText k="abP2" />
        </p>

        <h2><UIText k="abSideBrand" /></h2>
        <p>
          <UIText k="abP3pre" />{" "}
          <a href="https://gronn.studio">GRØNN Studio</a>
          <UIText k="abP3post" />
        </p>

        <h2><UIText k="abPrinciples" /></h2>
        <ul>
          {PRINCIPLES.map((p) => (
            <li key={p}><UIText k={p} /></li>
          ))}
        </ul>

        <h2 id="license"><UIText k="abLicence" /></h2>
        <p>
          <UIText k="abLicPre" />{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons BY-SA 4.0</a>
          <UIText k="abLicMid" />{" "}
          <a href={BRAND.github}>GitHub</a>
          <UIText k="abLicPost" />
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            { k: "statArticles", v: stats.articles },
            { k: "statDomains", v: stats.categories },
            { k: "statConnections", v: stats.connections },
            { k: "abPaths", v: stats.paths },
          ] as const
        ).map((s, i) => (
          <Reveal key={s.k} delay={i * 0.05}>
            <div className="rounded-2xl border border-line bg-surface/40 p-6 text-center">
              <p className="font-heading text-3xl text-foreground">{s.v}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-faint"><UIText k={s.k} /></p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/explore" className="rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]">
          <UIText k="abEnter" />
        </Link>
      </div>
    </div>
  )
}

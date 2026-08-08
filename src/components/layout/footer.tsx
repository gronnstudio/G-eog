"use client"

import Link from "next/link"
import { GitBranch, Heart } from "lucide-react"

import { useUI } from "@/components/language-provider"
import { totalStats } from "@/lib/knowledge"
import type { UI } from "@/lib/i18n"

type UIKey = keyof typeof UI

// A link either resolves a UI dictionary key or carries a raw brand name
// that never translates (GRØNN Studio).
type FooterLink = { href: string; label?: UIKey; raw?: string }

const COLUMNS: { title: UIKey; links: FooterLink[] }[] = [
  {
    title: "nav_explore",
    links: [
      { href: "/explore", label: "ftKnowledgeGraph" },
      { href: "/knowledge", label: "allCategories" },
      { href: "/learn", label: "ftLearningPaths" },
      { href: "/community", label: "nav_community" },
    ],
  },
  {
    title: "contribute",
    links: [
      { href: "/community", label: "ftHowItWorks" },
      { href: "https://github.com/gronnstudio/g-eog", label: "ftViewGithub" },
      { href: "https://github.com/gronnstudio/g-eog/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22", label: "ftGoodFirstIssues" },
      { href: "/community#peer-review", label: "ftPeerReview" },
      { href: "/about", label: "ftOurMission" },
    ],
  },
  {
    title: "ftStudio",
    links: [
      { href: "https://gronn.studio", raw: "GRØNN Studio" },
      { href: "/about", label: "ftAboutEquilibrium" },
      { href: "/about#license", label: "ftOpenLicence" },
    ],
  },
]

export function Footer() {
  const stats = totalStats()
  const ui = useUI()
  const linkLabel = (l: FooterLink) => l.raw ?? ui(l.label as UIKey)
  return (
    <footer className="relative mt-32 border-t border-line pb-28 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-heading text-2xl text-foreground">Equilibrium</p>
            <p className="mt-3 max-w-xs text-pretty text-muted">{ui("ftTagline")}</p>
            <p className="mt-6 font-mono text-xs text-faint">
              {stats.articles} {ui("statArticles")} · {stats.categories} {ui("statDomains")} · {stats.connections} {ui("statConnections")}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">{ui(col.title)}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + (l.label ?? l.raw)}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                      {linkLabel(l)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-sm text-faint sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {ui("ftCopyright")}
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              {ui("ftBuiltWith")} <Heart className="h-3.5 w-3.5 text-rust" /> {ui("ftForBiosphere")}
            </span>
            <Link
              href="https://github.com/gronnstudio/g-eog"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GitBranch className="h-4 w-4" /> {ui("ftSource")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

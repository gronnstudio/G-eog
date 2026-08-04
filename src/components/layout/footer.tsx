import Link from "next/link"
import { GitBranch, Heart } from "lucide-react"

import { totalStats } from "@/lib/knowledge"

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/explore", label: "Knowledge Graph" },
      { href: "/knowledge", label: "All Categories" },
      { href: "/learn", label: "Learning Paths" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: "/community", label: "How it works" },
      { href: "https://github.com/gronnstudio/g-eog", label: "View on GitHub" },
      { href: "https://github.com/gronnstudio/g-eog/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22", label: "Good first issues" },
      { href: "/community#peer-review", label: "Peer review" },
      { href: "/about", label: "Our mission" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "https://gronn.studio", label: "GRØNN Studio" },
      { href: "/about", label: "About Equilibrium" },
      { href: "/about#license", label: "Open licence" },
    ],
  },
]

export function Footer() {
  const stats = totalStats()
  return (
    <footer className="relative mt-32 border-t border-line pb-28 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-heading text-2xl text-foreground">Equilibrium</p>
            <p className="mt-3 max-w-xs text-pretty text-muted">
              The world&rsquo;s living knowledge ecosystem for regenerative thinking. Free, open
              and endlessly connected.
            </p>
            <p className="mt-6 font-mono text-xs text-faint">
              {stats.articles} articles · {stats.categories} domains · {stats.connections} connections
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-sm text-faint sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Equilibrium — a side brand of GRØNN Studio. Content under
            CC BY-SA 4.0.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              Built with <Heart className="h-3.5 w-3.5 text-rust" /> for the biosphere
            </span>
            <Link
              href="https://github.com/gronnstudio/g-eog"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GitBranch className="h-4 w-4" /> Source
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

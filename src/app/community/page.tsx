import type { Metadata } from "next"
import Link from "next/link"
import {
  BadgeCheck,
  GitFork,
  GitPullRequest,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"

export const metadata: Metadata = {
  title: "Community — Contribute",
  description:
    "Equilibrium is open source and built in public. Learn how contributions flow from a first edit to peer review and expert verification.",
}

const GH = "https://github.com/gronnstudio/g-eog"

const STEPS = [
  { icon: GitFork, title: "Fork & edit", body: "Every article has an “Improve this page” link that opens the source in GitHub. Fix a typo, add a citation or write a whole new page in Markdown." },
  { icon: GitPullRequest, title: "Open a pull request", body: "Your change becomes a pull request. Automated checks validate frontmatter, citations and links before a human ever looks." },
  { icon: Users, title: "Peer review", body: "Contributors review each other's work in the open. Discussion happens on the PR, where anyone can weigh in." },
  { icon: BadgeCheck, title: "Expert verification", body: "Domain experts verify facts and sign off. Verified articles carry a mark of trust and enter the graph." },
]

const ROLES = [
  { role: "Reader", body: "Explore freely, save collections, take private notes." },
  { role: "Contributor", body: "Edit and write articles, suggest connections, open discussions." },
  { role: "Reviewer", body: "Review pull requests and shepherd contributions toward merge." },
  { role: "Expert", body: "Verify facts in your domain and sign off on accuracy." },
  { role: "Maintainer", body: "Steward a domain, resolve disputes and shape the roadmap." },
]

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel>Built in public</SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        Knowledge as a commons, tended by many hands.
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        Equilibrium belongs to everyone. It grows through the same open, version-controlled workflow
        that builds the world&rsquo;s best software — applied to the world&rsquo;s ecological knowledge.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={GH} className="rounded-full bg-accent px-6 py-3 font-medium text-on-accent transition-transform hover:scale-[1.02]">
          Start on GitHub
        </Link>
        <Link href="/about#license" className="rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2">
          Read the licence
        </Link>
      </div>

      {/* Flow */}
      <section id="peer-review" className="mt-20 scroll-mt-28">
        <SectionLabel>The contribution flow</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative h-full rounded-2xl border border-line bg-surface/40 p-6">
                <span className="absolute right-5 top-5 font-heading text-3xl text-line">{i + 1}</span>
                <s.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-heading text-xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mt-20">
        <SectionLabel>Roles in the ecosystem</SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-line">
          {ROLES.map((r, i) => (
            <div
              key={r.role}
              className={`flex flex-col gap-1 p-6 sm:flex-row sm:items-center sm:gap-8 ${
                i !== ROLES.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <p className="w-40 shrink-0 font-heading text-xl text-foreground">{r.role}</p>
              <p className="text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Every page has */}
      <section className="mt-20">
        <SectionLabel>Every page carries</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: GitPullRequest, label: "Improve this page" },
            { icon: ScrollText, label: "View source" },
            { icon: MessageSquare, label: "Discussion" },
            { icon: Users, label: "Contributors" },
            { icon: BadgeCheck, label: "Version history" },
          ].map((x) => (
            <span key={x.label} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
              <x.icon className="h-4 w-4 text-accent" /> {x.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

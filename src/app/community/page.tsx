import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Check,
  GitFork,
  GitPullRequest,
  MessageSquare,
  PencilLine,
  ScrollText,
  Sprout,
  Users,
} from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { SectionLabel } from "@/components/ui/badges"
import { UIText } from "@/components/ui/ui-text"

export const metadata: Metadata = {
  title: "Community — Contribute",
  description:
    "Equilibrium is open source and built in public. Learn how contributions flow from a first edit to peer review and expert verification.",
}

const GH = "https://github.com/gronnstudio/g-eog"

const STEPS = [
  { icon: GitFork, title: "comStep1t", body: "comStep1b" },
  { icon: GitPullRequest, title: "comStep2t", body: "comStep2b" },
  { icon: Users, title: "comStep3t", body: "comStep3b" },
  { icon: BadgeCheck, title: "comStep4t", body: "comStep4b" },
] as const

const START = [
  { icon: PencilLine, title: "comStart1t", body: "comStart1b", href: GH },
  {
    icon: Sprout,
    title: "comStart2t",
    body: "comStart2b",
    href: `${GH}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
  },
  { icon: MessageSquare, title: "comStart3t", body: "comStart3b", href: `${GH}/discussions` },
  { icon: BookOpen, title: "comStart4t", body: "comStart4b", href: `${GH}/blob/main/CONTRIBUTING.md` },
] as const

const CHECKLIST = [
  "comCheck1",
  "comCheck2",
  "comCheck3",
  "comCheck4",
  "comCheck5",
  "comCheck6",
] as const

const ROLES = [
  { role: "comRole1", body: "comRole1b" },
  { role: "comRole2", body: "comRole2b" },
  { role: "comRole3", body: "comRole3b" },
  { role: "comRole4", body: "comRole4b" },
  { role: "comRole5", body: "comRole5b" },
] as const

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <SectionLabel><UIText k="comLabel" /></SectionLabel>
      <h1 className="max-w-3xl font-heading text-4xl text-foreground sm:text-6xl">
        <UIText k="comHeadline" />
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        <UIText k="comBody" />
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={GH} className="rounded-full bg-gronn-green px-6 py-3 font-medium text-gronn-white transition-transform hover:scale-[1.02]">
          <UIText k="comStartGitHub" />
        </Link>
        <Link href="/about#license" className="rounded-full border border-line px-6 py-3 font-medium text-foreground transition-colors hover:bg-surface-2">
          <UIText k="comReadLicence" />
        </Link>
      </div>

      {/* Flow */}
      <section id="peer-review" className="mt-20 scroll-mt-28">
        <SectionLabel><UIText k="comFlow" /></SectionLabel>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative h-full rounded-2xl border border-line bg-surface/40 p-6">
                <span className="absolute right-5 top-5 font-heading text-3xl text-line">{i + 1}</span>
                <s.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-heading text-xl text-foreground"><UIText k={s.title} /></h3>
                <p className="mt-2 text-sm leading-relaxed text-muted"><UIText k={s.body} /></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Where to start */}
      <section id="where-to-start" className="mt-20 scroll-mt-28">
        <Reveal>
          <SectionLabel><UIText k="comWhereStart" /></SectionLabel>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {START.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface/40 p-6 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-start justify-between">
                  <s.icon className="h-6 w-6 text-accent" />
                  <ArrowUpRight className="h-5 w-5 text-faint transition-colors group-hover:text-foreground" />
                </div>
                <h3 className="mt-4 font-heading text-xl text-foreground"><UIText k={s.title} /></h3>
                <p className="mt-2 text-sm leading-relaxed text-muted"><UIText k={s.body} /></p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What makes a good article */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel><UIText k="comGood" /></SectionLabel>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
            <p className="max-w-xl text-pretty text-muted">
              <UIText k="comGoodIntro" />
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm leading-relaxed"><UIText k={item} /></span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Roles */}
      <section className="mt-20">
        <SectionLabel><UIText k="comRoles" /></SectionLabel>
        <div className="overflow-hidden rounded-2xl border border-line">
          {ROLES.map((r, i) => (
            <div
              key={r.role}
              className={`flex flex-col gap-1 p-6 sm:flex-row sm:items-center sm:gap-8 ${
                i !== ROLES.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <p className="w-40 shrink-0 font-heading text-xl text-foreground"><UIText k={r.role} /></p>
              <p className="text-muted"><UIText k={r.body} /></p>
            </div>
          ))}
        </div>
      </section>

      {/* Every page has */}
      <section className="mt-20">
        <SectionLabel><UIText k="comEveryPage" /></SectionLabel>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { icon: GitPullRequest, label: "artImprove" },
              { icon: ScrollText, label: "artViewSource" },
              { icon: MessageSquare, label: "artDiscussion" },
              { icon: Users, label: "artContributors" },
              { icon: BadgeCheck, label: "artHistory" },
            ] as const
          ).map((x) => (
            <span key={x.label} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
              <x.icon className="h-4 w-4 text-accent" /> <UIText k={x.label} />
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

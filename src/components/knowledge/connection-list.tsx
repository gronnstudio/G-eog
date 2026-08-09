"use client"

import Link from "next/link"
import { ArrowRight, ArrowLeft, Waypoints } from "lucide-react"

import { useT } from "@/components/language-provider"
import { getCategory, RELATIONSHIP_LABEL } from "@/lib/knowledge"
import { EVIDENCE_LABEL, EVIDENCE_TONE } from "@/lib/knowledge/evidence-ui"
import type { Article, EvidenceLevel, Relationship } from "@/lib/knowledge"
import { cn } from "@/lib/utils"

export interface Connection {
  relationship: Relationship
  other: Article
  inbound: boolean
}

/**
 * The typed connections of an article, rendered as sentences rather than a
 * wall of cards. Each row reads subject–verb–object in the direction the
 * edge was authored, so the meaning survives: "this enables X" and
 * "X enables this" are different claims and are shown as such.
 */
export function ConnectionList({
  title,
  connections,
  traceHref,
}: {
  title: string
  connections: Connection[]
  /** Deep link into the graph browser focused on this node. */
  traceHref?: string
}) {
  const t = useT()
  if (connections.length === 0) return null

  const evidenceLabel = (level: EvidenceLevel) => t(EVIDENCE_LABEL[level])

  return (
    <section className="border-t border-line bg-surface/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-faint">
          {t({ en: "Why these connect", nl: "Waarom deze samenhangen" })}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl text-foreground">{title}</h2>
          {traceHref && (
            <Link
              href={traceHref}
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Waypoints className="h-4 w-4" aria-hidden />
              {t({ en: "Trace these in the graph", nl: "Volg deze in de graaf" })}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <ul className="mt-8 grid gap-3 lg:grid-cols-2">
          {connections.map(({ relationship, other, inbound }) => {
            const cat = getCategory(other.category)
            const verb = RELATIONSHIP_LABEL[relationship.type]
            return (
              <li key={`${relationship.source}-${relationship.target}`}>
                <Link
                  href={`/knowledge/${other.category}/${other.slug}`}
                  className="group flex h-full min-w-0 flex-col rounded-2xl border border-line bg-surface/40 p-5 transition-colors hover:border-ember/40"
                >
                  {/* The claim, as a sentence */}
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-pretty">
                    {inbound ? (
                      <>
                        <span className="font-heading text-lg text-foreground">
                          {other.title}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ember-text">
                          {verb}
                        </span>
                        <span className="text-lg text-muted">
                          {t({ en: "this", nl: "dit" })}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg text-muted">
                          {t({ en: "This", nl: "Dit" })}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ember-text">
                          {verb}
                        </span>
                        <span className="font-heading text-lg text-foreground">
                          {other.title}
                        </span>
                      </>
                    )}
                  </p>

                  <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted">
                    {relationship.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                        EVIDENCE_TONE[relationship.evidence],
                      )}
                    >
                      {evidenceLabel(relationship.evidence)}
                    </span>
                    {cat && (
                      <span
                        className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: `hsl(${cat.hue} 45% 60%)` }}
                      >
                        {cat.title}
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-accent">
                      {t({ en: "Read", nl: "Lezen" })}
                      {inbound ? (
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      ) : (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default ConnectionList

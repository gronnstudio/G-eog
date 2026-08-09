"use client"

import { useT } from "@/components/language-provider"
import { EVIDENCE_LABEL, EVIDENCE_TONE } from "@/lib/knowledge/evidence-ui"
import type { EvidenceLevel } from "@/lib/knowledge"
import { cn } from "@/lib/utils"

/**
 * The "knowledge DNA" of a node: its structured metadata as data, in one
 * place. The same facts used to be scattered between the header meta strip
 * and the rail; here they read as a record — type, domain, how connected
 * the node is, how well sourced, and how its evidence is distributed —
 * so the trustworthiness of a page is visible before a word of it is read.
 */
export interface DnaFacts {
  type: string
  domain: string
  relationships: number
  sources: number
  /** Count of edges per evidence level, zeros omitted. */
  evidence: Partial<Record<EvidenceLevel, number>>
  updated: string
}

const ORDER: EvidenceLevel[] = [
  "strong",
  "moderate",
  "emerging",
  "limited",
  "contested",
  "hypothesis",
]

export function DnaPanel({ facts }: { facts: DnaFacts }) {
  const t = useT()

  const rows: Array<[string, string]> = [
    [t({ en: "Type", nl: "Type" }), facts.type],
    [t({ en: "Domain", nl: "Domein" }), facts.domain],
    [t({ en: "Relationships", nl: "Relaties" }), String(facts.relationships)],
    [t({ en: "Sources", nl: "Bronnen" }), String(facts.sources)],
    [t({ en: "Updated", nl: "Bijgewerkt" }), facts.updated],
  ]

  const evidence = ORDER.filter((l) => (facts.evidence[l] ?? 0) > 0)

  return (
    <div className="rounded-2xl border border-line bg-surface/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
        {t({ en: "Knowledge DNA", nl: "Kennis-DNA" })}
      </p>
      <dl className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
              {label}
            </dt>
            <dd className="text-right text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      {evidence.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
            {t({ en: "Evidence", nl: "Bewijs" })}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {evidence.map((level) => (
              <span
                key={level}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  EVIDENCE_TONE[level],
                )}
              >
                {t(EVIDENCE_LABEL[level])} · {facts.evidence[level]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DnaPanel

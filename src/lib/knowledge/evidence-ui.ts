import type { EvidenceLevel } from "./types"

/**
 * How confident the graph is in a given edge, as chip classes. Colour
 * carries the same information as the word so it reads at a glance without
 * relying on colour alone. Shared by every surface that shows an evidence
 * chip — the tones drifting apart between views would quietly break the
 * one visual vocabulary the evidence system has.
 */
export const EVIDENCE_TONE: Record<EvidenceLevel, string> = {
  strong: "border-gronn-green/40 text-gronn-green",
  moderate: "border-accent/40 text-accent",
  emerging: "border-ember/40 text-ember-text",
  limited: "border-line text-faint",
  contested: "border-ember/60 text-ember-text",
  hypothesis: "border-line text-faint",
}

/** English + Dutch labels; pass through useT at the call site. */
export const EVIDENCE_LABEL: Record<EvidenceLevel, { en: string; nl: string }> = {
  strong: { en: "Strong", nl: "Sterk" },
  moderate: { en: "Moderate", nl: "Redelijk" },
  emerging: { en: "Emerging", nl: "Opkomend" },
  limited: { en: "Limited", nl: "Beperkt" },
  contested: { en: "Contested", nl: "Omstreden" },
  hypothesis: { en: "Hypothesis", nl: "Hypothese" },
}

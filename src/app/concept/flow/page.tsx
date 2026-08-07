import type { Metadata } from "next"

import { FlowCore } from "@/components/home/flow-core"
import { SectionLabel } from "@/components/ui/badges"

export const metadata: Metadata = {
  title: "Light Through the Network — Concept",
  description: "Conduit 3D concept: light pulses travelling a living network.",
  robots: { index: false, follow: false },
}

/**
 * Concept preview of the conduit 3D scene (Cerebrium-style light paths).
 * Removed from the live home page; parked here — hidden from indexing
 * and nav — so the motion can be felt and art-directed. The scene is
 * scroll-driven, so this page provides tall scroll room; desktop
 * landscape only (the component's own gate).
 */
export default function FlowConceptPage() {
  return (
    <>
      <FlowCore />
      <section className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 pt-28 sm:px-6">
        <SectionLabel>Concept — light through the network</SectionLabel>
        <h1 className="max-w-3xl font-heading text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.02] text-foreground sm:leading-[0.98]">
          Knowledge flows where things connect.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
          Scroll — the pulses quicken and thicken as the page&apos;s story
          completes. Desktop landscape only.
        </p>
      </section>
      {/* scroll room so the flow choreography can be felt */}
      <div className="h-[240svh]" aria-hidden="true" />
    </>
  )
}

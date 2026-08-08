import type { Metadata } from "next"

import { ContributeWizard } from "@/components/community/contribute-wizard"

export const metadata: Metadata = {
  title: "Contribute — Propose a contribution",
  description:
    "Propose a new article, an improvement, a translation or a source suggestion for the Equilibrium knowledge ecosystem — the wizard drafts a ready-to-file GitHub issue for you.",
}

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <h1 className="max-w-2xl font-heading text-4xl text-foreground sm:text-6xl">Contribute</h1>
      <p className="mt-6 max-w-xl text-pretty text-lg text-muted">
        Three quick steps and the wizard drafts a well-structured GitHub issue for you — no
        account setup, no backend, just a proposal ready for the community to grow.
      </p>
      <div className="mt-10">
        <ContributeWizard />
      </div>
    </div>
  )
}

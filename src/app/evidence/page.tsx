import type { Metadata } from "next"

import { EvidenceView } from "@/components/evidence/evidence-view"

export const metadata: Metadata = {
  title: "Evidence — every source behind the knowledge",
  description:
    "The full bibliography of the knowledge base: every source, what cites it, and whether it carries a verified DOI or link.",
}

export default function EvidencePage() {
  return <EvidenceView />
}

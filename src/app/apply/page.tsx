import type { Metadata } from "next"

import { ApplyView } from "@/components/apply/apply-view"

export const metadata: Metadata = {
  title: "Apply — knowledge, put to work",
  description:
    "Where the knowledge graph meets ground: what to do this month, the practitioners already doing it, and how to contribute what you learn.",
}

export default function ApplyPage() {
  return <ApplyView />
}

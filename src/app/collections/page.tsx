import type { Metadata } from "next"

import { CollectionsView } from "@/components/collections/collections-view"

export const metadata: Metadata = {
  title: "Collections — Knowledge With a Purpose",
  description:
    "Ordered routes through the knowledge base: project plans, field guides and curated sequences that reference existing articles rather than duplicating them.",
}

export default function CollectionsPage() {
  return <CollectionsView />
}

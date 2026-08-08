import type { Metadata } from "next"

import { SeasonalView } from "@/components/seasonal/seasonal-view"

export const metadata: Metadata = {
  title: "Seasonal — what to do now",
  description:
    "The living calendar: what to do in the garden and landscape this month, for a Western-European climate — linked into the knowledge graph.",
}

export default function SeasonalPage() {
  return <SeasonalView />
}

import type { Metadata } from "next"

import { PartnersView } from "@/components/partners/partners-view"

export const metadata: Metadata = {
  title: "Partners — knowledge in practice",
  description:
    "Organisations applying ecological knowledge on real ground: their methods, the science behind them, and the concepts in our graph that explain the work.",
}

export default function PartnersPage() {
  return <PartnersView />
}

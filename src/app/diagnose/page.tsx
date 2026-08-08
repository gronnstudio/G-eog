import type { Metadata } from "next"

import { DiagnoseView } from "@/components/diagnose/diagnose-view"

export const metadata: Metadata = {
  title: "Ask the graph — what's going wrong?",
  description:
    "Describe a problem in your garden or landscape and get the mechanisms this knowledge base documents, with evidence levels and the concepts behind them.",
}

export default function DiagnosePage() {
  return <DiagnoseView />
}

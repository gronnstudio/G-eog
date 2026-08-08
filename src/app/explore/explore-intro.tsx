"use client"

import { useUI } from "@/components/language-provider"

/** Localized intro line with the live graph stats substituted in. */
export function ExploreIntro({
  articles,
  connections,
  categories,
}: {
  articles: number
  connections: number
  categories: number
}) {
  const ui = useUI()
  const text = ui("expBody")
    .replace("{articles}", String(articles))
    .replace("{connections}", String(connections))
    .replace("{categories}", String(categories))
  return <p className="max-w-sm text-pretty text-muted">{text}</p>
}

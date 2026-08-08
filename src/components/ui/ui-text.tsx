"use client"

import { useUI } from "@/components/language-provider"
import type { UI } from "@/lib/i18n"

/**
 * Tiny client leaf that resolves a UI-dictionary key in the current
 * locale, so server-rendered pages can localize static strings without
 * becoming client components themselves.
 */
export function UIText({ k }: { k: keyof typeof UI }) {
  const ui = useUI()
  return <>{ui(k)}</>
}

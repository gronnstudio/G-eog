"use client"

import { useEffect } from "react"

import { recordVisit } from "@/lib/pins"

/** Notes an article visit into the on-device history. Renders nothing. */
export function RecordVisit({ slug }: { slug: string }) {
  useEffect(() => {
    recordVisit(slug)
  }, [slug])
  return null
}

export default RecordVisit

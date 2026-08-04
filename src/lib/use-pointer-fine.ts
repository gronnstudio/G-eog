"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(pointer: fine)"

/**
 * True on fine-pointer (mouse/trackpad) devices. Read tearing-free via
 * useSyncExternalStore — server and first client render return false, so
 * hover-only affordances (magnetic, tilt, cursor companion, word drift)
 * never activate on touch and never trigger a setState-in-effect.
 */
export function usePointerFine(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(QUERY)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

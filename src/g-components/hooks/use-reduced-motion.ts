"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

// SSR-safe prefers-reduced-motion. Previously duplicated verbatim as
// gronn-studio's use-reduced-motion.ts and equilibrium's
// usePrefersReducedMotion.ts — this is now the single copy.
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

// Alias for equilibrium call sites.
export const usePrefersReducedMotion = useReducedMotion

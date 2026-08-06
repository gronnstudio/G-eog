"use client"

// Shared implementation lives in the vendored G-components library.
// Keeps G-eog's expo easing; gains live reduced-motion reactivity and
// the typed window.__lenis contract.
import { SmoothScroll as GSmoothScroll } from "@/g-components/lenis"

const EASE_EXPO = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

export function SmoothScroll() {
  return <GSmoothScroll easing={EASE_EXPO} />
}

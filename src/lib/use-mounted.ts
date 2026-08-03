import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * True only after hydration. Uses useSyncExternalStore so the value is
 * `false` on the server and during the first client render, then `true`
 * afterwards — the correct, tearing-free way to gate client-only UI
 * (theme icons, portals) without a setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

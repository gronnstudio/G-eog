"use client"

import { useEffect, useRef, type RefObject } from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Focus containment for the site's overlay dialogs (curtain menu, dock
// sheet). While `active`: Tab wraps inside the container, Escape calls
// `onEscape`, and elements under an [inert] ancestor don't count. On
// deactivate, focus returns to wherever it was before the dialog opened
// — the trigger button, per the ARIA dialog pattern.
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void
) {
  // Latest onEscape without re-running the trap effect per render.
  const escapeRef = useRef(onEscape)
  useEffect(() => {
    escapeRef.current = onEscape
  }, [onEscape])

  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null

    const focusables = () => {
      const root = ref.current
      if (!root) return []
      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest("[inert]") && el.offsetParent !== null
      )
    }

    // If opening left focus outside the dialog, move it to the first
    // control inside (the trigger usually already sits inside the trap).
    const root = ref.current
    if (root && !root.contains(document.activeElement)) {
      focusables()[0]?.focus()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        escapeRef.current?.()
        return
      }
      if (e.key !== "Tab") return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement as HTMLElement | null
      if (e.shiftKey && (current === first || !ref.current?.contains(current))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (current === last || !ref.current?.contains(current))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown, true)
    return () => {
      document.removeEventListener("keydown", onKeyDown, true)
      // Restore focus to the opener; guard against it having unmounted.
      if (previous && document.contains(previous)) previous.focus()
    }
  }, [ref, active])
}

"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Whether an element is anywhere near the viewport. Used to pause
 * infinite animations (CSS drift loops, canvas simulations) while their
 * section is scrolled away — they burn main-thread and compositor time
 * even when invisible, which is what dragged mobile scrolling down.
 */
export function useOnScreen<T extends Element>(margin = "160px") {
  const ref = useRef<T | null>(null)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: margin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return { ref, onScreen }
}

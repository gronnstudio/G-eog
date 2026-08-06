"use client"

import { useEffect } from "react"

// Registers the service worker: instant repeat opens for the installed
// app and an offline fallback page. Production only — a worker caching
// dev assets makes local work maddening.
export function RegisterSW({ path = "/sw.js" }: { path?: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    // Wait for load so registration never competes with first paint
    // (G-eog's refinement, folded upstream).
    const register = () =>
      navigator.serviceWorker.register(path).catch(() => {
        // Registration failing (old browser, private mode) just means
        // the site behaves as it always has.
      })
    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [path])
  return null
}

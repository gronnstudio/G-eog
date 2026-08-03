"use client"

import { useEffect } from "react"

/** Registers the PWA service worker once the page is idle. */
export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {})
    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [])
  return null
}

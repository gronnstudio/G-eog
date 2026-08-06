"use client"

import { useEffect, useRef, useState } from "react"

import { isStandalone } from "./use-standalone"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export type InstallPromptMode = "ios" | "android" | "menu" | null

// Headless PWA install hint, extracted from the byte-identical logic
// halves of gronn-studio's install-prompt.tsx and equilibrium's
// InstallPrompt.tsx. Android gets a real one-tap install via
// beforeinstallprompt; iOS Safari has no install API, so it reports
// "ios" (share → add-to-home-screen instruction); everything else falls
// back to "menu". Never activates when already running standalone or on
// fine-pointer devices; dismissal is remembered in localStorage.
//
// Each app keeps its own presentational shell — this hook only returns
// { mode, install, dismiss }.
export function useInstallPrompt({
  storageKey,
  dismissDays = 14,
  fallbackDelay = 7000,
}: {
  storageKey: string
  dismissDays?: number
  fallbackDelay?: number
}) {
  const [mode, setMode] = useState<InstallPromptMode>(null)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone()) return

    try {
      const dismissed = localStorage.getItem(storageKey)
      if (
        dismissed &&
        Date.now() - Number(dismissed) < dismissDays * 24 * 60 * 60 * 1000
      )
        return
    } catch {
      /* private mode — just show it */
    }

    // phones and tablets only
    if (!window.matchMedia("(pointer: coarse)").matches) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
      setMode("android")
    }
    window.addEventListener("beforeinstallprompt", onPrompt)

    // iPhone/iPod report themselves; iPadOS masquerades as a Mac with touch
    const ua = navigator.userAgent
    const isIOS =
      /iphone|ipad|ipod/i.test(ua) ||
      (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)

    // guaranteed fallback: if no install event fires within fallbackDelay,
    // show the platform's manual instruction instead of staying silent
    const timer = setTimeout(() => {
      setMode((current) => current ?? (isIOS ? "ios" : "menu"))
    }, fallbackDelay)

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      clearTimeout(timer)
    }
  }, [storageKey, dismissDays, fallbackDelay])

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, String(Date.now()))
    } catch {
      /* fine */
    }
    setMode(null)
  }

  const install = async () => {
    const event = deferred.current
    if (!event) return
    await event.prompt()
    await event.userChoice
    // Record the interaction either way so an accepted-but-not-launched
    // install doesn't re-prompt on the next visit.
    dismiss()
  }

  return { mode, install, dismiss }
}

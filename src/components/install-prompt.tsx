"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { useUI } from "@/components/language-provider"
import { EASE_ORGANIC } from "@/lib/motion"

const DISMISS_KEY = "eog-install-dismissed"
const DISMISS_DAYS = 14

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

/**
 * Mobile-only install hint, ported from GRØNN Studio. Android captures
 * beforeinstallprompt and offers a real one-tap install; iOS Safari has no
 * install API, so it shows the share → add-to-home-screen instruction
 * instead. Never shows when already running as an installed app; dismissal
 * is remembered for 14 days.
 */
export function InstallPrompt() {
  const ui = useUI()
  const [mode, setMode] = useState<"ios" | "android" | "menu" | null>(null)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari's non-standard flag
      (navigator as unknown as { standalone?: boolean }).standalone
    if (standalone) return

    try {
      const dismissed = localStorage.getItem(DISMISS_KEY)
      if (
        dismissed &&
        Date.now() - Number(dismissed) < DISMISS_DAYS * 24 * 60 * 60 * 1000
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

    // Guaranteed fallback: after 7s, if no install event has fired, show
    // the platform's manual instruction rather than staying silent.
    const timer = window.setTimeout(() => {
      setMode((current) => current ?? (isIOS ? "ios" : "menu"))
    }, 7000)

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* fine */
    }
    setMode(null)
  }

  const install = async () => {
    const evt = deferred.current
    if (!evt) return dismiss()
    await evt.prompt()
    await evt.userChoice
    dismiss()
  }

  return (
    <AnimatePresence>
      {mode && (
        <motion.aside
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_ORGANIC }}
          className="fixed inset-x-3 bottom-24 z-[88] pb-[env(safe-area-inset-bottom)] md:hidden"
          role="dialog"
          aria-label={ui("pwaInstallAria")}
        >
          <div className="eog-glass flex items-center gap-4 rounded-2xl border border-line p-4 shadow-float">
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={44}
              height={44}
              className="shrink-0 rounded-xl"
              unoptimized
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {ui("pwaTitle")}
              </p>
              {mode === "ios" ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {ui("pwaTapThe")} <span className="text-ember-text">{ui("pwaShare")}</span>{" "}
                  {ui("pwaIosMid")} <span className="text-ember-text">{ui("pwaA2HS")}</span>{" "}
                  {ui("pwaOpensLikeApp")}
                </p>
              ) : mode === "menu" ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {ui("pwaOpenMenu")} <span className="text-ember-text">{ui("pwaMenuGlyph")}</span>{" "}
                  {ui("pwaMenuMid")} <span className="text-ember-text">{ui("pwaA2HS")}</span>{" "}
                  {ui("pwaOpensLikeApp")}
                </p>
              ) : (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {ui("pwaAndroidBody")}
                </p>
              )}
            </div>
            {mode === "android" && (
              <button
                type="button"
                onClick={install}
                className="shrink-0 rounded-full bg-ember-strong px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white"
              >
                {ui("pwaInstall")}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label={ui("pwaDismiss")}
              className="shrink-0 self-start text-faint transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default InstallPrompt

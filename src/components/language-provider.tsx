"use client"

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  DEFAULT_LOCALE,
  LOCALE_KEY,
  isLocale,
  pick,
  type L,
  type Locale,
} from "@/lib/i18n"

// The locale lives in localStorage (external mutable state), so it is
// read through useSyncExternalStore rather than copied into React state
// inside an effect — same pattern as the theme-mode provider.
const listeners = new Set<() => void>()

const subscribe = (onChange: () => void) => {
  listeners.add(onChange)
  // `storage` covers other tabs; the local set is for this one.
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

const getSnapshot = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

const getServerSnapshot = (): Locale => DEFAULT_LOCALE

const LanguageContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
}>({ locale: DEFAULT_LOCALE, setLocale: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem(LOCALE_KEY, next)
    } catch {}
    document.documentElement.lang = next
    listeners.forEach((notify) => notify())
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

/** Resolve a Localized string in the current locale: const t = useT() */
export function useT() {
  const { locale } = useContext(LanguageContext)
  return useCallback((l: L) => pick(l, locale), [locale])
}

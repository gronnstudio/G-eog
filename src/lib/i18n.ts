// Bilingual interface strings, mirrored from the GRØNN base: every
// user-facing chrome string is a Localized pair. Equilibrium v1 keeps the
// locale as a client-side preference (localStorage) and localizes the
// interface chrome; URL-based locales for the content tree are on the
// roadmap (docs/10-seo-strategy.md).
export type Locale = "en" | "nl"

export type L = { en: string; nl: string }

export const LOCALES: { locale: Locale; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "nl", name: "Nederlands" },
]

export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_KEY = "eog-locale"

export function pick(l: L, locale: Locale): string {
  return l[locale]
}

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "nl"
}

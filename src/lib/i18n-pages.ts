import type { L } from "./i18n"

/**
 * UI strings for the inner pages: /knowledge, /learn, /explore,
 * /community, article pages, not-found, offline. Kept in its own
 * module so localization sweeps don't collide in i18n.ts; merged into
 * the UI dictionary there.
 */
export const UI_PAGES = {
  // filled by the pages localization sweep
} satisfies Record<string, L>

import type { L } from "./i18n"

/**
 * UI strings for the site chrome: footer, mobile dock, header menu,
 * command palette, install prompt, theme picker, offline/PWA notices.
 * Kept in its own module so localization sweeps don't collide in
 * i18n.ts; merged into the UI dictionary there.
 */
export const UI_CHROME = {
  // filled by the chrome localization sweep
} satisfies Record<string, L>

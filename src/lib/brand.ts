/**
 * The single source of truth for who this product is.
 *
 * The name is a working codename, not a settled brand — naming and domain
 * research is still open. So nothing else in the codebase may hardcode a
 * product name, domain, repository URL or handle: everything reads from
 * here, and a rename becomes an edit to this file rather than a sweep
 * across the tree.
 *
 * The rule for anything added later: if a string identifies the product
 * rather than describing the content, it belongs in this object.
 */
export const BRAND = {
  /** Full product name, as written in prose and page titles. */
  name: "Equilibrium",
  /** Compact form for tight chrome — docks, badges, tab titles. */
  shortName: "Equilibrium",
  /** One line, used in metadata and the footer. */
  tagline: "Ecological Intelligence · Structured",
  /** Sentence-length description for metadata and Open Graph. */
  description:
    "The world's living knowledge ecosystem for regenerative thinking. Free, open and endlessly connected.",
  /** Canonical origin, no trailing slash. Used for canonical URLs, sitemap, feed. */
  url: "https://equilibrium.gronn.studio",
  /** Public source repository. */
  github: "https://github.com/gronnstudio/g-eog",
  /** Parent studio. */
  parent: {
    name: "GRØNN Studio",
    url: "https://gronn.studio",
  },
  /** Content licence for the knowledge commons (code is licensed separately). */
  licence: "CC BY-SA 4.0",
} as const

/** Absolute URL for a site-relative path — `path` should start with "/". */
export function absoluteUrl(path = ""): string {
  return `${BRAND.url}${path}`
}

/** URL into the source repository, e.g. repoUrl("blob/main/docs/SOURCES.md"). */
export function repoUrl(path = ""): string {
  return path ? `${BRAND.github}/${path}` : BRAND.github
}

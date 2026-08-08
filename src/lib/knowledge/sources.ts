import { ARTICLES } from "./articles"
import type { Article, Citation } from "./types"

/**
 * Sources as first-class entities.
 *
 * Citations were authored inline on each article as author/year/title/source
 * text. That reads fine and verifies nothing: the same paper appeared under
 * several ids, and not one reference carried a DOI or URL, so a reader could
 * not follow a single one out of the site.
 *
 * This registry derives a deduplicated source list from those citations and
 * overlays verified identifiers. Deriving rather than rewriting keeps the
 * article files untouched while making sources queryable — the first step of
 * the migration, not the last.
 *
 * The rule for IDENTIFIERS below: an entry is added only when the DOI has
 * been checked against the publisher record. A wrong DOI is worse than no
 * DOI — it points a reader confidently at the wrong paper — so unresolved
 * sources stay visibly unresolved and are surfaced as contributable work.
 */

export type SourceType = "paper" | "book" | "report" | "institutional"

export interface Source {
  /** Stable key: lowercased first author + year + title slug fragment. */
  id: string
  title: string
  authors: string
  year: number
  /** Journal, publisher or issuing body, as cited. */
  publication: string
  type: SourceType
  /** Verified against the publisher record. Absent means not yet resolved. */
  doi?: string
  /** Canonical landing page, for sources without a DOI. */
  url?: string
  /** Slugs of the articles citing this source. */
  citedBy: string[]
}

/**
 * Verified identifiers, keyed by source id. Every entry here was checked
 * against the publisher record; anything unverified is deliberately absent
 * rather than guessed.
 */
const IDENTIFIERS: Record<string, { doi?: string; url?: string }> = {
  "simard-1997-net-transfer-of-carbon": { doi: "10.1038/41557" },
  "rockstrom-2009-a-safe-operating-space": { doi: "10.1038/461472a" },
  "ulrich-1984-view-through-a-window": { doi: "10.1126/science.6143402" },
  "lal-2004-soil-carbon-sequestration-impacts": { doi: "10.1126/science.1097396" },
  "estes-2011-trophic-downgrading-of-planet": { doi: "10.1126/science.1205106" },
  "ollerton-2011-how-many-flowering-plants": { doi: "10.1111/j.1600-0706.2010.18644.x" },
}

/** Journals cite volumes; books and bodies don't. Used to classify sources. */
function classify(publication: string, authors: string): SourceType {
  const p = publication.toLowerCase()
  if (/\d$/.test(publication.trim())) return "paper"
  if (/journal|science|nature|oikos|proceedings|inquiry|bioscience|naturalist/.test(p))
    return "paper"
  if (/^(ipcc|fao|usda)\b/i.test(authors) || /foundation|organization|service|panel/.test(p))
    return "report"
  if (/press|publishing|books|knopf|norton|picador|wiley|lane|cape|smith/.test(p))
    return "book"
  return "institutional"
}

/** Stable id from a citation — first author surname + year + title stem. */
function sourceId(c: Citation): string {
  const surname = c.authors
    .split(/[,&(]/)[0]
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "")
  const stem = c.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join("-")
  return `${surname}-${c.year}-${stem}`
}

function build(): Source[] {
  const map = new Map<string, Source>()
  for (const article of ARTICLES as Article[]) {
    for (const c of article.citations) {
      const id = sourceId(c)
      const existing = map.get(id)
      if (existing) {
        if (!existing.citedBy.includes(article.slug)) existing.citedBy.push(article.slug)
        continue
      }
      map.set(id, {
        id,
        title: c.title,
        authors: c.authors,
        year: c.year,
        publication: c.source,
        type: classify(c.source, c.authors),
        citedBy: [article.slug],
        ...IDENTIFIERS[id],
        ...(c.url ? { url: c.url } : {}),
      })
    }
  }
  return [...map.values()].sort((a, b) =>
    a.authors.localeCompare(b.authors) || a.year - b.year,
  )
}

export const SOURCES: Source[] = build()

/** Resolvable link for a source, preferring the DOI. */
export function sourceHref(s: Source): string | undefined {
  if (s.doi) return `https://doi.org/${s.doi}`
  return s.url
}

/** A source is resolved when a reader can actually reach it. */
export function isResolved(s: Source): boolean {
  return Boolean(sourceHref(s))
}

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id)
}

/**
 * The registry entry behind an inline citation. Lets the article view show
 * a resolvable link without every article file having to carry one.
 */
export function sourceForCitation(c: Citation): Source | undefined {
  return getSource(sourceId(c))
}

/** The registry's own honesty check, shown on the evidence page. */
export function sourceStats() {
  const resolved = SOURCES.filter(isResolved).length
  return {
    total: SOURCES.length,
    resolved,
    unresolved: SOURCES.length - resolved,
    citations: ARTICLES.reduce((n, a) => n + a.citations.length, 0),
  }
}

/** Sources cited by a given article, in the registry's canonical form. */
export function sourcesForArticle(slug: string): Source[] {
  return SOURCES.filter((s) => s.citedBy.includes(slug))
}

/**
 * Crossref candidate finder for unresolved sources.
 *
 * Usage (needs network access to api.crossref.org — run locally or in CI,
 * not in the sandboxed session):
 *
 *   npx tsx scripts/resolve-sources.ts            # report all unresolved
 *   npx tsx scripts/resolve-sources.ts <id>       # one source
 *
 * The output is a *review sheet*, never an auto-apply: for each unresolved
 * source it prints the best Crossref matches with a similarity score, and
 * only a human (or a session that has checked the publisher record) may
 * copy a DOI into the IDENTIFIERS map in src/lib/knowledge/sources.ts.
 * The registry's policy is verified-or-absent — a wrong DOI is worse than
 * none — so this script deliberately stops at "candidate".
 *
 * Books and reports mostly live outside Crossref; expect the strongest
 * candidates for journal papers.
 */

import { SOURCES, isResolved } from "../src/lib/knowledge/sources"

interface CrossrefItem {
  DOI: string
  title?: string[]
  author?: Array<{ family?: string }>
  issued?: { "date-parts"?: number[][] }
  "container-title"?: string[]
  score?: number
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Token overlap of the two titles, 0..1. */
function titleSimilarity(a: string, b: string): number {
  const ta = new Set(normalize(a).split(" "))
  const tb = new Set(normalize(b).split(" "))
  if (ta.size === 0 || tb.size === 0) return 0
  let hit = 0
  for (const w of ta) if (tb.has(w)) hit++
  return hit / Math.max(ta.size, tb.size)
}

async function query(source: (typeof SOURCES)[number]): Promise<CrossrefItem[]> {
  const params = new URLSearchParams({
    "query.bibliographic": `${source.title} ${source.authors} ${source.year}`,
    rows: "5",
    select: "DOI,title,author,issued,container-title,score",
  })
  const res = await fetch(`https://api.crossref.org/works?${params}`, {
    headers: {
      // Crossref asks polite callers to identify themselves.
      "User-Agent": "equilibrium-source-resolver/1.0 (https://github.com/gronnstudio/G-eog)",
    },
  })
  if (!res.ok) throw new Error(`Crossref ${res.status} for ${source.id}`)
  const body = (await res.json()) as { message: { items: CrossrefItem[] } }
  return body.message.items ?? []
}

function firstAuthorSurname(authors: string): string {
  return normalize(authors.split(",")[0] ?? "").split(" ")[0] ?? ""
}

async function main() {
  const only = process.argv[2]
  const targets = SOURCES.filter(
    (s) => !isResolved(s) && (!only || s.id === only),
  )
  console.log(`# ${targets.length} unresolved source(s)\n`)

  for (const s of targets) {
    console.log(`## ${s.id}`)
    console.log(`   ${s.authors} (${s.year}) ${s.title} — ${s.publication}`)
    try {
      const items = await query(s)
      const scored = items
        .map((it) => {
          const title = it.title?.[0] ?? ""
          const year = it.issued?.["date-parts"]?.[0]?.[0]
          const sim = titleSimilarity(s.title, title)
          const yearOk = year === s.year
          const authorOk =
            it.author?.some(
              (a) => a.family && normalize(a.family) === firstAuthorSurname(s.authors),
            ) ?? false
          const confidence = sim + (yearOk ? 0.15 : 0) + (authorOk ? 0.15 : 0)
          return { it, title, year, sim, yearOk, authorOk, confidence }
        })
        .sort((a, b) => b.confidence - a.confidence)

      for (const c of scored.slice(0, 3)) {
        const flag = c.confidence >= 0.95 ? "★ STRONG" : c.confidence >= 0.7 ? "~ maybe" : "  weak"
        console.log(
          `   ${flag}  ${c.it.DOI}  [sim ${c.sim.toFixed(2)} year ${c.yearOk ? "✓" : "✗"} author ${c.authorOk ? "✓" : "✗"}]`,
        )
        console.log(`           ${c.title} (${c.year ?? "?"}) — ${c.it["container-title"]?.[0] ?? ""}`)
      }
      if (scored.length === 0) console.log("   (no candidates)")
    } catch (err) {
      console.log(`   ERROR: ${(err as Error).message}`)
    }
    console.log()
    // Stay well inside Crossref's polite-pool rate expectations.
    await new Promise((r) => setTimeout(r, 1100))
  }

  console.log(
    "Review each ★ candidate against the publisher record before adding it to IDENTIFIERS in src/lib/knowledge/sources.ts.",
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import { ARTICLES } from "./articles"
import { RELATIONSHIPS } from "./relationships"
import type { Article, Relationship } from "./types"

/**
 * Serendipity, deterministically.
 *
 * Two discovery mechanisms that need nothing but the graph:
 *
 * - A daily discovery: one edge of the graph surfaced per day, the same
 *   for every visitor. Seeded by the date rather than Math.random() so the
 *   server and client agree (no hydration mismatch), and so the discovery
 *   is shared — "did you see today's?" only works if everyone sees the
 *   same one.
 *
 * - Horizon suggestions: the concepts exactly two hops away — connected
 *   to what you're reading through something else, but not directly.
 *   One hop is already on the page as the connection list; two hops is
 *   where the surprising-but-relevant material lives. Three is noise.
 */

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

/** Small deterministic hash — good enough to spread picks across days. */
function seedFrom(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface DailyDiscovery {
  relationship: Relationship
  from: Article
  to: Article
}

/**
 * The edge of the day. Prefers the graph's most interesting shelf — edges
 * whose evidence is settled enough to state confidently but whose pairing
 * crosses domains, which is where "I didn't know those touched" lives.
 */
export function dailyDiscovery(dateKey: string): DailyDiscovery | null {
  // Cross-domain edges first: a soil↔economics link surprises; a
  // soil↔soil link is filing.
  const pool = RELATIONSHIPS.filter((r) => {
    const a = BY_SLUG.get(r.source)
    const b = BY_SLUG.get(r.target)
    return a && b && a.category !== b.category
  })
  const list = pool.length > 0 ? pool : RELATIONSHIPS
  if (list.length === 0) return null
  const pick = list[seedFrom(dateKey) % list.length]
  const from = BY_SLUG.get(pick.source)
  const to = BY_SLUG.get(pick.target)
  if (!from || !to) return null
  return { relationship: pick, from, to }
}

export interface HorizonSuggestion {
  article: Article
  /** The stepping stone that connects it to where the reader is. */
  via: Article
}

/**
 * Concepts two hops out from a slug: reachable through one intermediary,
 * not directly connected. Ordered by how many distinct paths lead there —
 * something reachable three ways is structurally close even without a
 * direct edge, which is exactly the "you might explore" feeling.
 */
export function horizon(slug: string, limit = 4): HorizonSuggestion[] {
  const direct = new Set<string>([slug])
  const via = new Map<string, string>()
  const pathCount = new Map<string, number>()

  const neighboursOf = (s: string): string[] => {
    const out: string[] = []
    for (const r of RELATIONSHIPS) {
      if (r.source === s) out.push(r.target)
      else if (r.target === s) out.push(r.source)
    }
    return out
  }

  const firstHop = neighboursOf(slug)
  for (const n of firstHop) direct.add(n)

  for (const mid of firstHop) {
    for (const far of neighboursOf(mid)) {
      if (direct.has(far)) continue
      pathCount.set(far, (pathCount.get(far) ?? 0) + 1)
      if (!via.has(far)) via.set(far, mid)
    }
  }

  return [...pathCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([far]) => ({
      article: BY_SLUG.get(far)!,
      via: BY_SLUG.get(via.get(far)!)!,
    }))
    .filter((s) => s.article && s.via)
}

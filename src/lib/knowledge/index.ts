import { ARTICLES } from "./articles"
import { CATEGORIES } from "./categories"
import { LEARNING_PATHS } from "./paths"
import { RELATIONSHIPS } from "./relationships"
import type {
  Article,
  CategoryId,
  GraphEdge,
  GraphNode,
  KnowledgeGraph,
  Relationship,
} from "./types"

export * from "./types"
export { RELATIONSHIPS } from "./relationships"
export { CATEGORIES, getCategory } from "./categories"
export { LEARNING_PATHS } from "./paths"
export { ARTICLES } from "./articles"

const ARTICLE_BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

export function getArticle(slug: string): Article | undefined {
  return ARTICLE_BY_SLUG.get(slug)
}

export function articlesInCategory(id: CategoryId): Article[] {
  return ARTICLES.filter((a) => a.category === id)
}

export function categoryStats(id: CategoryId) {
  const articles = articlesInCategory(id)
  const connections = articles.reduce((n, a) => n + a.related.length, 0)
  const minutes = articles.reduce((n, a) => n + a.readingMinutes, 0)
  return { articles: articles.length, connections, minutes }
}

/**
 * Sequential neighbours for prev/next paging. Walks the article's own
 * category first (the natural reading order of a domain); if the category
 * has a single article, falls back to the full corpus so paging never
 * dead-ends. No wrap-around — the first article has no previous.
 */
export function articleNeighbors(article: Article): {
  prev: Article | undefined
  next: Article | undefined
} {
  const inCat = articlesInCategory(article.category)
  const list = inCat.length > 1 ? inCat : ARTICLES
  const i = list.findIndex((a) => a.slug === article.slug)
  return { prev: i > 0 ? list[i - 1] : undefined, next: i < list.length - 1 ? list[i + 1] : undefined }
}

/**
 * Every typed relationship touching an article, normalised so the article
 * in question is always the subject. An edge authored in the other
 * direction comes back flagged `inbound`, so the UI can read it as
 * "X supports this" rather than silently reversing the sentence — the
 * direction is part of the meaning.
 */
export function relationshipsFor(
  slug: string,
): { relationship: Relationship; other: Article; inbound: boolean }[] {
  const out: { relationship: Relationship; other: Article; inbound: boolean }[] = []
  for (const r of RELATIONSHIPS) {
    const inbound = r.target === slug
    if (r.source !== slug && !inbound) continue
    const other = ARTICLE_BY_SLUG.get(inbound ? r.source : r.target)
    if (!other) continue
    out.push({ relationship: r, other, inbound })
  }
  return out
}

/**
 * Slugs an article is connected to that the typed graph doesn't yet cover.
 * `related` remains the authoring shortcut; this reports where the two
 * models have drifted apart so the gap stays visible instead of silent.
 */
export function untypedConnections(article: Article): string[] {
  const typed = new Set(
    relationshipsFor(article.slug).map((r) => r.other.slug),
  )
  return article.related.filter((s) => ARTICLE_BY_SLUG.has(s) && !typed.has(s))
}

/** Resolve related slugs to full articles, dropping any that don't exist. */
export function relatedArticles(article: Article): Article[] {
  return article.related
    .map((slug) => ARTICLE_BY_SLUG.get(slug))
    .filter((a): a is Article => Boolean(a))
}

/**
 * Build the knowledge graph from articles + their `related` edges.
 * Edges are de-duplicated (undirected) and node degree is computed so the
 * renderer can size nodes by connectedness.
 */
export function buildGraph(): KnowledgeGraph {
  const degree = new Map<string, number>()
  const seen = new Set<string>()
  const edges: GraphEdge[] = []

  for (const r of RELATIONSHIPS) {
    if (!ARTICLE_BY_SLUG.has(r.source) || !ARTICLE_BY_SLUG.has(r.target)) continue
    const key = [r.source, r.target].sort().join("::")
    if (seen.has(key)) continue
    seen.add(key)
    edges.push({
      source: r.source,
      target: r.target,
      type: r.type,
      description: r.description,
      evidence: r.evidence,
    })
    degree.set(r.source, (degree.get(r.source) ?? 0) + 1)
    degree.set(r.target, (degree.get(r.target) ?? 0) + 1)
  }

  const nodes: GraphNode[] = ARTICLES.map((a) => ({
    id: a.slug,
    label: a.title,
    category: a.category,
    difficulty: a.difficulty,
    degree: degree.get(a.slug) ?? 1,
  }))

  return { nodes, edges }
}

export function totalStats() {
  const connections = buildGraph().edges.length
  return {
    articles: ARTICLES.length,
    categories: CATEGORIES.length,
    connections,
    paths: LEARNING_PATHS.length,
  }
}

/** Lightweight lexical search across titles, summaries and tags. */
export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  return ARTICLES.map((a) => {
    const haystack = `${a.title} ${a.summary} ${a.tags.join(" ")} ${a.category}`.toLowerCase()
    const score = terms.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0)
    return { a, score }
  })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 12)
    .map((r) => r.a)
}

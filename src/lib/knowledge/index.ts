import { ARTICLES } from "./articles"
import { CATEGORIES } from "./categories"
import { LEARNING_PATHS } from "./paths"
import type {
  Article,
  CategoryId,
  GraphEdge,
  GraphNode,
  KnowledgeGraph,
} from "./types"

export * from "./types"
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

  for (const a of ARTICLES) {
    for (const target of a.related) {
      if (!ARTICLE_BY_SLUG.has(target)) continue
      const key = [a.slug, target].sort().join("::")
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({ source: a.slug, target })
      degree.set(a.slug, (degree.get(a.slug) ?? 0) + 1)
      degree.set(target, (degree.get(target) ?? 0) + 1)
    }
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

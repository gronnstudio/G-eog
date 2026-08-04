/** Core domain types for the Equilibrium knowledge ecosystem. */

export type Difficulty = "foundational" | "intermediate" | "advanced"

export type CategoryId =
  | "soil"
  | "water"
  | "trees"
  | "plants"
  | "microbiology"
  | "fungi"
  | "animals"
  | "climate"
  | "permaculture"
  | "food-forests"
  | "construction"
  | "energy"
  | "biology"
  | "chemistry"
  | "ecology"
  | "landscape-design"
  | "urban-ecology"
  | "hydrology"
  | "botany"
  | "biodiversity"
  | "philosophy"
  | "psychology"
  | "economics"
  | "circular-systems"

export interface Category {
  id: CategoryId
  title: string
  /** One-line essence shown on cards. */
  tagline: string
  /** Longer editorial description for the category page. */
  description: string
  /** Hue used to tint the node in the graph and accents on the page. */
  hue: number
  /** Emoji-free glyph name from lucide, resolved in the UI layer. */
  icon: string
}

export interface Citation {
  id: string
  authors: string
  year: number
  title: string
  source: string
  url?: string
}

/** Interactive diagrams that can be embedded inline in an article body. */
export type ArticleEmbed =
  | "food-forest-layers"
  | "succession-timeline"
  | "regeneration-slider"

export interface ArticleSection {
  heading?: string
  /** Paragraphs and lists rendered by the article view. */
  body: string[]
  /** Optional interactive diagram rendered after this section's prose. */
  embed?: ArticleEmbed
  /** Caption shown beneath an embedded diagram. */
  embedCaption?: string
}

export interface Article {
  slug: string
  title: string
  category: CategoryId
  /** Editorial standfirst shown under the title. */
  summary: string
  difficulty: Difficulty
  readingMinutes: number
  updated: string // ISO date
  contributors: string[]
  tags: string[]
  /** Slugs of directly related articles — the graph edges. */
  related: string[]
  sections: ArticleSection[]
  citations: Citation[]
}

export interface GraphNode {
  id: string
  label: string
  category: CategoryId
  difficulty: Difficulty
  /** Degree — number of connections, drives node size. */
  degree: number
}

export interface GraphEdge {
  source: string
  target: string
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface LearningPath {
  slug: string
  title: string
  summary: string
  difficulty: Difficulty
  hours: number
  steps: { slug: string; note: string }[]
}

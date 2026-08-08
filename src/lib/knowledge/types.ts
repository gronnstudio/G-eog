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

/**
 * How two concepts are connected. Relationships are first-class in this
 * knowledge model: an edge that only says "related" throws away the part
 * a reader actually wants — *why* these two things sit next to each other.
 * Every edge carries a type from this vocabulary and a sentence of
 * explanation.
 */
export type RelationshipType =
  | "supports"
  | "influences"
  | "regulates"
  | "contains"
  | "interacts_with"
  | "symbiotic_with"
  | "depends_on"
  | "contributes_to"
  | "increases"
  | "decreases"
  | "enables"
  | "requires"
  | "transforms"
  | "stores"
  | "cycles"
  | "exchanges"
  | "precedes"
  | "follows"
  | "mitigates"
  | "causes"
  | "associated_with"
  | "applied_in"

/** Human-readable, directional label for each relationship type. */
export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  supports: "supports",
  influences: "influences",
  regulates: "regulates",
  contains: "contains",
  interacts_with: "interacts with",
  symbiotic_with: "is symbiotic with",
  depends_on: "depends on",
  contributes_to: "contributes to",
  increases: "increases",
  decreases: "decreases",
  enables: "enables",
  requires: "requires",
  transforms: "transforms",
  stores: "stores",
  cycles: "cycles",
  exchanges: "exchanges with",
  precedes: "precedes",
  follows: "follows",
  mitigates: "mitigates",
  causes: "causes",
  associated_with: "is associated with",
  applied_in: "is applied in",
}

/**
 * How well established the connection is. Kept deliberately coarse — the
 * point is to be honest about certainty, not to imply false precision.
 */
export type EvidenceLevel =
  | "strong"
  | "moderate"
  | "emerging"
  | "limited"
  | "contested"
  | "hypothesis"

export interface Relationship {
  /** Article slug the relationship runs from. */
  source: string
  /** Article slug it runs to. */
  target: string
  type: RelationshipType
  /** One sentence answering "why are these connected?". */
  description: string
  evidence: EvidenceLevel
}

export interface GraphEdge {
  source: string
  target: string
  type: RelationshipType
  description: string
  evidence: EvidenceLevel
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

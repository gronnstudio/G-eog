import { ARTICLES } from "./articles"
import { CATEGORIES } from "./categories"
import type { Article, Category, CategoryId } from "./types"

/**
 * A navigation layer over the domains — not a second knowledge model.
 *
 * The graph stays the truth: an article belongs to one domain and connects
 * to anything through typed relationships. This groups the 24 domains into
 * a handful of shelves so the collection can be browsed like a filesystem,
 * which is a thing people already know how to do.
 *
 * Crucially it is *only* a view. Nothing here constrains what an article
 * may relate to, and regrouping the shelves later changes navigation
 * without touching a single piece of content.
 *
 * Every group below is populated. Empty shelves are worse than no shelves:
 * they promise depth that isn't there. Research, Library and the project's
 * own material already have homes elsewhere in the site (Evidence, the
 * sources file, About and Community) and are deliberately not duplicated
 * here.
 */

export interface KnowledgeGroup {
  id: string
  /** Two-digit ordinal, shown like a shelf label. */
  ordinal: string
  title: { en: string; nl: string }
  blurb: { en: string; nl: string }
  categories: CategoryId[]
}

export const KNOWLEDGE_GROUPS: KnowledgeGroup[] = [
  {
    id: "foundations",
    ordinal: "01",
    title: { en: "Foundations", nl: "Fundamenten" },
    blurb: {
      en: "How to think about living systems at all — the ideas everything else assumes.",
      nl: "Hoe je überhaupt over levende systemen denkt — de ideeën die de rest veronderstelt.",
    },
    categories: ["ecology", "biology", "biodiversity"],
  },
  {
    id: "living-systems",
    ordinal: "02",
    title: { en: "Living Systems", nl: "Levende systemen" },
    blurb: {
      en: "The organisms themselves: what they are, how they work, what they need.",
      nl: "De organismen zelf: wat ze zijn, hoe ze werken, wat ze nodig hebben.",
    },
    categories: ["plants", "botany", "trees", "fungi", "microbiology", "animals"],
  },
  {
    id: "elements",
    ordinal: "03",
    title: { en: "Elements", nl: "Elementen" },
    blurb: {
      en: "The physical substrate — matter and energy moving through the biosphere.",
      nl: "De fysieke ondergrond — materie en energie die door de biosfeer bewegen.",
    },
    categories: ["soil", "water", "hydrology", "climate", "energy", "chemistry"],
  },
  {
    id: "ecosystems",
    ordinal: "04",
    title: { en: "Ecosystems", nl: "Ecosystemen" },
    blurb: {
      en: "Whole places, where the parts above assemble into something self-sustaining.",
      nl: "Hele plekken, waar bovenstaande delen samenkomen tot iets zelfvoorzienends.",
    },
    categories: ["food-forests", "urban-ecology"],
  },
  {
    id: "practice",
    ordinal: "05",
    title: { en: "Practice", nl: "Praktijk" },
    blurb: {
      en: "Design and craft: what people actually do with all of this on real ground.",
      nl: "Ontwerp en vakmanschap: wat mensen hier daadwerkelijk mee doen op echte grond.",
    },
    categories: ["permaculture", "landscape-design", "construction"],
  },
  {
    id: "human-systems",
    ordinal: "06",
    title: { en: "Human Systems", nl: "Menselijke systemen" },
    blurb: {
      en: "Economies, ethics and minds — the human half of every ecological decision.",
      nl: "Economie, ethiek en denken — de menselijke helft van elke ecologische keuze.",
    },
    categories: ["economics", "circular-systems", "philosophy", "psychology"],
  },
]

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

/** Categories of a group, resolved and in authored order. */
export function categoriesInGroup(group: KnowledgeGroup): Category[] {
  return group.categories
    .map((id) => CATEGORY_BY_ID.get(id))
    .filter((c): c is Category => Boolean(c))
}

export function articlesInGroup(group: KnowledgeGroup): Article[] {
  const set = new Set<CategoryId>(group.categories)
  return ARTICLES.filter((a) => set.has(a.category))
}

export function groupOf(categoryId: CategoryId): KnowledgeGroup | undefined {
  return KNOWLEDGE_GROUPS.find((g) => g.categories.includes(categoryId))
}

/**
 * Domains that no group claims. Surfaced rather than silently dropped —
 * a shelf-less domain is a navigation bug, not a content problem.
 */
export function ungroupedCategories(): Category[] {
  const claimed = new Set(KNOWLEDGE_GROUPS.flatMap((g) => g.categories))
  return CATEGORIES.filter((c) => !claimed.has(c.id))
}

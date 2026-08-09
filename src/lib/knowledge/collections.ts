import { ARTICLES } from "./articles"
import type { Article } from "./types"

/**
 * Collections organise purpose; folders organise knowledge.
 *
 * A collection is an ordered sequence of existing nodes with a note on why
 * each step is there — a project plan, a field guide, a curated route.
 * It references knowledge, never duplicates it: the articles stay the one
 * truth, and a collection is just a path drawn across them. This is the
 * same discipline as the graph (relationships are not copies either), and
 * it is what makes collections cheap to author and impossible to rot.
 *
 * Steps point at article slugs; a missing slug is skipped by the resolver
 * rather than failing the build, same policy as learning paths.
 */

export type CollectionKind = "project" | "guide" | "route"

export interface CollectionStep {
  slug: string
  /** Why this step is here — the purpose, not a summary of the article. */
  note: { en: string; nl: string }
}

export interface Collection {
  slug: string
  kind: CollectionKind
  title: { en: string; nl: string }
  summary: { en: string; nl: string }
  steps: CollectionStep[]
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "build-a-food-forest",
    kind: "project",
    title: { en: "Build a Food Forest", nl: "Bouw een voedselbos" },
    summary: {
      en: "From bare ground to a seven-layer system that feeds itself — the knowledge behind each decision, in the order you will make them.",
      nl: "Van kale grond naar een zevenlaags systeem dat zichzelf voedt — de kennis achter elke beslissing, in de volgorde waarin je ze neemt.",
    },
    steps: [
      {
        slug: "watershed-thinking",
        note: {
          en: "Read the site first: where water comes from and where it wants to go.",
          nl: "Lees eerst het terrein: waar water vandaan komt en waarheen het wil.",
        },
      },
      {
        slug: "swales-and-earthworks",
        note: {
          en: "Shape the ground before anything is planted — earthworks are hardest to retrofit.",
          nl: "Vorm de grond vóór er iets geplant wordt — grondwerk is achteraf het moeilijkst.",
        },
      },
      {
        slug: "soil-food-web",
        note: {
          en: "Feed the underground workforce that will do most of the growing for you.",
          nl: "Voed de ondergrondse werkploeg die het meeste groeiwerk voor je doet.",
        },
      },
      {
        slug: "seven-layer-food-forest",
        note: {
          en: "Design the layers: canopy to groundcover, each with a job.",
          nl: "Ontwerp de lagen: van kroon tot bodembedekker, elk met een taak.",
        },
      },
      {
        slug: "nitrogen-fixation",
        note: {
          en: "Plant the fertility: species that bank nitrogen for their neighbours.",
          nl: "Plant de vruchtbaarheid: soorten die stikstof sparen voor hun buren.",
        },
      },
      {
        slug: "chop-and-drop-mulching",
        note: {
          en: "Maintain by returning biomass where it falls — pruning as feeding.",
          nl: "Onderhoud door biomassa terug te geven waar ze valt — snoeien als voeden.",
        },
      },
    ],
  },
  {
    slug: "bring-back-the-water",
    kind: "project",
    title: { en: "Bring Back the Water", nl: "Breng het water terug" },
    summary: {
      en: "Slow it, spread it, sink it: retrofit a drying site into one that harvests every storm.",
      nl: "Vertraag het, spreid het, laat het zakken: verander een verdrogend terrein in één dat elke bui oogst.",
    },
    steps: [
      {
        slug: "the-water-cycle",
        note: {
          en: "Understand the loop you are intervening in before you cut into it.",
          nl: "Begrijp de kringloop waarin je ingrijpt voordat je erin snijdt.",
        },
      },
      {
        slug: "keyline-design",
        note: {
          en: "Find the contours that move water from valleys to ridges.",
          nl: "Vind de hoogtelijnen die water van dalen naar ruggen brengen.",
        },
      },
      {
        slug: "rainwater-harvesting",
        note: {
          en: "Catch the roof water first — it is the cheapest yield on the site.",
          nl: "Vang eerst het dakwater — de goedkoopste opbrengst van het terrein.",
        },
      },
      {
        slug: "swales-and-earthworks",
        note: {
          en: "Then catch the land water: earthworks that turn runoff into recharge.",
          nl: "Vang daarna het landwater: grondwerk dat afstroming laat infiltreren.",
        },
      },
      {
        slug: "carbon-sequestration",
        note: {
          en: "Build soil carbon — every percent of organic matter holds more rain.",
          nl: "Bouw bodemkoolstof op — elk procent organische stof houdt meer regen vast.",
        },
      },
    ],
  },
  {
    slug: "rewild-a-city-corner",
    kind: "guide",
    title: { en: "Rewild a City Corner", nl: "Verwilder een stadshoek" },
    summary: {
      en: "A verge, a schoolyard, a car-park edge: turning leftover urban space into working habitat.",
      nl: "Een berm, een schoolplein, een rand van een parkeerterrein: van stedelijke restruimte naar werkend habitat.",
    },
    steps: [
      {
        slug: "urban-food-forests",
        note: {
          en: "See what is possible on paved ground before deciding it is not.",
          nl: "Zie wat mogelijk is op verharde grond voor je besluit dat het niet kan.",
        },
      },
      {
        slug: "the-case-for-native-plants",
        note: {
          en: "Choose the plants the local food web already knows how to use.",
          nl: "Kies de planten die het lokale voedselweb al weet te gebruiken.",
        },
      },
      {
        slug: "miyawaki-mini-forests",
        note: {
          en: "Plant dense and diverse — a pocket forest outgrows a lawn in three years.",
          nl: "Plant dicht en divers — een minibos ontgroeit een gazon in drie jaar.",
        },
      },
      {
        slug: "pollinator-networks",
        note: {
          en: "Sequence the bloom so something is flowering from March to October.",
          nl: "Plan de bloei zo dat er van maart tot oktober iets bloeit.",
        },
      },
      {
        slug: "biophilia",
        note: {
          en: "Design for the people too — a loved corner is a defended corner.",
          nl: "Ontwerp ook voor de mensen — een geliefde hoek is een verdedigde hoek.",
        },
      },
    ],
  },
]

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

/** Steps resolved to articles, missing slugs skipped. */
export function resolvedSteps(
  c: Collection,
): Array<{ article: Article; note: CollectionStep["note"] }> {
  return c.steps
    .map((s) => {
      const article = BY_SLUG.get(s.slug)
      return article ? { article, note: s.note } : null
    })
    .filter((x): x is { article: Article; note: CollectionStep["note"] } => x !== null)
}

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}

/** Total reading time of a collection, from its resolved steps. */
export function collectionMinutes(c: Collection): number {
  return resolvedSteps(c).reduce((sum, s) => sum + s.article.readingMinutes, 0)
}

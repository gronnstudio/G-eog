import { RELATIONSHIPS } from "./relationships"
import { ARTICLES } from "./articles"
import type { Article, EvidenceLevel, RelationshipType } from "./types"

/**
 * Symptom-first reasoning over the knowledge graph.
 *
 * People arrive with a problem ("my soil is compacted"), not a topic. This
 * turns a problem into a walk through the typed relationships and returns
 * the mechanisms the graph actually documents, each traceable to concepts
 * and an evidence level.
 *
 * It is deliberately NOT generative. Every sentence it shows was authored
 * on an edge and reviewed; the engine only chooses which chains to surface
 * and in what order. That means it cannot invent a mechanism, cannot
 * overstate certainty, and needs no model, key or server — which also
 * makes it the retrieval half of the AI layer rather than a throwaway.
 * A generative layer can sit on top later and cite exactly these chains.
 */

/** Verbs that carry an explanatory "because" — the useful ones to walk. */
const CAUSAL: RelationshipType[] = [
  "causes",
  "enables",
  "depends_on",
  "requires",
  "regulates",
  "increases",
  "decreases",
  "contributes_to",
  "supports",
  "transforms",
  "mitigates",
  "influences",
  "exchanges",
  "precedes",
]

const EVIDENCE_WEIGHT: Record<EvidenceLevel, number> = {
  strong: 1,
  moderate: 0.75,
  emerging: 0.5,
  limited: 0.35,
  contested: 0.35,
  hypothesis: 0.25,
}

export interface Symptom {
  id: string
  /** What the visitor would actually say. */
  label: { en: string; nl: string }
  /** Extra words matched against free text. */
  terms: string[]
  /** Where in the graph this problem is best understood from. */
  entries: string[]
  /** Honest framing of what the graph can and can't tell them. */
  lead: { en: string; nl: string }
}

/**
 * The symptom catalogue. Each entry maps a real complaint onto the
 * concepts in this graph that bear on it — no more. Where the graph has
 * nothing useful to say about a problem, it is better not to list it than
 * to route someone to a loosely related article.
 */
export const SYMPTOMS: Symptom[] = [
  {
    id: "compacted-soil",
    label: { en: "My soil is compacted and hard", nl: "Mijn bodem is verdicht en hard" },
    terms: ["compact", "hard", "dense", "verdicht", "hard", "klei", "clay"],
    entries: ["soil-food-web", "no-till-agriculture", "chop-and-drop-mulching"],
    lead: {
      en: "Compaction is usually a symptom of absent structure rather than of pressure alone — soil holds itself open when something living is building and binding aggregates.",
      nl: "Verdichting is meestal een symptoom van ontbrekende structuur, niet alleen van druk — een bodem houdt zichzelf open als er iets levends aggregaten bouwt en bindt.",
    },
  },
  {
    id: "water-runs-off",
    label: { en: "Water pools or runs straight off", nl: "Water blijft staan of stroomt meteen weg" },
    terms: ["puddle", "runoff", "flood", "drain", "plas", "afstroming", "wateroverlast"],
    entries: ["the-water-cycle", "watershed-thinking", "swales-and-earthworks"],
    lead: {
      en: "Runoff is water moving faster than the ground can accept it. The graph treats this as a landscape-shape question and an infiltration question at once.",
      nl: "Afstroming is water dat sneller beweegt dan de grond het kan opnemen. De graaf behandelt dit tegelijk als een vraag over landschapsvorm en over infiltratie.",
    },
  },
  {
    id: "dries-out",
    label: { en: "The ground dries out too fast", nl: "De grond droogt te snel uit" },
    terms: ["dry", "drought", "arid", "droogte", "uitdrogen"],
    entries: ["chop-and-drop-mulching", "the-water-cycle", "soil-food-web"],
    lead: {
      en: "Water holding is mostly a structural and organic-matter property, so this usually leads back into the same mechanisms as compaction.",
      nl: "Waterberging is vooral een kwestie van structuur en organische stof, dus dit leidt meestal terug naar dezelfde mechanismen als verdichting.",
    },
  },
  {
    id: "weak-plants",
    label: { en: "Plants are weak or yellowing", nl: "Planten zijn zwak of vergelen" },
    terms: ["yellow", "weak", "stunted", "pale", "geel", "zwak", "slecht groeien"],
    entries: ["nutrient-cycling", "mycorrhizal-networks", "nitrogen-fixation"],
    lead: {
      en: "Nutrient availability is rarely the same thing as nutrient presence. The graph tends to route this through what makes nutrition reachable rather than what adds more of it.",
      nl: "Beschikbaarheid van voeding is zelden hetzelfde als aanwezigheid ervan. De graaf leidt dit meestal via wat voeding bereikbaar maakt, niet via wat er meer van toevoegt.",
    },
  },
  {
    id: "few-pollinators",
    label: { en: "Few pollinators, poor fruit set", nl: "Weinig bestuivers, slechte vruchtzetting" },
    terms: ["bee", "pollinator", "fruit", "bloom", "bij", "bestuiving", "vrucht"],
    entries: ["pollinator-networks", "the-case-for-native-plants", "seven-layer-food-forest"],
    lead: {
      en: "Pollinator presence tracks continuity of forage and co-evolved plants far more than it tracks the number of flowers.",
      nl: "De aanwezigheid van bestuivers hangt veel meer samen met doorlopend voedselaanbod en co-geëvolueerde planten dan met het aantal bloemen.",
    },
  },
  {
    id: "bare-ground",
    label: { en: "Bare ground and erosion", nl: "Kale grond en erosie" },
    terms: ["erosion", "bare", "wash", "erosie", "kaal", "wegspoelen"],
    entries: ["ecological-succession", "chop-and-drop-mulching", "swales-and-earthworks"],
    lead: {
      en: "Bare ground is a successional state, not a stable one — the question the graph asks is what is preventing the next stage from arriving.",
      nl: "Kale grond is een successiestadium, geen stabiele toestand — de graaf vraagt vooral wat het volgende stadium tegenhoudt.",
    },
  },
  {
    id: "low-biodiversity",
    label: { en: "Hardly any insects or birds", nl: "Nauwelijks insecten of vogels" },
    terms: ["insect", "bird", "wildlife", "biodiversity", "insect", "vogel", "biodiversiteit"],
    entries: ["the-case-for-native-plants", "keystone-species", "rewilding"],
    lead: {
      en: "Abundance higher up the food web is usually limited by what is available lower down, so this walks downward rather than upward.",
      nl: "Rijkdom hoger in het voedselweb wordt meestal begrensd door wat er lager beschikbaar is, dus dit loopt naar beneden in plaats van omhoog.",
    },
  },
  {
    id: "nothing-under-trees",
    label: { en: "Nothing grows under my trees", nl: "Onder mijn bomen groeit niets" },
    terms: ["shade", "under trees", "canopy", "schaduw", "onder bomen"],
    entries: ["forest-microclimates", "ecological-succession", "seven-layer-food-forest"],
    lead: {
      en: "Shade is a distinct habitat rather than a deficient one. The graph frames this as choosing for the layer instead of fighting it.",
      nl: "Schaduw is een eigen habitat, geen gebrekkige. De graaf ziet dit als kiezen vóór de laag in plaats van ertegen vechten.",
    },
  },
  {
    id: "too-much-waste",
    label: { en: "Too much garden waste", nl: "Te veel tuinafval" },
    terms: ["waste", "clippings", "prunings", "afval", "snoeisel", "compost"],
    entries: ["compost-science", "chop-and-drop-mulching", "nutrient-cycling"],
    lead: {
      en: "In a closed system there is no waste, only nutrition in the wrong place. This is the most directly solvable problem in the set.",
      nl: "In een gesloten systeem bestaat geen afval, alleen voeding op de verkeerde plek. Dit is het meest direct oplosbare probleem in deze reeks.",
    },
  },
  {
    id: "store-carbon",
    label: { en: "I want to store more carbon", nl: "Ik wil meer koolstof vastleggen" },
    terms: ["carbon", "climate", "sequester", "koolstof", "klimaat", "vastleggen"],
    entries: ["carbon-sequestration", "no-till-agriculture", "compost-science"],
    lead: {
      en: "Worth reading with the evidence labels visible: this is the area of the graph where the literature disagrees most, and several edges here are marked contested.",
      nl: "Lees dit met de bewijslabels erbij: dit is het deel van de graaf waar de literatuur het meest verdeeld is, en meerdere verbindingen zijn hier als omstreden gemarkeerd.",
    },
  },
  {
    id: "start-food-forest",
    label: { en: "I want to start a food forest", nl: "Ik wil een voedselbos beginnen" },
    terms: ["food forest", "edible", "orchard", "voedselbos", "eetbaar"],
    entries: ["seven-layer-food-forest", "ecological-succession", "nitrogen-fixation"],
    lead: {
      en: "A food forest is a successional system held at a productive stage, so most early decisions are really decisions about fertility and time.",
      nl: "Een voedselbos is een successiesysteem dat op een productief stadium wordt gehouden, dus de meeste vroege keuzes gaan eigenlijk over vruchtbaarheid en tijd.",
    },
  },
  {
    id: "too-hot",
    label: { en: "The garden is too hot and exposed", nl: "De tuin is te heet en te open" },
    terms: ["hot", "heat", "exposed", "wind", "hitte", "warm", "open", "wind"],
    entries: ["forest-microclimates", "miyawaki-mini-forests", "passive-solar-design"],
    lead: {
      en: "Microclimate is buildable. The graph treats shade, humidity and wind as outcomes of structure you can plant or construct.",
      nl: "Microklimaat is maakbaar. De graaf ziet schaduw, luchtvochtigheid en wind als gevolgen van structuur die je kunt planten of bouwen.",
    },
  },
]

export interface ChainStep {
  from: Article
  to: Article
  type: RelationshipType
  description: string
  evidence: EvidenceLevel
}

export interface Mechanism {
  /** One or two hops through the graph. */
  steps: ChainStep[]
  /** Weakest evidence anywhere in the chain — a chain is only as good as that. */
  confidence: EvidenceLevel
  score: number
}

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]))

/** Directed, walkable view of the typed relationships. */
const OUT = new Map<string, ChainStep[]>()
for (const r of RELATIONSHIPS) {
  const from = BY_SLUG.get(r.source)
  const to = BY_SLUG.get(r.target)
  if (!from || !to) continue
  const step: ChainStep = {
    from,
    to,
    type: r.type,
    description: r.description,
    evidence: r.evidence,
  }
  const list = OUT.get(r.source) ?? []
  list.push(step)
  OUT.set(r.source, list)
}

const WEAKEST: EvidenceLevel[] = [
  "strong",
  "moderate",
  "emerging",
  "limited",
  "contested",
  "hypothesis",
]

function weakest(a: EvidenceLevel, b: EvidenceLevel): EvidenceLevel {
  return WEAKEST.indexOf(a) >= WEAKEST.indexOf(b) ? a : b
}

/**
 * Walk out from a symptom's entry concepts and collect the mechanism
 * chains the graph supports, best first.
 *
 * Chains are capped at two hops on purpose. Three-hop paths through a
 * dense graph will connect almost anything to almost anything, which reads
 * as insight while being closer to noise.
 */
export function explain(symptom: Symptom, limit = 8): Mechanism[] {
  const out: Mechanism[] = []
  const seen = new Set<string>()

  for (const entry of symptom.entries) {
    for (const first of OUT.get(entry) ?? []) {
      if (!CAUSAL.includes(first.type)) continue

      const key1 = `${first.from.slug}>${first.to.slug}`
      if (!seen.has(key1)) {
        seen.add(key1)
        out.push({
          steps: [first],
          confidence: first.evidence,
          score: EVIDENCE_WEIGHT[first.evidence] * 1.2,
        })
      }

      for (const second of OUT.get(first.to.slug) ?? []) {
        if (!CAUSAL.includes(second.type)) continue
        // Don't walk back to where the chain started.
        if (second.to.slug === entry || second.to.slug === first.from.slug) continue
        const key2 = `${key1}>${second.to.slug}`
        if (seen.has(key2)) continue
        seen.add(key2)
        const confidence = weakest(first.evidence, second.evidence)
        out.push({
          steps: [first, second],
          confidence,
          score:
            (EVIDENCE_WEIGHT[first.evidence] + EVIDENCE_WEIGHT[second.evidence]) / 2,
        })
      }
    }
  }

  return out.sort((a, b) => b.score - a.score).slice(0, limit)
}

/** Concepts worth reading for a symptom, most connected first. */
export function conceptsFor(symptom: Symptom): Article[] {
  const slugs = new Set(symptom.entries)
  for (const m of explain(symptom, 12)) {
    for (const s of m.steps) slugs.add(s.to.slug)
  }
  return [...slugs].map((s) => BY_SLUG.get(s)).filter((a): a is Article => Boolean(a))
}

/** Free-text → symptom, by label and keyword overlap. */
export function matchSymptoms(query: string): Symptom[] {
  const q = query.trim().toLowerCase()
  if (!q) return SYMPTOMS
  const words = q.split(/\s+/).filter((w) => w.length > 2)
  return SYMPTOMS.map((s) => {
    const terms = [
      ...s.label.en.toLowerCase().split(/\s+/),
      ...s.label.nl.toLowerCase().split(/\s+/),
      ...s.terms.map((t) => t.toLowerCase()),
    ]
    const hay = terms.join(" ")
    let score = 0
    if (hay.includes(q)) score += 5
    for (const w of words) {
      // Match both directions so inflected forms still land: the catalogue
      // stores stems ("bij", "erosie") and people type "bijen", "erosies".
      if (terms.some((t) => t.length > 2 && (w.includes(t) || t.includes(w)))) score += 1
    }
    return { s, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s)
}

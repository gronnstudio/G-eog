import type { CategoryId } from "./types"

/**
 * Field Stories — the immersive, place-based counterpart to reference
 * articles. Where an article explains a concept, a story walks a real (or
 * representative) landscape as narrative: a cinematic hero, chaptered
 * scroll sections, the species that live there, and the people who tend
 * it. Modelled on the way SUGi tells each pocket forest as its own place.
 */

export interface StoryStat {
  label: string
  value: string
}

export interface StoryChapter {
  /** Short chapter label shown in the progress rail. */
  title: string
  paragraphs: string[]
  /** Optional pull-quote that breaks the column between chapters. */
  pullQuote?: string
}

export interface Species {
  common: string
  latin: string
  /** Its job in the system — pollinator, nitrogen-fixer, canopy… */
  role: string
}

export interface Guardian {
  name: string
  role: string
}

export interface Story {
  slug: string
  title: string
  /** One-line dek under the title. */
  subtitle: string
  /** Where it is — "Rotterdam, NL" / "Roosevelt Island, NYC". */
  place: string
  category: CategoryId
  /** Ambient hue for the hero art + accents (0–360). */
  hue: number
  updated: string
  readingMinutes: number
  /** Editorial standfirst on the hero. */
  lead: string
  stats: StoryStat[]
  chapters: StoryChapter[]
  species: Species[]
  guardians: Guardian[]
  /** Slugs of reference articles that go deeper. */
  related: string[]
}

export const STORIES: Story[] = [
  {
    slug: "the-half-acre-forest",
    title: "The Half-Acre Forest",
    subtitle: "How a strip of dead ground between two warehouses became a living forest in a thousand days.",
    place: "Rotterdam, NL",
    category: "food-forests",
    hue: 132,
    updated: "2026-03-18",
    readingMinutes: 9,
    lead: "There was nothing here worth naming — compacted fill, a chain-link fence, the exhausted grey of a place the city had forgotten. Three winters later it is a forest you can lose yourself in. This is the story of how it grew, and what it teaches about the speed of regeneration.",
    stats: [
      { label: "Area", value: "0.4 ha" },
      { label: "Species planted", value: "42" },
      { label: "Trees per m²", value: "3" },
      { label: "Self-sustaining", value: "Year 3" },
    ],
    chapters: [
      {
        title: "The ground",
        paragraphs: [
          "Before a single seedling went in, the work was underground. The site had been a lorry yard: soil compacted to the density of a footpath, drainage nonexistent, the biology all but sterilised by years of oil and shade. Nothing about it said forest.",
          "The team broke the pan with forks rather than machines, folded in a metre-deep layer of compost, wood chip and local leaf mould, and inoculated it with fungi lifted from a nearby woodland. They were not planting trees so much as rebuilding the stomach that would one day feed them.",
        ],
        pullQuote: "They were not planting trees so much as rebuilding the stomach that would one day feed them.",
      },
      {
        title: "The planting",
        paragraphs: [
          "The method was Miyawaki's: plant dense, plant native, plant every layer at once. Forty-two species — canopy, sub-canopy, shrub, herb — went in at three young plants per square metre, close enough that they would compete for light from the first spring and race upward instead of out.",
          "It looks reckless. It is the opposite. Density is what triggers a forest's own logic: the plants shade out weeds, hold moisture, and shelter one another from wind and frost, so the whole community establishes years faster than a conventional, tidily-spaced planting ever could.",
        ],
      },
      {
        title: "The acceleration",
        paragraphs: [
          "By the end of the first year the fastest pioneers were above head height. By the second, the canopy had closed and the ground beneath had gone cool and dim and damp — the unmistakable microclimate of woodland. Weeding, watering and mowing stopped almost entirely.",
          "This is the part that surprises people: a Miyawaki planting reaches in a decade what an unmanaged plot might take a century to become. Not because the trees grow unnaturally fast, but because the whole system — soil, fungi, shade, cooperation — is switched on at once, on day one.",
        ],
        pullQuote: "A decade of forest in three years — because the whole system is switched on at once, on day one.",
      },
      {
        title: "What lives here now",
        paragraphs: [
          "The census in the third spring counted birds that had not been seen in that quarter of the city for a generation, four species of wild bee, and a fox that had quietly made the thicket its own. The forest had not been stocked with any of them. It had simply become a place worth arriving at.",
          "That is the quiet lesson of the half-acre forest. You do not have to import life. Build the conditions — the soil, the layers, the density, the patience of three short years — and life finds its own way back.",
        ],
      },
    ],
    species: [
      { common: "Small-leaved lime", latin: "Tilia cordata", role: "Canopy · nectar" },
      { common: "Hazel", latin: "Corylus avellana", role: "Sub-canopy · nuts" },
      { common: "Elder", latin: "Sambucus nigra", role: "Shrub · berries" },
      { common: "Wild garlic", latin: "Allium ursinum", role: "Ground · edible" },
      { common: "Alder", latin: "Alnus glutinosa", role: "Pioneer · nitrogen-fixer" },
      { common: "Dog rose", latin: "Rosa canina", role: "Thicket · hips, habitat" },
    ],
    guardians: [
      { name: "Maaike de Vries", role: "Forest maker · site design" },
      { name: "Tomás Herrera", role: "Soil & mycology" },
      { name: "The Delfshaven volunteers", role: "Planting & monitoring" },
    ],
    related: ["seven-layer-food-forest", "soil-food-web", "mycorrhizal-networks", "ecological-succession"],
  },
  {
    slug: "reading-a-raindrop",
    title: "Reading a Raindrop",
    subtitle: "Follow one drop of water across a regenerated hillside and watch a landscape learn to hold its rain.",
    place: "Alentejo, PT",
    category: "hydrology",
    hue: 202,
    updated: "2026-02-05",
    readingMinutes: 8,
    lead: "For decades the rain arrived here as a problem — sheeting off bare, baked slopes, taking the topsoil with it and leaving the land thirstier than before. Then the farmers stopped fighting the water and started reading it. This is what a single raindrop now does on its way down the hill.",
    stats: [
      { label: "Slope restored", value: "18 ha" },
      { label: "Swales cut", value: "2.4 km" },
      { label: "Infiltration", value: "×6" },
      { label: "Dry-season springs", value: "3 returned" },
    ],
    chapters: [
      {
        title: "The old way down",
        paragraphs: [
          "On the bare hillside a raindrop had one destiny: to run. It struck sun-hardened ground that shed it like glass, joined a hundred thousand others into a sheet, and was gone to the valley in minutes — carrying soil, cutting gullies, and leaving nothing behind but a little more damage than it found.",
          "A landscape that cannot slow its own water cannot keep it. Every storm was a withdrawal from an account that never received a deposit.",
        ],
        pullQuote: "A landscape that cannot slow its own water cannot keep it.",
      },
      {
        title: "On contour",
        paragraphs: [
          "The first move was to read the land's own shape. Following the contour lines — the level paths water itself would choose — the farmers cut shallow swales: ditches dug dead level, so that water running down the slope meets them and stops, spreading sideways instead of rushing on.",
          "Behind each swale they planted trees and left the excavated soil as a raised bank. Now the raindrop's journey changes. It reaches the swale and pools. It has nowhere to run, so it does the only thing left: it sinks.",
        ],
      },
      {
        title: "Underground",
        paragraphs: [
          "This is where the story leaves the surface. The drop soaks past the leaf litter, into soil that years of cover crops and mulch have made spongy and open, and down toward the water table. Multiplied across two kilometres of swales, the hillside now drinks six times the rain it once shed.",
          "Water stored underground does not evaporate and cannot flood. It moves slowly sideways through the hill, and — months later, in the dry heat of August — emerges again, cool and clean, at springs that had not run in living memory.",
        ],
        pullQuote: "Slow it, spread it, sink it — and the hill gives the water back in August.",
      },
      {
        title: "The hill that holds",
        paragraphs: [
          "A regenerated catchment is not wetter because it rains more. It is wetter because it lets go of less. The same storm that once scoured the slope now recharges it; the same drop that once did damage now does work.",
          "Reading a raindrop is really reading a whole landscape — its shape, its soil, its memory of water. Learn that language and a dying hillside becomes, one contour at a time, a place that keeps what it is given.",
        ],
      },
    ],
    species: [
      { common: "Cork oak", latin: "Quercus suber", role: "Canopy · deep roots" },
      { common: "Carob", latin: "Ceratonia siliqua", role: "Drought-hardy · pods" },
      { common: "Rosemary", latin: "Salvia rosmarinus", role: "Ground · pollinator" },
      { common: "Tagasaste", latin: "Cytisus proliferus", role: "Pioneer · nitrogen-fixer" },
      { common: "Lavender", latin: "Lavandula stoechas", role: "Bank · nectar" },
    ],
    guardians: [
      { name: "Inês Carvalho", role: "Keyline design & earthworks" },
      { name: "João Mendes", role: "Agroforestry" },
    ],
    related: ["watershed-thinking", "keyline-design", "swales-and-earthworks", "rainwater-harvesting"],
  },
]

export const STORY_BY_SLUG = new Map(STORIES.map((s) => [s.slug, s]))

export function getStory(slug: string): Story | undefined {
  return STORY_BY_SLUG.get(slug)
}

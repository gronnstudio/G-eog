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
  {
    slug: "voedselbos-ketelbroek",
    title: "Voedselbos Ketelbroek",
    subtitle: "On a former maize field near Groesbeek, the Netherlands' pioneering food forest has been proving for over fifteen years that a farm can feed people while it rewilds itself.",
    place: "Groesbeek, NL",
    category: "food-forests",
    hue: 88,
    updated: "2026-04-02",
    readingMinutes: 10,
    lead: "In 2009 this was two and a half hectares of maize monoculture — ploughed, sprayed, fed from a bag, and quiet. Wouter van Eck planted it with trees and then did something almost no farmer dares: nothing. No fertiliser, no pesticides, no irrigation, no tillage. Ketelbroek has been yielding more, not less, every year since — and the nightingale has come back to sing about it.",
    stats: [
      { label: "Area", value: "2.5 ha" },
      { label: "Planted", value: "2009" },
      { label: "Edible species", value: "~400" },
      { label: "External inputs", value: "0" },
    ],
    chapters: [
      {
        title: "The maize field",
        paragraphs: [
          "The starting point could hardly have been less promising or more ordinary: a flat Dutch maize field on the edge of the De Bruuk nature reserve, farmed the conventional way for decades. One crop, one harvest, one annual cycle of plough, spray and feed — a system that only ran as long as somebody kept paying its bills in diesel and nitrogen.",
          "Van Eck, a former campaigner with a farmer's patience, saw the field differently. If a natural forest can build fertility, hold water and defend itself with no one's help, then a forest designed around edible species should be able to do the same — and hand over a harvest as well. In the winter of 2009, with co-designer Pieter Jansen, he planted the counter-argument.",
        ],
        pullQuote: "If a wild forest needs no inputs, why should an edible one?",
      },
      {
        title: "Designing an ecosystem you can eat",
        paragraphs: [
          "Ketelbroek is not an orchard with extra steps. It is a forest ecosystem in which nearly every chosen species happens to be edible or useful: walnuts and chestnuts in the canopy, Asian pears and persimmons below them, Szechuan pepper, honeyberries and hundreds of other shrubs and herbs filling the layers down to the ground. Around four hundred edible species share the site, arranged the way a young woodland arranges itself.",
          "The design does the work management would otherwise have to do. Alders fix nitrogen for their neighbours. Deep roots pump minerals up from the subsoil. Fallen leaves are the fertiliser programme; the predators that moved into the tangle are the pest control. After the establishment years, the intervention budget settled at almost nothing — the forest is the machinery.",
        ],
      },
      {
        title: "Rising yields, rising life",
        paragraphs: [
          "Conventional intuition says an unmanaged field slides towards weeds and losses. Ketelbroek slid the other way. As the trees matured, harvests climbed year on year — nuts, fruit, shoots and leaves that go to restaurants and markets, picked from a system that was never once ploughed, sprayed or fed after planting.",
          "The biodiversity ledger climbed with it. Surveys by ecologists who began following the site found bird numbers and species multiplying far beyond the surrounding farmland, along with beetles, butterflies and other invertebrates rare in the region. The return that made the news was the nightingale — a bird of dense, scrubby young woodland, absent from tidy fields, now breeding in a place grown expressly for dinner.",
        ],
        pullQuote: "The harvest and the nightingale arrived by the same door: complexity.",
      },
      {
        title: "What Ketelbroek proves",
        paragraphs: [
          "One small site cannot feed a country, and Van Eck has never claimed it could. What Ketelbroek is, is an existence proof: food production and rich nature on the same hectares, with the input bill at zero — not a compromise between farming and ecology but a system where each carries the other.",
          "The proof is spreading. Ketelbroek became the reference site for a Dutch food-forest movement — the Green Deal Voedselbossen, larger successors like Voedselbos Schijndel, and a national foundation carrying the model onto hundreds of hectares. Every one of them is, in a sense, a cutting taken from a former maize field near Groesbeek.",
        ],
      },
    ],
    species: [
      { common: "Sweet chestnut", latin: "Castanea sativa", role: "Canopy · nuts" },
      { common: "Walnut", latin: "Juglans regia", role: "Canopy · nuts" },
      { common: "Italian alder", latin: "Alnus cordata", role: "Pioneer · nitrogen-fixer" },
      { common: "Asian pear", latin: "Pyrus pyrifolia", role: "Sub-canopy · fruit" },
      { common: "Szechuan pepper", latin: "Zanthoxylum simulans", role: "Shrub · spice" },
      { common: "Honeyberry", latin: "Lonicera caerulea", role: "Shrub · early berries" },
      { common: "Ramsons", latin: "Allium ursinum", role: "Ground · edible" },
    ],
    guardians: [
      { name: "Wouter van Eck", role: "Founder · design & harvest" },
      { name: "Pieter Jansen", role: "Co-designer · ecology" },
    ],
    related: ["seven-layer-food-forest", "ecological-succession", "urban-food-forests", "no-till-agriculture"],
  },
  {
    slug: "marker-wadden",
    title: "The Marker Wadden",
    subtitle: "How five islands built from mud turned one of Europe's deadest lakes back into a place worth flying to.",
    place: "Markermeer, NL",
    category: "biodiversity",
    hue: 197,
    updated: "2026-04-02",
    readingMinutes: 9,
    lead: "The Markermeer was an accident of engineering: a vast lake sealed off by a dike in 1976 for a land reclamation that never came, left to stew in its own suspended silt until the water turned to grey soup and the life drained out of it. The answer, when it finally arrived, was more engineering — but this time in nature's service. Since 2016, dredgers have been raising an archipelago out of the very mud that was killing the lake.",
    stats: [
      { label: "Lake area", value: "700 km²" },
      { label: "First island", value: "2016" },
      { label: "Archipelago", value: "1,300 ha" },
      { label: "Bird species", value: "150+" },
    ],
    chapters: [
      {
        title: "A lake in limbo",
        paragraphs: [
          "When the Houtribdijk cut the Markermeer off from the IJsselmeer, it created a shallow basin with no tides, no rivers to speak of, and no way out for its sediment. Every storm stirred the soft clay floor into the water column, where it hung as a permanent murk — smothering light, clogging the filter-feeding mussels, starving the fish that fed on them and the birds that fed on the fish.",
          "For decades the counts went one way. Ecologists watched populations of smelt, mussels and waterbirds slide, and filed the Markermeer under a bleak heading: a lake too engineered to live and too expensive to undo.",
        ],
        pullQuote: "The lake was drowning in its own stirred-up floor.",
      },
      {
        title: "Building with the enemy",
        paragraphs: [
          "The idea that broke the stalemate came from Natuurmonumenten, the Dutch conservation society: if the sediment is the problem, make it the raw material. Working with Boskalis and the national water authorities, they began in 2016 to dredge the troublesome silt and clay and spray it, layer by layer, into ring dikes of sand — letting mud settle, drain and consolidate into land.",
          "It was a genuine experiment. Nobody had built islands from material this soft at this scale, and the ground itself had to be coaxed: as the mud dewatered it shrank and sank, and the builders learned to over-fill, to plant pioneering vegetation whose roots knit the surface, and to let wind and wave finish the sculpting. Building with nature, they call it — engineering that recruits natural processes instead of overruling them.",
        ],
      },
      {
        title: "The birds vote first",
        paragraphs: [
          "Life did not wait for the ribbon-cutting. Bare, wet, predator-free mudflats are the rarest of commodities in north-west Europe, and the first breeding season on the unfinished islands brought colonies of common terns nesting on ground the dredgers had barely left. Avocets, plovers and shelduck followed; by the archipelago's fifth year, surveys were recording well over a hundred and fifty bird species, with thousands of pairs breeding.",
          "Below the waterline the gradient did its work. The sheltered bays between the islands let silt drop out of suspension, clearing the water locally; light reached the bottom again, plants and insects returned, and fish moved into the warm shallows to spawn — rebuilding, link by link, the food web the murk had dismantled.",
        ],
        pullQuote: "Bare mud, safe from foxes — the rarest luxury a coastal bird can be offered.",
      },
      {
        title: "Lessons from a made place",
        paragraphs: [
          "The Marker Wadden are unapologetically artificial, and that is the point. In a country where almost every hectare is designed, the archipelago demonstrates that design can run in nature's favour — that the same dredgers, dikes and delta expertise that once erased Dutch wetlands can be turned around to build them.",
          "The deeper lesson is about incompleteness. The islands were handed over unfinished on purpose: low, soft, mobile, with room for storms and succession to redraw them. A nature reserve, the builders argue, should not be a finished product but a starting condition — you supply the substrate and the safety, and the ecosystem writes the rest itself.",
        ],
      },
    ],
    species: [
      { common: "Common tern", latin: "Sterna hirundo", role: "Pioneer coloniser · fish-eater" },
      { common: "Pied avocet", latin: "Recurvirostra avosetta", role: "Mudflat breeder" },
      { common: "Kentish plover", latin: "Anarhynchus alexandrinus", role: "Rare pioneer breeder" },
      { common: "Common reed", latin: "Phragmites australis", role: "Soil-binder · marsh builder" },
      { common: "Zebra mussel", latin: "Dreissena polymorpha", role: "Filter-feeder · water clarity" },
      { common: "European smelt", latin: "Osmerus eperlanus", role: "Keystone forage fish" },
    ],
    guardians: [
      { name: "Natuurmonumenten", role: "Initiator · site management" },
      { name: "Rijkswaterstaat", role: "Water authority · co-funder" },
      { name: "Boskalis crews", role: "Dredging & construction" },
    ],
    related: ["rewilding", "trophic-cascades", "keystone-species", "watershed-thinking"],
  },
]

export const STORY_BY_SLUG = new Map(STORIES.map((s) => [s.slug, s]))

export function getStory(slug: string): Story | undefined {
  return STORY_BY_SLUG.get(slug)
}

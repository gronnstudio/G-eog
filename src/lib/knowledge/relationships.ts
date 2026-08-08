import type { Relationship } from "./types"

/**
 * The typed edges of the knowledge graph.
 *
 * Until now a connection between two articles was a bare slug in a
 * `related: string[]` array — it told you *that* two ideas touch, and
 * nothing about *how*. Every edge here carries a direction, a relationship
 * type, a sentence explaining the link, and an honest evidence level.
 *
 * Direction matters: `source` → `target` reads as a sentence with the
 * type as its verb ("mycorrhizal networks *enable* tree communication").
 * Reversing an edge changes its meaning, so edges are authored once, in
 * the direction that reads true.
 *
 * Evidence is deliberately coarse. `strong` means textbook-settled;
 * `moderate` means well supported but with real debate at the edges;
 * `emerging` means an active and unfinished research area. Where a claim
 * is genuinely contested in the literature, say so rather than rounding up.
 */
export const RELATIONSHIPS: Relationship[] = [
  // ── Soil ────────────────────────────────────────────────────────────
  {
    source: "soil-food-web",
    target: "mycorrhizal-networks",
    type: "contains",
    description:
      "Mycorrhizal fungi are one guild within the wider soil economy — the part that plugs directly into living roots.",
    evidence: "strong",
  },
  {
    source: "soil-food-web",
    target: "compost-science",
    type: "applied_in",
    description:
      "A compost heap is the soil food web run deliberately: the same decomposer guilds, concentrated and accelerated.",
    evidence: "strong",
  },
  {
    source: "soil-food-web",
    target: "nutrient-cycling",
    type: "enables",
    description:
      "Bacteria, fungi and their predators are the machinery that turns locked-up organic matter into plant-available nutrition.",
    evidence: "strong",
  },
  {
    source: "soil-food-web",
    target: "carbon-sequestration",
    type: "contributes_to",
    description:
      "Microbial necromass and fungal binding agents are a major route by which carbon becomes stable soil organic matter.",
    evidence: "moderate",
  },
  {
    source: "soil-food-web",
    target: "nitrogen-fixation",
    type: "contains",
    description:
      "Nitrogen-fixing bacteria are members of the web — both free-living in the soil and housed inside root nodules.",
    evidence: "strong",
  },
  {
    source: "photosynthesis",
    target: "soil-food-web",
    type: "supports",
    description:
      "A large share of what a plant fixes is exuded from its roots as sugars — the soil food web is fed from above.",
    evidence: "strong",
  },
  {
    source: "no-till-agriculture",
    target: "soil-food-web",
    type: "supports",
    description:
      "Leaving the soil unturned keeps fungal hyphae and aggregate structure intact rather than shredding them annually.",
    evidence: "strong",
  },
  {
    source: "no-till-agriculture",
    target: "compost-science",
    type: "interacts_with",
    description:
      "Without tillage to incorporate residues, surface-applied compost becomes the main way organic matter enters the system.",
    evidence: "moderate",
  },
  {
    source: "no-till-agriculture",
    target: "chop-and-drop-mulching",
    type: "enables",
    description:
      "Once you stop inverting soil, cutting biomass and leaving it where it falls becomes the logical way to feed the surface.",
    evidence: "strong",
  },
  {
    source: "no-till-agriculture",
    target: "carbon-sequestration",
    type: "contributes_to",
    description:
      "Undisturbed soil loses less carbon to oxidation, though the size and permanence of the gain is actively debated.",
    evidence: "contested",
  },
  {
    source: "no-till-agriculture",
    target: "regenerative-grazing",
    type: "associated_with",
    description:
      "Both refuse the plough as the default tool and rely on living roots holding the ground year-round.",
    evidence: "moderate",
  },
  {
    source: "regenerative-grazing",
    target: "soil-food-web",
    type: "supports",
    description:
      "Short, intense grazing followed by long rest lets roots regrow deeply, pumping fresh carbon into the soil biology.",
    evidence: "moderate",
  },
  {
    source: "compost-science",
    target: "nutrient-cycling",
    type: "transforms",
    description:
      "Composting is nutrient cycling under management — the same decay, run hot, fast and contained.",
    evidence: "strong",
  },
  {
    source: "compost-science",
    target: "regenerative-grazing",
    type: "associated_with",
    description:
      "Grazing animals return nutrients as manure; composting does the same job when the animals aren't there.",
    evidence: "strong",
  },
  {
    source: "chop-and-drop-mulching",
    target: "compost-science",
    type: "applied_in",
    description:
      "Composting in place: no heap, no turning, decomposition happening exactly where the nutrients are needed.",
    evidence: "strong",
  },
  {
    source: "chop-and-drop-mulching",
    target: "soil-food-web",
    type: "supports",
    description:
      "A permanent surface litter layer is the habitat the fungal and detritivore end of the web actually needs.",
    evidence: "strong",
  },
  {
    source: "chop-and-drop-mulching",
    target: "nutrient-cycling",
    type: "contributes_to",
    description:
      "Nutrients drawn up by deep-rooted plants return to the surface instead of leaving the site.",
    evidence: "strong",
  },
  {
    source: "chop-and-drop-mulching",
    target: "seven-layer-food-forest",
    type: "applied_in",
    description:
      "Support species in the design exist partly to be cut down — their biomass is the system's fertility.",
    evidence: "strong",
  },

  // ── Fungi & forests ─────────────────────────────────────────────────
  {
    source: "mycorrhizal-networks",
    target: "tree-communication",
    type: "enables",
    description:
      "The fungal network is the physical medium along which signals and resources are proposed to travel between trees.",
    evidence: "emerging",
  },
  {
    source: "mycorrhizal-networks",
    target: "forest-microclimates",
    type: "contributes_to",
    description:
      "Better-supplied trees hold fuller canopies, and canopy is what buffers the temperature and humidity beneath it.",
    evidence: "moderate",
  },
  {
    source: "mycorrhizal-networks",
    target: "photosynthesis",
    type: "exchanges",
    description:
      "A direct trade: photosynthetic sugars out of the plant, fungal-mined phosphorus and water back in.",
    evidence: "strong",
  },
  {
    source: "mycorrhizal-networks",
    target: "nutrient-cycling",
    type: "increases",
    description:
      "Hyphae extend the effective absorbing surface of a root system by orders of magnitude.",
    evidence: "strong",
  },
  {
    source: "tree-communication",
    target: "forest-microclimates",
    type: "interacts_with",
    description:
      "The stable, humid interior of a closed forest is the condition under which below-ground networks stay connected.",
    evidence: "emerging",
  },
  {
    source: "tree-communication",
    target: "photosynthesis",
    type: "depends_on",
    description:
      "Whatever is shared between trees was paid for in fixed carbon first.",
    evidence: "strong",
  },
  {
    source: "tree-communication",
    target: "ecological-succession",
    type: "influences",
    description:
      "If established trees subsidise seedlings, they help decide which species reach the next generation.",
    evidence: "emerging",
  },
  {
    source: "tree-communication",
    target: "biophilia",
    type: "influences",
    description:
      "The idea that forests are social has done more to change public feeling about trees than any timber statistic.",
    evidence: "limited",
  },
  {
    source: "forest-microclimates",
    target: "rewilding",
    type: "contributes_to",
    description:
      "Restoring canopy restores the cool, damp interior conditions that specialist woodland species need to return.",
    evidence: "strong",
  },

  // ── Carbon, water, climate ──────────────────────────────────────────
  {
    source: "carbon-sequestration",
    target: "photosynthesis",
    type: "depends_on",
    description:
      "Every gram of biologically sequestered carbon enters the system through a leaf first.",
    evidence: "strong",
  },
  {
    source: "carbon-sequestration",
    target: "nutrient-cycling",
    type: "interacts_with",
    description:
      "Carbon storage and nutrient release draw on the same organic matter; how fast it decays decides which one you get.",
    evidence: "strong",
  },
  {
    source: "carbon-sequestration",
    target: "regenerative-grazing",
    type: "applied_in",
    description:
      "Planned grazing is one of the field practices claimed to move atmospheric carbon into grassland soils.",
    evidence: "contested",
  },
  {
    source: "carbon-sequestration",
    target: "compost-science",
    type: "applied_in",
    description:
      "Compost is a deliberate route for returning relatively stable carbon to soil rather than losing it to the air.",
    evidence: "moderate",
  },
  {
    source: "the-water-cycle",
    target: "watershed-thinking",
    type: "applied_in",
    description:
      "Watershed thinking is the water cycle read at the scale you can actually act on — one catchment at a time.",
    evidence: "strong",
  },
  {
    source: "the-water-cycle",
    target: "rainwater-harvesting",
    type: "applied_in",
    description:
      "Harvesting intercepts the cycle at its most available moment, before runoff carries it off the site.",
    evidence: "strong",
  },
  {
    source: "the-water-cycle",
    target: "forest-microclimates",
    type: "regulates",
    description:
      "Evapotranspiration and condensation are what keep a forest measurably cooler and wetter than open ground.",
    evidence: "strong",
  },
  {
    source: "the-water-cycle",
    target: "photosynthesis",
    type: "enables",
    description:
      "Water split inside the chloroplast supplies the electrons that drive the whole reaction.",
    evidence: "strong",
  },
  {
    source: "the-water-cycle",
    target: "swales-and-earthworks",
    type: "applied_in",
    description:
      "Earthworks slow, spread and sink water — an intervention aimed squarely at the runoff arm of the cycle.",
    evidence: "strong",
  },
  {
    source: "watershed-thinking",
    target: "rainwater-harvesting",
    type: "enables",
    description:
      "Reading the catchment tells you where water arrives, how fast, and therefore where it is worth catching.",
    evidence: "strong",
  },
  {
    source: "watershed-thinking",
    target: "swales-and-earthworks",
    type: "enables",
    description:
      "Contour is only meaningful once you know where the water is coming from and where it is going.",
    evidence: "strong",
  },
  {
    source: "watershed-thinking",
    target: "carbon-sequestration",
    type: "influences",
    description:
      "Water retained in a landscape is what lets vegetation grow long enough to accumulate carbon at all.",
    evidence: "moderate",
  },
  {
    source: "rainwater-harvesting",
    target: "swales-and-earthworks",
    type: "interacts_with",
    description:
      "Tanks catch roof water; swales catch everything else. Most sites need both, sized against each other.",
    evidence: "strong",
  },
  {
    source: "rainwater-harvesting",
    target: "passive-solar-design",
    type: "associated_with",
    description:
      "Both are decided in the same moment of siting a building — where it sits determines both sun and water.",
    evidence: "moderate",
  },
  {
    source: "passive-solar-design",
    target: "forest-microclimates",
    type: "associated_with",
    description:
      "The same physics at different scales: shade, thermal mass and air movement, whether the structure is a wall or a canopy.",
    evidence: "moderate",
  },
  {
    source: "passive-solar-design",
    target: "the-water-cycle",
    type: "interacts_with",
    description:
      "Roofs, hard surfaces and planting decide how much of a site's rainfall infiltrates and how much runs off.",
    evidence: "strong",
  },
  {
    source: "passive-solar-design",
    target: "doughnut-economics",
    type: "contributes_to",
    description:
      "Buildings that need almost no bought energy are one of the clearest ways to live inside the ecological ceiling.",
    evidence: "moderate",
  },
  {
    source: "passive-solar-design",
    target: "biophilia",
    type: "interacts_with",
    description:
      "Daylight, outlook and thermal comfort are also the conditions people consistently report as feeling good.",
    evidence: "moderate",
  },

  // ── Design systems ──────────────────────────────────────────────────
  {
    source: "keyline-design",
    target: "swales-and-earthworks",
    type: "contains",
    description:
      "Keyline geometry decides where the lines go; swales and dams are the earthworks that execute them.",
    evidence: "strong",
  },
  {
    source: "keyline-design",
    target: "watershed-thinking",
    type: "depends_on",
    description:
      "The whole method starts by reading the land as ridges and valleys and finding the keypoint.",
    evidence: "strong",
  },
  {
    source: "keyline-design",
    target: "rainwater-harvesting",
    type: "contributes_to",
    description:
      "Keyline pattern moves water from valleys onto dry ridges, storing it in the soil rather than a tank.",
    evidence: "strong",
  },
  {
    source: "keyline-design",
    target: "regenerative-grazing",
    type: "interacts_with",
    description:
      "The pattern and planned grazing were developed together, each depending on the other to build pasture soil.",
    evidence: "moderate",
  },
  {
    source: "keyline-design",
    target: "soil-food-web",
    type: "supports",
    description:
      "Shallow keyline subsoiling aerates and drains without inverting, so fungal networks survive the pass.",
    evidence: "moderate",
  },
  {
    source: "swales-and-earthworks",
    target: "seven-layer-food-forest",
    type: "supports",
    description:
      "Earthworks are usually the first stage: shape the water, then plant into the wetter ground it creates.",
    evidence: "strong",
  },
  {
    source: "seven-layer-food-forest",
    target: "ecological-succession",
    type: "depends_on",
    description:
      "The design is a way of holding a system at a chosen, productive point in succession rather than letting it close.",
    evidence: "strong",
  },
  {
    source: "seven-layer-food-forest",
    target: "nitrogen-fixation",
    type: "requires",
    description:
      "Without nitrogen-fixing shrubs and trees in the mix, the system needs fertility trucked in from outside.",
    evidence: "strong",
  },
  {
    source: "seven-layer-food-forest",
    target: "urban-food-forests",
    type: "applied_in",
    description:
      "The same seven layers, compressed into the space and soil constraints of a city plot.",
    evidence: "strong",
  },
  {
    source: "seven-layer-food-forest",
    target: "pollinator-networks",
    type: "supports",
    description:
      "Layered planting flowers in sequence from early spring to late autumn — a continuous forage supply.",
    evidence: "strong",
  },
  {
    source: "seven-layer-food-forest",
    target: "forgotten-vegetables-and-crop-diversity",
    type: "contains",
    description:
      "Perennial and shade-tolerant crops that industrial agriculture abandoned are exactly what the lower layers need.",
    evidence: "strong",
  },
  {
    source: "miyawaki-mini-forests",
    target: "ecological-succession",
    type: "transforms",
    description:
      "Dense, multi-layer planting of native species compresses decades of succession into a handful of years.",
    evidence: "moderate",
  },
  {
    source: "miyawaki-mini-forests",
    target: "forest-microclimates",
    type: "causes",
    description:
      "Canopy closes fast, and with it comes measurable cooling and humidity inside a very small footprint.",
    evidence: "moderate",
  },
  {
    source: "miyawaki-mini-forests",
    target: "seven-layer-food-forest",
    type: "associated_with",
    description:
      "Both plant in layers and both plant densely — one optimises for ecology, the other for yield.",
    evidence: "strong",
  },
  {
    source: "urban-food-forests",
    target: "miyawaki-mini-forests",
    type: "associated_with",
    description:
      "Two answers to the same question: what is the most life you can fit into a neglected urban parcel?",
    evidence: "strong",
  },
  {
    source: "urban-food-forests",
    target: "nutrient-cycling",
    type: "applied_in",
    description:
      "City organic waste becomes the fertility source, closing a loop that normally ends at a landfill.",
    evidence: "moderate",
  },

  // ── Ecology ─────────────────────────────────────────────────────────
  {
    source: "nitrogen-fixation",
    target: "nutrient-cycling",
    type: "contributes_to",
    description:
      "Fixation is where new nitrogen enters the system; everything after it is recycling.",
    evidence: "strong",
  },
  {
    source: "nitrogen-fixation",
    target: "compost-science",
    type: "interacts_with",
    description:
      "Legume residues are the nitrogen half of the carbon-to-nitrogen ratio a heap needs to heat up.",
    evidence: "strong",
  },
  {
    source: "nitrogen-fixation",
    target: "photosynthesis",
    type: "depends_on",
    description:
      "Fixing nitrogen is metabolically expensive, and the plant pays for it entirely in photosynthetic sugar.",
    evidence: "strong",
  },
  {
    source: "ecological-succession",
    target: "rewilding",
    type: "enables",
    description:
      "Rewilding is largely the decision to stop interrupting succession and let it run.",
    evidence: "strong",
  },
  {
    source: "ecological-succession",
    target: "trophic-cascades",
    type: "interacts_with",
    description:
      "Which stage a system reaches depends on who is eating whom on the way there.",
    evidence: "strong",
  },
  {
    source: "ecological-succession",
    target: "forest-microclimates",
    type: "precedes",
    description:
      "Canopy closure is the successional step that creates a forest interior climate in the first place.",
    evidence: "strong",
  },
  {
    source: "ecological-succession",
    target: "keystone-species",
    type: "influences",
    description:
      "A single species arriving or vanishing can redirect the whole trajectory of a site.",
    evidence: "strong",
  },
  {
    source: "trophic-cascades",
    target: "keystone-species",
    type: "depends_on",
    description:
      "A cascade needs a species whose influence is wildly out of proportion to its abundance.",
    evidence: "strong",
  },
  {
    source: "trophic-cascades",
    target: "rewilding",
    type: "applied_in",
    description:
      "Reintroducing a missing predator is an attempt to restart a cascade that stopped.",
    evidence: "moderate",
  },
  {
    source: "trophic-cascades",
    target: "pollinator-networks",
    type: "influences",
    description:
      "Predation pressure shapes which pollinators are abundant, and therefore which plants get pollinated.",
    evidence: "moderate",
  },
  {
    source: "trophic-cascades",
    target: "regenerative-grazing",
    type: "associated_with",
    description:
      "Planned grazing tries to reproduce, with fencing, the herd movement that predators once enforced.",
    evidence: "moderate",
  },
  {
    source: "pollinator-networks",
    target: "rewilding",
    type: "contributes_to",
    description:
      "Pollinator recovery is both an outcome of rewilding and one of the mechanisms that carries it forward.",
    evidence: "strong",
  },
  {
    source: "pollinator-networks",
    target: "the-case-for-native-plants",
    type: "depends_on",
    description:
      "Specialist pollinators can only use the plants they co-evolved with — ornamental nectar is no substitute.",
    evidence: "strong",
  },
  {
    source: "pollinator-networks",
    target: "urban-food-forests",
    type: "supports",
    description:
      "Most urban fruit set depends on wild pollinators, not managed hives.",
    evidence: "strong",
  },
  {
    source: "pollinator-networks",
    target: "keystone-species",
    type: "contains",
    description:
      "A few generalist pollinators hold a disproportionate share of the network together.",
    evidence: "moderate",
  },
  {
    source: "rewilding",
    target: "keystone-species",
    type: "requires",
    description:
      "Without the species that structure the system, rewilding produces scrub rather than a functioning ecosystem.",
    evidence: "moderate",
  },
  {
    source: "rewilding",
    target: "miyawaki-mini-forests",
    type: "applied_in",
    description:
      "The Miyawaki method is rewilding at the smallest workable scale — a car park's worth at a time.",
    evidence: "moderate",
  },
  {
    source: "keystone-species",
    target: "nutrient-cycling",
    type: "influences",
    description:
      "Beavers, salmon and large grazers physically move nutrients across a landscape that would otherwise stay put.",
    evidence: "strong",
  },
  {
    source: "the-case-for-native-plants",
    target: "keystone-species",
    type: "contains",
    description:
      "A small number of native genera support the overwhelming majority of local insect herbivores.",
    evidence: "strong",
  },
  {
    source: "the-case-for-native-plants",
    target: "rewilding",
    type: "requires",
    description:
      "Restoration built on the wrong plant palette rebuilds the structure without the food web.",
    evidence: "strong",
  },
  {
    source: "the-case-for-native-plants",
    target: "miyawaki-mini-forests",
    type: "applied_in",
    description:
      "Strict use of locally native species is not a preference in the method — it is the method.",
    evidence: "strong",
  },
  {
    source: "the-case-for-native-plants",
    target: "biophilia",
    type: "influences",
    description:
      "Planting what belongs to a place is how a garden starts to feel like somewhere rather than anywhere.",
    evidence: "limited",
  },
  {
    source: "forgotten-vegetables-and-crop-diversity",
    target: "urban-food-forests",
    type: "applied_in",
    description:
      "Shade-tolerant, perennial and forgotten crops are the ones that actually thrive in a layered city planting.",
    evidence: "moderate",
  },
  {
    source: "forgotten-vegetables-and-crop-diversity",
    target: "nutrient-cycling",
    type: "interacts_with",
    description:
      "Deep-rooted heritage crops reach nutrients that shallow modern annuals never touch.",
    evidence: "moderate",
  },
  {
    source: "forgotten-vegetables-and-crop-diversity",
    target: "no-till-agriculture",
    type: "associated_with",
    description:
      "Perennial and self-seeding crops make sense precisely where the ground is never turned over.",
    evidence: "moderate",
  },
  {
    source: "forgotten-vegetables-and-crop-diversity",
    target: "pollinator-networks",
    type: "supports",
    description:
      "Crops allowed to flower and set seed feed pollinators; crops harvested before flowering never do.",
    evidence: "strong",
  },

  // ── Philosophy & economics ──────────────────────────────────────────
  {
    source: "biophilia",
    target: "deep-ecology",
    type: "precedes",
    description:
      "Biophilia is the felt affinity; deep ecology is the ethical position built on top of it.",
    evidence: "moderate",
  },
  {
    source: "biophilia",
    target: "urban-food-forests",
    type: "influences",
    description:
      "The measurable human response to green space is most of the political argument for planting cities.",
    evidence: "strong",
  },
  {
    source: "biophilia",
    target: "forest-microclimates",
    type: "associated_with",
    description:
      "The conditions people describe as restorative are largely the physical conditions of a forest interior.",
    evidence: "moderate",
  },
  {
    source: "deep-ecology",
    target: "rewilding",
    type: "influences",
    description:
      "Rewilding's willingness to hand control back to a landscape comes straight out of this ethic.",
    evidence: "moderate",
  },
  {
    source: "deep-ecology",
    target: "nutrient-cycling",
    type: "associated_with",
    description:
      "A worldview where nothing is waste and everything is somebody's input has an obvious material analogue.",
    evidence: "limited",
  },
  {
    source: "deep-ecology",
    target: "keystone-species",
    type: "influences",
    description:
      "It reframes a species as valuable in itself, not for the ecosystem services it renders us.",
    evidence: "limited",
  },
  {
    source: "doughnut-economics",
    target: "nutrient-cycling",
    type: "associated_with",
    description:
      "Circular nutrient flow is what an economy operating inside the ecological ceiling looks like in physical terms.",
    evidence: "moderate",
  },
  {
    source: "doughnut-economics",
    target: "deep-ecology",
    type: "interacts_with",
    description:
      "Both reject growth as the goal, and disagree productively about whether humans sit inside or above the system.",
    evidence: "moderate",
  },
  {
    source: "doughnut-economics",
    target: "carbon-sequestration",
    type: "requires",
    description:
      "Returning below the climate ceiling needs drawdown, not only reduced emissions.",
    evidence: "strong",
  },
  {
    source: "doughnut-economics",
    target: "biophilia",
    type: "influences",
    description:
      "The social foundation of the doughnut includes access to nature as a need, not an amenity.",
    evidence: "limited",
  },
]

import type { Category } from "./types"

/**
 * The 24 domains of the Equilibrium ecosystem. Hues are spread around the
 * wheel but pulled toward greens and earth tones so the graph reads as a
 * living organism rather than a rainbow.
 */
export const CATEGORIES: Category[] = [
  { id: "soil", title: "Soil", tagline: "The living skin of the earth", hue: 28, icon: "Layers", description: "The thin, breathing membrane where geology, biology and chemistry meet. Soil stores carbon, filters water and feeds nearly all terrestrial life." },
  { id: "water", title: "Water", tagline: "The circulatory system of the biosphere", hue: 200, icon: "Droplets", description: "How water moves, stores, cleans and connects — from raindrop to aquifer to ocean and back into the sky." },
  { id: "trees", title: "Trees", tagline: "Standing rivers of carbon and time", hue: 130, icon: "Trees", description: "The architecture of forests: how trees grow, communicate, cooperate and shape the climate around them." },
  { id: "plants", title: "Plants", tagline: "The engineers of the living world", hue: 110, icon: "Sprout", description: "Photosynthesis, succession, defence and reproduction — the strategies plants use to turn light into life." },
  { id: "microbiology", title: "Microbiology", tagline: "The invisible majority", hue: 300, icon: "Microscope", description: "Bacteria, archaea and the microbial engines that drive every nutrient cycle on the planet." },
  { id: "fungi", title: "Fungi", tagline: "The internet beneath the forest", hue: 32, icon: "Network", description: "Mycelial networks, decomposition and the symbioses that quietly hold ecosystems together." },
  { id: "animals", title: "Animals", tagline: "The movers of the ecosystem", hue: 20, icon: "Rabbit", description: "Grazers, predators, pollinators and engineers — how animal behaviour shapes landscapes." },
  { id: "climate", title: "Climate", tagline: "The pattern behind the weather", hue: 190, icon: "CloudSun", description: "Energy balance, feedback loops and the systems thinking needed to understand a changing climate." },
  { id: "permaculture", title: "Permaculture", tagline: "Design by observing nature", hue: 95, icon: "Compass", description: "An ethics-led design system for productive, resilient human habitats modelled on natural ecosystems." },
  { id: "food-forests", title: "Food Forests", tagline: "Edible ecosystems in seven layers", hue: 85, icon: "Apple", description: "Perennial polycultures that mimic forest structure to produce food with minimal input." },
  { id: "construction", title: "Construction", tagline: "Building with the grain of nature", hue: 40, icon: "Hammer", description: "Natural materials, passive design and regenerative building that gives back more than it takes." },
  { id: "energy", title: "Energy", tagline: "The current that powers change", hue: 48, icon: "Zap", description: "Flows, storage and the transition to systems that run on sunlight rather than stored carbon." },
  { id: "biology", title: "Biology", tagline: "The logic of the living", hue: 145, icon: "Dna", description: "Cells, evolution and the shared grammar that connects every organism on earth." },
  { id: "chemistry", title: "Chemistry", tagline: "The exchange of matter", hue: 265, icon: "FlaskConical", description: "The reactions and cycles — carbon, nitrogen, phosphorus — that move matter through the biosphere." },
  { id: "ecology", title: "Ecology", tagline: "The study of relationships", hue: 155, icon: "Waypoints", description: "Populations, communities and the web of interactions that make ecosystems more than their parts." },
  { id: "landscape-design", title: "Landscape Design", tagline: "Composing living space", hue: 75, icon: "PencilRuler", description: "The craft of shaping land for beauty, function and ecological health at once." },
  { id: "urban-ecology", title: "Urban Ecology", tagline: "Nature inside the city", hue: 165, icon: "Building2", description: "How ecosystems form and function within cities — and how to design cities that support them." },
  { id: "hydrology", title: "Hydrology", tagline: "Reading the flow of catchments", hue: 205, icon: "Waves", description: "Watersheds, infiltration and the slow, spread, sink logic of keeping water in the landscape." },
  { id: "botany", title: "Botany", tagline: "The science of plant life", hue: 120, icon: "Leaf", description: "Anatomy, physiology and taxonomy — the deep study of how plants are built and named." },
  { id: "biodiversity", title: "Biodiversity", tagline: "The wealth of life", hue: 140, icon: "Flower2", description: "Why variety at every scale — gene, species, ecosystem — is the foundation of resilience." },
  { id: "philosophy", title: "Philosophy", tagline: "How we think about nature", hue: 250, icon: "BookOpen", description: "Ethics, worldviews and the ideas that shape our relationship with the living world." },
  { id: "psychology", title: "Psychology", tagline: "The mind in the landscape", hue: 285, icon: "Brain", description: "Attention, wellbeing and behaviour — how nature shapes the mind and how minds shape nature." },
  { id: "economics", title: "Economics", tagline: "The accounting of nature", hue: 52, icon: "Coins", description: "Valuing ecosystems, rethinking growth and designing economies that operate within planetary limits." },
  { id: "circular-systems", title: "Circular Systems", tagline: "Waste is a design flaw", hue: 170, icon: "Recycle", description: "Closed loops of materials and nutrients that mirror the zero-waste logic of natural ecosystems." },
]

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(id: string): Category | undefined {
  return CATEGORY_BY_ID.get(id as Category["id"])
}

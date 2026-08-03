import type { LearningPath } from "./types"

/**
 * Guided sequences through the ecosystem. Each step points at an article
 * slug; the UI resolves titles and progress. Steps reference slugs from
 * articles.ts — if a slug is missing the resolver simply skips it, so
 * paths never hard-fail the build.
 */
export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "reading-the-living-soil",
    title: "Reading the Living Soil",
    summary:
      "Start beneath your feet. Learn to see soil as a living system — the food web, the fungal networks and the practices that keep it alive.",
    difficulty: "foundational",
    hours: 6,
    steps: [
      { slug: "soil-food-web", note: "Meet the organisms that make soil alive." },
      { slug: "mycorrhizal-networks", note: "How fungi wire the underground economy." },
      { slug: "compost-science", note: "Turning death back into fertility." },
      { slug: "no-till-agriculture", note: "Growing food without breaking the web." },
      { slug: "nutrient-cycling", note: "Closing the loop above and below ground." },
    ],
  },
  {
    slug: "designing-with-water",
    title: "Designing With Water",
    summary:
      "Follow a raindrop from the sky to the aquifer and learn to slow, spread and sink it across a landscape.",
    difficulty: "intermediate",
    hours: 7,
    steps: [
      { slug: "the-water-cycle", note: "The planet's circulatory system." },
      { slug: "watershed-thinking", note: "Reading the shape of a catchment." },
      { slug: "keyline-design", note: "Working with the land's own contours." },
      { slug: "swales-and-earthworks", note: "Building landscapes that harvest rain." },
      { slug: "rainwater-harvesting", note: "Capturing water where it falls." },
    ],
  },
  {
    slug: "the-forest-as-teacher",
    title: "The Forest as Teacher",
    summary:
      "Understand how a forest cooperates, communicates and regenerates — then bring that intelligence into your own designs.",
    difficulty: "intermediate",
    hours: 8,
    steps: [
      { slug: "tree-communication", note: "The wood-wide web in action." },
      { slug: "forest-microclimates", note: "How canopies engineer their own weather." },
      { slug: "ecological-succession", note: "How bare ground becomes forest." },
      { slug: "seven-layer-food-forest", note: "Designing an edible forest." },
      { slug: "rewilding", note: "Letting ecosystems lead." },
    ],
  },
  {
    slug: "systems-thinking-for-regeneration",
    title: "Systems Thinking for Regeneration",
    summary:
      "Zoom out. Connect ecology, economics and philosophy into a coherent worldview for designing regenerative futures.",
    difficulty: "advanced",
    hours: 9,
    steps: [
      { slug: "trophic-cascades", note: "How one species reshapes a whole system." },
      { slug: "keystone-species", note: "The disproportionate power of connection." },
      { slug: "doughnut-economics", note: "An economy within planetary limits." },
      { slug: "deep-ecology", note: "Rethinking our place in the web of life." },
      { slug: "biophilia", note: "Why we are wired to need the living world." },
    ],
  },
]

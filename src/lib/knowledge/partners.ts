import type { CategoryId } from "./types"

/**
 * Partners — organisations doing the practical work that the knowledge
 * graph describes. Where an article explains *why* soil life matters and a
 * field story walks a place that proved it, a partner is someone applying
 * it commercially, in gardens and on land, right now.
 *
 * Everything here is sourced from the partner's own public material and
 * kept factual: we describe what they do and link out. No invented contact
 * details, no invented claims — where a partner states a figure it is
 * attributed to them, not asserted by Equilibrium.
 */

export interface Bilingual {
  en: string
  nl: string
}

/** One step or component of a partner's working method. */
export interface PartnerMethodStep {
  /** Product or step name as the partner brands it. */
  name: string
  /** What role it plays — "Soil life", "Minerals", "Nutrition". */
  role: Bilingual
  body: Bilingual
}

export interface PartnerLink {
  label: Bilingual
  href: string
}

export interface PartnerFact {
  label: Bilingual
  value: Bilingual
}

export interface Partner {
  slug: string
  /** Trading name, as they write it. */
  name: string
  /** Registered entity, when it differs from the trading name. */
  legalName?: string
  /** Where they operate. */
  place: string
  /** Primary site. */
  website: string
  /** One-line description. */
  tagline: Bilingual
  /** Ambient hue for accents (0–360), matched to their domain. */
  hue: number
  /** Knowledge categories their work touches. */
  domains: CategoryId[]
  /** Two or three paragraphs: who they are and what they do. */
  intro: Bilingual[]
  /** Their method, broken into its components. */
  methodTitle: Bilingual
  methodIntro: Bilingual
  method: PartnerMethodStep[]
  /** How the method is applied in practice — sequence, timing. */
  practice?: Bilingual
  /** Short attributed facts (team, background, community). */
  facts: PartnerFact[]
  /** Who they serve beyond the general public. */
  audience: Bilingual
  /** Article slugs in our graph that explain the science they work with. */
  related: string[]
  links: PartnerLink[]
}

export const PARTNERS: Partner[] = [
  {
    slug: "grnfix",
    name: "Grnfix",
    legalName: "Greenfix B.V.",
    place: "Nederland",
    website: "https://grnfix.nl",
    hue: 28,
    domains: ["soil", "microbiology", "fungi", "plants"],
    tagline: {
      en: "Natural soil restoration — soil life, minerals and nutrition, in that order.",
      nl: "Natuurlijk bodemherstel — bodemleven, mineralen en voeding, in die volgorde.",
    },
    intro: [
      {
        en: "Grnfix makes 100% natural soil improvers and plant strengtheners for gardens, growers and the professional green sector. Their starting point is the one this knowledge base keeps arriving at from the other direction: a garden's problems are rarely leaf problems. They are soil problems, showing up in the leaves.",
        nl: "Grnfix maakt 100% natuurlijke bodemverbeteraars en plantversterkers voor tuinen, telers en de professionele groensector. Hun uitgangspunt is precies waar deze kennisbank vanaf de andere kant steeds op uitkomt: de problemen van een tuin zijn zelden bladproblemen. Het zijn bodemproblemen die zich in het blad laten zien.",
      },
      {
        en: "So they look under the ground first — not at symptoms, but at the processes that have stalled. The aim is to restart the biological engine and then keep it fed, until the soil regulates itself and the garden asks for less help from outside.",
        nl: "Daarom kijken ze eerst onder de grond — niet naar symptomen, maar naar processen die zijn stilgevallen. Het doel is de biologische motor opnieuw op gang te brengen en daarna gevoed te houden, tot de bodem zichzelf reguleert en de tuin minder hulp van buitenaf vraagt.",
      },
      {
        en: "The company grew out of agriculture, and it shows in how the products are put together: a system rather than a single fix, applied in a sequence, judged over a season rather than a weekend.",
        nl: "Het bedrijf is voortgekomen uit de landbouw, en dat zie je terug in hoe de producten in elkaar zitten: een systeem in plaats van één ingreep, in een volgorde toegepast, beoordeeld over een seizoen in plaats van een weekend.",
      },
    ],
    methodTitle: {
      en: "The Grnfix method",
      nl: "De Grnfix-methode",
    },
    methodIntro: {
      en: "In their own framing: a living soil does not come from one intervention but from coherence — each step builds on the last. Three components, in order.",
      nl: "In hun eigen woorden: een levende bodem ontstaat niet door één ingreep, maar door samenhang — elke stap bouwt voort op de vorige. Drie componenten, op volgorde.",
    },
    method: [
      {
        name: "BodemBoost",
        role: { en: "Soil life", nl: "Bodemleven" },
        body: {
          en: "Bacteria and fungi that convert organic material and make nutrition available to roots again — the biological engine, restarted.",
          nl: "Bacteriën en schimmels die organisch materiaal omzetten en voeding opnieuw beschikbaar maken voor wortels — de biologische motor, opnieuw gestart.",
        },
      },
      {
        name: "BodemBalans",
        role: { en: "Minerals", nl: "Mineralen" },
        body: {
          en: "A marine-derived mineral base — Grnfix state 32% calcium, 5% magnesium and 70+ trace elements — giving the system something stable to work with over the long term.",
          nl: "Een minerale basis uit zee — Grnfix noemt 32% calcium, 5% magnesium en 70+ spoorelementen — die het systeem een stabiele basis geeft voor de lange termijn.",
        },
      },
      {
        name: "BodemBehoud",
        role: { en: "Nutrition", nl: "Voeding" },
        body: {
          en: "Once the soil life is active and the minerals are replenished, the system needs fuel. This is the step that provides continuity rather than a spike.",
          nl: "Als het bodemleven actief is en de mineralen zijn aangevuld, heeft het systeem brandstof nodig. Dit is de stap die zorgt voor continuïteit in plaats van een piek.",
        },
      },
    ],
    practice: {
      en: "In practice: start with BodemBalans and BodemBoost together, then spread BodemBehoud after two to three weeks. The expected outcome is a soil that becomes progressively more self-regulating — nutrients recycled more efficiently, less input required each season.",
      nl: "In de praktijk: begin met BodemBalans en BodemBoost samen, en strooi na twee tot drie weken BodemBehoud. Het verwachte resultaat is een bodem die steeds zelfregulerender wordt — nutriënten worden efficiënter gerecycled en er is elk seizoen minder input nodig.",
    },
    facts: [
      {
        label: { en: "Roots", nl: "Herkomst" },
        value: {
          en: "Agriculture — 25+ years of sector experience behind the formulations",
          nl: "Landbouw — 25+ jaar sectorervaring achter de formuleringen",
        },
      },
      {
        label: { en: "Team", nl: "Team" },
        value: {
          en: "Four people: two from a lifetime in agriculture and soil life, two from IT",
          nl: "Vier mensen: twee met een leven lang landbouw en bodemleven, twee uit de IT",
        },
      },
      {
        label: { en: "Range", nl: "Assortiment" },
        value: {
          en: "Soil restoration, plant strengthening, pest management and complete systems",
          nl: "Bodemherstel, plantversterking, plaagbeheersing en complete systemen",
        },
      },
      {
        label: { en: "Community", nl: "Community" },
        value: {
          en: "A webshop, a Discord for gardeners, and a partner network in the green sector",
          nl: "Een webshop, een Discord voor hoveniers en een partnernetwerk in de groensector",
        },
      },
    ],
    audience: {
      en: "Beyond the home garden, Grnfix positions itself as a full partner to professional gardeners — bundling knowledge, training, advice and purchasing rather than only supplying product. They have also put that outward, contributing to tree-planting days such as the one at Kuinrebos.",
      nl: "Naast de particuliere tuin positioneert Grnfix zich als volwaardige partner voor hoveniers — met gebundelde kennis, trainingen, advies en inkoop in plaats van alleen productlevering. Ze brengen dat ook naar buiten, met bijdragen aan bomenplantdagen zoals die in het Kuinrebos.",
    },
    related: [
      "soil-food-web",
      "mycorrhizal-networks",
      "nutrient-cycling",
      "compost-science",
      "no-till-agriculture",
    ],
    links: [
      { label: { en: "Website", nl: "Website" }, href: "https://grnfix.nl" },
      { label: { en: "The method", nl: "De methode" }, href: "https://grnfix.nl/grnfix-methode/" },
      { label: { en: "Soil ecosystem", nl: "Bodemecosysteem" }, href: "https://grnfix.nl/bodemecosysteem/" },
      { label: { en: "For gardeners", nl: "Voor hoveniers" }, href: "https://grnfix.nl/hoveniers/" },
      { label: { en: "Shop", nl: "Shop" }, href: "https://grnfix.nl/shop/" },
      { label: { en: "About them", nl: "Over ons" }, href: "https://grnfix.nl/over-ons/" },
    ],
  },
]

export function getPartner(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug)
}

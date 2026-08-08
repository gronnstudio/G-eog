import { UI } from "./i18n"

type UIKey = keyof typeof UI

/**
 * The site as a bounded archive.
 *
 * Navigation kept drifting because three components each held their own
 * private idea of the structure — the header listed one set of
 * destinations, the dock another, the footer a third. Anything added
 * landed in whichever one the author was editing, and the hierarchy
 * quietly stopped being a hierarchy.
 *
 * So the structure lives here once, with hard limits, and every navigation
 * derives from it. If the tree is wrong, everything is wrong together and
 * visibly — which is far easier to fix than three views disagreeing.
 *
 * The limits are the point. A shelf you can't overfill stays navigable:
 *
 *   MAX_SECTIONS  10   top-level areas — more than this and no one can
 *                      hold the whole site in their head at once
 *   MAX_DEPTH      5   levels below the root; deeper and people lose the
 *                      thread of where they came from
 *   MAX_CHILDREN  99   entries per level, the point past which a list
 *                      stops being scannable and needs its own index
 *
 * These are checked at module load, so exceeding one fails the build
 * rather than quietly degrading the site.
 */

export const MAX_SECTIONS = 10
export const MAX_DEPTH = 5
export const MAX_CHILDREN = 99

export interface SiteNode {
  href: string
  /** UI dictionary key for the label. */
  key: UIKey
  /** Shown in the pill dock — the dock carries only what has an icon. */
  icon?: "home" | "ask" | "learn" | "apply" | "evidence" | "community" | "graph"
  /** Nested levels. Content routes (categories, articles) are generated
   *  from data and counted separately — they live under their section. */
  children?: SiteNode[]
}

/**
 * The seven top-level areas, in the order a visitor moves through them:
 * find it, ask about it, learn it, apply it, check it, improve it.
 */
export const SITE_TREE: SiteNode[] = [
  {
    href: "/explore",
    key: "nav_explore",
    icon: "graph",
    children: [
      {
        href: "/knowledge",
        key: "nav_knowledge",
        // /knowledge/[category]/[slug] — two generated levels below this,
        // putting the deepest content route at depth 3 of 5.
      },
    ],
  },
  { href: "/diagnose", key: "nav_ask", icon: "ask" },
  { href: "/learn", key: "nav_learn", icon: "learn" },
  {
    href: "/apply",
    key: "nav_apply",
    icon: "apply",
    children: [
      { href: "/seasonal", key: "megaSeasonal" },
      { href: "/partners", key: "megaPartners" },
      { href: "/contribute", key: "megaWizard" },
    ],
  },
  { href: "/evidence", key: "nav_evidence", icon: "evidence" },
  { href: "/community", key: "nav_community", icon: "community" },
  { href: "/about", key: "nav_about" },
]

/** Depth of the deepest branch, counting the root's children as level 1. */
function depthOf(nodes: SiteNode[], level = 1): number {
  let deepest = level
  for (const n of nodes) {
    if (n.children?.length) deepest = Math.max(deepest, depthOf(n.children, level + 1))
  }
  return deepest
}

function assertWidth(nodes: SiteNode[], path: string): void {
  if (nodes.length > MAX_CHILDREN) {
    throw new Error(
      `Site tree: ${path} has ${nodes.length} children, over the ${MAX_CHILDREN} limit. ` +
        `Give it an index page and split it.`,
    )
  }
  for (const n of nodes) if (n.children) assertWidth(n.children, n.href)
}

/**
 * Enforced at import time. Two generated levels sit below /knowledge
 * (category, then article), so the authored tree may only go three deep.
 */
const GENERATED_LEVELS = 2

export function validateSiteTree(): void {
  if (SITE_TREE.length > MAX_SECTIONS) {
    throw new Error(
      `Site tree: ${SITE_TREE.length} top-level sections, over the ${MAX_SECTIONS} limit.`,
    )
  }
  const depth = depthOf(SITE_TREE) + GENERATED_LEVELS
  if (depth > MAX_DEPTH) {
    throw new Error(
      `Site tree: deepest route is ${depth} levels, over the ${MAX_DEPTH} limit. ` +
        `Flatten a branch rather than nesting further.`,
    )
  }
  assertWidth(SITE_TREE, "/")
}

validateSiteTree()

/** Primary areas — everything except the About footnote. */
export const PRIMARY_AREAS: SiteNode[] = SITE_TREE.filter((n) => n.key !== "nav_about")

/** The five wing slots of the dock, in header order, minus the centre. */
export const DOCK_WINGS: SiteNode[] = PRIMARY_AREAS.filter(
  (n) => n.icon && n.icon !== "graph",
)

/** The dock's centre slot. */
export const DOCK_CENTRE: SiteNode =
  PRIMARY_AREAS.find((n) => n.icon === "graph") ?? PRIMARY_AREAS[0]

/** Everything not reachable from the pill itself — the sheet's contents. */
export const SHEET_EXTRAS: SiteNode[] = SITE_TREE.flatMap((n) => n.children ?? []).concat(
  SITE_TREE.filter((n) => n.key === "nav_about"),
)

/** Current stats, for the "you are here" line in the sheet. */
export function treeShape() {
  return {
    sections: SITE_TREE.length,
    depth: depthOf(SITE_TREE) + GENERATED_LEVELS,
    maxSections: MAX_SECTIONS,
    maxDepth: MAX_DEPTH,
  }
}

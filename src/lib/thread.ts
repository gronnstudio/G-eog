/**
 * The Thread — a record of the path a reader actually took through the
 * knowledge ecosystem. Ported from GRØNN Studio's site.
 *
 * Breadcrumbs answer "where does this page sit in the hierarchy". They
 * cannot answer "how did I get here", and in a graph those are different
 * questions: the soil food web is reachable from the Soil domain, from a
 * related-links card, or from the knowledge graph. The hierarchy crumb
 * reads the same in all three cases, so the route that actually carried
 * you is lost — which is precisely when people feel stranded.
 *
 * This keeps the last few content pages visited, in order, so the reader
 * can see the line they walked and step back onto any point of it. State
 * is per-tab (sessionStorage): a thread belongs to a session of thinking,
 * not to a device.
 */

export type ThreadNode = {
  href: string
  label: string
}

const KEY = "eog-thread"
/** enough to show the shape of an enquiry, few enough to stay a hairline */
export const THREAD_MAX = 6

/** routes that are chrome rather than content — never worth a node */
const IGNORED = ["/offline"]

export function isThreadable(pathname: string): boolean {
  if (pathname === "/") return false
  return !IGNORED.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function readThread(): ThreadNode[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ThreadNode[]) : []
  } catch {
    return []
  }
}

function write(nodes: ThreadNode[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(nodes))
  } catch {
    // private mode — the thread simply does not persist
  }
}

/**
 * Add a page to the thread. Revisiting a page already on the thread
 * rewinds to it rather than appending a duplicate: stepping back onto the
 * Soil domain means you have stepped back up your own path, not walked
 * somewhere new. That keeps the line a route rather than a log.
 */
export function pushThread(node: ThreadNode): ThreadNode[] {
  const current = readThread()
  const seen = current.findIndex((n) => n.href === node.href)
  const next =
    seen === -1
      ? [...current, node].slice(-THREAD_MAX)
      : current.slice(0, seen + 1)
  write(next)
  return next
}

export function clearThread(): ThreadNode[] {
  write([])
  return []
}

/**
 * Turn a document title into a node label. Titles carry the site name for
 * the tab and search results; on a hairline trail that is pure noise.
 */
export function labelFromTitle(title: string, pathname: string): string {
  const cleaned = title
    .split(/[—|·]/)[0]
    .replace(/equilibrium/gi, "")
    .trim()
  if (cleaned) return cleaned.toLowerCase()
  // fall back to the last meaningful path segment
  const seg = pathname.split("/").filter(Boolean).pop() ?? ""
  return decodeURIComponent(seg).replace(/-/g, " ") || "page"
}

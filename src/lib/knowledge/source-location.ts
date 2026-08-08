import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Where an article actually lives in the repository.
 *
 * The article pages used to link to `content/<category>/<slug>.mdx` — a
 * path that has never existed. Every "Improve this page", "View source"
 * and "Version history" link 404'd, which is a bad first impression for
 * exactly the person willing to contribute.
 *
 * Articles are entries in one large TypeScript module, so the honest link
 * is that file plus the line the article starts on. The line is resolved
 * at build time from the real file, so it is accurate for the commit being
 * deployed rather than a guess that drifts.
 */

const ARTICLES_PATH = "src/lib/knowledge/articles.ts"

/** slug → 1-indexed line number of its `slug:` declaration. */
let lineIndex: Map<string, number> | null = null

function buildIndex(): Map<string, number> {
  const map = new Map<string, number>()
  try {
    const text = readFileSync(join(process.cwd(), ARTICLES_PATH), "utf8")
    text.split("\n").forEach((line, i) => {
      const m = line.match(/^\s{4}slug:\s*"([^"]+)"/)
      if (m) map.set(m[1], i + 1)
    })
  } catch {
    // If the file can't be read (unexpected build layout), fall back to
    // linking the file without an anchor rather than failing the build.
  }
  return map
}

export interface SourceLocation {
  /** Repo-relative path of the file holding this article. */
  path: string
  /** 1-indexed line the article starts on, when it could be resolved. */
  line?: number
}

export function articleSourceLocation(slug: string): SourceLocation {
  lineIndex ??= buildIndex()
  const line = lineIndex.get(slug)
  return line ? { path: ARTICLES_PATH, line } : { path: ARTICLES_PATH }
}

/** GitHub blob/edit/commits URL for an article's source. */
export function articleSourceUrl(
  repo: string,
  slug: string,
  mode: "blob" | "edit" | "commits",
): string {
  const { path, line } = articleSourceLocation(slug)
  const base = `${repo}/${mode}/main/${path}`
  // Line anchors only mean anything on a blob view; edit and commits
  // ignore them, and commits/<path> is a file history, not a line history.
  return mode === "blob" && line ? `${base}#L${line}` : base
}

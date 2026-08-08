import { ARTICLES } from "@/lib/knowledge"

const SITE = "https://g-eog.vercel.app"

/** Escape the five XML special characters for safe text nodes. */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function GET() {
  const items = [...ARTICLES]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .map((a) => {
      const link = `${SITE}/knowledge/${a.category}/${a.slug}`
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <description>${esc(a.summary)}</description>
      <pubDate>${new Date(a.updated).toUTCString()}</pubDate>
      <category>${esc(a.category)}</category>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Equilibrium — The living knowledge ecosystem</title>
    <link>${SITE}</link>
    <description>Humanity's ecological knowledge, freely accessible and endlessly connected. New and freshly grown articles from the Equilibrium knowledge graph.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

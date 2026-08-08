import type { MetadataRoute } from "next"

import { ARTICLES, CATEGORIES } from "@/lib/knowledge"
import { BRAND } from "@/lib/brand"

const SITE = BRAND.url

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/explore",
    "/knowledge",
    "/learn",
    "/community",
    "/partners",
    "/evidence",
    "/seasonal",
    "/contribute",
    "/about",
  ].map(
    (path) => ({
      url: `${SITE}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  )

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${SITE}/knowledge/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const articleRoutes = ARTICLES.map((a) => ({
    url: `${SITE}/knowledge/${a.category}/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Field Stories live under /concept and are deliberately excluded from
  // the sitemap — a hidden concept, reachable only by direct URL.

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes]
}

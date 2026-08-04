import type { MetadataRoute } from "next"

import { ARTICLES, CATEGORIES, STORIES } from "@/lib/knowledge"

const SITE = "https://equilibrium.gronn.studio"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/explore", "/knowledge", "/stories", "/learn", "/community", "/about"].map(
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

  const storyRoutes = STORIES.map((s) => ({
    url: `${SITE}/stories/${s.slug}`,
    lastModified: new Date(s.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...storyRoutes]
}

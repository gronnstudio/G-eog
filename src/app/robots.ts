import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/brand"

const SITE = BRAND.url

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  }
}

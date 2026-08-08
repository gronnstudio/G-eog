import { BRAND } from "@/lib/brand"
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — Living Knowledge Ecosystem`,
    short_name: BRAND.shortName,
    description: "The world's living knowledge ecosystem for regenerative thinking.",
    start_url: "/",
    display: "standalone",
    background_color: "#10152e",
    theme_color: "#10152e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}

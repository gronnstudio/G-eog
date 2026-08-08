import { HomeContent } from "@/components/home/home-content"

/**
 * Home. The body lives in a client component so every heading and CTA
 * resolves through the locale dictionary — hardcoding copy here left
 * the page English regardless of the chosen language.
 */
export default function HomePage() {
  return <HomeContent />
}

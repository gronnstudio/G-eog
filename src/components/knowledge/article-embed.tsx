"use client"

import { EcosystemHotspots } from "@/components/play/ecosystem-hotspots"
import { SuccessionTimeline } from "@/components/play/succession-timeline"
import { RegenerationSlider } from "@/components/play/regeneration-slider"
import type { ArticleEmbed as ArticleEmbedName } from "@/lib/knowledge"

/**
 * Renders an interactive diagram inside an article body. The article data
 * references an embed by a stable string key (see ArticleEmbed in the
 * knowledge types); this registry resolves that key to the component. Keys
 * that don't resolve render nothing, so a typo can never break a page.
 */
const REGISTRY: Record<ArticleEmbedName, () => React.ReactElement> = {
  "food-forest-layers": () => <EcosystemHotspots />,
  "succession-timeline": () => <SuccessionTimeline />,
  "regeneration-slider": () => <RegenerationSlider />,
}

export function ArticleEmbed({
  name,
  caption,
}: {
  name: ArticleEmbedName
  caption?: string
}) {
  const render = REGISTRY[name]
  if (!render) return null

  return (
    <figure className="my-10">
      {render()}
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs text-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default ArticleEmbed

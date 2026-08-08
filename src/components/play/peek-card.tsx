"use client"

import * as Icons from "lucide-react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import type { Category } from "@/lib/knowledge"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

interface PeekCardProps {
  category: Category
  articles: { slug: string; title: string }[]
}

/**
 * A category card that, on a fine-pointer desktop, reveals a "peek" panel of
 * related articles when hovered or focused. Touch devices have no hover, so
 * there the panel is shown statically (always open) — otherwise "what's
 * inside" would never appear on mobile. Reduced motion drops the animation
 * but keeps the list. The card itself is a link to the category; the peek
 * links sit above it and stay individually tappable.
 */
export function PeekCard({ category, articles }: PeekCardProps) {
  const reduced = useReducedMotion()
  const iconTint = `hsl(${category.hue} 50% 55%)`
  const peek = articles.slice(0, 3)

  const IconMap = Icons as unknown as Record<string, LucideIcon>
  const Icon = IconMap[category.icon] ?? Icons.Circle

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-line bg-surface/40 p-6",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-float",
        "focus-within:-translate-y-1 focus-within:shadow-float"
      )}
    >
      {/* Corner glow — isolated in a translateZ wrapper to dodge the iOS
          Safari blur-clipping bug, and non-interactive. */}
      {/* Painted radial gradient instead of a blurred child — iOS Safari
          lets filter() output bleed past rounded overflow clips. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        style={{
          background: `radial-gradient(140px 140px at calc(100% - 8px) 8px, color-mix(in srgb, ${iconTint} 40%, transparent), color-mix(in srgb, ${iconTint} 14%, transparent) 55%, transparent 75%)`,
        }}
      />

      {/* Primary link overlay — covers the card, names the category. Peek
          links sit above it via relative z-10 so they stay clickable. */}
      <Link
        href={`/knowledge/${category.id}`}
        aria-label={`${category.title} — ${category.tagline}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />

      <div className="relative z-10 flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-2"
          style={{ color: iconTint }}
        >
          <Icon className="size-6" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground">
            {category.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{category.tagline}</p>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-xs text-faint">
        {articles.length} {articles.length === 1 ? "article" : "articles"}
      </p>

      {reduced || peek.length === 0 ? null : (
        <div
          className={cn(
            // Fine pointer: collapsed, revealed on hover or keyboard focus.
            "relative z-10 grid grid-rows-[0fr] opacity-0",
            "transition-[grid-template-rows,opacity] duration-300 ease-out",
            "group-hover:grid-rows-[1fr] group-hover:opacity-100",
            "group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100",
            // Touch has no hover — reveal the list statically so mobile
            // visitors can actually see (and tap) what's inside.
            "[@media(pointer:coarse)]:grid-rows-[1fr] [@media(pointer:coarse)]:opacity-100"
          )}
        >
          <div className="overflow-hidden">
            <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
              {peek.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/knowledge/${category.id}/${a.slug}`}
                    className="block truncate text-sm text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

export interface TocItem {
  id: string
  title: string
}

/**
 * Progress-linked "On this page" rail. Watches the article's section
 * headings with an IntersectionObserver and highlights the entry whose
 * section is currently in view, with an ember accent on the border.
 */
export function TocSpy({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (headings.length === 0) return

    // Track which headings sit inside the "reading band" (upper third of
    // the viewport); the topmost visible one wins. When none are in the
    // band (long section between headings), keep the last heading that
    // scrolled past the top.
    const visible = new Set<string>()

    const pickActive = () => {
      const inBand = headings.find((h) => visible.has(h.id))
      if (inBand) {
        setActiveId(inBand.id)
        return
      }
      // Fall back to the last heading above the band.
      let last: string | null = null
      for (const h of headings) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.3) last = h.id
      }
      setActiveId(last ?? headings[0].id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        pickActive()
      },
      // Band: from just under the fixed header to 60% down the viewport.
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    )
    headings.forEach((h) => observer.observe(h))
    pickActive()

    return () => observer.disconnect()
  }, [items])

  return (
    <ul className="mt-3 space-y-2 border-l border-line">
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <li key={item.id} className="-ml-px">
            <a
              href={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
                history.replaceState(null, "", `#${item.id}`)
                setActiveId(item.id)
              }}
              className={`block border-l pl-4 text-sm transition-colors duration-300 ${
                active
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

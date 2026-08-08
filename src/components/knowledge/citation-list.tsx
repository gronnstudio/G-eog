"use client"

import { useEffect, useRef, useState } from "react"
import { BookMarked, ExternalLink } from "lucide-react"

import type { Citation } from "@/lib/knowledge"
import { useT } from "@/components/language-provider"
import { sourceForCitation, sourceHref } from "@/lib/knowledge/sources"

/**
 * References list where every row opens a small floating card with the
 * citation's full details and outbound link. Hover previews on pointer
 * devices; tap/click toggles it everywhere. Escape and outside clicks
 * close the open card.
 */
export function CitationList({ citations }: { citations: Citation[] }) {
  const t = useT()
  const [openId, setOpenId] = useState<string | null>(null)
  const rootRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenId(null)
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onPointerDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [openId])

  return (
    <ol ref={rootRef} className="mt-4 space-y-1 !list-none !pl-0">
      {citations.map((c, i) => {
        const open = openId === c.id
        return (
          <li
            key={c.id}
            className="relative"
            onMouseEnter={() => setOpenId(c.id)}
            onMouseLeave={() => setOpenId((cur) => (cur === c.id ? null : cur))}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`citation-card-${c.id}`}
              onClick={() => setOpenId(open ? null : c.id)}
              className={`flex w-full items-baseline gap-3 rounded-lg px-2 py-1.5 text-left text-sm leading-relaxed transition-colors ${
                open ? "bg-surface-2 text-foreground" : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-xs text-accent">[{i + 1}]</span>
              <span className="min-w-0">
                {c.authors} ({c.year}). <span className="text-foreground">{c.title}</span>
              </span>
            </button>

            {open && (
              <div
                id={`citation-card-${c.id}`}
                role="region"
                aria-label={c.title}
                className="absolute bottom-full left-0 z-30 mb-2 w-full max-w-md rounded-2xl border border-line bg-surface p-4 shadow-float"
              >
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                  <BookMarked className="h-3.5 w-3.5 text-accent" />
                  {t({ en: "Reference", nl: "Referentie" })} {i + 1}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-foreground">{c.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {c.authors} · {c.year}
                </p>
                <p className="mt-0.5 text-sm italic text-muted">{c.source}</p>
                {(() => {
                  // The link comes from the source registry rather than the
                  // article file, so resolving a DOI once makes it appear
                  // everywhere that source is cited.
                  const src = sourceForCitation(c)
                  const href = c.url ?? (src ? sourceHref(src) : undefined)
                  if (href) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent underline underline-offset-2 hover:text-foreground"
                      >
                        {src?.doi
                          ? t({ en: "Open via DOI", nl: "Open via DOI" })
                          : t({ en: "Open source", nl: "Open bron" })}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )
                  }
                  // Say so plainly rather than leaving a dead-looking card.
                  return (
                    <p className="mt-3 text-xs leading-relaxed text-faint">
                      {t({
                        en: "No verified link yet — this reference hasn't been resolved to a DOI.",
                        nl: "Nog geen geverifieerde link — deze verwijzing is nog niet naar een DOI herleid.",
                      })}
                    </p>
                  )
                })()}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

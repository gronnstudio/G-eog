"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { useUI } from "@/components/language-provider"
import { BRAND } from "@/lib/brand"
import { SITE_TREE, treeShape } from "@/lib/site-tree"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { cn } from "@/lib/utils"

/** Category shortcuts, shown under the section that owns them. */
const CATEGORY_SHORTCUTS = [
  { href: "/knowledge/soil", key: "dockSoil" },
  { href: "/knowledge/water", key: "dockWater" },
  { href: "/knowledge/fungi", key: "dockFungi" },
  { href: "/knowledge/permaculture", key: "dockPermaculture" },
] as const

/**
 * The mobile mega menu: the whole site structure on one screen.
 *
 * The dock sheet used to be two things at once — a navigation list and a
 * settings panel — which meant neither had room. Navigation now gets the
 * full screen and shows the actual hierarchy: every section numbered, with
 * the level beneath it visible rather than hidden one tap deeper. Switches
 * moved out to their own sheet.
 *
 * Sections come from the site tree, so this menu, the header nav and the
 * pill are all views of one structure and cannot disagree.
 */
export function MobileMegaMenu({
  open,
  onClose,
  onOpenSearch,
}: {
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
}) {
  const ui = useUI()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const shape = treeShape()

  useFocusTrap(ref, open, onClose)

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  if (!open) return null

  return (
    <div
      ref={ref}
      id="site-mega-menu"
      role="dialog"
      aria-modal="true"
      aria-label={ui("menuSiteMenu")}
      // No entrance animation: framer would not commit the animate state
      // for this panel and left it stuck at its initial value — present in
      // the DOM and invisible. A menu that opens instantly is the better
      // failure mode anyway.
      className="safe-x fixed inset-0 z-[70] overflow-y-auto bg-background md:hidden"
      style={{
        paddingTop: "max(1.5rem, calc(env(safe-area-inset-top) + 1rem))",
        paddingBottom: "max(7.5rem, calc(env(safe-area-inset-bottom) + 7rem))",
      }}
    >
          <div className="px-5">
            {/* Search first — it is the fastest route to anything. */}
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenSearch()
              }}
              className="flex w-full items-center gap-3 rounded-full border border-line px-5 py-3.5 text-left text-muted transition-colors hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-base">{ui("search")}</span>
            </button>

            <p className="mb-4 mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
              {ui("navigate")}
              <span className="ml-3 text-faint/70">
                {shape.sections} / {shape.maxSections}
              </span>
            </p>

            {/* The structure, one level visible at a time but never hidden */}
            <nav className="flex flex-col">
              {SITE_TREE.map((section, i) => (
                <div key={section.href} className="border-t border-line py-4 first:border-t-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={section.href}
                      onClick={onClose}
                      className={cn(
                        "font-heading text-3xl font-semibold tracking-tight transition-colors",
                        active(section.href) ? "text-accent" : "text-foreground",
                      )}
                    >
                      {ui(section.key)}
                    </Link>
                  </div>

                  {/* The level below, in view rather than a tap away */}
                  {(section.children?.length ||
                    section.href === "/explore") && (
                    <div className="ml-[1.85rem] mt-3 flex flex-wrap gap-2">
                      {section.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "tap-target rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors",
                            active(child.href)
                              ? "border-accent/50 bg-accent-soft text-accent"
                              : "border-line text-muted hover:border-ember/40 hover:text-foreground",
                          )}
                        >
                          {ui(child.key)}
                        </Link>
                      ))}
                      {section.href === "/explore" &&
                        CATEGORY_SHORTCUTS.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={onClose}
                            className={cn(
                              "tap-target rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors",
                              active(c.href)
                                ? "border-accent/50 bg-accent-soft text-accent"
                                : "border-line text-muted hover:border-ember/40 hover:text-foreground",
                            )}
                          >
                            {ui(c.key)}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>


            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
              <a
                href={BRAND.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target underline-draw text-xs tracking-wide text-muted"
              >
                GitHub
              </a>
              <a
                href={BRAND.parent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target underline-draw text-xs tracking-wide text-muted"
              >
                {BRAND.parent.name}
              </a>
            </div>
          </div>
    </div>
  )
}

export default MobileMegaMenu

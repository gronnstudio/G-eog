"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  clearThread,
  isThreadable,
  labelFromTitle,
  pushThread,
  readThread,
  type ThreadNode,
} from "@/lib/thread"
import { EASE_ORGANIC } from "@/lib/motion"

/**
 * The Thread — the reader's own path through the ecosystem, drawn as the
 * site draws everything else: nodes on a line. Ported from GRØNN Studio.
 *
 * It stays a hairline until you touch it. Each node is a dot; the one you
 * are standing on is ember and named. Hovering any other node names it too,
 * so the whole route can be read without it ever occupying real estate.
 *
 * It only appears once there are two nodes, because a path of one is just a
 * page. Desktop only, deliberately: the trail is driven by hover to stay
 * small, and hover does not exist on a phone — phones keep the dock and the
 * hierarchy breadcrumb.
 */
export function Thread() {
  const pathname = usePathname()
  const [nodes, setNodes] = useState<ThreadNode[]>([])
  const [hidden, setHidden] = useState(false)

  // Record the visit after paint (so the resolved <title> is available).
  // Every state write happens inside the async timeout, so we never call
  // setState synchronously during the effect (Next 16 lint).
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (pathname && isThreadable(pathname)) {
        setNodes(
          pushThread({
            href: pathname,
            label: labelFromTitle(document.title, pathname),
          })
        )
      } else {
        setNodes(readThread())
      }
    }, 60)
    return () => window.clearTimeout(id)
  }, [pathname])

  const show = !hidden && nodes.length > 1

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Your path"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: EASE_ORGANIC }}
          className="fixed inset-x-0 top-16 z-[64] hidden md:top-24 md:block"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-5 md:px-12">
            <ol className="group/thread flex items-center rounded-full border border-line bg-surface/70 py-1.5 pl-3 pr-1.5 backdrop-blur-md">
              {nodes.map((n, i) => {
                const current = i === nodes.length - 1
                return (
                  <li key={n.href} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mx-1 h-px w-4 bg-line transition-colors duration-300 group-hover/thread:bg-foreground/30"
                      />
                    )}
                    <Link
                      href={n.href}
                      aria-current={current ? "page" : undefined}
                      className="group/node flex items-center gap-1.5 rounded-full px-1.5 py-0.5 transition-colors duration-300"
                    >
                      <span
                        aria-hidden="true"
                        className={
                          "block h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 " +
                          (current
                            ? "bg-ember ring-4 ring-ember/15"
                            : "bg-foreground/35 group-hover/node:bg-gronn-green")
                        }
                      />
                      {/* The current node is always named; the rest name
                          themselves on hover, so the trail reads as a line
                          at rest and as a route when interrogated. */}
                      <span
                        className={
                          "whitespace-nowrap text-[0.62rem] tracking-[0.14em] transition-all duration-300 " +
                          (current
                            ? "max-w-[14rem] text-foreground/80"
                            : "max-w-0 overflow-hidden text-muted group-hover/node:max-w-[14rem] group-hover/node:text-foreground")
                        }
                      >
                        {n.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setNodes(clearThread())
                    setHidden(true)
                  }}
                  aria-label="Clear your path"
                  className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-faint transition-colors duration-300 hover:bg-surface-2 hover:text-foreground"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 2.5l7 7M9.5 2.5l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            </ol>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default Thread

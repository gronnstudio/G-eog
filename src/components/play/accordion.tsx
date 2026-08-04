"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { EASE_ORGANIC } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

interface AccordionItem {
  q: string
  a: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

/**
 * An animated FAQ accordion. One panel open at a time; each answer expands
 * with a height + opacity settle (instant under reduced motion). Wired for
 * keyboard use with aria-expanded / aria-controls.
 */
export function Accordion({ items, className }: AccordionProps) {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const baseId = useId()

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        const buttonId = `${baseId}-trigger-${i}`
        const panelId = `${baseId}-panel-${i}`

        return (
          <div key={i} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-start font-heading text-foreground transition-colors hover:text-accent"
              >
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-300",
                    isOpen && "rotate-180 text-accent"
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.4, ease: EASE_ORGANIC }
                  }
                  className="overflow-hidden"
                >
                  <p className="pb-4 pe-8 text-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

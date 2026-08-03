"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { DURATION, EASE_ORGANIC } from "@/lib/motion"

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number
  y?: number
}

/** A scroll-triggered rise-and-fade. The site's default entrance. */
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DURATION.slow, ease: EASE_ORGANIC, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

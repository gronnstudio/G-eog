import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/knowledge"

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export function DifficultyBadge({ level, className }: { level: Difficulty; className?: string }) {
  const dots = level === "foundational" ? 1 : level === "intermediate" ? 2 : 3
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs text-muted", className)}>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn("h-1.5 w-1.5 rounded-full", i < dots ? "bg-accent" : "bg-line")}
          />
        ))}
      </span>
      {DIFFICULTY_LABEL[level]}
    </span>
  )
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-full border border-line px-3 py-1 text-xs text-muted", className)}>
      {children}
    </span>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
      <span className="h-px w-8 bg-line" />
      {children}
    </p>
  )
}

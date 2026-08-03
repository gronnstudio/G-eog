// Per-letter hover flip for nav links, ported from the GRØNN base: the
// resting word rolls up out of a mask while an accent copy rolls in from
// below, letter by letter. Pure CSS (per-letter transition-delay), driven
// by a `group/nav` on the link; motion-reduce collapses it to a plain
// color change.
export function LetterFlip({ text }: { text: string }) {
  const letters = text.split("")

  return (
    <span aria-hidden className="relative block overflow-hidden">
      <span className="flex">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-out motion-safe:group-hover/nav:-translate-y-full"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex text-accent">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block translate-y-full transition-transform duration-300 ease-out motion-safe:group-hover/nav:translate-y-0"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  )
}

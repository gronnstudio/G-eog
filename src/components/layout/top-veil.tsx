/**
 * Progressive blur at the top edge of the viewport — the same liquid-
 * glass grammar as the dock pill: content leaving the page melts into a
 * soft blur under the header instead of clipping hard against the
 * status bar. Pure CSS (masked backdrop-filter), pointer-transparent,
 * under the header (z-40 vs the header's z-50).
 */
export function TopVeil() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        maskImage: "linear-gradient(to bottom, black 20%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent)",
      }}
    />
  )
}

export default TopVeil

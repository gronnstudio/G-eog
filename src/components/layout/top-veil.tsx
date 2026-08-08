/**
 * Progressive blur at the very top of the viewport: content scrolling
 * out melts into glass the same way it does behind the dock pill. The
 * first version read as a smeared band because its mask cut off hard;
 * this one blurs hardest at the edge and eases out over a smooth ramp.
 * Pointer-transparent, under the header (z-40 vs z-50).
 */
export function TopVeil() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-16"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        maskImage:
          "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.45) 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.45) 60%, transparent 100%)",
      }}
    />
  )
}

export default TopVeil

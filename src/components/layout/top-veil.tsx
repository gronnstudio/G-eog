/**
 * Progressive blur at the very top of the viewport: content scrolling
 * out melts into glass the same way it does behind the dock pill.
 *
 * Safe-area aware: installed as a PWA on notched phones the page runs
 * under the status bar (viewport-fit=cover), and a fixed-height veil
 * spent itself inside the notch — its fade ramp landed across the
 * first line of content and read as a smear. The veil now covers the
 * safe-area inset at full strength (keeps the clock readable) and only
 * then eases out over a short ramp.
 */
const INSET = "env(safe-area-inset-top, 0px)"

export function TopVeil() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
      style={{
        height: `calc(${INSET} + 48px)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        maskImage: `linear-gradient(to bottom, black 0, black ${INSET}, rgba(0,0,0,0.8) calc(${INSET} + 12px), rgba(0,0,0,0.35) calc(${INSET} + 28px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, black 0, black ${INSET}, rgba(0,0,0,0.8) calc(${INSET} + 12px), rgba(0,0,0,0.35) calc(${INSET} + 28px), transparent 100%)`,
      }}
    />
  )
}

export default TopVeil

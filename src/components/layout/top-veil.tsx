/**
 * Progressive glass at the top edge. Two stacked tricks:
 *
 * 1. A hard veil for the notch/status-bar zone: strong blur PLUS a
 *    theme-tinted gradient wash — blur alone only smears text under
 *    the clock; the tint actually settles it.
 * 2. A soft ramp below the inset so content melts out gradually, the
 *    same grammar as the dock pill.
 *
 * env(safe-area-inset-top) is 0 in regular browsers, where only the
 * soft ramp shows. All layers are pointer-transparent, under the
 * header (z-40 vs z-50).
 */
const INSET = "env(safe-area-inset-top, 0px)"

export function TopVeil() {
  return (
    <>
      {/* status-bar zone: heavy glass + tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40"
        style={{
          height: `calc(${INSET} + 8px)`,
          backdropFilter: "blur(22px) saturate(1.4)",
          WebkitBackdropFilter: "blur(22px) saturate(1.4)",
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 62%, transparent), color-mix(in srgb, var(--background) 30%, transparent))",
          maskImage: "linear-gradient(to bottom, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent)",
        }}
      />
      {/* soft melt-out ramp below it */}
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
    </>
  )
}

export default TopVeil

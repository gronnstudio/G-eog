import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Equilibrium — the living knowledge ecosystem for regenerative thinking"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(60% 60% at 20% 10%, #1f5136 0%, transparent 60%), radial-gradient(50% 50% at 90% 90%, #16324a 0%, transparent 60%), #0d1b14",
          color: "#eef3ee",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "2px solid #6cb389",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: -0.5 }}>Equilibrium</div>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900, letterSpacing: -2 }}>
          Knowledge grows when everything connects.
        </div>
        <div style={{ fontSize: 26, color: "#9db3a5" }}>
          The world&rsquo;s living knowledge ecosystem for regenerative thinking.
        </div>
      </div>
    ),
    size,
  )
}

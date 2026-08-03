# Design System

Design language: **Apple × National Geographic × Linear × Arc × Obsidian** — minimal, premium, editorial, immersive, organic, scientific, calm. **Time-of-day theming**: two palettes — **Golden Hour** (day) and **Blue Hour** (night) — auto-selected from the visitor's clock, with Blue Hour as the default fallback and the design source of truth.

Tokens are defined as CSS custom properties in `src/app/globals.css` and mapped into Tailwind CSS 4 via `@theme`.

---

## 1. Color

### 1.1 Brand constants (raw)

Brand constants are fixed reference colors — they identify the brand across marks, illustration, duotones, and category tones. They are **not** page tokens: Deep Forest is no longer the page background token.

| Name | Hex | Role |
|---|---|---|
| Deep Forest | `#0D1B14` | Brand anchor — marks, duotones, illustration |
| Moss | `#1F5136` | Brand primary dark / fills |
| Fern | `#4D8B63` | Brand primary / interactive |
| Sage | `#B8D8C2` | Brand tint |
| Stone | `#EDEDE8` | Neutral surfaces (brand collateral) |
| Warm White | `#FAFAF7` | Neutral canvas (brand collateral) |

Accents — use sparingly, only where semantics demand: Sky `#6ea8c7` (water/info), Amber `#e0a458` (energy/warning), Rust `#c2603f` (danger/erosion). Never as decoration.

### 1.2 Time-of-day palettes

Two palettes replace the previous static dark/light pair:

- **Golden Hour** — the day palette: warm cream surfaces, deep green accent.
- **Blue Hour** — the night palette and the **default fallback**: deep indigo surfaces, pale sage accent.

The palette is auto-selected from the visitor's clock: **07:00–19:00 local time = Golden Hour**, otherwise Blue Hour. The Tailwind `dark` variant maps to `.bluehour` (and legacy `.dark`).

**Auto/manual mechanic:**

- A pre-paint inline script in `layout.tsx` seeds next-themes' `"theme"` localStorage key from the clock — unless the stored mode is manual — so first paint is always correct (no flash).
- `ThemeModeProvider` re-syncs the palette on a 60-second interval and on `visibilitychange` while in auto mode.
- Choosing any palette explicitly writes `"eog-theme-mode": "manual"` to localStorage — a **permanent** override that persists until the user picks Auto again. Auto mode stores `"eog-theme-mode": "auto"`.

#### Golden Hour tokens (day)

| Token | Value | Notes |
|---|---|---|
| `--background` | `#f8efdc` | Page canvas |
| `--surface` | `#fdf8ee` | Cards, panels |
| `--surface-2` | `#f1e6cf` | Wells, insets, popovers |
| `--foreground` | `#1d1810` | Primary text |
| `--muted` | `#58503e` | Secondary text |
| `--faint` | `#8a7f66` | Tertiary/meta — decorative only below 18px |
| `--line` | `rgba(29,24,16,0.14)` | 1px hairlines |
| `--accent` | `#175c3d` | Deep green — interactive default |
| `--accent-soft` | `rgba(23,92,61,0.10)` | Accent tints, hover washes |
| `--on-accent` | `#f8efdc` | Text/icons on accent fills |

#### Blue Hour tokens (night, default)

| Token | Value | Notes |
|---|---|---|
| `--background` | `#10152e` | Page canvas |
| `--surface` | `#1a2040` | Cards, panels |
| `--surface-2` | `#232a52` | Wells, insets, popovers |
| `--foreground` | `#eceffa` | Primary text |
| `--muted` | `#9ba5c8` | Secondary text |
| `--faint` | `#626d94` | Tertiary/meta — decorative only below 18px |
| `--line` | `rgba(236,239,250,0.12)` | 1px hairlines |
| `--accent` | `#bfe3d0` | Pale sage — interactive default |
| `--accent-soft` | `rgba(191,227,208,0.12)` | Accent tints, hover washes |
| `--on-accent` | `#10152e` | Text/icons on accent fills |

**Why `--on-accent` exists:** the accent flips polarity between palettes — deep green on cream in Golden Hour, pale sage on indigo in Blue Hour — so text sitting on an accent fill must flip too. `--on-accent` is cream (`#f8efdc`) in Golden Hour and indigo (`#10152e`) in Blue Hour. Never hardcode white or `--foreground` on accent fills.

### 1.3 Contrast expectations (WCAG, against usage background)

- **All body text pairs meet AA (4.5:1) at minimum** in both palettes; `--foreground` on `--background` targets AAA in each.
- `--faint` is decorative-only below 18px in both palettes.
- `--on-accent` on `--accent` must meet 4.5:1 in both palettes — verified in the audit manifest like any other pair.
- Every new token pair must pass the contrast audit script (`11-accessibility.md`) before merge.

### 1.4 Category tones
Each of the 24 categories gets a hue-shifted tint of Fern (±20° hue, fixed L/C in OKLCH: `oklch(0.62 0.09 h)`) used for graph nodes, category chips, and OG art. Generated once, stored in `src/lib/category-tones.ts` — never hand-picked per component.

## 2. Typography

- **Headings:** Playfair Display (variable, `wght 400–700`), `next/font`, `display: swap`.
- **Body/UI:** Inter (variable), `font-feature-settings: "cv11", "ss01"`.
- **Technical:** `ui-monospace, "JetBrains Mono"` for data annotations, citations keys, taxonomy.

Fluid scale (viewport 360 → 1440, Utopia-style):

| Token | clamp() | Use |
|---|---|---|
| `--text-xs` | `clamp(0.75rem, 0.72rem + 0.12vw, 0.8125rem)` | meta, captions |
| `--text-sm` | `clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem)` | UI, labels |
| `--text-base` | `clamp(1rem, 0.96rem + 0.25vw, 1.125rem)` | body (article body line-height 1.7, max-width 68ch) |
| `--text-lg` | `clamp(1.125rem, 1.06rem + 0.35vw, 1.3125rem)` | lede, H4 |
| `--text-xl` | `clamp(1.375rem, 1.26rem + 0.6vw, 1.75rem)` | H3 |
| `--text-2xl` | `clamp(1.75rem, 1.5rem + 1.1vw, 2.5rem)` | H2 |
| `--text-3xl` | `clamp(2.25rem, 1.85rem + 1.9vw, 3.5rem)` | H1 / page titles |
| `--text-display` | `clamp(2.75rem, 2.0rem + 3.5vw, 5.25rem)` | Home hero only |

Rules: Playfair only at `--text-xl` and above (it degrades small). Headings `letter-spacing: -0.015em`, line-height 1.05–1.2. No font-weight below 400. Numerals in tables: `font-variant-numeric: tabular-nums`.

## 3. Spacing — 4px base

Scale (px): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160`. Tailwind default scale maps 1:1; anything off-scale needs a comment justifying it. Section rhythm: vertical padding `clamp(4rem, 3rem + 5vw, 8rem)` between page sections. Article gutter: `max(1.25rem, env(safe-area-inset-left))`.

## 4. Radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `6px` | chips, inputs, code |
| `--radius-md` | `10px` | buttons, small cards |
| `--radius-lg` | `16px` | cards, panels |
| `--radius-xl` | `24px` | hero media, modals |
| `--radius-full` | `9999px` | pills, avatars |

Nested radius rule: inner = outer − padding (never equal).

## 5. Shadows & elevation

Blue Hour elevates with **lighter surface + hairline**, not heavy shadow. Shadows carry a green cast, never pure black.

```css
--shadow-sm: 0 1px 2px oklch(0.1 0.03 160 / 0.5);
--shadow-md: 0 4px 16px -4px oklch(0.1 0.03 160 / 0.45);
--shadow-lg: 0 12px 40px -8px oklch(0.08 0.03 160 / 0.55);
--shadow-glow: 0 0 24px -6px oklch(0.62 0.09 160 / 0.35); /* graph node focus only */
```

Golden Hour swaps alpha to 0.10 / 0.12 / 0.16. Elevation levels: 0 canvas, 1 raised (`--shadow-sm` + border), 2 overlay (`--shadow-md`), 3 modal/palette (`--shadow-lg` + scrim `oklch(0.05 0.02 160 / 0.6)` with 8px backdrop blur).

## 6. Glass rules

Glass = `backdrop-filter: blur(16px) saturate(1.4)` over `--background` at 72% alpha, 1px `--line` bottom hairline. Allowed **only** on: sticky header, Cmd-K palette, graph HUD controls. Never on article content, cards, or anything containing body text. Always provide solid fallback via `@supports not (backdrop-filter: blur(1px))`.

## 7. Iconography

- **Lucide** icons, 1.5px stroke, sizes 16/20/24 only, `currentColor`.
- Custom set (24 category glyphs + logo marks) drawn on the same 24px grid, 1.5px stroke, rounded caps — stored as sprite in `src/components/icons/`.
- No filled icons except state indicators (bookmark saved, verified check). No emoji in UI.

## 8. Imagery & texture

Editorial photography (NatGeo register): natural light, macro detail, no stock-photo staginess. Duotone treatment (Deep Forest → Sage) for category covers. Subtle grain overlay (`opacity: 0.04`, tiling 128px PNG) permitted on hero surfaces only. All raster via Cloudflare Images with AVIF/WebP (see `12-performance.md`).

---

*Token changes land in `globals.css` + this doc in the same PR. The design system is versioned with the codebase — no separate Figma source of truth.*

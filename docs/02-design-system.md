# Design System

Design language: **Apple × National Geographic × Linear × Arc × Obsidian** — minimal, premium, editorial, immersive, organic, scientific, calm. **Dark mode first**: dark is the default and the design source of truth; light mode is derived, never the reverse.

Tokens are defined as CSS custom properties in `src/app/globals.css` and mapped into Tailwind CSS 4 via `@theme`.

---

## 1. Color

### 1.1 Brand palette (raw)

| Name | Hex | Role |
|---|---|---|
| Deep Forest | `#0D1B14` | Dark canvas |
| Moss | `#1F5136` | Brand primary dark / fills |
| Fern | `#4D8B63` | Brand primary / interactive |
| Sage | `#B8D8C2` | Brand tint / dark-mode accents |
| Stone | `#EDEDE8` | Light surfaces |
| Warm White | `#FAFAF7` | Light canvas |

Accents — use sparingly, only where semantics demand: Sky Blue `#6FA8DC` (water/info), Amber `#D9A441` (energy/warning), Rust `#B4552D` (danger/erosion). Never as decoration.

### 1.2 Semantic tokens

| Token | Dark | Light | Notes |
|---|---|---|---|
| `--bg` | `#0D1B14` | `#FAFAF7` | Page canvas |
| `--bg-raised` | `#12241A` | `#FFFFFF` | Cards, panels |
| `--bg-overlay` | `#162E21` | `#EDEDE8` | Popovers, palette |
| `--bg-inset` | `#0A150F` | `#E4E4DD` | Wells, code blocks |
| `--fg` | `#EDEDE8` | `#12241A` | Primary text |
| `--fg-muted` | `#9FB8A8` | `#4A5D51` | Secondary text |
| `--fg-faint` | `#5F7A6A` | `#7C8B81` | Tertiary/meta — decorative only below 18px |
| `--accent` | `#4D8B63` | `#1F5136` | Interactive default |
| `--accent-hover` | `#5FA377` | `#2A6847` | |
| `--accent-fg` | `#B8D8C2` | `#1F5136` | Links/text on canvas |
| `--border` | `#24382C` | `#D8D8CE` | 1px hairlines |
| `--border-strong` | `#33503F` | `#B9BDB2` | Inputs, focus adjacency |
| `--ring` | `#B8D8C2` | `#1F5136` | Focus ring, 2px |
| `--info` | `#6FA8DC` | `#2F6CA3` | |
| `--warning` | `#D9A441` | `#8A6414` | |
| `--danger` | `#C86A45` | `#9A3F1C` | Rust ramp |
| `--success` | `#4D8B63` | `#1F5136` | Reuses brand green |

### 1.3 Contrast notes (WCAG, against usage background)

- `--fg` `#EDEDE8` on `#0D1B14`: **15.2:1** — AAA all sizes.
- `--fg-muted` `#9FB8A8` on `#0D1B14`: **8.4:1** — AAA body.
- `--accent-fg` `#B8D8C2` on `#0D1B14`: **11.6:1** — AAA; this is why dark-mode links use Sage, not Fern.
- Fern `#4D8B63` on `#0D1B14`: **4.6:1** — AA only → allowed for UI glyphs/borders and text ≥ 18.66px bold; body links must use `--accent-fg`.
- Light mode: `#12241A` on `#FAFAF7`: **14.8:1** AAA; `#1F5136` on `#FAFAF7`: **8.1:1** AAA.
- Every new token pair must pass 7:1 (body) / 4.5:1 (large text) — enforced by the contrast audit script (`11-accessibility.md`).

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

Dark mode elevates with **lighter surface + hairline**, not heavy shadow. Shadows carry a green cast, never pure black.

```css
--shadow-sm: 0 1px 2px oklch(0.1 0.03 160 / 0.5);
--shadow-md: 0 4px 16px -4px oklch(0.1 0.03 160 / 0.45);
--shadow-lg: 0 12px 40px -8px oklch(0.08 0.03 160 / 0.55);
--shadow-glow: 0 0 24px -6px oklch(0.62 0.09 160 / 0.35); /* graph node focus only */
```

Light mode swaps alpha to 0.10 / 0.12 / 0.16. Elevation levels: 0 canvas, 1 raised (`--shadow-sm` + border), 2 overlay (`--shadow-md`), 3 modal/palette (`--shadow-lg` + scrim `oklch(0.05 0.02 160 / 0.6)` with 8px backdrop blur).

## 6. Glass rules

Glass = `backdrop-filter: blur(16px) saturate(1.4)` over `--bg` at 72% alpha, 1px `--border` bottom hairline. Allowed **only** on: sticky header, Cmd-K palette, graph HUD controls. Never on article content, cards, or anything containing body text. Always provide solid fallback via `@supports not (backdrop-filter: blur(1px))`.

## 7. Iconography

- **Lucide** icons, 1.5px stroke, sizes 16/20/24 only, `currentColor`.
- Custom set (24 category glyphs + logo marks) drawn on the same 24px grid, 1.5px stroke, rounded caps — stored as sprite in `src/components/icons/`.
- No filled icons except state indicators (bookmark saved, verified check). No emoji in UI.

## 8. Imagery & texture

Editorial photography (NatGeo register): natural light, macro detail, no stock-photo staginess. Duotone treatment (Deep Forest → Sage) for category covers. Subtle grain overlay (`opacity: 0.04`, tiling 128px PNG) permitted on hero surfaces only. All raster via Cloudflare Images with AVIF/WebP (see `12-performance.md`).

---

*Token changes land in `globals.css` + this doc in the same PR. The design system is versioned with the codebase — no separate Figma source of truth.*

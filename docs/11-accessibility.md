# Accessibility

Target: **WCAG 2.2 AA as the hard floor, AAA wherever achievable** — specifically AAA for text contrast (7:1), reading experience, and keyboard operability. An open knowledge commons that excludes readers is failing its own mission. Accessibility review is part of PR review, not a post-hoc audit.

---

## 1. Contrast (AAA-first)

- All body text pairs meet **7:1**; large text (≥ 24px / 18.66px bold) meets **4.5:1**; UI glyphs/borders meet **3:1**. Verified values per token pair in `02-design-system.md` §1.3.
- Consequences already baked into the system: dark-mode links are Sage `#B8D8C2` (11.6:1), not Fern (4.6:1); `--fg-faint` is decorative-only below 18px; category tones are used on chips/nodes, never as body-text color.
- **Audit approach:** `scripts/contrast-audit.ts` parses `globals.css` tokens, computes every declared foreground/background pairing (pairs are declared in a manifest — no guessing), fails CI below threshold. Storybook-free visual checks via Playwright + `axe-core` on 12 representative pages, both themes, both motion modes. Manual quarterly pass with Windows High Contrast / `forced-colors: active` (system colors respected; focus/selected states re-expressed via `outline` and `forced-color-adjust`).

## 2. Keyboard navigation map

Global:
| Key | Action |
|---|---|
| `Cmd/Ctrl-K` | Command palette |
| `/` | Focus search (when no input focused) |
| `Tab` order | Skip link → header nav → main → aside (TOC) → footer |
| `Esc` | Close topmost layer (palette > dialog > drawer > popover) |
| `?` | Shortcut help dialog |

Article: TOC is a nav landmark with arrow-key support; footnote/citation refs are buttons opening popovers, `Esc` returns focus to the ref; "Improve this page", bookmark, and discussion are ordinary tab stops.

Graph (`/explore`) — full keyboard parity, no pointer required:
| Key | Action |
|---|---|
| `Tab` into canvas | Focuses current node (roving tabindex; one stop for the whole canvas) |
| `Arrow keys` | Move focus to nearest neighbor in that direction |
| `Enter` | Open node preview panel |
| `Shift-Enter` | Navigate to article |
| `1–7` | Toggle edge-type filters (matches legend order) |
| `+ / -` / `0` | Zoom / reset camera |
| `f` | Focus mode (dim non-neighbors) |

Rules: visible focus ring (`--ring`, 2px, offset 2px) on **everything**, never `outline: none` without replacement; focus is trapped in dialogs and restored on close; no positive `tabindex` anywhere (lint-enforced `jsx-a11y`).

## 3. Screen reader patterns

- Semantics first: real landmarks (`header/nav/main/aside/footer`), one `h1`, continuous heading levels (validated in content CI, `05` §4.5).
- **Graph:** `GraphCanvas` is `role="application"` with an `aria-label` describing scope ("Knowledge graph, 640 topics, 24 categories") and `aria-describedby` usage hints. The real SR surface is **`GraphA11yList`** — a parallel, visually-hidden-but-focusable structured view: current node as heading, then edges grouped by type as link lists ("Depends on: 3 topics…"). Canvas focus changes update the list and announce via a polite live region ("Soil food web. Soil. Verified. 5 connections."). Filters announce result deltas ("Showing 112 of 640 topics"). This is a *mirror*, not a fallback — it is always present and stays in sync.
- Cmd-K: `role="dialog"` + `role="listbox"`/`option` pattern, `aria-activedescendant`, result-count live region debounced to 500ms (no announcement spam while typing).
- Progress/checkpoints: `ProgressRing` carries `role="progressbar"` with value text ("4 of 9 steps"); checkpoint feedback rendered in text, focus moved to the result.
- AI content: "AI-generated" labels are text, not icon-only; streamed Ask answers render into `aria-busy` container announced once on completion, not per token.
- Media: mandatory alt/captions/credits enforced by content validation; decorative imagery `alt=""`; duotone covers described by article title context, not repeated.

## 4. Reduced motion & vestibular safety

Per `04-animation-guidelines.md` §1.5 — central `motion-safe` layer: crossfades replace transforms, Lenis off, graph drift off, camera fly-tos become cuts with a 150ms fade. Additionally: no flashing > 3/sec anywhere (nothing even close by design), parallax banned outright, and the graph's `filter` dimming is opacity-based (no blur pulsing).

## 5. Cognitive & reading accessibility

- 68ch measure, 1.7 line-height, fluid type never below 16px effective body size; user font-size scaling to 200% breaks no layout (tested in CI viewport pass at 320px-wide / 200% zoom — WCAG 1.4.10 reflow).
- Summary ("lede") on every article; "Key points" box for long reads; reading time and difficulty badges set expectations.
- Plain-language glossary terms get `<dfn>`-backed hover/focus definitions from `content/glossary.yaml`.
- Consistent component grammar (one reveal pattern, one card pattern) reduces relearning cost per page.

## 6. Forms, errors, touch

- Labels always visible (no placeholder-as-label); errors are text + icon + `aria-describedby`, never color-only; all touch targets ≥ 44×44px (AAA 2.5.5) including graph HUD controls; drag interactions (graph pan) have non-drag equivalents (keyboard, zoom buttons).

## 7. Process & tooling

1. **Lint:** `eslint-plugin-jsx-a11y` strict; custom rules: no `outline:none`, no icon-button without label.
2. **CI:** `axe-core` via Playwright on the 12-page golden set × {dark, light} × {motion, reduced} — zero serious/critical violations to merge; contrast audit script (§1).
3. **Manual cadence:** monthly NVDA + VoiceOver pass on one new surface; quarterly full pass including graph keyboard parity; findings filed with `a11y` label, treated as bugs (priority ≥ functional bugs).
4. **Definition of done** for any component PR includes: keyboard path, SR announcement text, reduced-motion variant, contrast check — listed in the PR template.
5. Accessibility statement at `/about#accessibility` with contact for barriers and known-issues list — honest and current.

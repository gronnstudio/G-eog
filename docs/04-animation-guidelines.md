# Animation Guidelines

Motion in Equilibrium behaves like nature: continuous, physical, unhurried, never decorative for its own sake. Stack: **Framer Motion** (UI), **Lenis** (scroll), **canvas/WebGL** (graph). CSS transitions for trivial state changes.

---

## 1. Principles

1. **60fps or nothing.** Animate only `transform`, `opacity`, `filter` (sparingly), and canvas. Anything that triggers layout/paint (top/left/width/height/box-shadow transitions) is forbidden. Budget: main-thread task < 8ms during any animation frame.
2. **Physics over duration.** Interactive motion (drag, graph, dismiss) uses springs, not fixed durations — velocity is inherited from the gesture. Duration-based easing is reserved for non-interactive choreography (reveals, fades).
3. **Purposeful.** Every animation must answer one of: where did this come from? / what changed? / what can I do? If it answers none, delete it.
4. **Calm.** Small distances (≤ 24px translates), low overshoot (spring damping ≥ 20), no bounce on content. The site should feel like a forest, not a fairground.
5. **Reduced motion is a first-class variant, not a kill switch.** Under `prefers-reduced-motion: reduce`: transforms become opacity-only crossfades (150ms), Lenis is disabled (native scroll), graph simulation renders settled (no drift), autoplaying ambient motion stops entirely. Implemented centrally via `useReducedMotion()` + a `motion-safe` token layer — never per-component ad hoc.

## 2. Tokens

Defined in `src/lib/motion.ts` and mirrored as CSS vars.

### Durations
| Token | Value | Use |
|---|---|---|
| `--dur-instant` | `100ms` | hover tints, toggles |
| `--dur-fast` | `180ms` | buttons, tooltips, chips |
| `--dur-base` | `240ms` | cards, popovers, palette |
| `--dur-slow` | `400ms` | panels, drawers, TOC |
| `--dur-reveal` | `600ms` | scroll reveals, hero |
| `--dur-page` | `320ms` | route transitions |

Nothing exceeds 600ms except the one-time home hero (≤ 900ms) and camera fly-tos in the graph (spring-driven, typically 500–800ms).

### Easings
| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrances (default) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | position changes, tabs |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | exits (always faster than entrances: exit dur = 0.6 × entrance) |

### Springs (Framer Motion)
| Token | Config | Use |
|---|---|---|
| `spring.ui` | `{ stiffness: 420, damping: 32, mass: 0.8 }` | palette, popovers, badges |
| `spring.panel` | `{ stiffness: 300, damping: 30 }` | drawers, node preview |
| `spring.camera` | `{ stiffness: 120, damping: 22 }` | graph fly-to, zoom |
| `spring.node` | `{ stiffness: 200, damping: 26 }` | node focus scale (1 → 1.15) |

### Stagger
`stagger.list = 40ms` (cap total at 400ms — beyond 10 items, remaining appear together). `stagger.grid = 30ms`, row-major.

## 3. Choreography patterns

### 3.1 Reveal (scroll)
- One pattern site-wide: `opacity 0→1` + `translateY 16px→0`, `--dur-reveal`, `--ease-out`, triggered at 20% viewport intersection, `once: true`.
- Never re-trigger on scroll-up. Never reveal below-fold content that's already visible on load. Headings reveal before their body (60ms lead). LCP elements are **never** part of a reveal (they render visible; see `12-performance.md`).

### 3.2 Page transitions
- Template-level: exiting view fades to 0 over 190ms (`--ease-exit`), entering view fades in + 12px rise over 320ms (`--ease-out`). Header, footer, and palette persist — only `<main>` transitions.
- Article → article within a category: shared category badge and title use layout projection (`layoutId`) when navigation originates from a card.
- Scroll restoration is instant and precedes the entrance animation.

### 3.3 Graph
- **Idle:** nodes drift with low-amplitude simulation noise (±1.5px, 0.1Hz). Disabled under reduced motion and when tab is hidden (`visibilitychange`).
- **Focus:** selected node scales 1→1.15 (`spring.node`) with `--shadow-glow`; neighbors brighten, rest dims to 35% opacity over 240ms; camera fly-to via `spring.camera`.
- **Filter:** removed nodes fade+shrink out (180ms), layout re-settles via simulation — never teleport.
- **Entry:** on `/explore` load, nodes fade in radially from the focused/central node, 500ms total, capped stagger. Simulation pre-warmed off-thread so entry is presentation, not layout.

### 3.4 Cmd-K palette
Scrim fades 150ms; panel scales 0.98→1 + fades with `spring.ui`. Result list changes crossfade at 120ms with **no** per-item stagger (speed beats theater in search). Closing is 0.6× entry.

### 3.5 Micro-interactions
Buttons: background tint 100ms, `active:scale-[0.98]` (transform only). Bookmark: icon fill + 1→1.2→1 spring pop. Progress ring: animates on value change with `--ease-in-out` 400ms, never on mount. Hover cards: 300ms open delay, 0ms close.

### 3.6 Lenis scroll
`lerp: 0.1`, `wheelMultiplier: 1`, disabled on touch devices (native momentum wins) and under reduced motion. Anchor/TOC jumps use Lenis `scrollTo` with `--ease-in-out`, max 700ms regardless of distance.

## 4. Forbidden

- Parallax on text; any horizontal scroll-hijacking; scroll-jacking that changes scroll speed/direction.
- Autoplaying looping motion in content areas (ambient motion is graph-only).
- Animating `width/height/top/left/margin/box-shadow`; `filter: blur()` transitions on elements > 400px.
- Skeleton shimmer loops > 2 iterations; spinner + skeleton together.
- Text effects: typewriter, per-letter reveals, gradient text animation.
- Bounce/elastic easing on content; overshoot on anything containing text.
- Entrance animation on the LCP element, or any animation delaying interactivity.
- More than one attention-seeking motion per viewport at a time.
- Custom cursors; cursor-trailing effects.

## 5. Review checklist (every motion PR)

1. DevTools Performance: no frame > 16.7ms during the animation on a 4× CPU throttle.
2. `prefers-reduced-motion` variant verified by toggling emulation.
3. Interruption-safe: animation can be reversed mid-flight without snapping (springs handle this; duration-based must use `AnimatePresence` mode `popLayout`/`wait` correctly).
4. Purposeful test: reviewer can state which of the three questions (§1.3) it answers.

// The shared motion vocabulary. If an app mirrors a curve in CSS
// (gronn-studio declares --ease-out-expo / --ease-curtain twins in
// globals.css), the two halves must stay identical.

// framer-motion's `BezierDefinition` (from motion-utils, not re-exported
// by framer-motion itself) is exactly this shape. Declaring it locally
// keeps the constants assignable to any `ease` prop with no cast at the
// call site, without importing from a transitive dependency.
type Bezier = readonly [number, number, number, number]

/**
 * The house reveal ease (out-expo): fast out of the gate, long soft
 * landing. Everything that *enters* uses this.
 * gronn-studio value; equilibrium's inline [0.22, 1, 0.36, 1] callers
 * can keep passing their own curve as a prop where offered.
 */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const satisfies Bezier

/**
 * The curtain ease (in-out-quart): symmetric, weighted at both ends — it
 * reads as a panel being drawn rather than an object arriving. For
 * full-bleed wipes: route transitions and full-screen menus.
 */
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const satisfies Bezier

/**
 * How long a curtain takes to cross the screen, in seconds.
 */
export const DURATION_CURTAIN = 0.7

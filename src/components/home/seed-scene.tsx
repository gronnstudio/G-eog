"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * The Living Seed — EOG's scroll companion. One particle object that
 * travels down the home page on a fixed layer and *returns in a
 * different ecological form* at each stage of the scroll:
 *
 *   seed sphere → mycelium web → growth rings → phyllotaxis spiral → bloom
 *
 * All forms are precomputed point sets of equal length; the scene eases
 * between them (and a side-to-side drift) from a single scroll fraction.
 * Distinct from the equilibrium reference's fracturing core — same
 * "recurring companion" idea, EOG's own story and palette.
 */

const COUNT = 1400

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** fibonacci sphere — the dormant seed */
function formSeed(): Float32Array {
  const a = new Float32Array(COUNT * 3)
  const phi = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = phi * i
    a[i * 3] = Math.cos(t) * r * 1.05
    a[i * 3 + 1] = y * 1.05
    a[i * 3 + 2] = Math.sin(t) * r * 1.05
  }
  return a
}

/** clustered filament network — the mycelium web */
function formMycelium(): Float32Array {
  const a = new Float32Array(COUNT * 3)
  const rand = seededRandom(11)
  const hubs: THREE.Vector3[] = []
  for (let h = 0; h < 9; h++)
    hubs.push(
      new THREE.Vector3((rand() - 0.5) * 3.4, (rand() - 0.5) * 2.6, (rand() - 0.5) * 1.6)
    )
  for (let i = 0; i < COUNT; i++) {
    const from = hubs[Math.floor(rand() * hubs.length)]
    const to = hubs[Math.floor(rand() * hubs.length)]
    const t = rand()
    const jitter = 0.09 + rand() * 0.08
    a[i * 3] = from.x + (to.x - from.x) * t + (rand() - 0.5) * jitter
    a[i * 3 + 1] = from.y + (to.y - from.y) * t + (rand() - 0.5) * jitter
    a[i * 3 + 2] = from.z + (to.z - from.z) * t + (rand() - 0.5) * jitter
  }
  return a
}

/** concentric flat rings — the growth rings of a felled trunk */
function formRings(): Float32Array {
  const a = new Float32Array(COUNT * 3)
  const rand = seededRandom(23)
  for (let i = 0; i < COUNT; i++) {
    const ring = i % 5
    const radius = 0.45 + ring * 0.38 + (rand() - 0.5) * 0.06
    const t = rand() * Math.PI * 2
    a[i * 3] = Math.cos(t) * radius
    a[i * 3 + 1] = Math.sin(t) * radius * 0.42
    a[i * 3 + 2] = (rand() - 0.5) * 0.12
  }
  return a
}

/** phyllotaxis disc — the sunflower/canopy spiral */
function formSpiral(): Float32Array {
  const a = new Float32Array(COUNT * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < COUNT; i++) {
    const r = 1.9 * Math.sqrt(i / COUNT)
    const t = i * golden
    a[i * 3] = Math.cos(t) * r
    a[i * 3 + 1] = Math.sin(t) * r * 0.75
    a[i * 3 + 2] = Math.sin(i * 0.09) * 0.16
  }
  return a
}

/** bursting shells — the bloom */
function formBloom(): Float32Array {
  const a = new Float32Array(COUNT * 3)
  const rand = seededRandom(37)
  const phi = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = phi * i
    const shell = 1.1 + (i % 3) * 0.55 + rand() * 0.25
    a[i * 3] = Math.cos(t) * r * shell
    a[i * 3 + 1] = y * shell
    a[i * 3 + 2] = Math.sin(t) * r * shell
  }
  return a
}

/** per-form world offset (x, y) so the object keeps clear of the copy */
const FORM_OFFSET: [number, number][] = [
  [1.9, 0.1], // seed — right of the hero headline
  [-2.1, 0], // mycelium — left while the graph text sits right
  [2.0, -0.2], // rings — back right
  [-1.9, 0.1], // spiral — left again
  [0, 0.1], // bloom — center stage at the CTA
]

const EMBER = new THREE.Color("#f95a08")
const CREAM = new THREE.Color("#f4ede6")
const LEAF = new THREE.Color("#2f8552")

function SeedObject({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null)
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.PointsMaterial>(null)

  const forms = useMemo(
    () => [formSeed(), formMycelium(), formRings(), formSpiral(), formBloom()],
    []
  )

  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3)
    const rand = seededRandom(5)
    const tmp = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const roll = rand()
      tmp.copy(roll < 0.14 ? EMBER : roll < 0.5 ? LEAF : CREAM)
      c[i * 3] = tmp.r
      c[i * 3 + 1] = tmp.g
      c[i * 3 + 2] = tmp.b
    }
    return c
  }, [])

  const positions = useMemo(() => forms[0].slice(), [forms])
  const eased = useRef({ form: 0, x: FORM_OFFSET[0][0], y: FORM_OFFSET[0][1] })

  useFrame((state, delta) => {
    const p = points.current
    const g = group.current
    if (!p || !g) return

    // scroll fraction → position on the form timeline
    const target = progressRef.current * (forms.length - 1)
    const e = eased.current
    const lerp = 1 - Math.exp(-3.2 * delta)
    e.form += (target - e.form) * lerp

    const ia = Math.min(forms.length - 1, Math.floor(e.form))
    const ib = Math.min(forms.length - 1, ia + 1)
    // smoothstep so each form holds its shape before melting into the next
    const raw = e.form - ia
    const t = raw * raw * (3 - 2 * raw)

    const A = forms[ia]
    const B = forms[ib]
    const arr = p.geometry.getAttribute("position") as THREE.BufferAttribute
    const time = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      // per-particle breathing so the object always feels alive
      const wob = Math.sin(time * 0.7 + i * 0.37) * 0.025
      arr.array[j] = A[j] + (B[j] - A[j]) * t + wob
      arr.array[j + 1] = A[j + 1] + (B[j + 1] - A[j + 1]) * t + Math.cos(time * 0.6 + i * 0.53) * 0.025
      arr.array[j + 2] = A[j + 2] + (B[j + 2] - A[j + 2]) * t
    }
    arr.needsUpdate = true

    // drift toward the active form's parking spot
    const [oxA, oyA] = FORM_OFFSET[ia]
    const [oxB, oyB] = FORM_OFFSET[ib]
    e.x += (oxA + (oxB - oxA) * t - e.x) * lerp
    e.y += (oyA + (oyB - oyA) * t - e.y) * lerp
    g.position.set(e.x, e.y, 0)

    // slow presence rotation, a little livelier mid-morph
    const churn = 1 + Math.sin(t * Math.PI) * 1.6
    g.rotation.y += delta * 0.16 * churn
    g.rotation.x = Math.sin(time * 0.11) * 0.22

    if (mat.current) {
      // dim slightly while morphing so transitions read as dissolves
      mat.current.opacity = 0.85 - Math.sin(t * Math.PI) * 0.3
    }
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={mat}
          size={0.028}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function SeedScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <SeedObject progressRef={progressRef} />
    </Canvas>
  )
}

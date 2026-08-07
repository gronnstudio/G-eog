"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * The Living Seed — EOG's scroll companion, v2: each form now mirrors
 * the content on screen at that point of the page.
 *
 *   hero        → knowledge constellation (nodes + relationship threads —
 *                 "knowledge grows when everything connects")
 *   graph strip → mycelium web (the underground network the graph maps)
 *   categories  → eight orbiting clusters, one per domain chip on screen,
 *                 each tinted like the category colour family
 *   timeline    → ecological succession: ground → trunk → rising canopy
 *   CTA         → seed bloom (the commons growing outward)
 *
 * Points AND line threads morph between equal-length precomputed sets
 * from a single scroll fraction; colors crossfade per form. Only mounted
 * ≥1024px landscape, no reduced-motion, WebGL only (see seed-core).
 */

const COUNT = 1800
const LINK_COUNT = 220 // line segments; 2 vertices each

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function fib(count: number, i: number): [number, number, number] {
  const phi = Math.PI * (Math.sqrt(5) - 1)
  const y = 1 - (i / (count - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  const t = phi * i
  return [Math.cos(t) * r, y, Math.sin(t) * r]
}

const EMBER = new THREE.Color("#f95a08")
const CREAM = new THREE.Color("#f4ede6")
const LEAF = new THREE.Color("#2f8552")
const WATER = new THREE.Color("#4f8fb8")
const AMBER = new THREE.Color("#e0a458")
const SOIL = new THREE.Color("#8a6f4d")

/** category colour families — mirrors the domain chips on screen */
const CLUSTER_TINTS = [LEAF, WATER, AMBER, EMBER, SOIL, CREAM, LEAF, WATER]

type Form = {
  pts: Float32Array
  col: Float32Array
  links: Float32Array
  linkAlpha: number
  offset: [number, number]
}

function makeForm(): { pts: Float32Array; col: Float32Array; links: Float32Array } {
  return {
    pts: new Float32Array(COUNT * 3),
    col: new Float32Array(COUNT * 3),
    links: new Float32Array(LINK_COUNT * 2 * 3),
  }
}

function setColor(col: Float32Array, i: number, c: THREE.Color, dim = 1) {
  col[i * 3] = c.r * dim
  col[i * 3 + 1] = c.g * dim
  col[i * 3 + 2] = c.b * dim
}

/** 1 — knowledge constellation: hub-and-spoke node sphere + threads */
function formConstellation(): Form {
  const f = makeForm()
  const rand = seededRandom(3)
  const hubs: number[] = []
  for (let i = 0; i < COUNT; i++) {
    const [x, y, z] = fib(COUNT, i)
    const isHub = i % 75 === 0
    if (isHub) hubs.push(i)
    const r = isHub ? 1.35 : 1.0 + rand() * 0.55
    f.pts[i * 3] = x * r
    f.pts[i * 3 + 1] = y * r
    f.pts[i * 3 + 2] = z * r
    setColor(f.col, i, isHub ? EMBER : rand() < 0.55 ? CREAM : LEAF, isHub ? 1 : 0.85)
  }
  // threads: hub → nearby nodes (the "97 connections" on screen)
  for (let l = 0; l < LINK_COUNT; l++) {
    const h = hubs[l % hubs.length] * 3
    const n = Math.floor(rand() * COUNT) * 3
    f.links.set([f.pts[h], f.pts[h + 1], f.pts[h + 2], f.pts[n], f.pts[n + 1], f.pts[n + 2]], l * 6)
  }
  return { ...f, linkAlpha: 0.28, offset: [1.9, 0.1] }
}

/** 2 — mycelium: filament runs between buried hubs */
function formMycelium(): Form {
  const f = makeForm()
  const rand = seededRandom(11)
  const hubs: THREE.Vector3[] = []
  for (let h = 0; h < 10; h++)
    hubs.push(new THREE.Vector3((rand() - 0.5) * 3.6, (rand() - 0.5) * 2.4, (rand() - 0.5) * 1.4))
  for (let i = 0; i < COUNT; i++) {
    const a = hubs[Math.floor(rand() * hubs.length)]
    const b = hubs[Math.floor(rand() * hubs.length)]
    const t = rand()
    const j = 0.08 + rand() * 0.1
    f.pts[i * 3] = a.x + (b.x - a.x) * t + (rand() - 0.5) * j
    f.pts[i * 3 + 1] = a.y + (b.y - a.y) * t + (rand() - 0.5) * j
    f.pts[i * 3 + 2] = a.z + (b.z - a.z) * t + (rand() - 0.5) * j
    setColor(f.col, i, rand() < 0.12 ? AMBER : CREAM, 0.8)
  }
  for (let l = 0; l < LINK_COUNT; l++) {
    const a = hubs[l % hubs.length]
    const b = hubs[(l * 3 + 1) % hubs.length]
    f.links.set([a.x, a.y, a.z, b.x, b.y, b.z], l * 6)
  }
  return { ...f, linkAlpha: 0.16, offset: [-2.1, 0] }
}

/** 3 — domains: eight tinted orbit clusters (one per category card) */
function formClusters(): Form {
  const f = makeForm()
  const rand = seededRandom(23)
  const centers: THREE.Vector3[] = []
  for (let c = 0; c < 8; c++) {
    const a = (c / 8) * Math.PI * 2
    centers.push(new THREE.Vector3(Math.cos(a) * 1.7, Math.sin(a) * 1.15, Math.sin(a * 2) * 0.4))
  }
  for (let i = 0; i < COUNT; i++) {
    const c = i % 8
    const ctr = centers[c]
    const [x, y, z] = fib(Math.ceil(COUNT / 8), Math.floor(i / 8))
    const r = 0.28 + rand() * 0.22
    f.pts[i * 3] = ctr.x + x * r
    f.pts[i * 3 + 1] = ctr.y + y * r
    f.pts[i * 3 + 2] = ctr.z + z * r
    setColor(f.col, i, CLUSTER_TINTS[c], 0.9)
  }
  // ring of relationships between neighbouring domains
  for (let l = 0; l < LINK_COUNT; l++) {
    const a = centers[l % 8]
    const b = centers[(l + 1) % 8]
    const t1 = (l / LINK_COUNT) * 0.4
    f.links.set([
      a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1, a.z,
      a.x + (b.x - a.x) * (t1 + 0.5), a.y + (b.y - a.y) * (t1 + 0.5), b.z,
    ], l * 6)
  }
  return { ...f, linkAlpha: 0.2, offset: [2.0, -0.1] }
}

/** 4 — succession: bare ground rising into trunk and canopy */
function formSuccession(): Form {
  const f = makeForm()
  const rand = seededRandom(37)
  for (let i = 0; i < COUNT; i++) {
    const roll = i / COUNT
    if (roll < 0.3) {
      // ground layer — pioneers
      f.pts[i * 3] = (rand() - 0.5) * 3.6
      f.pts[i * 3 + 1] = -1.5 + rand() * 0.25
      f.pts[i * 3 + 2] = (rand() - 0.5) * 1.2
      setColor(f.col, i, rand() < 0.5 ? SOIL : AMBER, 0.8)
    } else if (roll < 0.45) {
      // trunk
      const t = rand()
      f.pts[i * 3] = (rand() - 0.5) * 0.22
      f.pts[i * 3 + 1] = -1.4 + t * 1.9
      f.pts[i * 3 + 2] = (rand() - 0.5) * 0.22
      setColor(f.col, i, SOIL, 0.9)
    } else {
      // canopy dome
      const [x, y, z] = fib(COUNT, i)
      const r = 0.9 + rand() * 0.45
      f.pts[i * 3] = x * r * 1.25
      f.pts[i * 3 + 1] = 0.75 + Math.abs(y) * r * 0.85
      f.pts[i * 3 + 2] = z * r * 0.9
      setColor(f.col, i, rand() < 0.85 ? LEAF : EMBER, 0.95)
    }
  }
  // branches: trunk top fanning into the canopy
  for (let l = 0; l < LINK_COUNT; l++) {
    const a = rand() * Math.PI * 2
    const r = 0.5 + rand() * 1.1
    f.links.set([
      0, -0.2 + rand() * 0.8, 0,
      Math.cos(a) * r, 0.9 + rand() * 0.9, Math.sin(a) * r * 0.8,
    ], l * 6)
  }
  return { ...f, linkAlpha: 0.14, offset: [-1.9, 0.05] }
}

/** 5 — bloom: shells bursting outward */
function formBloom(): Form {
  const f = makeForm()
  const rand = seededRandom(53)
  for (let i = 0; i < COUNT; i++) {
    const [x, y, z] = fib(COUNT, i)
    const shell = 1.1 + (i % 3) * 0.55 + rand() * 0.3
    f.pts[i * 3] = x * shell
    f.pts[i * 3 + 1] = y * shell
    f.pts[i * 3 + 2] = z * shell
    setColor(f.col, i, rand() < 0.2 ? EMBER : rand() < 0.6 ? CREAM : LEAF)
  }
  // radial rays
  for (let l = 0; l < LINK_COUNT; l++) {
    const [x, y, z] = fib(LINK_COUNT, l)
    f.links.set([x * 0.4, y * 0.4, z * 0.4, x * 2.1, y * 2.1, z * 2.1], l * 6)
  }
  return { ...f, linkAlpha: 0.1, offset: [0, 0.1] }
}

function SeedObject({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const group = useRef<THREE.Group>(null)
  const pMat = useRef<THREE.PointsMaterial>(null)
  const lMat = useRef<THREE.LineBasicMaterial>(null)

  const forms = useMemo<Form[]>(
    () => [formConstellation(), formMycelium(), formClusters(), formSuccession(), formBloom()],
    []
  )

  const positions = useMemo(() => forms[0].pts.slice(), [forms])
  const colors = useMemo(() => forms[0].col.slice(), [forms])
  const linkPositions = useMemo(() => forms[0].links.slice(), [forms])
  const eased = useRef({ form: 0, x: forms[0].offset[0], y: forms[0].offset[1] })

  useFrame((state, delta) => {
    const p = points.current
    const ln = lines.current
    const g = group.current
    if (!p || !ln || !g) return

    const target = progressRef.current * (forms.length - 1)
    const e = eased.current
    const lerp = 1 - Math.exp(-3.2 * delta)
    e.form += (target - e.form) * lerp

    const ia = Math.min(forms.length - 1, Math.floor(e.form))
    const ib = Math.min(forms.length - 1, ia + 1)
    const raw = e.form - ia
    const t = raw * raw * (3 - 2 * raw) // smoothstep hold

    const A = forms[ia]
    const B = forms[ib]
    const time = state.clock.elapsedTime

    const pAttr = p.geometry.getAttribute("position") as THREE.BufferAttribute
    const cAttr = p.geometry.getAttribute("color") as THREE.BufferAttribute
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      const wobX = Math.sin(time * 0.7 + i * 0.37) * 0.02
      const wobY = Math.cos(time * 0.6 + i * 0.53) * 0.02
      pAttr.array[j] = A.pts[j] + (B.pts[j] - A.pts[j]) * t + wobX
      pAttr.array[j + 1] = A.pts[j + 1] + (B.pts[j + 1] - A.pts[j + 1]) * t + wobY
      pAttr.array[j + 2] = A.pts[j + 2] + (B.pts[j + 2] - A.pts[j + 2]) * t
      cAttr.array[j] = A.col[j] + (B.col[j] - A.col[j]) * t
      cAttr.array[j + 1] = A.col[j + 1] + (B.col[j + 1] - A.col[j + 1]) * t
      cAttr.array[j + 2] = A.col[j + 2] + (B.col[j + 2] - A.col[j + 2]) * t
    }
    pAttr.needsUpdate = true
    cAttr.needsUpdate = true

    const lAttr = ln.geometry.getAttribute("position") as THREE.BufferAttribute
    for (let i = 0; i < LINK_COUNT * 2 * 3; i++) {
      lAttr.array[i] = A.links[i] + (B.links[i] - A.links[i]) * t
    }
    lAttr.needsUpdate = true

    const morphDip = Math.sin(t * Math.PI)
    if (pMat.current) pMat.current.opacity = 0.85 - morphDip * 0.3
    if (lMat.current) {
      // threads fade out mid-morph and settle at the target form's alpha
      const alpha = A.linkAlpha + (B.linkAlpha - A.linkAlpha) * t
      lMat.current.opacity = alpha * (1 - morphDip * 0.85)
      // gentle pulse so relationships feel alive
      lMat.current.opacity *= 0.8 + Math.sin(time * 1.3) * 0.2
    }

    e.x += (A.offset[0] + (B.offset[0] - A.offset[0]) * t - e.x) * lerp
    e.y += (A.offset[1] + (B.offset[1] - A.offset[1]) * t - e.y) * lerp
    g.position.set(e.x, e.y, 0)

    const churn = 1 + morphDip * 1.6
    g.rotation.y += delta * 0.14 * churn
    g.rotation.x = Math.sin(time * 0.11) * 0.2
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pMat}
          size={0.026}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lMat}
          color="#f4ede6"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
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

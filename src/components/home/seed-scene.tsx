"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * The Growing Graph — the site's own sentence made spatial:
 * "knowledge grows when everything connects."
 *
 * A small constellation of node-lights drifts slowly in space. As the
 * page scrolls, the connection radius widens — at the hero only a few
 * close pairs are threaded; by the footer the whole constellation is
 * woven into one web. Hovering breathes; nothing swarms, nothing
 * explodes. No postprocessing (the composer glitched on some GPUs) —
 * just additive sprites and hairline threads.
 *
 * Desktop-landscape only; reduced-motion and WebGL gated in seed-core.
 */

const NODES = 64
const MAX_LINKS = 420 // preallocated segment budget

const EMBER = new THREE.Color("#f95a08")
const CREAM = new THREE.Color("#f4ede6")
const LEAF = new THREE.Color("#2f8552")

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float uTime;
  uniform float uPixelRatio;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.9 + 0.1 * sin(uTime * 1.1 + aPhase);
    gl_PointSize = aSize * uPixelRatio * (110.0 / -mv.z) * vTwinkle;
    gl_Position = projectionMatrix * mv;
  }
`
const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float uOpacity;
  uniform float uInk;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float halo = smoothstep(0.5, 0.0, d);
    float core = pow(max(0.0, 1.0 - d * 2.4), 3.0);
    float aGlow = (halo * 0.4 + core) * vTwinkle;
    float aInk = smoothstep(0.4, 0.28, d) * 0.9;
    float a = mix(aGlow, aInk, uInk) * uOpacity;
    vec3 col = mix(vColor * (0.75 + core * 0.8), vColor * 0.6, uInk);
    gl_FragColor = vec4(col, a);
  }
`

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** true on Golden Hour — glow flips to ink on the paper ground */
function useInkTheme(): boolean {
  const [ink, setInk] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const read = () => setInk(el.classList.contains("goldenhour"))
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [])
  return ink
}

type Node = {
  base: THREE.Vector3
  freq: THREE.Vector3
  phase: THREE.Vector3
  amp: number
}

function GrowingGraph({
  progressRef,
  ink,
}: {
  progressRef: React.MutableRefObject<number>
  ink: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const pMat = useRef<THREE.ShaderMaterial>(null)
  const lMat = useRef<THREE.LineBasicMaterial>(null)

  // node cloud: flattened ellipsoid, slightly right-weighted like a canopy
  const nodes = useMemo<Node[]>(() => {
    const rand = seededRandom(9)
    const arr: Node[] = []
    for (let i = 0; i < NODES; i++) {
      const u = rand() * Math.PI * 2
      const v = Math.acos(2 * rand() - 1)
      const r = 0.55 + Math.cbrt(rand()) * 1.15
      arr.push({
        base: new THREE.Vector3(
          Math.sin(v) * Math.cos(u) * r * 1.35,
          Math.cos(v) * r * 0.95,
          Math.sin(v) * Math.sin(u) * r * 0.8
        ),
        freq: new THREE.Vector3(0.12 + rand() * 0.22, 0.1 + rand() * 0.2, 0.12 + rand() * 0.2),
        phase: new THREE.Vector3(rand() * 6.283, rand() * 6.283, rand() * 6.283),
        amp: 0.1 + rand() * 0.16,
      })
    }
    return arr
  }, [])

  const { positions, colors, sizes, phases } = useMemo(() => {
    const rand = seededRandom(31)
    const pos = new Float32Array(NODES * 3)
    const col = new Float32Array(NODES * 3)
    const siz = new Float32Array(NODES)
    const ph = new Float32Array(NODES)
    const tmp = new THREE.Color()
    for (let i = 0; i < NODES; i++) {
      const roll = rand()
      // a few ember anchors — most nodes cream/leaf
      tmp.copy(roll < 0.12 ? EMBER : roll < 0.5 ? LEAF : CREAM)
      col[i * 3] = tmp.r
      col[i * 3 + 1] = tmp.g
      col[i * 3 + 2] = tmp.b
      siz[i] = roll < 0.12 ? 2.6 + rand() * 0.8 : 1.1 + rand() * 1.0
      ph[i] = rand() * Math.PI * 2
    }
    return { positions: pos, colors: col, sizes: siz, phases: ph }
  }, [])

  const linkPositions = useMemo(() => new Float32Array(MAX_LINKS * 2 * 3), [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.9 },
      uPixelRatio: { value: 1 },
      uInk: { value: 0 },
    }),
    []
  )

  useEffect(() => {
    if (pMat.current) {
      pMat.current.uniforms.uInk.value = ink ? 1 : 0
      pMat.current.blending = ink ? THREE.NormalBlending : THREE.AdditiveBlending
      pMat.current.needsUpdate = true
    }
    if (lMat.current) {
      lMat.current.color.set(ink ? "#2c4638" : "#f4ede6")
      lMat.current.blending = ink ? THREE.NormalBlending : THREE.AdditiveBlending
      lMat.current.needsUpdate = true
    }
  }, [ink])

  const current = useMemo(() => nodes.map((n) => n.base.clone()), [nodes])

  useFrame((state, delta) => {
    const g = group.current
    const p = points.current
    const ln = lines.current
    if (!g || !p || !ln) return

    const time = state.clock.elapsedTime
    const progress = progressRef.current

    // nodes drift on slow lissajous paths around their anchors
    const pAttr = p.geometry.getAttribute("position") as THREE.BufferAttribute
    for (let i = 0; i < NODES; i++) {
      const n = nodes[i]
      const c = current[i]
      c.set(
        n.base.x + Math.sin(time * n.freq.x + n.phase.x) * n.amp,
        n.base.y + Math.sin(time * n.freq.y + n.phase.y) * n.amp,
        n.base.z + Math.sin(time * n.freq.z + n.phase.z) * n.amp
      )
      pAttr.array[i * 3] = c.x
      pAttr.array[i * 3 + 1] = c.y
      pAttr.array[i * 3 + 2] = c.z
    }
    pAttr.needsUpdate = true

    // the sentence, spatial: connection reach grows with scroll
    const reach = 0.55 + progress * 1.35
    const lAttr = ln.geometry.getAttribute("position") as THREE.BufferAttribute
    let seg = 0
    for (let i = 0; i < NODES && seg < MAX_LINKS; i++) {
      for (let j = i + 1; j < NODES && seg < MAX_LINKS; j++) {
        const a = current[i]
        const b = current[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dz = a.z - b.z
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < reach * reach) {
          const o = seg * 6
          lAttr.array[o] = a.x
          lAttr.array[o + 1] = a.y
          lAttr.array[o + 2] = a.z
          lAttr.array[o + 3] = b.x
          lAttr.array[o + 4] = b.y
          lAttr.array[o + 5] = b.z
          seg++
        }
      }
    }
    // collapse unused segments to zero-length (invisible)
    for (let s = seg; s < MAX_LINKS; s++) {
      const o = s * 6
      lAttr.array[o] = 0
      lAttr.array[o + 1] = 0
      lAttr.array[o + 2] = 0
      lAttr.array[o + 3] = 0
      lAttr.array[o + 4] = 0
      lAttr.array[o + 5] = 0
    }
    lAttr.needsUpdate = true

    if (pMat.current) {
      pMat.current.uniforms.uTime.value = time
      pMat.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    }
    if (lMat.current) {
      // threads stay hairline-faint; slightly clearer as the web completes
      lMat.current.opacity = (ink ? 0.3 : 0.22) + progress * 0.12
    }

    // parked right of the copy, drifting gently left across the page
    const side = 1.9 - progress * 3.6
    const sway = Math.sin(progress * Math.PI) // out and back
    g.position.set(side * (1 - sway * 0.25) + state.pointer.x * 0.08, state.pointer.y * 0.06, 0)
    g.rotation.y += delta * 0.05
    g.rotation.x = Math.sin(time * 0.06) * 0.1
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pMat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
  const ink = useInkTheme()
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <GrowingGraph progressRef={progressRef} ink={ink} />
    </Canvas>
  )
}

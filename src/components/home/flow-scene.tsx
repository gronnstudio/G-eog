"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Light through the network — Cerebrium-style engineered 3D, EOG's story.
 * A handful of smooth curved conduits (vines/cables) sweep across the
 * scene; pulses of light travel along them like sap through a stem —
 * knowledge flowing through connections. Dark glossy tubes with a
 * fresnel sheen, ember/leaf/cream pulses, junction nodes where paths
 * pass close. Scroll drives flow speed and pulse density; the camera
 * drifts gently. No postprocessing — the glow is in the tube shader.
 *
 * Desktop-landscape only; reduced-motion and WebGL gated in flow-core.
 */

const TUBE_SEGMENTS = 220
const TUBE_RADIUS = 0.022

const TUBE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const TUBE_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  uniform float uTime;
  uniform float uFlow;     // pulse travel speed multiplier
  uniform float uDensity;  // how many pulses live on the tube
  uniform float uSeed;
  uniform vec3 uPulseColor;
  uniform vec3 uCam;
  uniform float uInk;      // 1 on the paper Hour

  void main() {
    vec3 V = normalize(uCam - vPosW);
    float fres = pow(1.0 - max(0.0, dot(vNormalW, V)), 2.6);

    // ground body: near-black green gloss on dark, soft sage ink on paper
    vec3 bodyDark = vec3(0.035, 0.07, 0.055);
    vec3 bodyInk  = vec3(0.63, 0.66, 0.60);
    vec3 body = mix(bodyDark, bodyInk, uInk);

    // travelling pulses: bright bands running along the tube's length
    float x = vUv.x;
    float pulse = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float speed = 0.055 * uFlow * (1.0 + fi * 0.35);
      float head = fract(uSeed * 7.31 + fi * 0.37 + uTime * speed);
      float d = x - head;
      d -= floor(d + 0.5); // wrap to [-0.5, 0.5]
      // comet: sharp front, long tail behind the head
      float front = smoothstep(0.012, 0.0, d) * smoothstep(-0.16, -0.02, d);
      pulse += front * step(fi + 0.5, uDensity * 3.0);
    }
    pulse = min(pulse, 1.4);

    vec3 glowDark = uPulseColor;
    vec3 glowInk  = uPulseColor * 0.55;
    vec3 col = body
      + fres * mix(vec3(0.55, 0.62, 0.58), vec3(0.16, 0.24, 0.19), uInk) * 0.5
      + pulse * mix(glowDark, glowInk, uInk) * 1.9;

    float alpha = mix(0.85, 0.9, uInk);
    gl_FragColor = vec4(col, alpha);
  }
`

/** deterministic pseudo-random */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** a near-horizontal cable sweeping the FULL width, gently arced —
    Cerebrium's grammar: sparse precise lines, lots of negative space */
function makeCurve(rand: () => number, i: number, n: number): THREE.CatmullRomCurve3 {
  const lane = (i / (n - 1) - 0.5) * 2 // -1 .. 1
  const pts: THREE.Vector3[] = []
  const K = 6
  for (let k = 0; k < K; k++) {
    const t = k / (K - 1)
    const x = THREE.MathUtils.lerp(-6.8, 6.8, t)
    const y =
      lane * 2.0 +
      Math.sin(t * Math.PI * (0.8 + rand() * 0.3) + i * 2.1) * (0.28 + rand() * 0.18)
    const z = Math.sin(t * Math.PI * 1.5 + i) * 0.35 + (rand() - 0.5) * 0.2
    pts.push(new THREE.Vector3(x, y, z))
  }
  return new THREE.CatmullRomCurve3(pts)
}

const PULSE_COLORS = ["#f95a08", "#8fd0a5", "#f4ede6", "#f95a08", "#cfe8d8"]

/** true on Golden Hour */
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

function Conduits({
  progressRef,
  ink,
}: {
  progressRef: React.MutableRefObject<number>
  ink: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<THREE.ShaderMaterial[]>([])

  const tubes = useMemo(() => {
    const rand = seededRandom(17)
    const n = 4
    return Array.from({ length: n }, (_, i) => {
      const curve = makeCurve(rand, i, n)
      const geometry = new THREE.TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, 10, false)
      // two quiet junction nodes per cable
      const nodeTs = [0.3 + rand() * 0.12, 0.68 + rand() * 0.12]
      const nodes = nodeTs.map((t) => curve.getPoint(t))
      return { geometry, nodes, seed: rand(), color: PULSE_COLORS[i % PULSE_COLORS.length] }
    })
  }, [])

  useEffect(() => {
    const materials = mats.current
    return () => {
      tubes.forEach((t) => t.geometry.dispose())
      materials.forEach((m) => m.dispose())
    }
  }, [tubes])

  useEffect(() => {
    mats.current.forEach((m) => {
      if (m) m.uniforms.uInk.value = ink ? 1 : 0
    })
  }, [ink])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const time = state.clock.elapsedTime
    const p = progressRef.current

    mats.current.forEach((m) => {
      if (!m) return
      m.uniforms.uTime.value = time
      // sparse, unhurried flow that only slightly quickens down the page
      m.uniforms.uFlow.value = 0.5 + p * 0.9
      m.uniforms.uDensity.value = 0.25 + p * 0.4
      m.uniforms.uCam.value.copy(state.camera.position)
    })

    // centered full-width; only breath and a whisper of parallax
    g.position.x = state.pointer.x * 0.05
    g.position.y = Math.sin(time * 0.05) * 0.06 + state.pointer.y * 0.04
    g.rotation.z = -0.14 + Math.sin(time * 0.04) * 0.015
    g.rotation.y = Math.sin(time * 0.05) * 0.04
  })

  return (
    <group ref={group} rotation={[0.1, 0, -0.14]}>
      {tubes.map((t, i) => (
        <group key={i}>
          <mesh geometry={t.geometry}>
            <shaderMaterial
              ref={(m: THREE.ShaderMaterial | null) => {
                if (m) mats.current[i] = m
              }}
              vertexShader={TUBE_VERT}
              fragmentShader={TUBE_FRAG}
              uniforms={{
                uTime: { value: 0 },
                uFlow: { value: 1 },
                uDensity: { value: 0.5 },
                uSeed: { value: t.seed },
                uPulseColor: { value: new THREE.Color(t.color) },
                uCam: { value: new THREE.Vector3(0, 0, 6) },
                uInk: { value: 0 },
              }}
              transparent
            />
          </mesh>
          {t.nodes.map((n, k) => (
            <mesh key={k} position={n}>
              <sphereGeometry args={[0.045, 20, 20]} />
              <meshBasicMaterial
                color={ink ? "#41604f" : "#dbe9df"}
                transparent
                opacity={ink ? 0.65 : 0.4}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function FlowScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>
}) {
  const ink = useInkTheme()
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <Conduits progressRef={progressRef} ink={ink} />
    </Canvas>
  )
}

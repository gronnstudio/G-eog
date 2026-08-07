"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import * as THREE from "three"

/**
 * The Living Form — one organic hero object instead of a particle cloud.
 * A noise-displaced sphere with fresnel-lit, slowly flowing color: the
 * silky "living orb" aesthetic of award-winning 3D sites. Scroll doesn't
 * swap shapes — it changes the object's CHARACTER per section:
 *
 *   hero       → calm breathing orb, barely rippling
 *   graph      → tighter, faster ripples (a mind at work)
 *   domains    → broad slow waves, colour drifting through the palette
 *   timeline   → stretched tall, growing — reaching upward
 *   CTA        → open bloom: soft, swollen, radiant
 *
 * Desktop-landscape only, reduced-motion and WebGL gated in seed-core.
 */

/** per-section character: displacement amp/freq, speed, scale xyz, pos, hue mix */
const CHAPTERS = [
  { amp: 0.16, freq: 1.6, speed: 0.35, scale: [1, 1, 1], pos: [1.9, 0.05], mix: 0.0 },
  { amp: 0.34, freq: 3.2, speed: 0.7, scale: [0.92, 0.92, 0.92], pos: [-2.0, 0.1], mix: 0.25 },
  { amp: 0.22, freq: 1.1, speed: 0.4, scale: [1.15, 1.0, 1.15], pos: [2.0, -0.1], mix: 0.5 },
  { amp: 0.2, freq: 1.9, speed: 0.5, scale: [0.8, 1.5, 0.8], pos: [-1.9, 0.15], mix: 0.75 },
  { amp: 0.42, freq: 0.9, speed: 0.55, scale: [1.1, 1.1, 1.1], pos: [0, 0.05], mix: 1.0 },
] as const

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uSpeed;
  varying float vDisp;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  // Ashima simplex noise (3D)
  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float t = uTime * uSpeed;
    // two octaves of flowing noise along the normal — silk, not spikes
    float n = snoise(normal * uFreq + vec3(t * 0.6, t * 0.4, t * 0.5));
    n += 0.5 * snoise(normal * uFreq * 2.3 + vec3(-t * 0.5, t * 0.7, -t * 0.3));
    vDisp = n;
    vec3 displaced = position + normal * n * uAmp;
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vPosW = world.xyz;
    // cheap displaced normal: blend the sphere normal with the noise slope
    vNormalW = normalize(mat3(modelMatrix) * normalize(normal + vec3(n) * 0.35));
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const FRAG = /* glsl */ `
  uniform float uMix;    // palette drift across the page
  uniform float uInk;    // 1 on the paper Hour
  uniform float uOpacity;
  uniform vec3 uCam;
  varying float vDisp;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 V = normalize(uCam - vPosW);
    float fres = pow(1.0 - max(0.0, dot(vNormalW, V)), 2.2);

    // EOG palette flow: deep forest -> leaf -> water -> ember accents
    vec3 forest = vec3(0.043, 0.145, 0.102);
    vec3 leaf   = vec3(0.184, 0.522, 0.322);
    vec3 water  = vec3(0.310, 0.561, 0.722);
    vec3 ember  = vec3(0.976, 0.353, 0.031);
    vec3 cream  = vec3(0.957, 0.929, 0.902);

    float band = vDisp * 0.5 + 0.5;
    vec3 base = mix(forest, leaf, smoothstep(0.15, 0.75, band));
    base = mix(base, water, uMix * 0.45 * smoothstep(0.4, 1.0, band));
    // ember licks only on the highest crests
    base = mix(base, ember, smoothstep(0.82, 1.0, band) * (0.35 + uMix * 0.4));
    // fresnel rim: cream glow on dark, deep ink edge on paper
    vec3 rimDark = mix(cream, ember, uMix * 0.5);
    vec3 rimInk  = forest * 0.55;
    base += fres * mix(rimDark, rimInk, uInk) * mix(1.1, 0.9, uInk);
    // on paper, deepen everything toward ink so it sits on cream
    base = mix(base, base * 0.55 + forest * 0.25, uInk * 0.55);

    float alpha = uOpacity * mix(0.92, 0.85, uInk);
    gl_FragColor = vec4(base, alpha);
  }
`

/** true on Golden Hour — glow palette flips to ink on the paper ground */
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

function LivingForm({
  progressRef,
  ink,
}: {
  progressRef: React.MutableRefObject<number>
  ink: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const eased = useRef({
    amp: CHAPTERS[0].amp,
    freq: CHAPTERS[0].freq,
    speed: CHAPTERS[0].speed,
    sx: 1, sy: 1, sz: 1,
    x: CHAPTERS[0].pos[0],
    y: CHAPTERS[0].pos[1],
    mix: 0,
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: CHAPTERS[0].amp },
      uFreq: { value: CHAPTERS[0].freq },
      uSpeed: { value: CHAPTERS[0].speed },
      uMix: { value: 0 },
      uInk: { value: 0 },
      uOpacity: { value: 0.9 },
      uCam: { value: new THREE.Vector3(0, 0, 6) },
    }),
    []
  )

  useEffect(() => {
    if (mat.current) mat.current.uniforms.uInk.value = ink ? 1 : 0
  }, [ink])

  useFrame((state, delta) => {
    const m = mesh.current
    const material = mat.current
    if (!m || !material) return

    const scrollT = progressRef.current * (CHAPTERS.length - 1)
    const ia = Math.min(CHAPTERS.length - 1, Math.floor(scrollT))
    const ib = Math.min(CHAPTERS.length - 1, ia + 1)
    const raw = scrollT - ia
    const t = raw * raw * (3 - 2 * raw)
    const A = CHAPTERS[ia]
    const B = CHAPTERS[ib]

    const e = eased.current
    const k = 1 - Math.exp(-3 * delta)
    e.amp += (A.amp + (B.amp - A.amp) * t - e.amp) * k
    e.freq += (A.freq + (B.freq - A.freq) * t - e.freq) * k
    e.speed += (A.speed + (B.speed - A.speed) * t - e.speed) * k
    e.sx += (A.scale[0] + (B.scale[0] - A.scale[0]) * t - e.sx) * k
    e.sy += (A.scale[1] + (B.scale[1] - A.scale[1]) * t - e.sy) * k
    e.sz += (A.scale[2] + (B.scale[2] - A.scale[2]) * t - e.sz) * k
    e.x += (A.pos[0] + (B.pos[0] - A.pos[0]) * t - e.x) * k
    e.y += (A.pos[1] + (B.pos[1] - A.pos[1]) * t - e.y) * k
    e.mix += (A.mix + (B.mix - A.mix) * t - e.mix) * k

    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uAmp.value = e.amp
    material.uniforms.uFreq.value = e.freq
    material.uniforms.uSpeed.value = e.speed
    material.uniforms.uMix.value = e.mix
    material.uniforms.uCam.value.copy(state.camera.position)
    // recede behind the CTA/footer copy at the very end of the page
    const p = progressRef.current
    const lateFade = p > 0.82 ? (p - 0.82) / 0.18 : 0
    material.uniforms.uOpacity.value = 0.9 - lateFade * 0.55

    // whisper of cursor parallax
    m.position.set(e.x + state.pointer.x * 0.1, e.y + state.pointer.y * 0.07, 0)
    m.scale.set(e.sx, e.sy, e.sz)
    m.rotation.y += delta * 0.08
    m.rotation.z = Math.sin(state.clock.elapsedTime * 0.07) * 0.08
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 96]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
      />
    </mesh>
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
      <LivingForm progressRef={progressRef} ink={ink} />
      {/* gentle bloom lifts the fresnel rim on the dark Hour; on paper it
          would haze the cream ground, so it stays off there */}
      {!ink && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.35} luminanceSmoothing={0.6} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}

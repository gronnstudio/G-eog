"use client"

import { useEffect, useRef } from "react"

/**
 * A hue-tinted atmospheric field for a story hero: slow-drifting motes
 * with faint connecting threads, echoing the knowledge graph but softer
 * and out of focus — weather, not diagram. Pauses off-screen and under
 * reduced motion.
 */
export function StoryAtmosphere({ hue }: { hue: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const parent = canvas.parentElement!

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const COUNT = 54
    type P = { x: number; y: number; vx: number; vy: number; r: number; d: number }
    let pts: P[] = []

    const seed = () => {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 2.4,
        d: 0.3 + Math.random() * 0.7, // depth → parallax + opacity
      }))
    }
    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    resize()

    let raf = 0
    let running = true
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx * p.d
          p.y += p.vy * p.d
          if (p.x < -20) p.x = w + 20
          if (p.x > w + 20) p.x = -20
          if (p.y < -20) p.y = h + 20
          if (p.y > h + 20) p.y = -20
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `hsl(${hue} 45% 70% / ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue} 50% 72% / ${0.35 * a.d})`
        ctx.fill()
      }
      if (running && !reduce) raf = requestAnimationFrame(draw)
    }
    draw()

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running && !reduce) raf = requestAnimationFrame(draw)
      else cancelAnimationFrame(raf)
    })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [hue])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

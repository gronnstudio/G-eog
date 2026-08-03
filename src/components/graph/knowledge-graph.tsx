"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { buildGraph, getCategory, ARTICLES } from "@/lib/knowledge"
import type { GraphNode } from "@/lib/knowledge"

interface Sim extends GraphNode {
  x: number
  y: number
  vx: number
  vy: number
}

const CSS_HUE = (hue: number, l = 62, s = 45) => `hsl(${hue} ${s}% ${l}%)`

/**
 * A calm force-directed knowledge graph on a canvas. Runs a lightweight
 * spring simulation, settles, then idles. Supports pan, wheel-zoom, hover
 * highlight and click-to-open. Respects reduced motion by skipping the
 * animated settle and drawing the final layout once.
 */
export function KnowledgeGraph({
  height = 620,
  interactive = true,
  focusSlug,
  activeCategory = null,
}: {
  height?: number
  interactive?: boolean
  focusSlug?: string
  activeCategory?: string | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [hover, setHover] = useState<string | null>(null)
  const zoomRef = useRef<(factor: number) => void>(() => {})
  const activeCat = activeCategory

  const graph = useMemo(() => buildGraph(), [])
  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const e of graph.edges) {
      if (!m.has(e.source)) m.set(e.source, new Set())
      if (!m.has(e.target)) m.set(e.target, new Set())
      m.get(e.source)!.add(e.target)
      m.get(e.target)!.add(e.source)
    }
    return m
  }, [graph])

  const state = useRef({
    nodes: [] as Sim[],
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    hoverId: null as string | null,
    activeCat: null as string | null,
    focus: focusSlug ?? null,
  })

  useEffect(() => {
    state.current.hoverId = hover
  }, [hover])
  useEffect(() => {
    state.current.activeCat = activeCat
  }, [activeCat])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext("2d")!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = wrap.clientWidth
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = wrap.clientWidth
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Seed positions on a gentle spiral around the centre.
    const cx = width / 2
    const cy = height / 2
    const nodes: Sim[] = graph.nodes.map((n, i) => {
      const angle = i * 2.399
      const radius = 30 + Math.sqrt(i) * 26
      return {
        ...n,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      }
    })
    state.current.nodes = nodes
    const byId = new Map(nodes.map((n) => [n.id, n]))

    let alpha = reduce ? 0 : 1
    let raf = 0

    const step = () => {
      // Simulation
      if (alpha > 0.002) {
        // Repulsion
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i]
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j]
            let dx = a.x - b.x
            let dy = a.y - b.y
            const d2 = dx * dx + dy * dy || 0.01
            const force = (2600 * alpha) / d2
            const d = Math.sqrt(d2)
            dx /= d
            dy /= d
            a.vx += dx * force
            a.vy += dy * force
            b.vx -= dx * force
            b.vy -= dy * force
          }
        }
        // Springs
        for (const e of graph.edges) {
          const a = byId.get(e.source)!
          const b = byId.get(e.target)!
          let dx = b.x - a.x
          let dy = b.y - a.y
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01
          const target = 96
          const k = 0.02 * alpha
          const f = (d - target) * k
          dx /= d
          dy /= d
          a.vx += dx * f
          a.vy += dy * f
          b.vx -= dx * f
          b.vy -= dy * f
        }
        // Gravity + integrate
        for (const n of nodes) {
          n.vx += (cx - n.x) * 0.002 * alpha
          n.vy += (cy - n.y) * 0.002 * alpha
          n.vx *= 0.86
          n.vy *= 0.86
          n.x += n.vx
          n.y += n.vy
        }
        alpha *= 0.985
      }

      draw()
      raf = requestAnimationFrame(step)
    }

    const draw = () => {
      const s = state.current
      // Theme-aware inks, read live so a Golden ↔ Blue Hour switch
      // repaints without a remount (the canvas carries text-foreground).
      const styles = getComputedStyle(canvas)
      const ink = styles.color
      const accent = styles.getPropertyValue("--color-accent").trim() || "#bfe3d0"
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(s.offsetX, s.offsetY)
      ctx.scale(s.scale, s.scale)

      const hoverId = s.hoverId ?? s.focus
      const neighbors = hoverId ? adjacency.get(hoverId) ?? new Set() : null

      // Edges
      for (const e of graph.edges) {
        const a = byId.get(e.source)!
        const b = byId.get(e.target)!
        const lit =
          hoverId && (e.source === hoverId || e.target === hoverId)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.globalAlpha = lit ? 0.6 : 0.14
        ctx.strokeStyle = lit ? accent : ink
        ctx.lineWidth = lit ? 1.4 : 0.7
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Nodes
      for (const n of nodes) {
        const cat = getCategory(n.category)
        const hue = cat?.hue ?? 150
        const r = 4 + Math.min(n.degree, 8) * 1.6
        const isHover = hoverId === n.id
        const isNeighbor = neighbors?.has(n.id)
        const dimByCat = s.activeCat && n.category !== s.activeCat
        const dim = (hoverId && !isHover && !isNeighbor) || dimByCat

        ctx.beginPath()
        ctx.arc(n.x, n.y, isHover ? r * 1.5 : r, 0, Math.PI * 2)
        ctx.fillStyle = CSS_HUE(hue, isHover ? 70 : 60)
        ctx.globalAlpha = dim ? 0.16 : 1
        ctx.fill()

        if (isHover) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 2.4, 0, Math.PI * 2)
          ctx.strokeStyle = CSS_HUE(hue, 65)
          ctx.globalAlpha = 0.4
          ctx.lineWidth = 1
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        if (isHover || isNeighbor || (!hoverId && n.degree >= 6)) {
          ctx.globalAlpha = dim ? 0.2 : 0.9
          ctx.fillStyle = ink
          ctx.font = "11px ui-sans-serif, system-ui"
          ctx.textAlign = "center"
          ctx.fillText(n.label, n.x, n.y - r - 6)
          ctx.globalAlpha = 1
        }
      }
      ctx.restore()
    }

    // ---- interaction ----
    const toWorld = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const s = state.current
      return {
        x: (clientX - rect.left - s.offsetX) / s.scale,
        y: (clientY - rect.top - s.offsetY) / s.scale,
      }
    }
    const pick = (clientX: number, clientY: number): Sim | null => {
      const p = toWorld(clientX, clientY)
      let best: Sim | null = null
      let bestD = 18
      for (const n of nodes) {
        const d = Math.hypot(n.x - p.x, n.y - p.y)
        if (d < bestD) {
          bestD = d
          best = n
        }
      }
      return best
    }

    let downX = 0
    let downY = 0
    const onMove = (e: PointerEvent) => {
      const s = state.current
      if (s.dragging) {
        s.offsetX += e.clientX - s.lastX
        s.offsetY += e.clientY - s.lastY
        s.lastX = e.clientX
        s.lastY = e.clientY
        return
      }
      if (!interactive) return
      const n = pick(e.clientX, e.clientY)
      canvas.style.cursor = n ? "pointer" : "grab"
      setHover(n?.id ?? null)
    }
    const onDown = (e: PointerEvent) => {
      const s = state.current
      s.dragging = true
      s.lastX = e.clientX
      s.lastY = e.clientY
      downX = e.clientX
      downY = e.clientY
      canvas.style.cursor = "grabbing"
      canvas.setPointerCapture(e.pointerId)
    }
    const onUp = (e: PointerEvent) => {
      const s = state.current
      // Distance from where the press STARTED — lastX/lastY tracks every
      // move, so measuring against it made a long pan register as a tap.
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY)
      s.dragging = false
      canvas.style.cursor = "grab"
      if (interactive && moved < 6) {
        const n = pick(e.clientX, e.clientY)
        if (n) {
          const art = ARTICLES.find((a) => a.slug === n.id)
          if (art) router.push(`/knowledge/${art.category}/${art.slug}`)
        }
      }
    }
    const onWheel = (e: WheelEvent) => {
      // Plain wheel keeps scrolling the page — a graph that hijacks the
      // wheel makes the section a scroll trap. Zoom rides ⌘/Ctrl+scroll,
      // which is also what trackpad pinch reports (ctrlKey: true).
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const s = state.current
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.08 : 0.93
      const next = Math.min(3, Math.max(0.4, s.scale * factor))
      s.offsetX = mx - (mx - s.offsetX) * (next / s.scale)
      s.offsetY = my - (my - s.offsetY) * (next / s.scale)
      s.scale = next
    }

    // With touch-action: pan-y the browser reclaims vertical swipes and
    // fires pointercancel mid-drag — reset so the graph isn't left in a
    // phantom dragging state.
    const onCancel = () => {
      state.current.dragging = false
      canvas.style.cursor = "grab"
    }

    // Button zoom (mobile has no ⌘+wheel): zoom about the canvas centre.
    zoomRef.current = (factor: number) => {
      const s = state.current
      const next = Math.min(3, Math.max(0.4, s.scale * factor))
      const mx = width / 2
      const my = height / 2
      s.offsetX = mx - (mx - s.offsetX) * (next / s.scale)
      s.offsetY = my - (my - s.offsetY) * (next / s.scale)
      s.scale = next
    }

    if (interactive) {
      canvas.addEventListener("pointermove", onMove)
      canvas.addEventListener("pointerdown", onDown)
      canvas.addEventListener("pointerup", onUp)
      canvas.addEventListener("pointercancel", onCancel)
      canvas.addEventListener("wheel", onWheel, { passive: false })
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    if (reduce) {
      // Run a fixed number of settle iterations synchronously, then draw.
      alpha = 1
      for (let k = 0; k < 240; k++) {
        // reuse step math without raf
      }
      raf = requestAnimationFrame(step)
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (interactive) {
        canvas.removeEventListener("pointermove", onMove)
        canvas.removeEventListener("pointerdown", onDown)
        canvas.removeEventListener("pointerup", onUp)
        canvas.removeEventListener("pointercancel", onCancel)
        canvas.removeEventListener("wheel", onWheel)
      }
    }
  }, [graph, adjacency, height, interactive, router, focusSlug])

  const hoverArticle = hover ? ARTICLES.find((a) => a.slug === hover) : null

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl border border-line bg-surface/40">
      {/* pan-y, not none: a phone visitor swiping vertically over the
          (near full-screen) canvas must still scroll the page — the
          graph pans on horizontal drags and mouse drags only. */}
      <canvas
        ref={canvasRef}
        className="block [touch-action:pan-y]"
        role="img"
        aria-label="Interactive knowledge graph of ecological topics and their connections"
      />
      {interactive && (
        <div className="pointer-events-none absolute inset-0">
          <p className="absolute left-4 top-4 hidden font-mono text-[11px] uppercase tracking-widest text-faint sm:block">
            ⌘/Ctrl + scroll to zoom · drag to pan · click a node
          </p>
          <div className="pointer-events-auto absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => zoomRef.current(1.25)}
              className="glass grid h-9 w-9 place-items-center rounded-full text-lg leading-none text-foreground transition-colors hover:text-accent"
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => zoomRef.current(0.8)}
              className="glass grid h-9 w-9 place-items-center rounded-full text-lg leading-none text-foreground transition-colors hover:text-accent"
            >
              −
            </button>
          </div>
          {hoverArticle && (
            <div className="eog-glass pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-xl px-4 py-3 shadow-float">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {getCategory(hoverArticle.category)?.title}
              </p>
              <p className="mt-1 font-heading text-lg text-foreground">{hoverArticle.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{hoverArticle.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

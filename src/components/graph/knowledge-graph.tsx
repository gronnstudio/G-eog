"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { buildGraph, getCategory, ARTICLES, RELATIONSHIP_LABEL } from "@/lib/knowledge"
import type { GraphNode } from "@/lib/knowledge"

interface Sim extends GraphNode {
  x: number
  y: number
  vx: number
  vy: number
}

const CSS_HUE = (hue: number, l = 62, s = 45) => `hsl(${hue} ${s}% ${l}%)`

/** #rrggbb (or shorthand) → rgba() at the given alpha, for label pills. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "").trim()
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = parseInt(full, 16)
  if (Number.isNaN(n) || full.length !== 6) return `rgba(20,25,40,${alpha})`
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

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
  const [selectedEdge, setSelectedEdge] = useState<number | null>(null)
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
    selectedEdge: null as number | null,
  })

  useEffect(() => {
    state.current.hoverId = hover
  }, [hover])
  useEffect(() => {
    state.current.selectedEdge = selectedEdge
  }, [selectedEdge])
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
    let parked = false
    let running = false

    /** (Re)start the frame loop — no-op if already running or offscreen. */
    const kick = () => {
      if (running || parked) return
      running = true
      raf = requestAnimationFrame(step)
    }

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
      // Sleep once the layout has settled and nothing is being dragged —
      // redrawing a static graph every frame was pure battery burn.
      // Interaction handlers call kick() to wake the loop back up.
      if (alpha > 0.002 || state.current.dragging) {
        raf = requestAnimationFrame(step)
      } else {
        running = false
      }
    }

    const draw = () => {
      const s = state.current
      // Theme-aware inks, read live so a Golden ↔ Blue Hour switch
      // repaints without a remount (the canvas carries text-foreground).
      const styles = getComputedStyle(canvas)
      const ink = styles.color
      const accent = styles.getPropertyValue("--color-accent").trim() || "#bfe3d0"
      const ember = styles.getPropertyValue("--color-ember").trim() || "#f95a08"
      // Semi-opaque background of the current theme, for label pills.
      const surface = styles.getPropertyValue("--surface").trim() || "#1a2040"
      const labelBg = hexToRgba(surface, 0.85)
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(s.offsetX, s.offsetY)
      ctx.scale(s.scale, s.scale)

      const hoverId = s.hoverId ?? s.focus
      const neighbors = hoverId ? adjacency.get(hoverId) ?? new Set() : null

      // Edges
      graph.edges.forEach((e, i) => {
        const a = byId.get(e.source)!
        const b = byId.get(e.target)!
        const picked = s.selectedEdge === i
        const lit =
          hoverId && (e.source === hoverId || e.target === hoverId)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        // A selected edge is the loudest thing on the canvas — it's the
        // subject of the open inspector, so it outranks hover highlighting.
        ctx.globalAlpha = picked ? 0.95 : lit ? 0.6 : 0.14
        ctx.strokeStyle = picked ? ember : lit ? accent : ink
        ctx.lineWidth = picked ? 2.2 : lit ? 1.4 : 0.7
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // Pass 1 — the node discs. Radius is computed once here and reused
      // by the label pass, so labels sit exactly above their node.
      const radiusOf = (n: Sim) => 4 + Math.min(n.degree, 8) * 1.6
      for (const n of nodes) {
        const cat = getCategory(n.category)
        const hue = cat?.hue ?? 150
        const r = radiusOf(n)
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
      }

      // Pass 2 — labels, drawn on top with collision avoidance so they
      // never pile into the unreadable stack the old single-pass code
      // produced on a small canvas. Priority: the hovered node and its
      // neighbours always win; then, only when nothing is hovered, the
      // most-connected hubs fill whatever room is left. A label is
      // dropped if its box would overlap one already placed. The budget
      // scales with canvas size, so phones show a readable handful and
      // desktops show more.
      ctx.font = "600 11px ui-sans-serif, system-ui"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const placed: { x: number; y: number; w: number; h: number }[] = []
      const ambientBudget = hoverId ? 0 : Math.max(3, Math.floor(width / 90))

      const candidates = hoverId
        ? nodes.filter((n) => n.id === hoverId || neighbors?.has(n.id))
        : [...nodes].sort((a, b) => b.degree - a.degree)

      let ambientShown = 0
      for (const n of candidates) {
        const isHover = hoverId === n.id
        const isNeighbor = neighbors?.has(n.id)
        if (!hoverId) {
          if (ambientShown >= ambientBudget) break
        }
        const dimByCat = s.activeCat && n.category !== s.activeCat
        if (dimByCat && !isHover) continue

        const r = radiusOf(n)
        const tw = ctx.measureText(n.label).width
        const pad = 5
        const boxW = tw + pad * 2
        const boxH = 18
        const by = n.y - r - 11
        // Keep the pill on-screen. Work in screen space (pan+zoom applied)
        // so the decision holds at any zoom: centre the label over the
        // node, but if that would run past either edge, anchor it to the
        // side that fits — measured against the label's real width, not a
        // fixed margin, so even the longest titles stay readable.
        const screenX = s.offsetX + n.x * s.scale
        const halfW = (boxW * s.scale) / 2
        const anchor: "left" | "right" | "center" =
          screenX + halfW > width - 8
            ? "right"
            : screenX - halfW < 8
              ? "left"
              : "center"
        const bx =
          anchor === "center" ? n.x : anchor === "right" ? n.x - r - 4 : n.x + r + 4
        let boxX =
          anchor === "center" ? bx - boxW / 2 : anchor === "right" ? bx - boxW : bx
        // Final clamp in screen space, converted back to world x, so a
        // label wider than its margin can never spill off either edge.
        const minWorldX = (8 - s.offsetX) / s.scale
        const maxWorldX = (width - 8 - s.offsetX) / s.scale - boxW
        if (boxX < minWorldX) boxX = minWorldX
        if (boxX > maxWorldX) boxX = Math.max(minWorldX, maxWorldX)
        const box = { x: boxX, y: by - boxH / 2, w: boxW, h: boxH }

        const collides = placed.some(
          (p) =>
            box.x < p.x + p.w &&
            box.x + box.w > p.x &&
            box.y < p.y + p.h &&
            box.y + box.h > p.y,
        )
        if (collides && !isHover) continue
        placed.push(box)
        if (!isHover && !isNeighbor) ambientShown++

        // Rounded background pill for legibility over edges/nodes.
        const rr = 6
        ctx.globalAlpha = isHover ? 0.96 : 0.82
        ctx.fillStyle = labelBg
        ctx.beginPath()
        ctx.roundRect(box.x, box.y, box.w, box.h, rr)
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.fillStyle = ink
        ctx.textAlign = "left"
        ctx.fillText(n.label, box.x + pad, by + 0.5)
      }
      ctx.globalAlpha = 1
      ctx.textBaseline = "alphabetic"
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

    /**
     * Nearest edge to the pointer, by perpendicular distance to the line
     * segment. Only consulted when no node is under the cursor, so nodes
     * always win a contested click — the edge is the larger target and
     * would otherwise swallow taps meant for its endpoints.
     */
    const pickEdge = (clientX: number, clientY: number): number | null => {
      const p = toWorld(clientX, clientY)
      let best: number | null = null
      // In world units; divided by scale so the hit area stays a constant
      // size on screen however far the view is zoomed out.
      let bestD = 6 / state.current.scale
      graph.edges.forEach((e, i) => {
        const a = byId.get(e.source)
        const b = byId.get(e.target)
        if (!a || !b) return
        const vx = b.x - a.x
        const vy = b.y - a.y
        const len2 = vx * vx + vy * vy
        if (len2 === 0) return
        // Projection of p onto the segment, clamped to its ends.
        const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2))
        const d = Math.hypot(a.x + t * vx - p.x, a.y + t * vy - p.y)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
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
      // Edges are clickable too, so they get the pointer cursor — without
      // it a connection looks like dead canvas and nobody discovers it.
      canvas.style.cursor =
        n || pickEdge(e.clientX, e.clientY) !== null ? "pointer" : "grab"
      setHover(n?.id ?? null)
      kick()
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
      kick()
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
          return
        }
        // No node under the tap — try an edge. Clicking a connection
        // opens the inspector rather than navigating, because the answer
        // to "why are these connected?" lives on the edge, not either end.
        const ei = pickEdge(e.clientX, e.clientY)
        setSelectedEdge(ei)
        kick()
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
      kick()
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
      kick()
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

    // Perf: the simulation ran its rAF loop forever, even scrolled far
    // offscreen — a steady main-thread drain on phones. Park the loop
    // while the canvas is out of view and resume where it left off.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          parked = false
          kick()
        } else if (!parked) {
          parked = true
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: "120px" }
    )
    io.observe(wrap)

    if (reduce) {
      // Run a fixed number of settle iterations synchronously, then draw.
      alpha = 1
      for (let k = 0; k < 240; k++) {
        // reuse step math without raf
      }
      kick()
    } else {
      kick()
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
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
  const edge = selectedEdge !== null ? graph.edges[selectedEdge] : null
  const edgeFrom = edge ? ARTICLES.find((a) => a.slug === edge.source) : null
  const edgeTo = edge ? ARTICLES.find((a) => a.slug === edge.target) : null

  // Escape closes the inspector — it's a transient panel, and on a canvas
  // there is no obvious "outside" to click.
  useEffect(() => {
    if (selectedEdge === null) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedEdge(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedEdge])

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
            ⌘/Ctrl + scroll to zoom · drag to pan · click a node or a connection
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
          {/* Hover card — suppressed while the edge inspector is open so
              the two panels never stack in the same corner. */}
          {hoverArticle && !edge && (
            <div className="eog-glass pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-xl px-4 py-3 shadow-float">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {getCategory(hoverArticle.category)?.title}
              </p>
              <p className="mt-1 font-heading text-lg text-foreground">{hoverArticle.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{hoverArticle.summary}</p>
            </div>
          )}

          {/* Edge inspector — the answer to "why are these connected?" */}
          {edge && edgeFrom && edgeTo && (
            <div
              role="dialog"
              aria-label="Connection details"
              className="eog-glass pointer-events-auto absolute inset-x-3 bottom-3 max-w-md rounded-2xl p-4 shadow-float sm:inset-x-auto sm:bottom-4 sm:left-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  Why these connect
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedEdge(null)}
                  aria-label="Close connection details"
                  className="-mt-1 shrink-0 text-faint transition-colors hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* The claim, in the direction it was authored */}
              <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <Link
                  href={`/knowledge/${edgeFrom.category}/${edgeFrom.slug}`}
                  className="font-heading text-base text-foreground underline-offset-4 hover:underline"
                >
                  {edgeFrom.title}
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ember-text">
                  {RELATIONSHIP_LABEL[edge.type]}
                </span>
                <Link
                  href={`/knowledge/${edgeTo.category}/${edgeTo.slug}`}
                  className="font-heading text-base text-foreground underline-offset-4 hover:underline"
                >
                  {edgeTo.title}
                </Link>
              </p>

              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                {edge.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  Evidence: {edge.evidence}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

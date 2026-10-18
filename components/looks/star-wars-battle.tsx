"use client"

import { useEffect } from "react"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"
import { drawShip, type ShipKind } from "@/components/looks/star-wars-ships"

// Background skirmishes behind the page. Timing and readability rules are in DOCS.md "Looks".
type Pt = { x: number; y: number }
type Ship = { kind: ShipKind; lag: number; off: number; amp: number; phase: number; fire: string; next: number; dead: boolean }
type Battle = { path: Pt[]; t0: number; dur: number; size: number; alpha: number; z: number; hitAt: number; ships: Ship[] }
type Bolt = { x: number; y: number; vx: number; vy: number; t: number; color: string; len: number; alpha: number }
type Bit = { x: number; y: number; vx: number; vy: number; t: number; life: number; r: number; alpha: number }

const LENGTH: Record<ShipKind, number> = { xwing: 56, tie: 40, falcon: 66, destroyer: 70 }
// Near, mid and far: farther ships are smaller, dimmer and slower.
const DEPTHS = [
  { size: 1, alpha: 0.6, speed: 240, z: 1 },
  { size: 0.7, alpha: 0.42, speed: 170, z: 0.6 },
  { size: 0.45, alpha: 0.28, speed: 120, z: 0.3 },
]
const RED = "#ff5a36"
const GREEN = "#4dff6a"
const BOLT_MS = 450

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

function bezier(p: Pt[], s: number): Pt {
  const u = 1 - s
  const a = u * u * u, b = 3 * u * u * s, c = 3 * u * s * s, d = s * s * s
  return { x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x, y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y }
}

export default function StarWarsBattle() {
  const hookReduced = useSafeReducedMotion()

  useEffect(() => {
    // The hook reads false on its first render, so check the query directly as well.
    if (hookReduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Test hook: ?sw-battle starts skirmishes every 6 s with a hit; ?sw-battle=falcon forces the Falcon.
    const q = new URLSearchParams(location.search)
    const test = q.has("sw-battle") ? q.get("sw-battle") || "on" : null

    const canvas = document.createElement("canvas")
    canvas.setAttribute("aria-hidden", "true")
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:-10"
    document.body.append(canvas)
    const ctx = canvas.getContext("2d")!

    let w = 0
    let h = 0
    let frame = 0
    // Several skirmishes can overlap: up to three on a wide screen, one on a phone.
    let battles: Battle[] = []
    let sd: { t0: number; dur: number; y: number; size: number } | null = null
    let bolts: Bolt[] = []
    let bits: Bit[] = []
    let scroll0 = window.scrollY
    let battleTimer = 0
    let sdTimer = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      kick()
    }

    // Wide screens keep the fight in a side margin; narrow ones cross quickly, small and dim.
    function makePath(): Pt[] {
      const margin = (w - 1024) / 2
      if (margin >= 110) {
        const x0 = Math.random() < 0.5 ? 40 : w - margin + 40
        const xs = () => rand(x0, x0 + margin - 80)
        const ys = [-90, h * 0.33, h * 0.66, h + 90]
        if (Math.random() < 0.5) ys.reverse()
        return ys.map((y) => ({ x: xs(), y }))
      }
      const xs = [-90, w * 0.33, w * 0.66, w + 90]
      if (Math.random() < 0.5) xs.reverse()
      return xs.map((x) => ({ x, y: rand(h * 0.1, h * 0.9) }))
    }

    function startBattle() {
      const small = w < 640
      const depth = pick(small ? DEPTHS.slice(1) : DEPTHS)
      const falcon = test ? test === "falcon" : Math.random() < 0.2
      const ship = (kind: ShipKind, lag: number, off: number, amp: number, fire = ""): Ship =>
        ({ kind, lag, off, amp, phase: rand(0, 6), fire, next: 0, dead: false })
      const ships: Ship[] = []
      if (falcon) {
        ships.push(ship("falcon", 0, 0, 10))
        ships.push(ship("tie", 0.3, 14, 16, GREEN))
        if (!small) ships.push(ship("tie", 0.5, -16, 16, GREEN))
        if (!small && Math.random() < 0.5) ships.push(ship("tie", 0.7, 4, 14, GREEN))
      } else {
        ships.push(ship("tie", 0, 0, 20))
        if (!small && Math.random() < 0.8) ships.push(ship("tie", 0.25, 26, 18))
        if (!small && Math.random() < 0.4) ships.push(ship("tie", 0.4, -24, 18))
        ships.push(ship("xwing", 0.6, -8, 10, RED))
        if (Math.random() < 0.7) ships.push(ship("xwing", 0.85, 18, 10, RED))
        if (!small && Math.random() < 0.35) ships.push(ship("xwing", 1.05, -20, 10, RED))
        if (!small && Math.random() < 0.5) ships.push(ship("tie", 1.3, 0, 12, GREEN))
      }
      const path = makePath()
      let len = 0
      for (let i = 1; i < 4; i++) len += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y)
      battles.push({
        path,
        t0: performance.now(),
        dur: (len / depth.speed / (falcon ? 1.8 : 1)) * 1000,
        size: depth.size * (small ? 0.6 : 1),
        alpha: depth.alpha,
        z: depth.z,
        hitAt: !falcon && (test || Math.random() < 0.5) ? rand(0.45, 0.65) : 2,
        ships,
      })
      kick()
    }

    // Where a ship is at progress s: on the shared curve, pushed sideways by its weave.
    function place(b: Battle, sh: Ship, s: number) {
      const p = bezier(b.path, s)
      const q = bezier(b.path, s + 0.01)
      const a = Math.atan2(q.y - p.y, q.x - p.x)
      const off = (sh.off + sh.amp * Math.sin(s * 9 + sh.phase)) * b.size
      return { x: p.x - Math.sin(a) * off, y: p.y + Math.cos(a) * off, a }
    }

    function explode(x: number, y: number, size: number, alpha: number, now: number) {
      bits.push({ x, y, vx: 0, vy: 0, t: now, life: 420, r: -32 * size, alpha })
      for (let i = 0; i < 18; i++) {
        const a = rand(0, Math.PI * 2)
        const v = rand(40, 160) * size
        bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: now, life: rand(500, 950), r: rand(1.5, 3.2) * size, alpha })
      }
    }

    function tick(now: number) {
      frame = 0
      ctx.clearRect(0, 0, w, h)
      const shift = -(window.scrollY - scroll0) * 0.1

      if (sd) {
        const p = (now - sd.t0) / sd.dur
        if (p >= 1) sd = null
        else {
          ctx.globalAlpha = 0.22
          drawShip(ctx, "destroyer", -80 + (w + 160) * p, sd.y + shift * 0.2, 0, sd.size)
          ctx.globalAlpha = 1
        }
      }

      battles = battles.filter((b) => {
        const t = (now - b.t0) / b.dur
        let flying = false
        for (const sh of b.ships) {
          const s = t - (sh.lag * 1000) / b.dur
          if (sh.dead || s < 0 || s > 1) {
            if (s <= 1 && !sh.dead) flying = true
            continue
          }
          flying = true
          const { x, y, a } = place(b, sh, s)
          const py = y + shift * b.z
          if (sh === b.ships[0] && s >= b.hitAt) {
            sh.dead = true
            explode(x, py, b.size, Math.min(1, b.alpha + 0.4), now)
            continue
          }
          const size = LENGTH[sh.kind] * b.size
          ctx.globalAlpha = b.alpha
          drawShip(ctx, sh.kind, x, py, sh.kind === "tie" ? Math.sin(a) * 0.25 : a, size)
          if (sh.fire && now >= sh.next && s > 0.05 && s < 0.9) {
            sh.next = now + rand(260, 620)
            const v = 700 * b.size + 200
            bolts.push({
              x: x + Math.cos(a) * size * 0.5, y: py + Math.sin(a) * size * 0.5,
              vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: now, color: sh.fire, len: 16 * b.size + 4, alpha: b.alpha + 0.3,
            })
          }
        }
        return flying
      })

      ctx.globalCompositeOperation = "lighter"
      ctx.lineCap = "round"
      bolts = bolts.filter((o) => now - o.t < BOLT_MS)
      for (const o of bolts) {
        const k = (now - o.t) / 1000
        const x = o.x + o.vx * k
        const y = o.y + o.vy * k
        const v = Math.hypot(o.vx, o.vy)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - (o.vx / v) * o.len, y - (o.vy / v) * o.len)
        ctx.globalAlpha = o.alpha * 0.5
        ctx.strokeStyle = o.color
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.globalAlpha = o.alpha
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1.3
        ctx.stroke()
      }
      bits = bits.filter((o) => now - o.t < o.life)
      for (const o of bits) {
        const q = (now - o.t) / o.life
        ctx.globalAlpha = o.alpha * (1 - q)
        if (o.r < 0) {
          const r = -o.r * (0.3 + q)
          const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r)
          g.addColorStop(0, "#fff")
          g.addColorStop(0.35, "#ffd27a")
          g.addColorStop(1, "rgba(255,90,40,0)")
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(o.x, o.y, r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const k = (now - o.t) / 1000
          ctx.fillStyle = q < 0.45 ? "#fff3b8" : "#ffa24a"
          ctx.fillRect(o.x + o.vx * k, o.y + o.vy * k, o.r, o.r)
        }
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
      if (battles.length || sd || bolts.length || bits.length) frame = requestAnimationFrame(tick)
    }

    // Frames run only while something is in flight.
    function kick() {
      if (!frame && !document.hidden && (battles.length || sd || bolts.length || bits.length)) frame = requestAnimationFrame(tick)
    }

    function scheduleBattle(ms = test ? 6000 : rand(4000, 10000)) {
      battleTimer = window.setTimeout(() => {
        if (!document.hidden && battles.length < (w < 640 ? 1 : 3)) {
          scroll0 = window.scrollY
          startBattle()
        }
        scheduleBattle()
      }, ms)
    }

    // A Star Destroyer glides through the far distance now and then.
    function scheduleDestroyer(ms = rand(45000, 90000)) {
      sdTimer = window.setTimeout(() => {
        if (!document.hidden && !sd) {
          const small = w < 640
          sd = { t0: performance.now(), dur: small ? 40000 : 70000, y: rand(h * 0.08, h * 0.22), size: small ? 42 : 70 }
          kick()
        }
        scheduleDestroyer()
      }, ms)
    }

    function onVisibility() {
      if (!document.hidden) return kick()
      cancelAnimationFrame(frame)
      frame = 0
      battles = []
      bolts = []
      bits = []
      ctx.clearRect(0, 0, w, h)
    }

    resize()
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)
    scheduleBattle(test ? 600 : rand(2000, 5000))
    scheduleDestroyer(test ? 300 : rand(10000, 25000))

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(battleTimer)
      clearTimeout(sdTimer)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.remove()
    }
  }, [hookReduced])

  return null
}

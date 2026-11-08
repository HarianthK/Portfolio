"use client"

import { useEffect } from "react"
import { addStyle, canvasLayer, decorate, isLite, isStill, pointer, rand } from "@/components/looks/look-kit"

// Elven lights and autumn leaves behind the page, a journey map down the left margin, map-line
// dividers and headings that glow in like writing in fire. See DOCS.md "Looks".
const CSS = `
.me-map { position: absolute; top: 0; left: 6%; right: 6%; height: 16px; transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 1; }
.me-map i { position: absolute; left: 0; right: 0; height: 5px; transform: scaleX(0);
  border-top: 1px solid rgb(226 192 110 / 0.7); border-bottom: 1px solid rgb(226 192 110 / 0.35);
  transition: transform 1.4s cubic-bezier(0.3, 0.7, 0.2, 1); }
.me-map b { position: relative; width: 16px; height: 16px; background: #e8c46c; opacity: 0;
  clip-path: polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%);
  filter: drop-shadow(0 0 6px rgb(232 196 108 / 0.8)); transition: opacity 0.6s 0.9s; }
.me-lit i { transform: scaleX(1); }
.me-lit b { opacity: 1; }

.me-wait { opacity: 0; }
.me-show { animation: me-fire 1.4s ease-out both; }
@keyframes me-fire {
  0% { opacity: 0; color: #ff8a2a; text-shadow: 0 0 22px rgb(255 120 30 / 0.9); }
  45% { opacity: 1; color: #ffc15a; text-shadow: 0 0 16px rgb(255 170 60 / 0.7); }
  100% { opacity: 1; }
}

html[data-look="lord-of-the-rings"] :is(#built article, #foundations dl > div) { position: relative; isolation: isolate; }
html[data-look="lord-of-the-rings"] :is(#built article, #foundations dl > div)::after {
  content: ""; position: absolute; inset: 0 -12px -12px; z-index: -1; pointer-events: none; opacity: 0;
  border-radius: 6px; border: 1px solid rgb(226 192 110 / 0.4);
  background: radial-gradient(100% 80% at 50% 0%, rgb(226 192 110 / 0.1), transparent 70%), rgb(30 60 40 / 0.18);
  box-shadow: inset 0 0 26px rgb(120 200 140 / 0.1), 0 0 18px rgb(226 192 110 / 0.1); transition: opacity 0.3s; }
html[data-look="lord-of-the-rings"] :is(#built article, #foundations dl > div):is(:hover, :focus-within)::after { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .me-map i, .me-map b { transition: none; }
}
`

type Light = { x: number; y: number; phase: number; speed: number; r: number; born?: number }
type Leaf = { x: number; y: number; s: number; spin: number; phase: number; fall: number }
type Mark = { y: number; kind: "hill" | "tree" }

// One soft light, drawn once and stamped, so frames make no gradients.
function lightSprite() {
  const c = Object.assign(document.createElement("canvas"), { width: 64, height: 64 })
  const g = c.getContext("2d")!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, "rgba(255, 244, 200, 1)")
  grad.addColorStop(0.25, "rgba(240, 210, 120, 0.55)")
  grad.addColorStop(1, "rgba(240, 210, 120, 0)")
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

// The route's x at height y: a slow meander down the left margin, inside its first 120 px.
const routeX = (y: number) => 62 + Math.sin(y / 140) * 16 + Math.sin(y / 53) * 5

export default function LordOfTheRings() {
  useEffect(() => {
    const cleanups = [addStyle(CSS)]
    cleanups.push(
      decorate("me", () => {
        const d = Object.assign(document.createElement("div"), { className: "me-map" })
        d.append(document.createElement("i"), document.createElement("b"))
        return d
      }, "me-wait", "me-show"),
    )

    const still = isStill()
    const sprite = lightSprite()
    let lights: Light[] = []
    let leaves: Leaf[] = []
    let marks: Mark[] = []
    let mouse: { x: number; y: number } | null = null
    let mapAlpha = 0
    let arrived = 0
    let last = performance.now()
    const sky = canvasLayer(-10, (ctx, w, h, now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // A journey map in the left margin: a dotted route with hills and trees, and a gold ring that
      // travels down it as the page scrolls. It fades out beside sections whose text reaches the edge.
      const c = sky.column()
      const target = c && c.margin >= 132 && c.margin < Infinity ? 1 : 0
      mapAlpha = still ? target : mapAlpha + (target - mapAlpha) * Math.min(1, dt * 4)
      if (mapAlpha > 0.01) {
        ctx.globalAlpha = mapAlpha
        const scrollMax = document.documentElement.scrollHeight - h
        const p = scrollMax > 0 ? Math.min(1, window.scrollY / scrollMax) : 0
        const top = 70, bottom = h - 70
        ctx.strokeStyle = "rgba(226, 192, 110, 0.4)"
        ctx.lineWidth = 1.4
        ctx.setLineDash([2, 6])
        ctx.beginPath()
        for (let y = top; y <= bottom; y += 6) ctx.lineTo(routeX(y), y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.strokeStyle = "rgba(226, 192, 110, 0.32)"
        for (const k of marks) {
          const y = top + k.y * (bottom - top)
          const x = routeX(y) + (k.y * 97 % 1 < 0.5 ? -26 : 26)
          ctx.beginPath()
          if (k.kind === "hill") {
            ctx.moveTo(x - 9, y + 4); ctx.lineTo(x - 3, y - 5); ctx.lineTo(x + 1, y + 1)
            ctx.moveTo(x - 1, y + 4); ctx.lineTo(x + 5, y - 3); ctx.lineTo(x + 10, y + 4)
          } else {
            ctx.arc(x, y - 3, 4, 0, Math.PI * 2); ctx.moveTo(x, y + 1); ctx.lineTo(x, y + 6)
          }
          ctx.stroke()
        }
        const ry = top + p * (bottom - top)
        const rx = routeX(ry)
        ctx.globalCompositeOperation = "lighter"
        ctx.globalAlpha = 0.5 * mapAlpha
        ctx.drawImage(sprite, rx - 18, ry - 18, 36, 36)
        // The ring arrives: reaching Contact makes it flare once, over 800 ms.
        if (p > 0.98 && !arrived && !still) arrived = now
        const q = arrived ? (now - arrived) / 800 : 1
        if (q < 1) {
          ctx.globalAlpha = Math.sin(q * Math.PI) * mapAlpha
          ctx.drawImage(sprite, rx - 60, ry - 60, 120, 120)
        }
        ctx.globalAlpha = mapAlpha
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = "#e8c46c"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(rx, ry, 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      ctx.globalCompositeOperation = "lighter"
      if (mouse) {
        ctx.globalAlpha = 0.12
        ctx.drawImage(sprite, mouse.x - 160, mouse.y - 160, 320, 320)
      }
      lights = lights.filter((l) => !l.born || now - l.born < 6000)
      for (const l of lights) {
        // Each light wanders on its own slow figure of eight, and pulses.
        const t = now / 1000 * l.speed + l.phase
        const x = (l.x + Math.sin(t) * 0.04 + Math.sin(t * 0.37) * 0.03) * w
        const y = (l.y + Math.sin(t * 0.8 + 1) * 0.03) * h - (l.born ? (now - l.born) * 0.03 : 0)
        const fade = l.born ? 1 - (now - l.born) / 6000 : 1
        ctx.globalAlpha = (0.35 + 0.35 * Math.sin(t * 2.3)) * fade
        ctx.drawImage(sprite, x - l.r * 5, y - l.r * 5, l.r * 10, l.r * 10)
      }
      ctx.globalCompositeOperation = "source-over"
      for (const f of leaves) {
        f.y += f.fall * dt
        if (f.y > h + 30) Object.assign(f, { y: -30, x: rand(0, w) })
        const x = f.x + Math.sin(now / 1300 + f.phase) * 26
        ctx.save()
        ctx.translate(x, f.y)
        ctx.rotate(Math.sin(now / 900 + f.phase) * 0.9 + f.spin)
        ctx.globalAlpha = 0.7
        ctx.fillStyle = f.s > 1 ? "#e0973a" : "#d9aa4a"
        ctx.beginPath()
        ctx.moveTo(0, -9 * f.s)
        ctx.quadraticCurveTo(6 * f.s, 0, 0, 9 * f.s)
        ctx.quadraticCurveTo(-6 * f.s, 0, 0, -9 * f.s)
        ctx.fill()
        ctx.globalAlpha = 0.4
        ctx.fillStyle = "#7a5a1e"
        ctx.fillRect(-0.4 * f.s, -9 * f.s, 0.8 * f.s, 18 * f.s)
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }, { mask: 0.35, onResize: (w, h) => {
      const lite = isLite()
      lights = Array.from({ length: lite ? 14 : 34 }, () => ({ x: rand(0.03, 0.97), y: rand(0.05, 0.95), phase: rand(0, 9), speed: rand(0.15, 0.4), r: rand(1.2, 2.6) }))
      leaves = Array.from({ length: lite ? 4 : 8 }, () => ({ x: rand(0, w), y: rand(-h, h), s: rand(0.7, 1.3), spin: rand(0, 3), phase: rand(0, 6), fall: rand(18, 34) }))
      marks = Array.from({ length: 9 }, (_, i) => ({ y: (i + rand(0.2, 0.8)) / 9, kind: Math.random() < 0.55 ? "hill" : "tree" }))
    } })
    cleanups.push(sky.stop)
    // The ring follows the scroll even when nothing else moves (reduced motion).
    window.addEventListener("scroll", sky.wake, { passive: true })
    cleanups.push(() => window.removeEventListener("scroll", sky.wake))

    cleanups.push(pointer((x, y) => {
      mouse = { x, y }
      sky.wake()
    }, (x, y) => {
      const now = performance.now()
      const w = window.innerWidth, h = window.innerHeight
      for (let i = 0; i < 7; i++) {
        lights.push({ x: (x + rand(-30, 30)) / w, y: (y + rand(-20, 20)) / h, phase: rand(0, 9), speed: rand(0.3, 0.6), r: rand(1.4, 2.8), born: now })
      }
      sky.wake()
    }))

    return () => cleanups.forEach((fn) => fn())
  }, [])
  return null
}

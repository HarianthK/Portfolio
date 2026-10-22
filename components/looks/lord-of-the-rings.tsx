"use client"

import { useEffect } from "react"
import { addStyle, canvasLayer, decorate, pointer, rand } from "@/components/looks/look-kit"

// Wandering elven lights and falling gold leaves behind the page, a soft light that follows the
// cursor, map-line dividers and headings that glow in like writing in fire. See DOCS.md "Looks".
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

    let lights: Light[] = []
    let leaves: Leaf[] = []
    let mouse: { x: number; y: number } | null = null
    let last = performance.now()
    const sky = canvasLayer(-10, (ctx, w, h, now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (mouse) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220)
        g.addColorStop(0, "rgba(220, 235, 255, 0.10)")
        g.addColorStop(1, "rgba(220, 235, 255, 0)")
        ctx.fillStyle = g
        ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440)
      }
      ctx.globalCompositeOperation = "lighter"
      lights = lights.filter((l) => !l.born || now - l.born < 6000)
      for (const l of lights) {
        // Each light wanders on its own slow figure of eight, and pulses.
        const t = now / 1000 * l.speed + l.phase
        const x = (l.x + Math.sin(t) * 0.04 + Math.sin(t * 0.37) * 0.03) * w
        const y = (l.y + Math.sin(t * 0.8 + 1) * 0.03) * h - (l.born ? (now - l.born) * 0.03 : 0)
        const fade = l.born ? 1 - (now - l.born) / 6000 : 1
        ctx.globalAlpha = (0.35 + 0.35 * Math.sin(t * 2.3)) * fade
        const g = ctx.createRadialGradient(x, y, 0, x, y, l.r * 5)
        g.addColorStop(0, "rgba(255, 244, 200, 1)")
        g.addColorStop(0.25, "rgba(240, 210, 120, 0.55)")
        g.addColorStop(1, "rgba(240, 210, 120, 0)")
        ctx.fillStyle = g
        ctx.fillRect(x - l.r * 5, y - l.r * 5, l.r * 10, l.r * 10)
      }
      ctx.globalCompositeOperation = "source-over"
      for (const f of leaves) {
        f.y += f.fall * dt
        if (f.y > h + 30) Object.assign(f, { y: -30, x: rand(0, w) })
        const x = f.x + Math.sin(now / 1300 + f.phase) * 26
        ctx.save()
        ctx.translate(x, f.y)
        ctx.rotate(Math.sin(now / 900 + f.phase) * 0.9 + f.spin)
        ctx.globalAlpha = 0.55
        ctx.fillStyle = "#d9aa4a"
        ctx.beginPath()
        ctx.moveTo(0, -9 * f.s)
        ctx.quadraticCurveTo(6 * f.s, 0, 0, 9 * f.s)
        ctx.quadraticCurveTo(-6 * f.s, 0, 0, -9 * f.s)
        ctx.fill()
        ctx.globalAlpha = 0.35
        ctx.fillStyle = "#7a5a1e"
        ctx.fillRect(-0.4 * f.s, -9 * f.s, 0.8 * f.s, 18 * f.s)
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }, (w, h) => {
      const small = w < 640
      lights = Array.from({ length: small ? 16 : 34 }, () => ({ x: rand(0.03, 0.97), y: rand(0.05, 0.95), phase: rand(0, 9), speed: rand(0.15, 0.4), r: rand(1.2, 2.6) }))
      leaves = Array.from({ length: small ? 4 : 8 }, () => ({ x: rand(0, w), y: rand(-h, h), s: rand(0.7, 1.3), spin: rand(0, 3), phase: rand(0, 6), fall: rand(18, 34) }))
    })
    cleanups.push(sky.stop)

    cleanups.push(pointer((x, y) => {
      mouse = { x, y }
    }, (x, y) => {
      const now = performance.now()
      const w = window.innerWidth, h = window.innerHeight
      for (let i = 0; i < 7; i++) {
        lights.push({ x: (x + rand(-30, 30)) / w, y: (y + rand(-20, 20)) / h, phase: rand(0, 9), speed: rand(0.3, 0.6), r: rand(1.4, 2.8), born: now })
      }
    }))

    return () => cleanups.forEach((fn) => fn())
  }, [])
  return null
}

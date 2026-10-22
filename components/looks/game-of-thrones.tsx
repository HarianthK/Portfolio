"use client"

import { useEffect } from "react"
import { addStyle, canvasLayer, decorate, isStill, pointer, rand } from "@/components/looks/look-kit"

// Snow on gusts of wind behind the page, frost at the screen's edges, dragonfire embers on
// background clicks, steel blade dividers and headings that thaw in. See DOCS.md "Looks".
const CSS = `
.got-frost { position: fixed; inset: 0; pointer-events: none; z-index: 30; opacity: 0;
  background: radial-gradient(ellipse 75% 70% at 50% 50%, transparent 72%, rgb(200 228 255 / 0.10) 88%, rgb(220 238 255 / 0.22));
  box-shadow: inset 0 0 70px rgb(190 225 255 / 0.18); animation: got-creep 3s ease-out 0.3s forwards; }
@keyframes got-creep { to { opacity: 1; } }

.got-blade { position: absolute; top: 0; left: 7%; right: 7%; height: 12px; transform: translateY(-50%);
  display: flex; align-items: center; pointer-events: none; z-index: 1; }
.got-blade[data-side="right"] { flex-direction: row-reverse; }
.got-blade::before { content: ""; flex: none; width: 6px; height: 12px; border-radius: 2px; margin: 0 2px;
  background: linear-gradient(#8a7a5c, #4b4130); box-shadow: 0 0 0 1px rgb(0 0 0 / 0.4); }
.got-blade i { position: relative; flex: 1; height: 4px; overflow: hidden; transform: scaleX(0); transform-origin: left;
  clip-path: polygon(0 0, 97% 0, 100% 50%, 97% 100%, 0 100%);
  background: repeating-linear-gradient(115deg, #9aa6b2 0 6px, #6d7884 6px 9px, #b9c3cd 9px 14px, #7e8995 14px 18px);
  box-shadow: 0 0 8px rgb(170 210 255 / 0.35); transition: transform 1s cubic-bezier(0.25, 0.8, 0.25, 1); }
.got-blade[data-side="right"] i { transform-origin: right; clip-path: polygon(3% 0, 100% 0, 100% 100%, 3% 100%, 0 50%); }
.got-blade i::after { content: ""; position: absolute; inset: 0; transform: translateX(-120%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.85), transparent); width: 30%; }
.got-lit i { transform: scaleX(1); }
.got-lit i::after { animation: got-glint 1.6s ease-in-out 0.9s; }
@keyframes got-glint { to { transform: translateX(420%); } }

.got-wait { opacity: 0; }
.got-show { animation: got-thaw 1.3s ease-out both; }
@keyframes got-thaw {
  0% { opacity: 0; color: #dff0ff; filter: blur(4px); text-shadow: 0 0 14px rgb(220 240 255 / 0.9); }
  50% { opacity: 1; filter: blur(0.8px); text-shadow: 0 0 8px rgb(220 240 255 / 0.5); }
  100% { opacity: 1; filter: none; }
}

html[data-look="game-of-thrones"] :is(#built article, #foundations dl > div) { position: relative; isolation: isolate; }
html[data-look="game-of-thrones"] :is(#built article, #foundations dl > div)::after {
  content: ""; position: absolute; inset: 0 -12px -12px; z-index: -1; pointer-events: none; opacity: 0;
  border-radius: 6px; border: 1px solid rgb(190 225 255 / 0.35);
  background: linear-gradient(160deg, rgb(190 225 255 / 0.10), rgb(120 160 200 / 0.04));
  box-shadow: inset 0 0 28px rgb(200 235 255 / 0.14); transition: opacity 0.3s; }
html[data-look="game-of-thrones"] :is(#built article, #foundations dl > div):is(:hover, :focus-within)::after { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .got-frost { animation: none; opacity: 1; }
  .got-blade i { transition: none; }
  .got-lit i::after { animation: none; }
}
`

type Flake = { x: number; y: number; r: number; vy: number; depth: number; phase: number }
type Ember = { x: number; y: number; vx: number; vy: number; t: number; life: number; r: number }

export default function GameOfThrones() {
  useEffect(() => {
    const cleanups = [addStyle(CSS)]
    const frost = Object.assign(document.createElement("div"), { className: "got-frost" })
    frost.setAttribute("aria-hidden", "true")
    document.body.append(frost)
    cleanups.push(() => frost.remove())
    cleanups.push(
      decorate("got", (i) => {
        const d = Object.assign(document.createElement("div"), { className: "got-blade" })
        d.dataset.side = i % 2 ? "right" : "left"
        d.append(document.createElement("i"))
        return d
      }, "got-wait", "got-show"),
    )

    // Snow in three depths; a gust every 6 to 14 seconds pushes it sideways, then dies away.
    let flakes: Flake[] = []
    let wind = 12, gust = 0, gustAt = performance.now() + rand(6000, 14000)
    let last = performance.now()
    const sky = canvasLayer(-10, (ctx, w, h, now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (now > gustAt) {
        gust = rand(70, 140) * (Math.random() < 0.5 ? -1 : 1)
        gustAt = now + rand(6000, 14000)
      }
      gust *= Math.pow(0.6, dt)
      ctx.fillStyle = "#f2f7ff"
      for (const f of flakes) {
        f.y += f.vy * dt
        f.x += ((wind + gust) * f.depth + Math.sin(now / 1100 + f.phase) * 10) * dt
        if (f.y > h + 5) Object.assign(f, { y: -5, x: rand(0, w) })
        if (f.x > w + 5) f.x = -5
        if (f.x < -5) f.x = w + 5
        ctx.globalAlpha = 0.2 + 0.5 * f.depth
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }, (w, h) => {
      const n = w < 640 ? 50 : 120
      flakes = Array.from({ length: n }, () => {
        const depth = [0.35, 0.65, 1][Math.floor(rand(0, 3))]
        return { x: rand(0, w), y: rand(0, h), r: 0.6 + 1.6 * depth, vy: 20 + 50 * depth, depth, phase: rand(0, 6) }
      })
    })
    cleanups.push(sky.stop)

    // Dragonfire: embers burst from the click, rise, flicker and burn out.
    let embers: Ember[] = []
    let flash: { x: number; y: number; t: number } | null = null
    const fx = canvasLayer(40, (ctx, _w, _h, now) => {
      if (flash && now - flash.t < 350) {
        const q = (now - flash.t) / 350
        const g = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, 90)
        g.addColorStop(0, `rgba(255, 170, 70, ${0.45 * (1 - q)})`)
        g.addColorStop(1, "rgba(255, 90, 20, 0)")
        ctx.fillStyle = g
        ctx.fillRect(flash.x - 90, flash.y - 90, 180, 180)
      }
      embers = embers.filter((p) => now - p.t < p.life)
      ctx.globalCompositeOperation = "lighter"
      for (const p of embers) {
        const k = (now - p.t) / 1000
        const q = (now - p.t) / p.life
        ctx.globalAlpha = (1 - q) * (0.7 + 0.3 * Math.sin(now / 40 + p.r * 9))
        ctx.fillStyle = q < 0.3 ? "#ffe08a" : q < 0.65 ? "#ff9a3c" : "#e2482a"
        ctx.beginPath()
        ctx.arc(p.x + p.vx * k, p.y + p.vy * k - 40 * k * k, p.r * (1 - q * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
      return embers.length > 0 || (flash !== null && now - flash.t < 350)
    })
    cleanups.push(fx.stop)
    if (!isStill()) {
      cleanups.push(pointer(null, (x, y) => {
        const now = performance.now()
        flash = { x, y, t: now }
        for (let i = 0; i < 40 && embers.length < 200; i++) {
          const a = rand(-Math.PI, 0)
          const v = rand(40, 200)
          embers.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: now, life: rand(600, 1300), r: rand(1.2, 3) })
        }
        fx.wake()
      }))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
  return null
}

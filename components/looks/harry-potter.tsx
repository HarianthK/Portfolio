"use client"

import { useEffect } from "react"
import { IM_Fell_English } from "next/font/google"
import { addStyle, canvasLayer, decorate, isLite, pointer, rand } from "@/components/looks/look-kit"

// An old-print revival for headings, fetched only with this look (preload off).
const fell = IM_Fell_English({ weight: "400", subsets: ["latin"], preload: false, display: "swap" })

// Floating candles behind the page, gold sparkles from the cursor and on background clicks,
// ink dividers and headings. Original drawing only; see DOCS.md "Looks".
const CSS = `
html[data-look="harry-potter"] main h2 { font-family: ${fell.style.fontFamily}, var(--font-serif); letter-spacing: -0.01em; }
.hp-ink { position: absolute; top: 0; left: 8%; right: 8%; height: 14px; transform: translateY(-50%);
  display: flex; align-items: center; pointer-events: none; z-index: 1; }
.hp-ink::before { content: ""; flex: none; width: 14px; height: 14px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #d8545a, #8e1d24 60%, #5c1016);
  box-shadow: 0 0 0 2px rgb(142 29 36 / 0.35), 0 1px 3px rgb(0 0 0 / 0.5); }
.hp-ink i { flex: 1; height: 2px; margin-left: 6px; transform: scaleX(0); transform-origin: left;
  background: linear-gradient(90deg, #e9c46a, #c9973e 70%, rgb(201 151 62 / 0));
  box-shadow: 0 0 8px rgb(233 196 106 / 0.45); transition: transform 1.3s cubic-bezier(0.3, 0.7, 0.2, 1); }
.hp-lit i { transform: scaleX(1); }

.hp-wait { opacity: 0; }
.hp-show { animation: hp-ink 1.2s ease-out both; }
@keyframes hp-ink {
  0% { opacity: 0; filter: blur(5px); color: #b8323a; }
  55% { opacity: 1; filter: blur(0.6px); }
  100% { opacity: 1; filter: none; }
}

html[data-look="harry-potter"] :is(#built article, #foundations dl > div) { position: relative; isolation: isolate; }
html[data-look="harry-potter"] :is(#built article, #foundations dl > div)::after {
  content: ""; position: absolute; inset: 0 -12px -12px; z-index: -1; pointer-events: none; opacity: 0;
  border-radius: 6px; border: 1px solid rgb(233 196 106 / 0.35);
  background: radial-gradient(120% 90% at 20% 0%, rgb(233 196 106 / 0.12), transparent 60%),
    linear-gradient(170deg, rgb(120 70 30 / 0.18), rgb(60 30 15 / 0.08));
  box-shadow: inset 0 0 30px rgb(233 160 80 / 0.12), 0 0 22px rgb(233 160 80 / 0.08); transition: opacity 0.3s; }
html[data-look="harry-potter"] :is(#built article, #foundations dl > div):is(:hover, :focus-within)::after { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .hp-ink i { transition: none; }
}
`

type Candle = { x: number; y: number; s: number; phase: number; bob: number }
type Spark = { x: number; y: number; vx: number; vy: number; t: number; life: number; r: number; white: boolean }

export default function HarryPotter() {
  useEffect(() => {
    const cleanups = [addStyle(CSS)]
    cleanups.push(
      decorate("hp", () => {
        const d = Object.assign(document.createElement("div"), { className: "hp-ink" })
        d.append(document.createElement("i"))
        return d
      }, "hp-wait", "hp-show"),
    )

    // Candles hang at fixed spots across the sky and bob; nearer ones are larger and brighter.
    // The layer fades to a quarter over the text column, and the wax is never brighter than the text.
    let candles: Candle[] = []
    const sky = canvasLayer(-10, (ctx, w, h, now) => {
      const shift = window.scrollY * -0.04
      for (const c of candles) {
        const x = c.x * w
        const y = c.y * h + Math.sin(now / 1900 + c.phase) * c.bob + shift * c.s
        const flick = 0.85 + 0.15 * Math.sin(now / 90 + c.phase * 7) * Math.sin(now / 230 + c.phase)
        ctx.globalAlpha = 0.3 + 0.35 * c.s
        const glow = ctx.createRadialGradient(x, y - 22 * c.s, 0, x, y - 22 * c.s, 42 * c.s * flick)
        glow.addColorStop(0, "rgba(255, 214, 130, 0.55)")
        glow.addColorStop(1, "rgba(255, 170, 80, 0)")
        ctx.fillStyle = glow
        ctx.fillRect(x - 50 * c.s, y - 72 * c.s, 100 * c.s, 100 * c.s)
        const body = ctx.createLinearGradient(x - 4 * c.s, 0, x + 4 * c.s, 0)
        body.addColorStop(0, "#a8987a")
        body.addColorStop(0.5, "#d2c3a2")
        body.addColorStop(1, "#968868")
        ctx.fillStyle = body
        ctx.fillRect(x - 4 * c.s, y - 10 * c.s, 8 * c.s, 40 * c.s)
        ctx.fillStyle = "#3b2a1a"
        ctx.fillRect(x - 0.6 * c.s, y - 14 * c.s, 1.2 * c.s, 4 * c.s)
        ctx.fillStyle = "#ffe7a8"
        ctx.beginPath()
        ctx.ellipse(x, y - 19 * c.s, 2.6 * c.s * flick, 6 * c.s * flick, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }, { mask: 0.22, onResize: (w) => {
      const n = isLite() ? 6 : 13
      candles = Array.from({ length: n }, (_, i) => ({
        x: (i + rand(0.2, 0.8)) / n, y: rand(0.12, 0.78), s: rand(0.55, 1.15), phase: rand(0, 6), bob: rand(4, 12),
      }))
    } })
    cleanups.push(sky.stop)

    // Sparkles: a few from the cursor as it moves, a burst where the background is clicked.
    let sparks: Spark[] = []
    const fx = canvasLayer(-5, (ctx, _w, _h, now) => {
      sparks = sparks.filter((p) => now - p.t < p.life)
      ctx.globalCompositeOperation = "lighter"
      for (const p of sparks) {
        const k = (now - p.t) / 1000
        const q = (now - p.t) / p.life
        const x = p.x + p.vx * k
        const y = p.y + p.vy * k + 60 * k * k
        const r = p.r * (1 - q * 0.6)
        ctx.globalAlpha = (1 - q) * 0.45
        ctx.fillStyle = "#ffcf5a"
        ctx.beginPath()
        ctx.arc(x, y, r * 1.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1 - q
        ctx.fillStyle = p.white ? "#fff8e1" : "#ffe08a"
        ctx.fillRect(x - r * 1.4, y - 0.75, r * 2.8, 1.5)
        ctx.fillRect(x - 0.75, y - r * 1.4, 1.5, r * 2.8)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
      return sparks.length > 0
    })
    cleanups.push(fx.stop)
    const emit = (x: number, y: number, n: number, speed: number) => {
      const now = performance.now()
      for (let i = 0; i < n && sparks.length < 240; i++) {
        const a = rand(0, Math.PI * 2)
        const v = rand(0.2, 1) * speed
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.3, t: now, life: rand(450, 900), r: rand(1.5, 3.5), white: Math.random() < 0.3 })
      }
      fx.wake()
    }
    cleanups.push(pointer((x, y) => emit(x, y, 3, 45), (x, y) => emit(x, y, 40, 240)))

    return () => cleanups.forEach((fn) => fn())
  }, [])
  return null
}

"use client"

import { useEffect } from "react"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

// Everything here is added to the page on mount and removed on unmount. See DOCS.md "Looks".
const BLADES = ["#4cc3ff", "#59f07a", "#ffcf4a"]
const TRAIL_MS = 140
const BOLT_MS = 190
const SPARK_MS = 280
const MAX_BOLTS = 3
// Clicks on anything a visitor reads or uses never fire a bolt.
const NOT_BACKGROUND =
  "a,button,input,textarea,select,label,summary,[role=button],[popover],canvas,svg,img,p,h1,h2,h3,h4,li,dt,dd,span"

type Point = { x: number; y: number; t: number }
type Bolt = { x0: number; y0: number; x1: number; y1: number; t: number }

const CSS = `
html[data-look="star-wars"] main > section:not(#hero) { overflow-x: clip; }
.sw-saber { position: absolute; top: 0; left: 5%; right: 5%; height: 8px; display: flex; align-items: center;
  transform: translateY(-50%); pointer-events: none; z-index: 1; }
.sw-saber[data-side="right"] { flex-direction: row-reverse; }
.sw-saber::before { content: ""; flex: none; width: 26px; height: 7px; border-radius: 2px;
  background: linear-gradient(#a7afbd, #59606e 55%, #2c313b); }
.sw-blade { flex: 1; height: 3px; border-radius: 3px; background: #fff; transform: scaleX(0); transform-origin: left;
  box-shadow: 0 0 3px 1px var(--blade), 0 0 10px 2px var(--blade), 0 0 26px 5px color-mix(in oklab, var(--blade) 55%, transparent);
  transition: transform 0.75s cubic-bezier(0.2, 0.9, 0.25, 1); }
.sw-saber[data-side="right"] .sw-blade { transform-origin: right; }
.sw-lit .sw-blade { transform: scaleX(1); }
.sw-on .sw-blade { animation: sw-hum 1.9s linear infinite; }
@keyframes sw-hum { 0%, 100% { opacity: 1 } 21% { opacity: 0.86 } 23% { opacity: 1 } 58% { opacity: 0.93 } 61% { opacity: 1 } }

.sw-wait { opacity: 0; }
.sw-drop { transform-origin: left center; animation: sw-drop 0.8s cubic-bezier(0.15, 0.85, 0.3, 1) both; }
@keyframes sw-drop {
  0% { opacity: 0; transform: scaleX(2.6); filter: blur(6px);
    text-shadow: -40px 0 8px rgb(170 205 255 / 0.7), -110px 0 16px rgb(170 205 255 / 0.35); }
  40% { opacity: 1; filter: blur(1px); }
  72% { transform: scaleX(0.98); filter: none; }
  100% { opacity: 1; transform: none; }
}

.sw-fx { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 40; }
.sw-streak { position: fixed; left: 0; top: var(--y); width: 220px; height: 2px; z-index: -10; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgb(255 110 100 / 0.9) 85%, #fff); border-radius: 2px;
  box-shadow: 0 0 6px rgb(255 80 70 / 0.6);
  transform: rotate(var(--a)) translateX(-200px); animation: sw-streak 1.1s linear forwards; }
@keyframes sw-streak { 15% { opacity: 1 } 100% { opacity: 0.2; transform: rotate(var(--a)) translateX(calc(100vw + 200px)); } }

html[data-look="star-wars"] :is(#built article, #foundations dl > div) { position: relative; isolation: isolate; }
html[data-look="star-wars"] :is(#built article, #foundations dl > div)::after {
  content: ""; position: absolute; inset: 0 -12px -12px; z-index: -1; pointer-events: none; opacity: 0; border-radius: 6px;
  background: repeating-linear-gradient(to bottom, rgb(130 205 255 / 0.08) 0 1px, transparent 1px 4px),
    linear-gradient(160deg, rgb(70 160 255 / 0.16), rgb(40 110 220 / 0.05));
  box-shadow: -2px 0 0 rgb(255 70 130 / 0.35), 2px 0 0 rgb(70 220 255 / 0.45), inset 0 0 28px rgb(70 160 255 / 0.22);
  transition: opacity 0.25s; }
html[data-look="star-wars"] :is(#built article, #foundations dl > div):is(:hover, :focus-within)::after {
  opacity: 1; animation: sw-scan 2.6s linear infinite, sw-flicker 3.7s steps(1) infinite; }
html[data-look="star-wars"] :is(#built article, #foundations dl > div):is(:hover, :focus-within) :is(h3, dd > p:first-child) {
  text-shadow: -1px 0 rgb(255 70 130 / 0.45), 1px 0 rgb(70 220 255 / 0.55); }
@keyframes sw-scan { to { background-position: 0 32px, 0 0; } }
@keyframes sw-flicker { 0% { opacity: 1 } 46% { opacity: 0.72 } 48% { opacity: 1 } 81% { opacity: 0.85 } 83% { opacity: 1 } }

@media (prefers-reduced-motion: reduce) {
  .sw-blade { transition: none; }
  .sw-on .sw-blade, .sw-drop { animation: none; }
  html[data-look="star-wars"] :is(#built article, #foundations dl > div):is(:hover, :focus-within)::after { animation: none; }
}
`

export default function StarWarsFx() {
  const hookReduced = useSafeReducedMotion()

  useEffect(() => {
    // The hook reads false on its first render, so check the query directly as well.
    const still = hookReduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const cleanups: (() => void)[] = []

    // Lightsaber dividers on every section boundary below the hero.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section")).slice(1)
    const sabers = new Map<Element, HTMLElement>()
    sections.forEach((section, i) => {
      const saber = document.createElement("div")
      saber.className = "sw-saber"
      saber.dataset.side = i % 2 ? "right" : "left"
      saber.style.setProperty("--blade", BLADES[i % BLADES.length])
      saber.setAttribute("aria-hidden", "true")
      saber.append(Object.assign(document.createElement("i"), { className: "sw-blade" }))
      if (still) saber.classList.add("sw-lit")
      section.append(saber)
      sabers.set(section, saber)
    })
    cleanups.push(() => sabers.forEach((s) => s.remove()))

    if (still) return () => cleanups.forEach((fn) => fn())

    const saberIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const saber = sabers.get(e.target)!
          if (e.isIntersecting) saber.classList.add("sw-lit")
          saber.classList.toggle("sw-on", e.isIntersecting)
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    sections.forEach((s) => saberIo.observe(s))
    cleanups.push(() => saberIo.disconnect())

    // Headings drop out of hyperspace once, the first time they come into view.
    const headings = Array.from(document.querySelectorAll<HTMLElement>("main > section h2"))
    headings.forEach((h) => h.classList.add("sw-wait"))
    const headingIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.replace("sw-wait", "sw-drop")
          headingIo.unobserve(e.target)
        }
      },
      { threshold: 0.3 },
    )
    headings.forEach((h) => headingIo.observe(h))
    cleanups.push(() => {
      headingIo.disconnect()
      headings.forEach((h) => h.classList.remove("sw-wait", "sw-drop"))
    })

    // One overlay canvas for the cursor trail and blaster bolts; it never takes clicks.
    const canvas = document.createElement("canvas")
    canvas.className = "sw-fx"
    canvas.setAttribute("aria-hidden", "true")
    document.body.append(canvas)
    const ctx = canvas.getContext("2d")!
    cleanups.push(() => canvas.remove())

    let w = 0
    let h = 0
    let frame = 0
    let trail: Point[] = []
    let bolts: Bolt[] = []

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function glowLine(x0: number, y0: number, x1: number, y1: number, color: string, width: number, alpha: number) {
      ctx.globalAlpha = alpha * 0.45
      ctx.strokeStyle = color
      ctx.lineWidth = width * 3.2
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.stroke()
      ctx.globalAlpha = alpha
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = width
      ctx.stroke()
    }

    function tick(now: number) {
      frame = 0
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      ctx.globalCompositeOperation = "lighter"

      trail = trail.filter((p) => now - p.t < TRAIL_MS)
      for (let i = 1; i < trail.length; i++) {
        const life = 1 - (now - trail[i].t) / TRAIL_MS
        glowLine(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y, "#4cc3ff", 1 + 2 * life, life)
      }

      bolts = bolts.filter((b) => now - b.t < BOLT_MS + SPARK_MS)
      for (const b of bolts) {
        const p = (now - b.t) / BOLT_MS
        if (p < 1) {
          const tail = Math.max(0, p - 0.3)
          glowLine(
            b.x0 + (b.x1 - b.x0) * tail,
            b.y0 + (b.y1 - b.y0) * tail,
            b.x0 + (b.x1 - b.x0) * p,
            b.y0 + (b.y1 - b.y0) * p,
            "#ff4040",
            3.5,
            1,
          )
        } else {
          const q = (now - b.t - BOLT_MS) / SPARK_MS
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2 + b.t
            const r0 = 3 + 10 * q
            const r1 = r0 + 7 * (1 - q)
            glowLine(
              b.x1 + Math.cos(a) * r0,
              b.y1 + Math.sin(a) * r0,
              b.x1 + Math.cos(a) * r1,
              b.y1 + Math.sin(a) * r1,
              "#ffb060",
              1.2,
              1 - q,
            )
          }
        }
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
      if (trail.length || bolts.length) frame = requestAnimationFrame(tick)
    }

    // Frames run only while a trail or bolt is on screen.
    function kick() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick)
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null
      if (e.defaultPrevented || target?.closest(NOT_BACKGROUND)) return
      if (window.getSelection()?.isCollapsed === false) return
      if (bolts.length >= MAX_BOLTS) bolts.shift()
      const fromLeft = Math.random() < 0.5
      bolts.push({
        x0: fromLeft ? -20 : w + 20,
        y0: h * (0.15 + Math.random() * 0.7),
        x1: e.clientX,
        y1: e.clientY,
        t: performance.now(),
      })
      kick()
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (trail.length > 24) trail.shift()
      kick()
    }

    function onVisibility() {
      if (!document.hidden) return
      cancelAnimationFrame(frame)
      frame = 0
      trail = []
      bolts = []
      ctx.clearRect(0, 0, w, h)
    }

    resize()
    window.addEventListener("resize", resize)
    document.addEventListener("click", onClick)
    document.addEventListener("visibilitychange", onVisibility)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (fine) window.addEventListener("pointermove", onMove, { passive: true })
    cleanups.push(() => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      document.removeEventListener("click", onClick)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onMove)
    })

    // Now and then a distant bolt crosses the starfield behind the page, one at a time.
    let timer = 0
    let streak: HTMLElement | null = null
    function schedule() {
      timer = window.setTimeout(fireStreak, 8000 + Math.random() * 12000)
    }
    function fireStreak() {
      if (!document.hidden && !streak) {
        const el = document.createElement("div")
        el.className = "sw-streak"
        el.setAttribute("aria-hidden", "true")
        el.style.setProperty("--y", `${10 + Math.random() * 70}vh`)
        el.style.setProperty("--a", `${Math.random() * 16 - 8}deg`)
        el.addEventListener("animationend", () => {
          el.remove()
          streak = null
        })
        document.body.append(el)
        streak = el
      }
      schedule()
    }
    schedule()
    cleanups.push(() => {
      clearTimeout(timer)
      streak?.remove()
    })

    return () => cleanups.forEach((fn) => fn())
  }, [hookReduced])

  return <style>{CSS}</style>
}

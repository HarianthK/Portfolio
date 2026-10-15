"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

type Star = { x: number; y: number; z: number; tint: string }

const JUMP_MS = 1100
const TINTS = ["#ffffff", "#dfe8ff", "#fff1cf", "#cfe0ff"]

// Fewer stars on small screens, and never more than 2x pixels, so phones stay smooth.
function makeStars(w: number, h: number): Star[] {
  const count = Math.min(420, Math.round((w * h) / 4200))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 0.9 + 0.1,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  }))
}

export default function StarWarsSky({ jump }: { jump: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const jumped = useRef(false)
  const hookReduced = useSafeReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // The hook reads false on its first render, so check the query directly as well.
    const still = hookReduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let stars: Star[] = []
    let frame = 0
    let start = 0
    const playJump = jump && !still && !jumped.current
    jumped.current = true

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(w, h)
      if (still) draw(0, 0)
    }

    // warp runs 0..1..0 over the jump; at 0 the stars are points with slow drift.
    function draw(warp: number, t: number) {
      ctx!.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const scroll = still ? 0 : window.scrollY
      for (const s of stars) {
        const drift = still ? 0 : (t * 0.004 * s.z) % w
        const x = (((s.x - drift - scroll * 0.05 * s.z) % w) + w) % w
        const y = (((s.y - scroll * 0.12 * s.z) % h) + h) % h
        const size = s.z * 1.6
        ctx!.globalAlpha = 0.35 + s.z * 0.65
        if (warp > 0.02) {
          const dx = x - cx
          const dy = y - cy
          const k = warp * 0.6 * s.z
          ctx!.strokeStyle = s.tint
          ctx!.lineWidth = size
          ctx!.beginPath()
          ctx!.moveTo(x, y)
          ctx!.lineTo(x + dx * k, y + dy * k)
          ctx!.stroke()
        } else {
          ctx!.fillStyle = s.tint
          ctx!.fillRect(x, y, size, size)
        }
      }
      ctx!.globalAlpha = 1
    }

    function tick(now: number) {
      if (!start) start = now
      const elapsed = now - start
      const p = playJump ? Math.min(elapsed / JUMP_MS, 1) : 1
      draw(Math.sin(p * Math.PI), elapsed)
      frame = requestAnimationFrame(tick)
    }

    function onVisibility() {
      cancelAnimationFrame(frame)
      if (!document.hidden && !still) frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener("resize", resize)
    if (!still) {
      document.addEventListener("visibilitychange", onVisibility)
      frame = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [hookReduced, jump])

  return createPortal(
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />,
    document.body,
  )
}

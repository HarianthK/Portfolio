"use client"

import { useEffect, useRef } from "react"
import { canvasLayer, isLite, isStill } from "@/components/looks/look-kit"

type Star = { x: number; y: number; z: number; tint: string }

const JUMP_MS = 1100
const TINTS = ["#ffffff", "#dfe8ff", "#fff1cf", "#cfe0ff"]

// Star count scales with screen area, and phones get half as many.
function makeStars(w: number, h: number): Star[] {
  const count = Math.min(420, Math.round((w * h) / (isLite() ? 8400 : 4200)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 0.9 + 0.1,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  }))
}

export default function StarWarsSky({ jump }: { jump: boolean }) {
  const jumped = useRef(false)

  useEffect(() => {
    const still = isStill()
    const playJump = jump && !still && !jumped.current
    jumped.current = true
    let stars: Star[] = []
    let start = 0

    // warp runs 0..1..0 over the jump; at 0 the stars are points with slow drift.
    const sky = canvasLayer(-10, (ctx, w, h, now) => {
      if (!start) start = now
      const t = now - start
      const warp = Math.sin((playJump ? Math.min(t / JUMP_MS, 1) : 1) * Math.PI)
      const cx = w / 2
      const cy = h / 2
      const scroll = still ? 0 : window.scrollY
      for (const s of stars) {
        const drift = still ? 0 : (t * 0.004 * s.z) % w
        const x = (((s.x - drift - scroll * 0.05 * s.z) % w) + w) % w
        const y = (((s.y - scroll * 0.12 * s.z) % h) + h) % h
        const size = s.z * 1.6
        ctx.globalAlpha = 0.35 + s.z * 0.65
        if (warp > 0.02) {
          const k = warp * 0.6 * s.z
          ctx.strokeStyle = s.tint
          ctx.lineWidth = size
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + (x - cx) * k, y + (y - cy) * k)
          ctx.stroke()
        } else {
          ctx.fillStyle = s.tint
          ctx.fillRect(x, y, size, size)
        }
      }
      ctx.globalAlpha = 1
    }, { mask: 0.3, onResize: (w, h) => (stars = makeStars(w, h)) })

    return sky.stop
  }, [jump])

  return null
}

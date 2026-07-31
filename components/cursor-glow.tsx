"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

export function CursorGlow() {
  const prefersReducedMotion = useSafeReducedMotion()
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 120, damping: 25, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 120, damping: 25, mass: 0.5 })

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    setEnabled(fine && !prefersReducedMotion)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!enabled) return
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 h-[420px] w-[420px] rounded-full mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(240,180,41,0.13) 0%, rgba(224,123,57,0.07) 40%, transparent 70%)",
      }}
    />
  )
}

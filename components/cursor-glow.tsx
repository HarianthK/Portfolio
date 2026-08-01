"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

export function CursorGlow() {
  const prefersReducedMotion = useSafeReducedMotion()
  const { resolvedTheme } = useTheme()
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

  const isDark = resolvedTheme === "dark"

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-40 h-[420px] w-[420px] rounded-full ${
        isDark ? "mix-blend-screen" : "mix-blend-multiply"
      }`}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: isDark
          ? "radial-gradient(circle, rgba(240,180,41,0.13) 0%, rgba(224,123,57,0.07) 40%, transparent 70%)"
          : "radial-gradient(circle, rgba(240,180,41,0.16) 0%, rgba(180,90,40,0.08) 40%, transparent 70%)",
      }}
    />
  )
}

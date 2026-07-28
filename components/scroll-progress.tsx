"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

export function ScrollProgress() {
  const prefersReducedMotion = useSafeReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  if (prefersReducedMotion) return null

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-primary"
      style={{ scaleX }}
    />
  )
}

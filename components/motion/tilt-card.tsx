"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { ReactNode } from "react"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
  const prefersReducedMotion = useSafeReducedMotion()

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 })

  const rotateX = useTransform(springY, [0, 1], [6, -6])
  const rotateY = useTransform(springX, [0, 1], [-6, 6])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handlePointerLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  )
}

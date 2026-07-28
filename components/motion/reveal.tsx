"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section"
}

export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const prefersReducedMotion = useSafeReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.6, delay, ease: "easeOut" },
    },
  }

  const MotionTag = as === "section" ? motion.section : motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}

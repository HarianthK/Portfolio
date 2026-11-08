"use client"

import { useEffect, useState } from "react"

// Shown while the hero is on screen; after that the pill shrinks to its icons so it clears the content column.
export function CornerResume() {
  const [heroVisible, setHeroVisible] = useState(true)
  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" })
    io.observe(hero)
    return () => io.disconnect()
  }, [])
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`${heroVisible ? "sm:inline-flex" : ""} hidden min-h-11 items-center px-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground`}
    >
      Résumé
    </a>
  )
}

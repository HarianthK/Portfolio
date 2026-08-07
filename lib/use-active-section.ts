"use client"

import { useEffect, useState } from "react"
import type { SectionId } from "@/lib/graph-data"

/**
 * Which of the narrative blocks the reader is currently on, so the graph beside
 * them can fly its camera to the matching cluster.
 *
 * Deliberately not `IntersectionObserver`'s default behaviour: several of these
 * blocks are taller than the viewport, so "is intersecting" is true for two of
 * them at once for most of the scroll. Instead the winner is whichever block
 * covers the most of a band across the middle of the screen, which gives one
 * unambiguous answer at every scroll position.
 */
export function useActiveSection(ids: SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(ids[0] ?? null)

  // Depend on the contents rather than the array identity, so a caller passing
  // an inline literal doesn't tear down and rebuild the listeners every render.
  const key = ids.join(",")

  useEffect(() => {
    const sections = key ? (key.split(",") as SectionId[]) : []
    if (sections.length === 0) return

    let frame = 0

    const measure = () => {
      frame = 0

      // A band through the middle of the viewport. Anything crossing it is
      // what the reader is actually looking at.
      const bandTop = window.innerHeight * 0.25
      const bandBottom = window.innerHeight * 0.75

      let winner: SectionId | null = null
      let best = 0

      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const overlap = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop)
        if (overlap > best) {
          best = overlap
          winner = id
        }
      }

      // Only null when nothing is near the band at all — above the first block
      // or below the last — which lets the graph fall back to the whole shape.
      setActive(winner)
    }

    const onScroll = () => {
      // Coalesce to one measurement per frame; scroll fires far more often.
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [key])

  return active
}

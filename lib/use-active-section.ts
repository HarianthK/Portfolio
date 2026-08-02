"use client"

import { useEffect, useState } from "react"
import type { SectionId } from "@/lib/graph-data"

/**
 * Reports which section currently owns the viewport, so the graph can move its
 * camera to match. Uses IntersectionObserver rather than scroll maths so it
 * stays correct regardless of section heights or smooth-scroll easing.
 */
export function useActiveSection(sectionIds: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(sectionIds[0])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // With a centred root margin several sections can qualify at once
        // mid-scroll; the most visible one wins.
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (best?.target.id) {
          setActive(best.target.id as SectionId)
        }
      },
      {
        // Only count a section once it's near the middle of the screen, so the
        // camera moves when the section is actually being read.
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}

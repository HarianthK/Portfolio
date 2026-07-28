"use client"

import { useEffect, useState } from "react"

/**
 * Always resolves to `false` on the server and on the client's first render so
 * hydration never mismatches, then syncs to the real value after mount.
 */
export function useSafeReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return reduced
}

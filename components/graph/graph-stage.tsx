"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import type { GraphFraming } from "@/components/graph/graph-canvas"
import type { GraphNode, NodeKind } from "@/lib/graph-data"

// WebGL can't render on the server, and pulling three.js into the initial
// bundle would delay first paint for no benefit.
const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), {
  ssr: false,
})

// Phones, touch screens and data savers get the still picture until they ask. See DOCS.md.
const LITE_QUERY = "(max-width: 768px), (pointer: coarse)"

type Props = {
  highlight?: NodeKind[] | null
  framing?: GraphFraming
  /** Hero is a picture you can poke; the explorer is a tool you use. */
  showReadout?: boolean
  /** The static picture shown until the live graph has drawn. */
  fallback?: ReactNode
  /** On lite devices, wait for a tap instead of loading as the stage approaches. */
  tapToLoad?: boolean
  className?: string
}

/**
 * A contained stage for the graph, used twice on the page: once as the opening
 * image, once as the interactive explorer. Not a full-page backdrop: text over a
 * live scene needed so heavy a scrim that it turned the graph to mud.
 */
export function GraphStage({
  highlight = null,
  framing = "immersive",
  showReadout = true,
  fallback,
  tapToLoad = false,
  className,
}: Props) {
  const [hovered, setHovered] = useState<GraphNode | null>(null)
  const [pinned, setPinned] = useState<GraphNode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  // null until checked, so nothing loads before the device is known.
  const [lite, setLite] = useState<boolean | null>(null)
  const [tapped, setTapped] = useState(false)
  const waitForTap = tapToLoad && (lite === null || (lite && !tapped))

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    setLite(Boolean(saveData) || window.matchMedia(LITE_QUERY).matches)
  }, [])

  // The hero shows its still picture only where it stands in for the live one; the
  // explorer shows it as a loading state everywhere. Before the check, CSS guesses.
  const fallbackShown = !tapToLoad || lite === true
  const fallbackClass = ready
    ? "opacity-0"
    : tapToLoad && lite === null
      ? "hidden max-md:block pointer-coarse:block"
      : fallbackShown
        ? "opacity-100"
        : "hidden"

  // Two of these are mounted at once. Without this both render continuously,
  // which measured at 15fps on a desktop; the off-screen one is pure waste.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      // A little margin so it's already running by the time it scrolls in.
      { rootMargin: "200px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // three.js is fetched only once a stage gets near the screen, never for one far below the fold.
  useEffect(() => {
    if (load || waitForTap) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setLoad(true), {
      rootMargin: "800px 0px",
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [load, waitForTap])

  const handleSelect = useCallback((node: GraphNode) => {
    // Tapping is the only way in on touch, where there's no hover at all, so a
    // tap has to both select and explain.
    setPinned((current) => (current?.id === node.id ? null : node))
  }, [])

  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // Clear the hover too. The cursor usually still rests on the pinned node,
      // so dropping only the pin would leave the panel up and look broken.
      setPinned(null)
      setHovered(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinned])

  // Hover previews whatever is under the cursor; the pinned node is what the
  // panel returns to once you point at nothing.
  const shown = hovered ?? pinned

  return (
    <div ref={containerRef} className={className}>
      {fallback && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${fallbackClass}`}
        >
          {fallback}
        </div>
      )}

      {load && (
        // Hidden from assistive tech: a WebGL canvas exposes nothing usable, and
        // everything it shows is written out in the sections around it.
        <div aria-hidden className="absolute inset-0">
          <GraphCanvas
            highlight={highlight}
            framing={framing}
            paused={!onScreen}
            pinnedId={pinned?.id ?? null}
            onReady={() => setReady(true)}
            onNodeFocus={setHovered}
            onNodeSelect={handleSelect}
          />
        </div>
      )}

      {tapToLoad && lite && !tapped && (
        <button
          type="button"
          onClick={() => {
            setTapped(true)
            setLoad(true)
          }}
          className="absolute left-4 top-0 z-20 inline-flex min-h-11 items-center rounded-full border border-border bg-background/85 px-4 font-mono text-xs text-foreground backdrop-blur"
        >
          Explore it live
        </button>
      )}

      {showReadout && shown && (
        // z-20 keeps it above the hero's bottom fade, which is a later sibling
        // and was otherwise painting over the panel.
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 max-w-sm rounded-lg border border-primary/25 bg-background/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto"
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-widest text-primary">
            {shown.kind}
          </p>
          <p className="mt-1 font-serif text-2xl leading-tight text-foreground">{shown.label}</p>
          {shown.detail && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{shown.detail}</p>
          )}
          {shown.meta && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/80">{shown.meta}</p>
          )}
          {/* Only label it pinned when the pinned node is the one on show,
              otherwise a hover preview would claim to be pinned. */}
          {pinned && shown.id === pinned.id && (
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-primary/70">
              pinned · press esc to dismiss
            </p>
          )}
        </div>
      )}
    </div>
  )
}

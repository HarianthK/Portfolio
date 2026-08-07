"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import type { GraphFraming } from "@/components/graph/graph-canvas"
import type { GraphNode, NodeKind, SectionId } from "@/lib/graph-data"

// WebGL can't render on the server, and pulling three.js into the initial
// bundle would delay first paint for no benefit.
const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), {
  ssr: false,
})

type Props = {
  highlight?: NodeKind[] | null
  /** Scroll-driven section focus — the camera flies to that cluster. */
  focus?: SectionId | null
  framing?: GraphFraming
  /** Hero is a picture you can poke; the explorer is a tool you use. */
  showReadout?: boolean
  /**
   * Whether pointer input reaches the canvas. The rail is a moving illustration
   * beside the writing until it unpins into the explorer, at which point it
   * becomes something to grab.
   */
  interactive?: boolean
  /**
   * Lets a parent stop the render loop. The stage pauses itself when its own
   * container scrolls away, but the rail's panel is `fixed` — always on screen
   * by definition — so the rail has to say when it's actually in play.
   */
  active?: boolean
  className?: string
}

/**
 * A contained stage for the graph, used twice on the page — once as the opening
 * image, once as the interactive explorer. It's deliberately *not* a fixed
 * full-page backdrop any more: text laid over a live 3D scene needed so heavy a
 * scrim that it turned the graph to mud, especially on phones.
 */
export function GraphStage({
  highlight = null,
  focus = null,
  framing = "immersive",
  showReadout = true,
  interactive = true,
  active = true,
  className,
}: Props) {
  const [hovered, setHovered] = useState<GraphNode | null>(null)
  const [pinned, setPinned] = useState<GraphNode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)

  // Two of these are mounted at once. Without this both render continuously,
  // which measured at 15fps on a desktop — the off-screen one is pure waste.
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

  // Leaving interactive mode has to drop whatever was being pointed at, or the
  // readout would stay frozen on the last node once the graph docks again.
  useEffect(() => {
    if (interactive) return
    setHovered(null)
    setPinned(null)
  }, [interactive])

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

  // Hover wins over the pin, not the other way round. Pinning used to take
  // priority, which meant that after clicking a node, pointing at any other one
  // did nothing at all and the graph felt broken. Now hovering always previews
  // whatever is under the cursor, and the pinned node is what the panel returns
  // to once you point at nothing.
  const shown = hovered ?? pinned

  return (
    // Hidden from assistive tech on purpose: a WebGL canvas exposes nothing
    // usable, and everything it shows — the roles, projects and relationships —
    // is written out in the sections around it. The explorer's filter buttons
    // sit outside this element and stay reachable.
    <div ref={containerRef} className={className} aria-hidden>
      {/* Non-interactive while docked: the rail is illustration beside the
          writing, and swallowing drags there would fight the page scroll. */}
      <div className={interactive ? "absolute inset-0" : "pointer-events-none absolute inset-0"}>
        <GraphCanvas
          highlight={highlight}
          focus={focus}
          framing={framing}
          paused={!onScreen || !active}
          onNodeFocus={interactive ? setHovered : undefined}
          onNodeSelect={handleSelect}
        />
      </div>

      {showReadout && shown && (
        // z-20 keeps it above the hero's bottom fade, which is a later sibling
        // and was otherwise painting over the panel.
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 max-w-sm rounded-lg border border-primary/25 bg-background/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto">
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
          {/* Only label it pinned when the pinned node is the one on show —
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

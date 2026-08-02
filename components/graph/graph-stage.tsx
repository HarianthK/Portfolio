"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import type { GraphFraming } from "@/components/graph/graph-canvas"
import type { GraphNode, NodeKind } from "@/lib/graph-data"

// WebGL can't render on the server, and pulling three.js into the initial
// bundle would delay first paint for no benefit.
const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), {
  ssr: false,
})

type Props = {
  highlight?: NodeKind[] | null
  framing?: GraphFraming
  /** Hero is a picture you can poke; the explorer is a tool you use. */
  showReadout?: boolean
  className?: string
}

/**
 * A contained stage for the graph, used twice on the page — once as the opening
 * image, once as the interactive explorer. It's deliberately *not* a fixed
 * full-page backdrop any more: text laid over a live 3D scene needed so heavy a
 * scrim that it turned the graph to mud, especially on phones.
 */
export function GraphStage({ highlight = null, framing = "immersive", showReadout = true, className }: Props) {
  const [hovered, setHovered] = useState<GraphNode | null>(null)
  const [pinned, setPinned] = useState<GraphNode | null>(null)

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

  const shown = pinned ?? hovered

  return (
    <div className={className}>
      <GraphCanvas
        highlight={highlight}
        framing={framing}
        onNodeFocus={setHovered}
        onNodeSelect={handleSelect}
      />

      {showReadout && shown && (
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 max-w-sm rounded-lg border border-primary/25 bg-background/90 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto">
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
          {pinned && (
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-primary/70">
              tap elsewhere or press esc to dismiss
            </p>
          )}
        </div>
      )}
    </div>
  )
}

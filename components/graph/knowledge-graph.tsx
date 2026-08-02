"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import type { GraphNode, SectionId } from "@/lib/graph-data"

// WebGL can't render on the server, and pulling three.js into the initial
// bundle would delay first paint for no benefit.
const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), {
  ssr: false,
})

export function KnowledgeGraph({ activeSection }: { activeSection: SectionId }) {
  const [hovered, setHovered] = useState<GraphNode | null>(null)
  const [pinned, setPinned] = useState<GraphNode | null>(null)

  /**
   * Clicking is the payoff of treating the graph as navigation rather than
   * decoration. Nodes that belong to a section jump the page there; the smaller
   * technology nodes have nowhere to go, so they pin their readout instead so
   * it can be read without holding the cursor still.
   */
  const handleSelect = useCallback((node: GraphNode) => {
    if (node.section) {
      setPinned(null)
      document.getElementById(node.section)?.scrollIntoView({ behavior: "smooth" })
      return
    }
    setPinned((current) => (current?.id === node.id ? null : node))
  }, [])

  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // Clear the hover too, not just the pin. The cursor is usually still
      // resting on the node that was pinned, so dropping only the pin would
      // leave the panel up and make Escape look broken.
      setPinned(null)
      setHovered(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinned])

  const shown = pinned ?? hovered

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden>
      <GraphCanvas
        activeSection={activeSection}
        onNodeFocus={setHovered}
        onNodeSelect={handleSelect}
      />

      {/* Readout panel. Styled like an instrument display rather than a
          tooltip — it's the graph explaining itself. */}
      {shown && (
        <div className="pointer-events-none absolute bottom-6 left-6 max-w-sm rounded-lg border border-primary/25 bg-background/85 p-4 backdrop-blur-md">
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
          {pinned ? (
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-primary/70">
              pinned · esc to dismiss
            </p>
          ) : (
            shown.section && (
              <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-primary/70">
                click to jump to this
              </p>
            )
          )}
        </div>
      )}
    </div>
  )
}

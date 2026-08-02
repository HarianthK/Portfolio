"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import type { GraphNode } from "@/lib/graph-data"

// WebGL can't render on the server, and pulling three.js into the initial
// bundle would delay first paint for no benefit — the graph is decorative until
// it's interactive.
const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), {
  ssr: false,
})

export function KnowledgeGraph() {
  const [focused, setFocused] = useState<GraphNode | null>(null)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <GraphCanvas onNodeFocus={setFocused} />

      {/* Readout panel. Deliberately styled like an instrument display rather
          than a tooltip — it's the graph explaining itself. */}
      {focused && (
        <div className="pointer-events-none absolute bottom-6 left-6 max-w-sm rounded-lg border border-primary/25 bg-background/85 p-4 backdrop-blur-md">
          <p className="font-mono text-[0.7rem] uppercase tracking-widest text-primary">
            {focused.kind}
          </p>
          <p className="mt-1 font-serif text-2xl leading-tight text-foreground">{focused.label}</p>
          {focused.detail && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{focused.detail}</p>
          )}
          {focused.meta && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/80">{focused.meta}</p>
          )}
        </div>
      )}
    </div>
  )
}

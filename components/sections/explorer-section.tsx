"use client"

import { useEffect, useState, type ReactNode } from "react"
import { GraphStage } from "@/components/graph/graph-stage"
import type { NodeKind } from "@/lib/graph-data"
import { useGraphPalette, type GraphPalette } from "@/lib/graph-palette"

type Family = "self" | "role" | "project" | "tech"

// Each chip carries the dot of the colour it lights, so the chips double as the legend.
const FILTERS: { label: string; kinds: NodeKind[] | null; dot?: Family }[] = [
  { label: "Everything", kinds: null },
  { label: "Where I've worked", kinds: ["self", "role", "education"], dot: "role" },
  { label: "What I built", kinds: ["self", "project", "outcome"], dot: "project" },
  { label: "What I built it with", kinds: ["self", "project", "tech"], dot: "tech" },
]

const KEY: { family: Family; label: string }[] = [
  { family: "self", label: "me" },
  { family: "role", label: "roles and schools" },
  { family: "project", label: "projects and outcomes" },
  { family: "tech", label: "tools" },
]

function Dot({ family, palette }: { family: Family; palette: GraphPalette }) {
  return <span aria-hidden className="inline-block size-2 shrink-0 rounded-full" style={{ background: palette[family] }} />
}

/**
 * The graph as a tool rather than wallpaper. Full-bleed, dark, and the only
 * place on the page where it's interactive, which is what lets every other
 * section be plain readable text.
 */
export function ExplorerSection({ fallback }: { fallback?: ReactNode }) {
  const [active, setActive] = useState(0)
  const palette = useGraphPalette()
  const [isTouch, setIsTouch] = useState(false)

  // Hover doesn't exist on touch, so the instructions shouldn't claim it does.
  // Checks pointer coarseness as well as hover, some devices report one but
  // not the other, and a narrow desktop window still has a mouse.
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches)
  }, [])

  return (
    <section id="explorer" className="relative py-20 md:py-28">
      <div className="px-6 md:px-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              <span aria-hidden className="text-primary/90">04</span> Explore
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-foreground md:text-5xl">
              The whole thing, as a graph
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Every node is a real entity from my work and every edge a relationship that actually
            exists. {isTouch ? "Drag to turn it, tap a node to read it." : "Drag to orbit, hover a node to read it, click to pin."}
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-2">
          {FILTERS.map((filter, i) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-xs transition-colors ${
                active === i
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter.dot && <Dot family={filter.dot} palette={palette} />}
              {filter.label}
            </button>
          ))}
        </div>
        <p className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
          {KEY.map((item) => (
            <span key={item.family} className="inline-flex items-center gap-2">
              <Dot family={item.family} palette={palette} />
              {item.label}
            </span>
          ))}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] px-6 md:px-14">
        <GraphStage
          highlight={FILTERS[active].kinds}
          framing="comfortable"
          fallback={fallback}
          tapToLoad
          className="relative h-[min(60vh,115vw)] min-h-[22rem] overflow-hidden md:h-[70vh] md:min-h-[26rem] rounded-xl border border-border bg-muted/20"
        />
      </div>
    </section>
  )
}

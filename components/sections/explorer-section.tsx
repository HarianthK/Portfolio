"use client"

import { useEffect, useState } from "react"
import { GraphStage } from "@/components/graph/graph-stage"
import type { NodeKind } from "@/lib/graph-data"

const FILTERS: { label: string; kinds: NodeKind[] | null }[] = [
  { label: "Everything", kinds: null },
  { label: "Where I've worked", kinds: ["self", "role", "education"] },
  { label: "What I built", kinds: ["self", "project", "outcome"] },
  { label: "What I built it with", kinds: ["self", "project", "tech"] },
]

/**
 * The graph as a tool rather than wallpaper. Full-bleed, dark, and the only
 * place on the page where it's interactive — which is what lets every other
 * section be plain readable text.
 */
export function ExplorerSection() {
  const [active, setActive] = useState(0)
  const [isTouch, setIsTouch] = useState(false)

  // Hover doesn't exist on touch, so the instructions shouldn't claim it does.
  // Checks pointer coarseness as well as hover — some devices report one but
  // not the other, and a narrow desktop window still has a mouse.
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches)
  }, [])

  return (
    <section id="explorer" className="relative bg-[#0a0704] py-20 md:py-28">
      <div className="px-6 md:px-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#f0b429]">
              <span className="text-[#f0b429]/50">03</span> Explore
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-[#f6efe4] md:text-5xl">
              The whole thing, as a graph
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#f6efe4]/60">
            Every node is a real entity from my work and every edge a relationship that actually
            exists. {isTouch ? "Drag to turn it, tap a node to read it." : "Drag to orbit, hover a node to read it, click to pin."}
          </p>
        </div>

        {/* Filters double as a legend — they name what the colours mean. */}
        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-2">
          {FILTERS.map((filter, i) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                active === i
                  ? "border-[#f0b429] bg-[#f0b429]/15 text-[#f0b429]"
                  : "border-[#f6efe4]/20 text-[#f6efe4]/60 hover:border-[#f6efe4]/40 hover:text-[#f6efe4]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] px-6 md:px-14">
        <GraphStage
          highlight={FILTERS[active].kinds}
          framing="comfortable"
          className="relative h-[70vh] min-h-[26rem] overflow-hidden rounded-xl border border-[#f6efe4]/10 bg-[#080603]"
        />
      </div>
    </section>
  )
}

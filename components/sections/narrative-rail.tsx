"use client"

import { useEffect, useRef, useState } from "react"
import { GraphStage } from "@/components/graph/graph-stage"
import { BuiltSection } from "@/components/sections/built-section"
import { FoundationsSection } from "@/components/sections/foundations-section"
import { NowSection } from "@/components/sections/now-section"
import type { NodeKind, SectionId } from "@/lib/graph-data"
import { useActiveSection } from "@/lib/use-active-section"
import { cn } from "@/lib/utils"

/** Blocks the camera tracks, in the order they're read. */
const TRACKED: SectionId[] = ["now", "work", "foundations"]

const FILTERS: { label: string; kinds: NodeKind[] | null }[] = [
  { label: "Everything", kinds: null },
  { label: "Where I've worked", kinds: ["self", "role", "education"] },
  { label: "What I built", kinds: ["self", "project", "outcome"] },
  { label: "What I built it with", kinds: ["self", "project", "tech"] },
]

/**
 * The middle of the page: the writing runs down the left, and the graph holds
 * the right, flying its camera to whichever section is being read. At the end
 * it unpins, takes the full width, and becomes something you can grab.
 *
 * Two problems solved at once. Roughly 600px of both margins used to sit empty
 * while the one distinctive thing on the site was parked between sections —
 * so the graph moves into the margin and gets to be the thing that moves.
 *
 * The panel is `fixed` rather than `sticky`. Sticky inside a grid can't change
 * its width when the explorer arrives without disturbing the column it lives
 * in; fixed is independent of the flow, so docking and expanding is one class.
 */
export function NarrativeRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const explorerRef = useRef<HTMLDivElement>(null)

  const [inRail, setInRail] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState(0)
  const [isTouch, setIsTouch] = useState(false)
  const [isNarrow, setIsNarrow] = useState(true)

  const tracked = useActiveSection(TRACKED)

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches)
  }, [])

  /*
    Which of the two stages to *mount*, rather than hiding one with CSS. A
    hidden canvas is still a live WebGL context holding its own copy of the
    geometry, and both were being created on every desktop load — one of them
    purely so it could be display:none.

    Starts narrow so the first paint is the cheap one, then corrects on mount.
  */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023.98px)")
    const sync = () => setIsNarrow(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  /*
    When the panel is on duty.

    Measured against the viewport rather than left to `IntersectionObserver`'s
    "is any part of it visible". The panel is `fixed`, so it covers the whole
    screen whether or not the rail does — with a plain observer it stayed lit
    past the end of the rail and the graph showed through the contact section.
    Here it's on only while the rail still occupies the middle of the screen.
  */
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const rail = railRef.current?.getBoundingClientRect()
      const explorer = explorerRef.current?.getBoundingClientRect()
      const vh = window.innerHeight

      if (rail) setInRail(rail.bottom > vh * 0.3 && rail.top < vh * 0.7)

      // Expands only once the explorer block properly owns the screen, so the
      // graph doesn't unpin while the last of the writing is still being read.
      if (explorer) setExpanded(explorer.top < vh * 0.5 && explorer.bottom > vh * 0.5)
    }

    const onScroll = () => {
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
  }, [isNarrow])

  return (
    <div ref={railRef} className="relative">
      {/* The panel. Not mounted below lg — there's no room for a split, and
          phones get the graph inline in the explorer block instead.

          Only the opacity is transitioned. `left` snaps, because animating it
          resizes the drawing buffer on every frame of the transition — at this
          resolution that's a 3800px-wide reallocation forty times over. The
          camera's damped re-frame covers the cut. */}
      {!isNarrow && (
        <div
          className={cn(
            "pointer-events-none fixed inset-y-0 right-0 z-0 transition-opacity duration-500 ease-out",
            expanded ? "left-0" : "left-[54%]",
            inRail ? "opacity-100" : "opacity-0",
          )}
        >
          <GraphStage
            // Filter chips take over once it's expanded; until then the camera
            // is driven by whatever section is being read.
            focus={expanded ? null : tracked}
            highlight={expanded ? FILTERS[filter].kinds : null}
            framing="comfortable"
            showReadout={expanded}
            interactive={expanded}
            active={inRail}
            className="pointer-events-auto relative h-full w-full"
          />
        </div>
      )}

      {/* The writing. Sits above the panel and is inset from it while docked. */}
      <div className="relative z-10 px-6 md:px-14 lg:pr-[50%]">
        <NowSection />
        <BuiltSection />
        <FoundationsSection />
      </div>

      {/* The explorer. The panel expands to fill the width behind this, so on
          desktop the block is mostly a heading, some chips and a tall space. */}
      {/* Transparent to the pointer as a whole: this block sits above the panel
          so its heading stays readable, but the tall reserved area below the
          chips would otherwise intercept every hover meant for the graph. Only
          the parts that need clicking take them back. */}
      <div
        ref={explorerRef}
        id="explorer"
        className="pointer-events-none relative z-10 pb-24 pt-10 md:pb-32"
      >
        <div className="pointer-events-auto px-6 md:px-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <span className="text-primary/50">05</span> Explore
          </p>
          <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-foreground md:text-5xl">
            The whole thing, as a graph
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Every node is a real entity from my work and every edge a relationship that actually
            exists.{" "}
            {isTouch ? "Drag to turn it, tap a node to read it." : "Drag to orbit, hover a node to read it, click to pin."}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setFilter(i)}
                aria-pressed={filter === i}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
                  filter === i
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop reserves height for the expanded panel behind it. Phones get
            their own inline stage, since the fixed panel never renders there. */}
        {isNarrow ? (
          <div className="pointer-events-auto mt-8 px-6">
            <GraphStage
              highlight={FILTERS[filter].kinds}
              framing="comfortable"
              className="relative h-[60vh] min-h-88 overflow-hidden rounded-xl border border-border bg-muted/20"
            />
          </div>
        ) : (
          <div className="mt-8 h-[78vh]" aria-hidden />
        )}
      </div>
    </div>
  )
}

import { GraphStage } from "@/components/graph/graph-stage"

/**
 * The graph gets the top of the page to itself and the words sit underneath it
 * in their own band. Nothing is laid over the canvas, so no scrim is needed and
 * nothing has to be dimmed to stay readable.
 */
export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col">
      <div className="relative flex-1 overflow-hidden">
        <GraphStage framing="immersive" />

        {/* Fades the canvas into the band below so the join isn't a hard edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>

      <div className="relative px-6 pb-14 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              AI Engineer · Phoenix, Arizona
            </p>
            <h1 className="mt-4 font-serif text-6xl leading-[0.9] text-foreground md:text-8xl">
              Harianth Kalavala
            </h1>
          </div>

          <p className="max-w-sm text-base leading-relaxed text-muted-foreground lg:text-right">
            I build retrieval systems that turn unstructured data into something production can
            depend on. Above is my own work, modelled as the kind of graph I build for a living.
          </p>
        </div>
      </div>
    </section>
  )
}

import { GraphStage } from "@/components/graph/graph-stage"
import { StaticGraph } from "@/components/graph/static-graph"
import { LINKS } from "@/components/sections/contact-section"

// Graph and words never overlap, so no scrim: stacked on phones, side by side from lg. See DOCS.md.
export function HeroSection() {
  return (
    <section
      id="hero"
      className="@container relative flex min-h-screen flex-col lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="relative min-h-[50vh] flex-1 overflow-hidden lg:order-2 lg:min-h-screen">
        <GraphStage
          framing="immersive"
          tapToLoad
          fallback={<StaticGraph labels />}
          // Clear of the fixed corner controls on phones.
          className="absolute inset-x-0 bottom-0 top-16 lg:top-0"
        />

        {/* Fades the canvas into the band below so the join isn't a hard edge.
            Sits below the readout panel: as a later sibling it was painting
            over the panel, washing out the bottom of it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 lg:hidden"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>

      {/* Centred on the graph's middle, and from lg on the same left edge as every section below. */}
      <div className="relative px-6 pb-14 md:px-14 lg:order-1 lg:flex lg:flex-col lg:justify-center lg:pb-0 lg:pr-0 lg:pl-[max(3.5rem,calc((100cqw-72rem)/2))]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          AI Engineer · Phoenix, Arizona
        </p>
        <h1 className="mt-4 font-serif text-6xl leading-[0.9] text-foreground md:text-8xl">
          Harianth Kalavala
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 md:text-xl">
          I build retrieval and knowledge-graph systems that production can depend on, at XNode AI.
          The picture is my own work, modelled as the kind of graph I build for a living.
        </p>
        {/* The ways to act, up where a recruiter lands rather than only at the bottom. */}
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`inline-flex min-h-11 items-center border-b transition-colors ${
                  link.label === "Résumé"
                    ? "border-primary/40 text-primary hover:border-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {link.label.includes("@") ? "Email" : link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

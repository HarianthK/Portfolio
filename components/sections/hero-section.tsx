import { GraphStage } from "@/components/graph/graph-stage"
import { LINKS } from "@/components/sections/contact-section"

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

        {/* Fades the canvas into the band below so the join isn't a hard edge.
            Sits below the readout panel: as a later sibling it was painting
            over the panel, washing out the bottom of it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>

      <div className="relative px-6 pb-14 md:px-14">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          AI Engineer · Phoenix, Arizona
        </p>
        <h1 className="mt-4 font-serif text-6xl leading-[0.9] text-foreground md:text-8xl">
          Harianth Kalavala
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 md:text-xl">
          I build retrieval and knowledge-graph systems that production can depend on, at XNode AI.
          Above is my own work, modelled as the kind of graph I build for a living.
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

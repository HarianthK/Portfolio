import { GraphStage } from "@/components/graph/graph-stage"
import { StaticGraph } from "@/components/graph/static-graph"
import { LINKS } from "@/components/sections/contact-section"

// Both are stated in full further down the page. See DOCS.md.
const FACTS = [
  { term: "Now", value: "AI Engineer at XNode AI", detail: "06/2025 – Present · Remote" },
  { term: "Education", value: "M.S. Information Technology, ASU", detail: "GPA 4.0 / 4.0 · May 2025" },
]

const href = (label: string) => LINKS.find((link) => link.label.includes(label))!.href

// Words first, graph beside them from lg and under them on phones. They never overlap. See DOCS.md.
export function HeroSection() {
  return (
    <section
      id="hero"
      className="@container relative flex flex-col pt-14 lg:grid lg:min-h-svh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      {/* From lg on the same left edge as every section below. */}
      <div className="relative flex flex-col justify-center px-6 pb-10 pt-12 md:px-14 lg:py-16 lg:pr-0 lg:pl-[max(3.5rem,calc((100cqw-72rem)/2))]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary min-[380px]:tracking-[0.3em]">
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
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={href("@")}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href={href("Résumé")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Résumé
          </a>
          <div className="flex basis-full gap-6 sm:basis-auto">
            {["GitHub", "LinkedIn"].map((label) => (
              <a
                key={label}
                href={href(label)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-mono text-sm text-muted-foreground underline decoration-border underline-offset-8 transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <dl className="mt-10 grid max-w-xl gap-x-8 gap-y-6 border-t border-border pt-6 sm:grid-cols-2">
          {FACTS.map((fact) => (
            <div key={fact.term}>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{fact.term}</dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-foreground">{fact.value}</dd>
              <dd className="mt-1 font-mono text-xs text-muted-foreground">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative h-[52svh] min-h-80 overflow-hidden lg:h-auto">
        <GraphStage
          framing="immersive"
          tapToLoad
          fallback={<StaticGraph labels />}
          className="absolute inset-0"
        />
        {/* Fades the canvas into the next section; the readout panel sits above it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 lg:hidden"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>
    </section>
  )
}

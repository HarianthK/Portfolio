import { GraphStage } from "@/components/graph/graph-stage"
import { links } from "@/lib/site"

// Each of these is stated in full further down the page. See DOCS.md.
const FACTS = [
  { term: "Now", value: "AI Engineer at XNode AI", detail: "06/2025 – Present · Remote" },
  { term: "Education", value: "M.S. Information Technology, ASU", detail: "GPA 4.0 / 4.0 · May 2025" },
  { term: "Open source", value: "33 pull requests upstream", detail: "Thirteen merged so far" },
]

// Words first, graph beside them on wide screens and under them on phones.
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative grid pt-14 lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-12 md:px-14 lg:py-16 lg:pr-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          AI Engineer · Phoenix, Arizona
        </p>
        <h1 className="mt-5 font-serif text-6xl leading-[0.95] text-foreground md:text-7xl xl:text-8xl">
          Harianth Kalavala
        </h1>

        <p className="mt-7 max-w-xl text-xl leading-snug text-foreground md:text-2xl">
          I build retrieval systems and knowledge graphs that turn unstructured data into something
          production can depend on.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={links.email}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Résumé
          </a>
          <div className="flex basis-full gap-6 sm:basis-auto">
            {[
              { label: "GitHub", href: links.github },
              { label: "LinkedIn", href: links.linkedin },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-border py-1 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <dl className="mt-12 grid max-w-2xl gap-x-8 gap-y-6 border-t border-border pt-6 sm:grid-cols-3">
          {FACTS.map((fact) => (
            <div key={fact.term}>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                {fact.term}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-foreground">{fact.value}</dd>
              <dd className="mt-1 font-mono text-xs text-muted-foreground">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative h-[52svh] min-h-80 overflow-hidden lg:h-auto">
        <GraphStage framing="immersive" />
        {/* Fades the canvas into the page so it has no hard edge. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent lg:inset-y-0 lg:right-auto lg:h-auto lg:w-40 lg:bg-linear-to-r" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-linear-to-t from-background to-transparent" />
        <p className="pointer-events-none absolute inset-x-6 bottom-4 z-10 font-mono text-xs text-muted-foreground lg:bottom-8 lg:right-14 lg:text-right">
          My own work, modelled as the kind of graph I build for a living.
        </p>
      </div>
    </section>
  )
}

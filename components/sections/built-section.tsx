import { FigureBlock } from "@/components/figure-block"
import { cn } from "@/lib/utils"

type Project = {
  name: string
  summary: string
  stack: string[]
  href: string
  hrefLabel: string
  figure?: { value: string; label: string; context: string }
}

const PROJECTS: Project[] = [
  {
    name: "LangGraph Agentic Platform",
    summary:
      "A multi-agent system for supply chain resilience: real-time news analytics, geospatial risk scoring, and automated alerting. I designed the orchestration layer — state management, tool routing, memory, and the LLM decision loops.",
    stack: ["LangGraph", "LangChain", "Python", "LLMs"],
    href: "https://github.com/HarianthK/Langgraph-agent-automation",
    hrefLabel: "View code",
    figure: {
      value: "~60%",
      label: "Less manual monitoring",
      context: "Agent orchestration replacing hand-watched supply-chain signals.",
    },
  },
  {
    /*
      Rewritten to describe the thing that actually loads.

      The previous version claimed authentication, time-series performance
      tracking and real-time updates. Opening the site shows a public search
      with no sign-in, and nothing pushing live updates. A hiring manager who
      reads a feature list and then clicks through to something else is being
      handed a reason to doubt everything around it — and the site's whole
      argument rests on its claims being checkable.

      What is here is verifiable by using it: type-ahead search, points totalled
      per division, competition history, and eligibility. Both endpoints named
      below are real — /api/autocomplete and /api/dancer.
    */
    name: "Registry Points",
    summary:
      "A lookup over the World Swing Dance Council's competitor registry. Type part of a name and it finds the dancer, then returns their points by division, how close they are to moving up, a chart of their competitions over time, and a comparison against other dancers on the same axis. Lookups take about a seventh of a second: the original asked the registry for a session token first, and nothing ever checked it.",
    stack: ["Next.js", "React", "REST APIs", "Vercel"],
    href: "https://registry-points.vercel.app",
    hrefLabel: "Visit site",
    figure: {
      value: "10",
      label: "Dependencies, down from 53",
      context: "Twenty-eight Radix packages removed for components that are a few lines of markup.",
    },
  },
  {
    /*
      The scoring is the part worth describing. Anyone can draw a line between
      two points; deciding which line is prettier is the actual work, and it is
      checkable against the roads Arizona has already designated as scenic.
    */
    name: "Trailblaze AZ",
    summary:
      "A route planner that picks the pretty way instead of the quick one. Every drivable road in Arizona is scored for how close it runs to woodland, wilderness and water, then checked against the roads the state has officially designated scenic. Ask it for Phoenix to Sedona and it sends you over the Mogollon Rim rather than up the interstate, shows the climb that explains the extra two hours, and works out when to leave to arrive in golden hour.",
    stack: ["Next.js", "OSRM", "OpenStreetMap", "Python", "MapLibre"],
    href: "https://trailblaze-az.vercel.app",
    hrefLabel: "Visit site",
    figure: {
      value: "931,043",
      label: "Roads scored",
      context: "Every drivable way in Arizona, rated against the state's own designated byways.",
    },
  },
  {
    // Coverage is the claim worth making: an emulator that runs most programs is
    // one with a bug it has not met yet, so the figure is the whole archive.
    name: "CHIP-8",
    summary:
      "A virtual machine from 1977, rebuilt from its instruction set and running in a browser, with both of the extensions people later built on it: SUPER-CHIP's larger screen and scrolling, and XO-CHIP's second colour plane, sixty four kilobytes of memory and waveform sound. Every one of the 103 programs in the community archive runs, fetched when you pick one from the list. No dependencies and no build step: a page, a script and a file.",
    stack: ["JavaScript", "Canvas", "Web Audio"],
    href: "https://harianthk.github.io/chip8/",
    hrefLabel: "Play it",
    figure: {
      value: "103/103",
      label: "Programs in the archive",
      context: "Each is run headlessly to confirm it draws and answers a key, over a published instruction suite.",
    },
  },
]

/**
 * An asymmetric stack rather than a grid of equal cards — the card grid is
 * exactly the shape the template version used, and it flattens everything to
 * the same importance.
 */
export function BuiltSection() {
  return (
    <section id="built" className="relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-primary/50">04</span> Built
        </p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Outside the day job
        </h2>

        <div className="mt-16 space-y-20">
          {PROJECTS.map((project, i) => {
            const hasFigure = Boolean(project.figure)
            // Alternate which side the figure sits on so the eye keeps moving.
            // Only meaningful when there *is* a figure — otherwise the article
            // is a single full-width column rather than a grid with an empty
            // cell, which previously squeezed the text into 16rem.
            const figureLeft = hasFigure && i % 2 === 1

            return (
            <article
              key={project.name}
              className={cn(
                "border-t border-border pt-10",
                hasFigure && "grid gap-8 md:gap-14",
                hasFigure &&
                  (figureLeft
                    ? "md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
                    : "md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]"),
              )}
            >
              <div className={cn(figureLeft && "md:order-2")}>
                <h3 className="font-serif text-3xl leading-tight text-foreground">
                  {project.name}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((item) => (
                    <li key={item} className="font-mono text-xs text-muted-foreground/70">
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-block border-b border-primary/40 pb-0.5 font-mono text-xs text-primary transition-colors hover:border-primary"
                >
                  {project.hrefLabel} →
                </a>
              </div>

              {project.figure && (
                <div className={cn(figureLeft && "md:order-1")}>
                  <FigureBlock {...project.figure} />
                </div>
              )}
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
      "A multi-agent system for supply chain resilience: real-time news analytics, geospatial risk scoring, and automated alerting. I designed the orchestration layer: state management, tool routing, memory, and the LLM decision loops.",
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
    // Describes what actually loads, because a claim that does not survive a
    // click costs you every other claim on the page. See DOCS.md.
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
    // The scoring is the part worth describing, and it is checkable against the
    // roads the state already calls scenic.
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
    // Worth building only because the machine under it was already proven.
    name: "Nibble",
    summary:
      "A small language that compiles to CHIP-8 machine code, written for the emulator below. Variables, sprites, routines, collisions, numbers and text: press compile and play it, with the real output shown as bytes under the screen. Meteors, a dodging game with a score, three lives and a proper ending, comes to 504 of them. Three passes in one file and no dependencies, with jumps left blank and filled in once their addresses are known.",
    stack: ["JavaScript", "Compilers", "Canvas"],
    href: "https://nibble-lang.vercel.app",
    hrefLabel: "Write a program",
    figure: {
      value: "61",
      label: "Bytes from a dozen lines",
      context: "Every test compiles a program and runs it on the machine. Each example must also come out identical under the six instructions interpreters disagree about.",
    },
  },
  {
    // The figure is the bug it was hiding, not the coverage. See DOCS.md.
    name: "CHIP-8",
    summary:
      "A virtual machine from 1977, rebuilt from its instruction set and running in a browser, with both of the extensions people later built on it: SUPER-CHIP's larger screen and scrolling, and XO-CHIP's second colour plane, sixty four kilobytes of memory and waveform sound. Every program in the community archive runs, and because none of them record how they are played, the page works out which keys each one watches by playing it. It is also the machine Nibble compiles for.",
    stack: ["JavaScript", "Canvas", "Web Audio"],
    href: "https://harianthk.github.io/chip8/",
    hrefLabel: "Play it",
    figure: {
      value: "86",
      label: "Programs quietly running wrong",
      context: "Six instructions have two accepted readings, and the archive records which each program expects. It had been ignoring that. It reads them now.",
    },
  },
]

// An asymmetric stack rather than a grid of equal cards, which would flatten
// everything to the same importance. See DOCS.md.
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
            // Alternate the figure's side so the eye keeps moving, but only when
            // there is one, or the text gets squeezed into an empty grid cell.
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

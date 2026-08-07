import { FigureBlock } from "@/components/figure-block"

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
    name: "Registry Points",
    summary:
      "A full-stack data application with authentication, time-series performance tracking, and interactive visualisation, backed by a REST API with flexible querying and real-time updates.",
    stack: ["React", "Next.js", "REST APIs", "Vercel"],
    href: "https://registry-points.vercel.app",
    hrefLabel: "Visit site",
  },
]

/**
 * A stack rather than a grid of equal cards — the card grid is exactly the
 * shape the template version used, and it flattens everything to the same
 * importance.
 *
 * The DOM id is `work` rather than `built` so it matches the `SectionId` the
 * graph nodes are tagged with; the rail looks these up by id to know which
 * cluster to fly the camera to.
 */
export function BuiltSection() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        <span className="text-primary/50">03</span> Built
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
        Outside the day job
      </h2>

      <div className="mt-14 space-y-16">
        {PROJECTS.map((project) => (
          <article key={project.name} className="border-t border-border pt-10">
            <h3 className="font-serif text-3xl leading-tight text-foreground">{project.name}</h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
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

            {project.figure && (
              <div className="mt-10 max-w-xs">
                <FigureBlock {...project.figure} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

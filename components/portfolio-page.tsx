"use client"

import { useMemo } from "react"
import { KnowledgeGraph } from "@/components/graph/knowledge-graph"
import { useActiveSection } from "@/lib/use-active-section"
import type { SectionId } from "@/lib/graph-data"

const SECTION_ORDER: SectionId[] = ["hero", "now", "work", "foundations", "contact"]

function SectionHeading({ index, label }: { index: string; label: string }) {
  return (
    <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-primary">
      <span className="text-primary/50">{index}</span> {label}
    </p>
  )
}

export function PortfolioPage() {
  const sectionIds = useMemo(() => SECTION_ORDER, [])
  const activeSection = useActiveSection(sectionIds)

  return (
    <>
      <KnowledgeGraph activeSection={activeSection} />

      {/* Scrim: the written column sits over a live 3D scene, so it needs a
          readable ground without hiding the graph entirely. */}
      <div
        className="pointer-events-none fixed inset-0 hidden lg:block"
        aria-hidden
        style={{
          background:
            "linear-gradient(to right, var(--background) 0%, color-mix(in oklch, var(--background) 88%, transparent) 34%, transparent 58%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 lg:hidden"
        aria-hidden
        style={{ background: "color-mix(in oklch, var(--background) 82%, transparent)" }}
      />

      {/* The sections are full-height blocks stacked over the canvas, so left as
          they were they'd swallow every mouse event and the graph couldn't be
          dragged. Pointer events are switched off here and re-enabled only on
          the text columns themselves. */}
      <main className="pointer-events-none relative">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section id="hero" className="flex min-h-screen items-center px-6 md:px-14">
          <div className="pointer-events-auto max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              AI Engineer · Phoenix, AZ
            </p>
            <h1 className="mt-6 font-serif text-6xl leading-[0.92] text-foreground md:text-8xl">
              Harianth
              <br />
              Kalavala
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              I build retrieval systems that turn unstructured data into something production can
              depend on — knowledge graphs, RAG pipelines, and the ingestion work underneath them.
            </p>
            <p className="mt-6 max-w-md border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground/85">
              What you&apos;re looking at is my career modelled as one of those graphs. Every node is
              real, every edge is a relationship that actually exists.
            </p>
            <p className="mt-8 font-mono text-xs text-muted-foreground/60">
              drag to orbit · hover a node · scroll to follow the thread
            </p>
          </div>
        </section>

        {/* ── Now ────────────────────────────────────────────────────────── */}
        <section id="now" className="flex min-h-screen items-center px-6 md:px-14">
          <div className="pointer-events-auto max-w-xl">
            <SectionHeading index="01" label="Now" />
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
              AI Engineer at XNode AI
            </h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground/70">
              06/2025 – Present · Remote
            </p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                I architected an enterprise information catalog that unifies metadata across
                PostgreSQL and five other sources, making discovery and lineage tracking possible
                across more than 100,000 data assets. The unglamorous half is the ingestion,
                validation, and indexing underneath it, running at 99%+ uptime behind CI/CD and
                production monitoring.
              </p>
            </div>

            {/* The decision, given its own weight. This is the part that
                separates having used the tools from having chosen between them. */}
            <div className="mt-12 border-l-2 border-primary/40 pl-6">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                The call that mattered
              </p>
              <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground">
                When similarity isn&apos;t enough
              </h3>

              <div className="mt-5 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Vector retrieval is excellent at finding what a document says. Preserving how
                  things relate to each other is a different problem: chunking optimises for
                  semantic similarity, and a relationship spanning several chunks doesn&apos;t
                  survive that split intact. Adding more context doesn&apos;t recover it, because
                  the structure is gone before the model ever sees it.
                </p>
                <p className="text-foreground">
                  That&apos;s not a flaw in RAG so much as a question it was never shaped to answer.
                  So for relational queries I stopped asking retrieval to infer connections and
                  modelled them directly — entity and relationship extraction into Neo4j and
                  Graphiti, running alongside the vector layer rather than replacing it.
                </p>
                <p>
                  That cut contextual search time by roughly 35%, though the more useful headline is
                  the trade. Building a graph with correct relations costs a significant number of
                  tokens up front: you pay once at ingestion instead of paying again at every query.
                  It earns that back only if the system answers enough relational questions to
                  justify it — which is exactly the bet worth checking before you make it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Work ───────────────────────────────────────────────────────── */}
        <section id="work" className="flex min-h-screen items-center px-6 md:px-14">
          <div className="pointer-events-auto max-w-xl">
            <SectionHeading index="02" label="Built" />
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Things I&apos;ve made outside the day job
            </h2>

            <div className="mt-10 space-y-10">
              <article>
                <h3 className="font-serif text-2xl text-foreground">LangGraph Agentic Platform</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  A multi-agent system for supply chain resilience: real-time news analytics,
                  geospatial risk scoring, and automated alerting. I designed the whole orchestration
                  layer — state management, tool routing, memory, and the LLM decision loops.
                </p>
                <p className="mt-3 font-mono text-xs text-primary">
                  ~60% less manual monitoring effort
                </p>
                <a
                  href="https://github.com/HarianthK/Langgraph-agent-automation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block border-b border-primary/40 pb-0.5 font-mono text-xs text-primary transition-colors hover:border-primary"
                >
                  View code →
                </a>
              </article>

              <article>
                <h3 className="font-serif text-2xl text-foreground">Registry Points</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  A full-stack data application with authentication, time-series performance
                  tracking, and interactive visualisation, backed by a REST API with flexible
                  querying and real-time updates.
                </p>
                <a
                  href="https://registry-points.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block border-b border-primary/40 pb-0.5 font-mono text-xs text-primary transition-colors hover:border-primary"
                >
                  Visit site →
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* ── Foundations ────────────────────────────────────────────────── */}
        <section id="foundations" className="flex min-h-screen items-center px-6 md:px-14">
          <div className="pointer-events-auto max-w-xl">
            <SectionHeading index="03" label="Foundations" />
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Where the data instincts came from
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                For eighteen months I was the data and operations analyst for ASU&apos;s library
                systems — a 2.5 million item physical and digital repository, one of the largest
                university collections in the US. Keeping metadata accurate at that scale is where I
                learned what actually breaks in retrieval.
              </p>
              <p>
                I built the archival inventory and reporting system that indexes 9,500+ records,
                which lifted operational visibility by 40%, and wrote the Python and SQL automation
                that cut record duplication by 20%. It earned second place for the Tomalee Doan
                LibAid Award in Fall 2024.
              </p>
              <p>
                Before that: a software engineering internship at Idori in Boston, where analysing
                interaction data drove three feature changes and a 54% lift in engagement.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-border/60 pt-8 sm:grid-cols-2">
              <div>
                <dt className="font-serif text-lg text-foreground">Arizona State University</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  M.S. Information Technology (STEM)
                </dd>
                <dd className="mt-1 font-mono text-xs text-primary">GPA 4.0 / 4.0 · May 2025</dd>
              </div>
              <div>
                <dt className="font-serif text-lg text-foreground">Neil Gogte Institute</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  B.E. Computer Science &amp; Engineering
                </dd>
                <dd className="mt-1 font-mono text-xs text-primary">GPA 8.2 / 10 · Jun 2023</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <section id="contact" className="flex min-h-[70vh] items-center px-6 pb-24 md:px-14">
          <div className="pointer-events-auto max-w-xl">
            <SectionHeading index="04" label="Contact" />
            <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Open to AI engineering roles
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              If you&apos;re building retrieval systems that have to hold up in production, I&apos;d
              like to hear about it.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
              <a
                href="mailto:hkalaval@asu.edu"
                className="border-b border-primary/40 pb-0.5 text-primary transition-colors hover:border-primary"
              >
                hkalaval@asu.edu
              </a>
              <a
                href="https://github.com/HarianthK"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-border pb-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/harianthk/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-border pb-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-border pb-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                Résumé
              </a>
            </div>

            <p className="mt-16 font-mono text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Harianth Kalavala
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

import { ChunkVsGraphDiagram } from "@/components/chunk-vs-graph-diagram"
import { FigureBlock } from "@/components/figure-block"

/**
 * Asymmetric on purpose: a narrow left rail carrying the role and its numbers,
 * and a wide right column carrying the decision. The decision is the part
 * hiring teams actually read, so it gets the space.
 */
export function NowSection() {
  return (
    <section id="now" className="section-grid relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-primary/50">02</span> Now
        </p>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          {/* Left rail — who, where, and the numbers */}
          <div>
            <h2 className="font-serif text-4xl leading-tight text-foreground">
              AI Engineer at XNode AI
            </h2>
            <p className="mt-3 font-mono text-xs text-muted-foreground/70">
              06/2025 – Present · Remote
            </p>

            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              I architected an enterprise information catalog unifying metadata across PostgreSQL
              and five other sources, and the ingestion, validation and indexing that keeps it fed.
            </p>

            <div className="mt-12 space-y-10">
              <FigureBlock
                value="100K+"
                label="Data assets"
                context="Discoverable and lineage-tracked through the catalog."
              />
              <FigureBlock
                value="99%+"
                label="Pipeline uptime"
                context="Ingestion and indexing in production, behind CI/CD and monitoring."
              />
            </div>
          </div>

          {/* Right column — the decision */}
          <div className="lg:pt-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              The call that mattered
            </p>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
              When similarity isn&apos;t enough
            </h3>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Vector retrieval is excellent at finding what a document says. Preserving how things
                relate to each other is a different problem: chunking optimises for semantic
                similarity, and a relationship spanning several chunks doesn&apos;t survive that
                split intact. Adding more context doesn&apos;t recover it, because the structure is
                gone before the model ever sees it.
              </p>
            </div>

            <ChunkVsGraphDiagram className="my-10" />

            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="text-foreground">
                That&apos;s not a flaw in RAG so much as a question it was never shaped to answer.
                So for relational queries I stopped asking retrieval to infer connections and
                modelled them directly — entity and relationship extraction into Neo4j and Graphiti,
                running alongside the vector layer rather than replacing it.
              </p>
              <p>
                Building a graph with correct relations costs a significant number of tokens up
                front: you pay once at ingestion instead of paying again at every query. It earns
                that back only if the system answers enough relational questions to justify it —
                which is exactly the bet worth checking before you make it.
              </p>
            </div>

            <div className="mt-12 max-w-xs">
              <FigureBlock
                value="~35%"
                label="Faster contextual search"
                context="After modelling relationships explicitly rather than inferring them."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

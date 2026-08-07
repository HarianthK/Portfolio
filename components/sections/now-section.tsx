import { ChunkVsGraphDiagram } from "@/components/chunk-vs-graph-diagram"
import { FigureBlock } from "@/components/figure-block"

/**
 * Runs as a single column now: it sits in the left half of the narrative rail,
 * with the graph holding the other half and flying to this section's cluster as
 * you read. The old two-column split assumed the full page width and would
 * squeeze to nothing inside the rail.
 *
 * The numbers still break out to the side wherever there's room for them.
 */
export function NowSection() {
  return (
    <section id="now" className="section-grid relative py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        <span className="text-primary/50">02</span> Now
      </p>

      <h2 className="mt-8 font-serif text-4xl leading-tight text-foreground md:text-5xl">
        AI Engineer at XNode AI
      </h2>
      <p className="mt-3 font-mono text-xs text-muted-foreground/70">06/2025 – Present · Remote</p>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
        I architected an enterprise information catalog unifying metadata across PostgreSQL and five
        other sources, and the ingestion, validation and indexing that keeps it fed.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
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

      <div className="mt-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          The call that mattered
        </p>
        <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
          When similarity isn&apos;t enough
        </h3>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Vector retrieval is excellent at finding what a document says. Preserving how things
          relate to each other is a different problem: chunking optimises for semantic similarity,
          and a relationship spanning several chunks doesn&apos;t survive that split intact. Adding
          more context doesn&apos;t recover it, because the structure is gone before the model ever
          sees it.
        </p>

        <ChunkVsGraphDiagram className="my-10" />

        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p className="text-foreground">
            That&apos;s not a flaw in RAG so much as a question it was never shaped to answer. So
            for relational queries I stopped asking retrieval to infer connections and modelled them
            directly — entity and relationship extraction into Neo4j and Graphiti, running alongside
            the vector layer rather than replacing it.
          </p>
          <p>
            Building a graph with correct relations costs a significant number of tokens up front:
            you pay once at ingestion instead of paying again at every query. It earns that back
            only if the system answers enough relational questions to justify it — which is exactly
            the bet worth checking before you make it.
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
    </section>
  )
}

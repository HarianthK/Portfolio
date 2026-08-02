import { KnowledgeGraph } from "@/components/graph/knowledge-graph"

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <KnowledgeGraph />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-start gap-4 p-8 md:p-14">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          AI Engineer · Phoenix, AZ
        </p>
        <h1 className="font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
          Harianth Kalavala
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          I build retrieval systems that turn unstructured data into something production can
          depend on. This is my work, as the kind of graph I build.
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground/70">
          drag to orbit · hover a node
        </p>
      </div>
    </main>
  )
}

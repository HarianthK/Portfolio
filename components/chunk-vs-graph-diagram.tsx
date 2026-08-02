/**
 * A conceptual illustration of the retrieval problem described in the "Now"
 * section: a relationship that spans several chunks doesn't survive being split
 * for similarity search, whereas modelling it explicitly keeps it intact.
 *
 * This illustrates the *idea*, not any particular system — it is not a diagram
 * of a real architecture and shouldn't be captioned as one.
 *
 * Built as two separate SVGs in a flex container rather than one wide drawing:
 * a single 520-unit-wide viewBox shrinks to about two-thirds on a phone, which
 * took the labels down to roughly seven pixels. Stacked, each half gets the
 * full column width and stays readable.
 */

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
      {children}
    </p>
  )
}

function Footnote({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 font-mono text-xs text-muted-foreground/70">{children}</p>
}

function ChunkedPanel() {
  return (
    <div className="flex-1">
      <svg viewBox="0 0 200 180" role="img" aria-labelledby="chunked-t" className="w-full">
        <title id="chunked-t">
          Three text chunks, each holding part of a relationship, with the connections between
          them broken
        </title>

        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x={0}
              y={4 + i * 58}
              width={190}
              height={42}
              rx={5}
              className="fill-muted/40 stroke-border"
              strokeWidth={1}
            />
            {[0, 1, 2].map((line) => (
              <rect
                key={line}
                x={12}
                y={16 + i * 58 + line * 9}
                width={line === 2 ? 96 : 150}
                height={3}
                rx={1.5}
                className="fill-muted-foreground/35"
              />
            ))}
            <circle cx={168} cy={25 + i * 58} r={6} className="fill-accent" />
          </g>
        ))}

        {/* severed links between chunks */}
        {[0, 1].map((i) => (
          <g key={i}>
            <path
              d={`M168 ${31 + i * 58} L168 ${56 + i * 58}`}
              className="stroke-accent/40"
              strokeWidth={1.5}
              strokeDasharray="3 4"
            />
            <path
              d={`M162 ${40 + i * 58} l12 7 M162 ${47 + i * 58} l12 -7`}
              className="stroke-destructive"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      <Caption>Chunked for similarity</Caption>
      <Footnote>The relationship is lost in the split.</Footnote>
    </div>
  )
}

function GraphPanel() {
  return (
    <div className="flex-1">
      <svg viewBox="0 0 200 180" role="img" aria-labelledby="graph-t" className="w-full">
        <title id="graph-t">
          The same entities stored as nodes joined by labelled edges, so the relationship survives
        </title>

        {/* edges first so nodes sit on top */}
        <path d="M46 40 L156 74" className="stroke-primary/55" strokeWidth={1.8} />
        <path d="M156 74 L60 146" className="stroke-primary/55" strokeWidth={1.8} />
        <path d="M46 40 L60 146" className="stroke-primary/30" strokeWidth={1.8} />

        {[
          { cx: 46, cy: 40 },
          { cx: 156, cy: 74 },
          { cx: 60, cy: 146 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r={15} className="fill-primary/15" />
            <circle cx={n.cx} cy={n.cy} r={8} className="fill-primary" />
          </g>
        ))}

        {/* the edge labels are the part chunking throws away */}
        <text x="96" y="50" className="fill-muted-foreground font-mono" style={{ fontSize: 11 }}>
          built_with
        </text>
        <text x="104" y="124" className="fill-muted-foreground font-mono" style={{ fontSize: 11 }}>
          produced
        </text>
      </svg>

      <Caption>Modelled explicitly</Caption>
      <Footnote>The relationship is the data.</Footnote>
    </div>
  )
}

export function ChunkVsGraphDiagram({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
        <ChunkedPanel />
        <GraphPanel />
      </div>
    </figure>
  )
}

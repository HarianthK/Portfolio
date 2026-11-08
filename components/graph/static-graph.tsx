import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force-3d"
import { CHIP, findSpot, overlaps, type Box, type Side } from "@/components/graph/graph-labels"
import { HERO_LABELS, NODE_FAMILY, NODE_SIZE, links, nodes, type NodeKind } from "@/lib/graph-data"

// The same graph laid out once on the server, for phones and as the loading picture. See DOCS.md.
type Point = { id: string; kind: NodeKind; label: string; x: number; y: number }

const FILL: Record<string, string> = {
  self: "var(--foreground)",
  role: "var(--node-role)",
  project: "var(--node-project)",
  tech: "var(--node-tech)",
}

const PAD = 44
const layout = (() => {
  const points = nodes.map((n) => ({ id: n.id, kind: n.kind, label: n.label })) as Point[]
  const edges = links.map((l) => ({ source: l.source, target: l.target }))
  forceSimulation(points, 2)
    .force("link", forceLink(edges).id((n) => n.id).distance(30))
    .force("charge", forceManyBody().strength(-90))
    // Pulled toward the middle so the picture stays round enough to fill a phone-shaped box.
    .force("x", forceX().strength(0.12))
    .force("y", forceY().strength(0.12))
    .force("collide", forceCollide((n: Point) => NODE_SIZE[n.kind] + 4))
    .stop()
    .tick(400)
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const x0 = Math.min(...xs) - PAD
  const y0 = Math.min(...ys) - PAD / 2
  const w = Math.max(...xs) - x0 + PAD
  const h = Math.max(...ys) - y0 + PAD
  points.forEach((p) => {
    p.x -= x0
    p.y -= y0
  })
  const byId = new Map(points.map((p) => [p.id, p]))
  const segments = links.map((l) => [byId.get(l.source)!, byId.get(l.target)!])

  // ponytail: label widths guessed from a 12px mono advance on the phone box (300 to 360px wide); good enough for nine names.
  const scale = 330 / w
  const nodeBoxes = points.filter((p) => p.kind !== "tech").map((p) => {
    const r = NODE_SIZE[p.kind]
    return { x: p.x - r, y: p.y - r, w: r * 2, h: r * 2 }
  })
  const placed: Box[] = []
  const labelled: { point: Point; box: Box; side: Side }[] = []
  // The root sits in the densest spot, where its name would cover a node; the name is right below anyway.
  for (const point of points.filter((p) => HERO_LABELS.has(p.id) && p.kind !== "self")) {
    const node = { cx: point.x, cy: point.y, r: NODE_SIZE[point.kind] }
    const w0 = (point.label.length * 7.3 + 10) / scale
    const h0 = 17 / scale
    const frame = { width: w, height: h, gap: 3 / scale, edge: 2 }
    const byLabel = (box: Box) => placed.some((q) => overlaps(box, q, 4 / scale))
    const byNode = (box: Box) => nodeBoxes.some((n) => overlaps(box, n))
    const spot = findSpot(w0, h0, node, frame, (box) => byLabel(box) || byNode(box))
    if (!spot) continue
    placed.push(spot.box)
    labelled.push({ point, ...spot })
  }
  return { points, segments, labelled, w, h }
})()

export function StaticGraph({ labels = false, caption }: { labels?: boolean; caption?: string }) {
  const { points, segments, labelled, w, h } = layout
  const ratio = (w / h).toFixed(3)
  return (
    <div className="absolute inset-0" style={{ containerType: "size" }}>
      <div
        className="absolute inset-0 m-auto"
        style={{ width: `min(100cqw, 100cqh * ${ratio})`, height: `min(100cqh, 100cqw / ${ratio})` }}
      >
        <svg viewBox={`0 0 ${w.toFixed(1)} ${h.toFixed(1)}`} className="size-full">
          <g stroke="var(--muted-foreground)" strokeOpacity={0.28} strokeWidth={1} vectorEffect="non-scaling-stroke">
            {segments.map(([a, b], i) => (
              <line
                key={i}
                x1={a.x.toFixed(1)}
                y1={a.y.toFixed(1)}
                x2={b.x.toFixed(1)}
                y2={b.y.toFixed(1)}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          {points.map((p) => (
            <g key={p.id} fill={FILL[NODE_FAMILY[p.kind]]}>
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={NODE_SIZE[p.kind] * 1.8} opacity={0.14} />
              <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={NODE_SIZE[p.kind]} />
            </g>
          ))}
        </svg>
        {labels &&
          labelled.map(({ point: p, box, side }) => (
            <span
              key={p.id}
              className="absolute whitespace-nowrap font-mono font-semibold leading-tight text-foreground"
              style={{ ...anchor(box, side, w, h), fontSize: 12, ...CHIP }}
            >
              {p.label}
            </span>
          ))}
      </div>
      {caption && (
        <p className="absolute inset-x-0 bottom-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground motion-safe:animate-pulse">
          {caption}
        </p>
      )}
    </div>
  )
}

const pct = (n: number) => `${(n * 100).toFixed(2)}%`

// Anchored from the edge facing the node, so the gap to it holds as the box grows past the layout width.
function anchor(box: Box, side: Side, w: number, h: number) {
  const cx = (box.x + box.w / 2) / w
  const cy = (box.y + box.h / 2) / h
  if (side === "left") return { right: pct(1 - (box.x + box.w) / w), top: pct(cy), translate: "0 -50%" }
  if (side === "right") return { left: pct(box.x / w), top: pct(cy), translate: "0 -50%" }
  if (side === "above") return { left: pct(cx), bottom: pct(1 - (box.y + box.h) / h), translate: "-50% 0" }
  return { left: pct(cx), top: pct(box.y / h), translate: "-50% 0" }
}

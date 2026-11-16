import * as THREE from "three"
import { NODE_SIZE, type GraphNode } from "@/lib/graph-data"

// HTML labels over the canvas: crisp at any size, above every edge and node, coloured by CSS. See DOCS.md.
export type Label = {
  el: HTMLSpanElement
  w: number
  h: number
  shown: boolean
  side: Side
  radius: number
  self: boolean
  // The owner's last spot, as [distance step, angle step], tried first so the name holds still.
  spot?: [number, number]
}

// A backing chip rather than a text halo, so an edge never strikes through a name.
export const CHIP = {
  background: "color-mix(in oklab, var(--background) 72%, transparent)",
  padding: "1px 5px",
  borderRadius: "4px",
}

export function makeLabels(layer: HTMLElement, nodes: GraphNode[]): Map<string, Label> {
  const labels = new Map<string, Label>()
  for (const node of nodes) {
    const el = document.createElement("span")
    el.textContent = node.label
    el.className = "font-mono motion-safe:transition-opacity motion-safe:duration-200"
    Object.assign(el.style, {
      position: "absolute",
      left: "0",
      top: "0",
      whiteSpace: "nowrap",
      fontSize: node.kind === "self" ? "14px" : "12px",
      fontWeight: "600",
      lineHeight: "1.2",
      color: "var(--foreground)",
      ...CHIP,
      opacity: "0",
      willChange: "transform",
    })
    layer.appendChild(el)
    labels.set(node.id, { el, w: 0, h: 0, shown: false, side: "below", radius: NODE_SIZE[node.kind], self: node.kind === "self" })
  }
  measureLabels(labels)
  return labels
}

export function measureLabels(labels: Map<string, Label>) {
  labels.forEach((label) => {
    label.w = label.el.offsetWidth
    label.h = label.el.offsetHeight
  })
}

const v = new THREE.Vector3()
const world = new THREE.Vector3()

export type Box = { x: number; y: number; w: number; h: number }
export type Side = "below" | "above" | "right" | "left"
const SIDES: Side[] = ["below", "above", "right", "left"]
export const overlaps = (a: Box, b: Box, pad = 0) =>
  a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y

/** The first side of a node (preferred side first) where a w by h label fits inside the frame unblocked. */
export function findSpot(
  w: number,
  h: number,
  node: { cx: number; cy: number; r: number },
  frame: { width: number; height: number; gap: number; edge: number; slack?: number },
  blocked: (box: Box) => boolean,
  prefer: Side = "below",
): { box: Box; side: Side } | null {
  const { cx, cy, r } = node
  const { gap, edge, slack = Infinity } = frame
  for (const side of [prefer, ...SIDES.filter((s) => s !== prefer)]) {
    const x = side === "right" ? cx + r + gap : side === "left" ? cx - r - gap - w : cx - w / 2
    const y = side === "below" ? cy + r + gap : side === "above" ? cy - r - gap - h : cy - h / 2
    const box = {
      x: Math.min(Math.max(x, edge), frame.width - w - edge),
      y: Math.min(Math.max(y, edge), frame.height - h - edge),
      w,
      h,
    }
    // Pushed far back inside the frame, a label stops reading as its node's.
    if (Math.abs(box.x - x) + Math.abs(box.y - y) > slack) continue
    if (!blocked(box)) return { box, side }
  }
  return null
}

/** The owner's name: the nearest clear, unambiguous spot, else the nearest that does least harm. */
export function findSelfSpot(
  w: number,
  h: number,
  node: { cx: number; cy: number; r: number },
  frame: { width: number; height: number; gap: number; edge: number },
  blockedByLabel: (box: Box) => boolean,
  nodes: Box[],
  ambiguous: (box: Box) => boolean,
  last?: [number, number],
): { box: Box; side: Side; spot: [number, number] } {
  const { cx, cy, r } = node
  const { gap, edge } = frame
  const tries: [number, number][] = []
  for (const k of [1, 1.5, 2, 3, 4, 6]) for (let i = 0; i < 16; i++) tries.push([k, i])
  // The last spot goes first and wins ties, so a moving camera doesn't make the name hop.
  if (last) tries.unshift(last)
  let best: { box: Box; side: Side; spot: [number, number]; hits: number } | null = null
  for (const [k, i] of tries) {
    // Below first, then sweeping both ways round to above.
    const a = Math.PI / 2 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * (Math.PI / 8)
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    const x = cx + dx * (r + gap * k + w / 2) - w / 2
    const y = cy + dy * (r + gap * k + h / 2) - h / 2
    const box = {
      x: Math.min(Math.max(x, edge), frame.width - w - edge),
      y: Math.min(Math.max(y, edge), frame.height - h - edge),
      w,
      h,
    }
    const side: Side = dy > 0.7 ? "below" : dy < -0.7 ? "above" : dx > 0 ? "right" : "left"
    const hits =
      nodes.filter((n) => overlaps(box, n)).length + (blockedByLabel(box) ? 0.5 : 0) + (ambiguous(box) ? 3 : 0)
    if (hits === 0) return { box, side, spot: [k, i] }
    if (!best || hits < best.hits) best = { box, side, spot: [k, i], hits }
  }
  return best!
}

// Most important first; each label takes the first side clear of nodes and placed labels, else hides.
export function placeLabels(
  labels: Map<string, Label>,
  objects: Map<string, THREE.Object3D>,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  rank: (id: string) => number | null,
  edge = 4,
) {
  const tanHalf = Math.tan((camera.fov * Math.PI) / 360)
  const discs = new Map<string, { cx: number; cy: number; r: number; depth: number }>()
  objects.forEach((object, id) => {
    if (object.scale.x < 0.05) return
    object.getWorldPosition(world)
    const depth = world.distanceTo(camera.position)
    v.copy(world).project(camera)
    if (v.z > 1) return
    const radius = labels.get(id)?.radius ?? 3
    discs.set(id, {
      cx: ((v.x + 1) / 2) * width,
      cy: ((1 - v.y) / 2) * height,
      r: ((radius * object.scale.x) / (depth * tanHalf)) * (height / 2),
      depth,
    })
  })

  const wanted: { id: string; label: Label; rank: number; depth: number }[] = []
  labels.forEach((label, id) => {
    const r = rank(id)
    const disc = discs.get(id)
    if (!disc || r === null || (objects.get(id)?.scale.x ?? 0) < 0.6 || label.w === 0) return hide(label)
    wanted.push({ id, label, rank: r, depth: disc.depth })
  })
  wanted.sort((a, b) => a.rank - b.rank || a.depth - b.depth)

  // Tool dots are small enough to sit under a label's chip; everything bigger is kept clear.
  const big = [...discs].filter(([id]) => (labels.get(id)?.radius ?? 0) > NODE_SIZE.tech)
  const nodeBoxes = big.map(([, d]) => ({ x: d.cx - d.r, y: d.cy - d.r, w: d.r * 2, h: d.r * 2 }))
  // Nodes a label could be mistaken for: every big one, and any dot that is itself labelled.
  const rivals = new Map(big)
  wanted.forEach(({ id }) => rivals.set(id, discs.get(id)!))
  // The owner's label keeps a little more room from nodes than the rest.
  const padded = nodeBoxes.map((n) => ({ x: n.x - 3, y: n.y - 3, w: n.w + 6, h: n.h + 6 }))
  const placed: Box[] = []
  const frame = { width, height, gap: 3, edge, slack: 12 }
  for (const { id, label, rank: r } of wanted) {
    const disc = discs.get(id)!
    // Newcomers need a little extra room, and a shown label keeps its side, so nothing flickers.
    const pad = label.shown ? 1 : 6
    const byLabel = (box: Box) => placed.some((p) => overlaps(box, p, pad))
    // Its own node counts too: a label pushed back inside the frame can land on it.
    const byNode = (box: Box) => nodeBoxes.some((n) => overlaps(box, n))
    // A label nearer another node than its own reads as that node's, so it is skipped.
    const ambiguous = (box: Box) => {
      const own = edgeGap(box, disc)
      for (const [other, d] of rivals) if (other !== id && edgeGap(box, d) < own) return true
      return false
    }
    const self = label.self
      ? findSelfSpot(label.w, label.h, disc, frame, byLabel, padded, ambiguous, label.shown ? label.spot : undefined)
      : null
    if (self) label.spot = self.spot
    let spot = self
      ? self
      : findSpot(label.w, label.h, disc, frame, (b) => byLabel(b) || byNode(b) || ambiguous(b), label.shown ? label.side : "below")
    // Whatever is under the pointer always gets a label.
    if (!spot && r <= 0) spot = findSpot(label.w, label.h, disc, { ...frame, slack: Infinity }, () => false)
    if (!spot) {
      hide(label)
      continue
    }
    label.side = spot.side
    const chosen = spot.box
    placed.push(chosen)
    label.el.style.transform = `translate(${chosen.x.toFixed(1)}px, ${chosen.y.toFixed(1)}px)`
    if (!label.shown) {
      label.shown = true
      label.el.style.opacity = "1"
    }
  }
}

function hide(label: Label) {
  if (!label.shown) return
  label.shown = false
  label.el.style.opacity = "0"
}

/** Distance from a node's rim to the nearest point of a box. */
export function edgeGap(box: Box, d: { cx: number; cy: number; r: number }) {
  const dx = Math.max(box.x - d.cx, 0, d.cx - box.x - box.w)
  const dy = Math.max(box.y - d.cy, 0, d.cy - box.y - box.h)
  return Math.hypot(dx, dy) - d.r
}

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
}

const HALO = "0 0 2px var(--background), 0 0 4px var(--background), 0 0 8px var(--background)"

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
      textShadow: HALO,
      opacity: "0",
      willChange: "transform",
    })
    layer.appendChild(el)
    labels.set(node.id, { el, w: 0, h: 0, shown: false, side: "below", radius: NODE_SIZE[node.kind] })
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
type Side = "below" | "above" | "right" | "left"
const SIDES: Side[] = ["below", "above", "right", "left"]
export const overlaps = (a: Box, b: Box, pad = 0) =>
  a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y

/** The first side of a node (preferred side first) where a w by h label fits inside the frame unblocked. */
export function findSpot(
  w: number,
  h: number,
  node: { cx: number; cy: number; r: number },
  frame: { width: number; height: number; gap: number; edge: number },
  blocked: (box: Box) => boolean,
  prefer: Side = "below",
): { box: Box; side: Side } | null {
  const { cx, cy, r } = node
  const { gap, edge } = frame
  for (const side of [prefer, ...SIDES.filter((s) => s !== prefer)]) {
    const x = side === "right" ? cx + r + gap : side === "left" ? cx - r - gap - w : cx - w / 2
    const y = side === "below" ? cy + r + gap : side === "above" ? cy - r - gap - h : cy - h / 2
    const box = {
      x: Math.min(Math.max(x, edge), frame.width - w - edge),
      y: Math.min(Math.max(y, edge), frame.height - h - edge),
      w,
      h,
    }
    if (!blocked(box)) return { box, side }
  }
  return null
}

/**
 * Most important first, each label tries below, above, right and left of its node and takes the first
 * spot clear of every node and every label already placed; if none is clear it hides. null rank = no label.
 */
export function placeLabels(
  labels: Map<string, Label>,
  objects: Map<string, THREE.Object3D>,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  rank: (id: string) => number | null,
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

  // Tool dots are small enough to sit under a label's halo; everything bigger is kept clear.
  const nodeBoxes = [...discs]
    .filter(([id]) => (labels.get(id)?.radius ?? 0) > NODE_SIZE.tech)
    .map(([, d]) => ({ x: d.cx - d.r, y: d.cy - d.r, w: d.r * 2, h: d.r * 2 }))
  const placed: Box[] = []
  const frame = { width, height, gap: 3, edge: 4 }
  for (const { id, label, rank: r } of wanted) {
    const disc = discs.get(id)!
    // Newcomers need a little extra room, and a shown label keeps its side, so nothing flickers.
    const pad = label.shown ? 1 : 6
    // Its own node counts too: a label pushed back inside the frame can land on it.
    const blocked = (box: Box) =>
      placed.some((p) => overlaps(box, p, pad)) || nodeBoxes.some((n) => overlaps(box, n))
    let spot = findSpot(label.w, label.h, disc, frame, blocked, label.shown ? label.side : "below")
    // The root and whatever is under the pointer always get a label.
    if (!spot && r <= 0) spot = findSpot(label.w, label.h, disc, frame, () => false)
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

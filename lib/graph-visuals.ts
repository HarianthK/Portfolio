import * as THREE from "three"
import { NODE_FAMILY, NODE_SIZE, type GraphNode } from "@/lib/graph-data"

/**
 * Colours live here as hex rather than being read from the CSS custom
 * properties in globals.css. The tokens there are authored in oklch, which
 * three.js won't parse reliably, and the WebGL scene needs numeric colour
 * anyway. The two sets are kept visually in sync by hand — CSS drives the DOM,
 * this drives the canvas.
 */
export const FAMILY_COLOR = {
  role: "#f0b429", // amber — people, institutions
  project: "#e07b39", // copper — things built, and what they produced
  tech: "#4a9fc4", // cool — technology, deliberately recessive
} as const

export function colorForNode(node: GraphNode): string {
  return FAMILY_COLOR[NODE_FAMILY[node.kind]]
}

export function radiusForNode(node: GraphNode): number {
  return NODE_SIZE[node.kind]
}

/**
 * Which nodes carry a permanent label. Only the structural ones — labelling
 * outcomes and tech too collides badly in dense clusters. Everything else
 * reveals itself on hover.
 */
export function isLabelled(node: GraphNode): boolean {
  return node.kind === "self" || node.kind === "role" || node.kind === "project"
}

/**
 * Text rendered to a canvas and used as a sprite texture. Cheaper than a text
 * geometry library for a handful of labels, and it always faces the camera.
 */
function makeLabelSprite(text: string, color: string): THREE.Sprite {
  const padding = 24
  const fontSize = 44
  const font = `500 ${fontSize}px ui-monospace, "JetBrains Mono", monospace`

  const measure = document.createElement("canvas").getContext("2d")
  if (measure) measure.font = font
  const textWidth = measure ? measure.measureText(text).width : text.length * fontSize * 0.6

  const canvas = document.createElement("canvas")
  // Device-pixel oversampling so labels stay crisp when the camera is close.
  const scale = 2
  canvas.width = (textWidth + padding * 2) * scale
  canvas.height = (fontSize + padding) * scale

  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.scale(scale, scale)
    ctx.font = font
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const cx = canvas.width / (2 * scale)
    const cy = canvas.height / (2 * scale)

    // Dark halo behind light text so labels stay readable against both the
    // near-black dark theme and the beige light theme, without having to
    // rebuild every sprite when the theme is toggled.
    ctx.lineJoin = "round"
    ctx.lineWidth = 7
    ctx.strokeStyle = "rgba(10, 7, 4, 0.9)"
    ctx.strokeText(text, cx, cy)

    ctx.fillStyle = color
    ctx.fillText(text, cx, cy)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.colorSpace = THREE.SRGBColorSpace

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      // Keeps labels legible when they pass behind glowing nodes.
      depthTest: false,
    }),
  )

  const aspect = canvas.width / canvas.height
  const height = 4.5
  sprite.scale.set(height * aspect, height, 1)
  return sprite
}

/**
 * Builds the 3D object for a node: an emissive core so bloom has something to
 * catch, a soft outer shell for volume, and a label for the significant nodes.
 *
 * Objects are cached per node id — `nodeThreeObject` is called on every graph
 * refresh, and rebuilding geometry each time would leak GPU memory.
 */
export function createNodeObjectFactory() {
  const cache = new Map<string, THREE.Object3D>()

  function nodeObject(node: GraphNode): THREE.Object3D {
    const cached = cache.get(node.id)
    if (cached) return cached

    const group = new THREE.Group()
    const color = colorForNode(node)
    const radius = radiusForNode(node)

    const coreMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color),
      // Bigger nodes glow harder, so hierarchy survives the bloom pass.
      emissiveIntensity: node.kind === "tech" ? 0.7 : 1.6,
      roughness: 0.35,
      metalness: 0.1,
      // Transparent so section de-emphasis can actually fade the node out.
      // Without this only the glow dimmed and the solid sphere stayed put,
      // which left "inactive" nodes looking nearly as present as active ones.
      transparent: true,
      opacity: 1,
    })
    coreMaterial.userData.baseOpacity = 1
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 3), coreMaterial))

    // Faint halo — reads as atmosphere rather than a hard-edged ball.
    const haloOpacity = node.kind === "tech" ? 0.05 : 0.1
    const haloMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: haloOpacity,
      depthWrite: false,
      side: THREE.BackSide,
    })
    // Remembered so section fading can scale it rather than clobber it.
    haloMaterial.userData.baseOpacity = haloOpacity
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(radius * 1.9, 2), haloMaterial))

    if (isLabelled(node)) {
      const label = makeLabelSprite(node.label, "#f6efe4")
      label.position.set(0, radius + 4, 0)
      group.add(label)
    }

    group.userData.nodeId = node.id
    group.userData.kind = node.kind
    cache.set(node.id, group)
    return group
  }

  // The cache doubles as the lookup for scroll choreography — the scene reads
  // world positions out of it to work out where a section's cluster sits.
  return { nodeObject, objects: cache }
}

/**
 * Fades nodes that aren't part of the active section. Applied by walking the
 * cached objects directly rather than re-rendering the graph, which would
 * restart the simulation.
 */
export function applySectionEmphasis(
  objects: Map<string, THREE.Object3D>,
  activeIds: Set<string> | null,
  lerp: number,
) {
  objects.forEach((object, id) => {
    const isActive = !activeIds || activeIds.has(id)
    const isTech = object.userData.kind === "tech"
    const targetOpacity = isActive ? 1 : 0.12
    const baseEmissive = isTech ? 0.7 : 1.6
    const targetEmissive = isActive ? baseEmissive : baseEmissive * 0.15

    object.traverse((child) => {
      const mesh = child as THREE.Mesh
      const material = mesh.material as THREE.MeshStandardMaterial | undefined
      if (!material) return

      if (material.emissiveIntensity !== undefined && material.emissive) {
        material.emissiveIntensity += (targetEmissive - material.emissiveIntensity) * lerp
      }
      if (material.transparent) {
        material.opacity += (targetOpacity * (material.userData.baseOpacity ?? 1) - material.opacity) * lerp
      }
    })

    const sprite = object.children.find((child) => child instanceof THREE.Sprite) as
      | THREE.Sprite
      | undefined
    if (sprite) {
      const spriteMaterial = sprite.material as THREE.SpriteMaterial
      spriteMaterial.opacity += (targetOpacity - spriteMaterial.opacity) * lerp
    }
  })
}

/** Frees cached geometry/materials when the scene unmounts. */
export function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(material)) material.forEach((m) => m.dispose())
    else material?.dispose()
  })
}

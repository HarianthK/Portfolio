import * as THREE from "three"
import { NODE_FAMILY, NODE_SIZE, type GraphNode } from "@/lib/graph-data"

/**
 * Colours live here as hex rather than being read from the CSS custom
 * properties in globals.css. The tokens there are authored in oklch, which
 * three.js won't parse reliably, and the WebGL scene needs numeric colour
 * anyway. The two sets are kept visually in sync by hand — CSS drives the DOM,
 * this drives the canvas.
 */
/**
 * Two palettes, because the two themes are lit in opposite directions.
 *
 * Dark mode adds light: nodes are emissive and bloom makes them glow, so the
 * centre node is near-white and burns brightest of everything.
 *
 * Light mode can't add light — there's nowhere brighter than the page to go, so
 * bloom just washes everything to white. There it reads as a printed diagram
 * instead: saturated, darker inks with no glow, and the centre node is the
 * darkest mark on the page rather than the brightest.
 */
export const FAMILY_COLOR = {
  dark: {
    self: "#fff4df", // near-white — burns brightest under bloom
    role: "#f0b429", // amber — people, institutions
    project: "#e07b39", // copper — things built, and what they produced
    tech: "#4a9fc4", // cool — technology, deliberately recessive
  },
  /*
    Not the dark palette darkened. That first attempt put amber at hue 38 and
    copper at hue 22 — sixteen degrees apart, which on a warm background reads
    as one brown. These are pushed apart to roughly 33 degrees and separated by
    lightness too, so gold, brick and blue stay three distinct inks.
  */
  light: {
    self: "#2b2318", // ink — the darkest mark, so it reads as the root
    role: "#bd8410", // gold
    project: "#9c2c1a", // brick — clearly red, not another orange
    tech: "#22607d", // steel blue
  },
} as const

export type GraphTheme = "dark" | "light"

export function colorForNode(node: GraphNode, theme: GraphTheme = "dark"): string {
  return FAMILY_COLOR[theme][NODE_FAMILY[node.kind]]
}

/**
 * How hard a node glows. Light mode runs almost flat — without bloom to catch
 * it, emissive only bleaches the colour out.
 */
export function emissiveForNode(kind: GraphNode["kind"], theme: GraphTheme): number {
  // Flat on light. Any emissive lifts the colour toward white, which is exactly
  // the wrong direction on paper — it's what made the inks look chalky.
  if (theme === "light") return 0
  if (kind === "self") return 2.4
  return kind === "tech" ? 0.7 : 1.6
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
 * Label colours per theme. Light text with a dark outline works on the near
 * black background but washes out badly on the light theme's beige, so the
 * light theme inverts it: dark text with a pale halo behind it.
 */
const LABEL_COLORS = {
  dark: { fill: "#f6efe4", outline: "rgba(10, 7, 4, 0.9)" },
  light: { fill: "#2b1d0e", outline: "rgba(250, 244, 234, 0.95)" },
} as const

/**
 * Text rendered to a canvas and used as a sprite texture. Cheaper than a text
 * geometry library for a handful of labels, and it always faces the camera.
 */
function makeLabelSprite(text: string, fill: string, outline: string): THREE.Sprite {
  const padding = 24
  const fontSize = 44
  // Semibold: these render small on screen, and the lighter weight went thin
  // and grey once the glow was removed from the light theme.
  const font = `600 ${fontSize}px ui-monospace, "JetBrains Mono", monospace`

  const measure = document.createElement("canvas").getContext("2d")
  if (measure) measure.font = font
  const textWidth = measure ? measure.measureText(text).width : text.length * fontSize * 0.6

  const canvas = document.createElement("canvas")
  /*
    Oversampling was a flat 2, which is a 1:1 texel-to-pixel match only on a
    non-retina screen. On a device-pixel-ratio 2 display the label was being
    magnified twice over and went soft — one of the two reasons the graph read
    as blurry. Track the display instead, then clamp: the widest label is around
    620 CSS px, so 4x would approach the 2048 texture limit on some GPUs.
  */
  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1
  const untiled = (textWidth + padding * 2) * 2 * Math.min(dpr, 2)
  const scale = untiled > 2048 ? (2048 / (textWidth + padding * 2)) : 2 * Math.min(dpr, 2)

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

    // A halo in the opposing tone, so the text keeps its edge whatever it
    // passes in front of.
    ctx.lineJoin = "round"
    ctx.lineWidth = 7
    ctx.strokeStyle = outline
    ctx.strokeText(text, cx, cy)

    ctx.fillStyle = fill
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

/** Which wave of the entrance a node belongs to. Lower arrives first. */
const APPEAR_ORDER: Record<GraphNode["kind"], number> = {
  self: 0,
  role: 1,
  education: 1,
  project: 2,
  outcome: 3,
  tech: 4,
}

/** Seconds between waves, and how long one node takes to reach full size. */
const ENTRANCE_STAGGER = 0.16
const ENTRANCE_DURATION = 0.55

/** Total length of the entrance, used to ramp the edges in behind the nodes. */
export const ENTRANCE_TOTAL =
  Math.max(...Object.values(APPEAR_ORDER)) * ENTRANCE_STAGGER + ENTRANCE_DURATION

/**
 * Grows each node from nothing, family by family, so the graph assembles itself
 * rather than simply being there. The whole pitch of the site is that he builds
 * these things; watching one get built is the argument.
 *
 * Returns true once every node has landed, so the caller can stop driving it.
 */
export function applyEntrance(
  objects: Map<string, THREE.Object3D>,
  elapsed: number,
  instant = false,
): boolean {
  /*
    Nothing to grow yet is emphatically *not* "finished". The first frame runs
    before the graph library has built any node objects, and reporting settled
    there meant the caller stopped driving the entrance a moment before every
    node appeared — leaving all of them stuck at zero scale, permanently.
  */
  if (objects.size === 0) return false

  if (instant) {
    objects.forEach((object) => object.scale.setScalar(1))
    return true
  }

  let settled = true

  objects.forEach((object) => {
    const order = (object.userData.appearOrder as number) ?? 0
    const t = (elapsed - order * ENTRANCE_STAGGER) / ENTRANCE_DURATION

    if (t >= 1) {
      object.scale.setScalar(1)
      return
    }

    settled = false

    if (t <= 0) {
      object.scale.setScalar(0)
      return
    }

    // Ease-out-back: overshoots a little and settles, which reads as a node
    // snapping into place rather than being faded up.
    const p = t - 1
    object.scale.setScalar(Math.max(0, 1 + 2.2 * p * p * p + 1.2 * p * p))
  })

  return settled
}

/**
 * Builds the 3D object for a node: an emissive core so bloom has something to
 * catch, a soft outer shell for volume, and a label for the significant nodes.
 *
 * Objects are cached per node id — `nodeThreeObject` is called on every graph
 * refresh, and rebuilding geometry each time would leak GPU memory.
 */
export function createNodeObjectFactory(theme: GraphTheme = "dark") {
  const cache = new Map<string, THREE.Object3D>()
  const label = LABEL_COLORS[theme]

  function nodeObject(node: GraphNode): THREE.Object3D {
    const cached = cache.get(node.id)
    if (cached) return cached

    const group = new THREE.Group()
    const color = colorForNode(node, theme)
    const radius = radiusForNode(node)

    // Transparent in both cases so section de-emphasis can actually fade a node
    // out — without it only the glow dimmed and the sphere stayed put.
    const coreMaterial =
      theme === "light"
        ? // Unlit on paper: a shaded sphere catches specular highlights that
          // bleach the ink and give every node a shiny spot it shouldn't have.
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 })
        : new THREE.MeshStandardMaterial({
            color,
            emissive: new THREE.Color(color),
            emissiveIntensity: emissiveForNode(node.kind, theme),
            roughness: 0.35,
            metalness: 0.1,
            transparent: true,
            opacity: 1,
          })
    coreMaterial.userData.baseOpacity = 1
    // Detail 2 rather than 3: at these on-screen sizes, and with bloom softening
    // the silhouette anyway, the extra subdivision isn't visible but does cost
    // four times the triangles across every node.
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 2), coreMaterial))

    // Halo only on dark, where it reads as atmosphere around a glowing point.
    // On the light theme a pale ring of a dark ink is just a grey smudge, and
    // one around every node was what made the whole graph look muddy.
    if (theme === "dark") {
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
      const halo = new THREE.Mesh(new THREE.IcosahedronGeometry(radius * 1.9, 1), haloMaterial)
      // Nearly twice the node's radius, so leaving it hoverable meant the
      // pointer registered a hit well outside the visible circle.
      halo.raycast = () => {}
      group.add(halo)
    }

    if (isLabelled(node)) {
      const sprite = makeLabelSprite(node.label, label.fill, label.outline)
      sprite.position.set(0, radius + 4, 0)
      // A label is a wide quad sitting above the node, and most of it is
      // transparent — but raycasting doesn't care about transparency, so
      // leaving it hittable made empty space next to the text report a hover.
      sprite.raycast = () => {}
      group.add(sprite)
    }

    group.userData.nodeId = node.id
    group.userData.kind = node.kind
    // Which wave this node arrives in. Built from the middle outwards — the
    // person, then where he's been, then what came out of it, then the tools —
    // so the graph assembles in the order the hierarchy reads.
    group.userData.appearOrder = APPEAR_ORDER[node.kind]
    // Entrance starts from nothing. applyEntrance drives this back to 1; if
    // reduced motion is set it's snapped to 1 on the first frame instead.
    group.scale.setScalar(0)
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
  theme: GraphTheme = "dark",
) {
  objects.forEach((object, id) => {
    const isActive = !activeIds || activeIds.has(id)
    const kind = object.userData.kind as GraphNode["kind"]
    const targetOpacity = isActive ? 1 : 0.12
    // Must match what the node was built with, or fading would quietly reset
    // each node's brightness to the wrong baseline.
    const baseEmissive = emissiveForNode(kind, theme)
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

/** Frees cached geometry, materials and label textures. */
export function disposeObject(root: THREE.Object3D) {
  const release = (material: THREE.Material) => {
    // Label sprites carry a canvas texture that won't be reclaimed with the
    // material on its own.
    const map = (material as THREE.SpriteMaterial).map
    map?.dispose()
    material.dispose()
  }

  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    mesh.geometry?.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(material)) material.forEach(release)
    else if (material) release(material)
  })
}

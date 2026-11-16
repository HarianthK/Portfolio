import * as THREE from "three"
import { NODE_FAMILY, NODE_SIZE, type GraphNode } from "@/lib/graph-data"
import type { GraphPalette, GraphTheme } from "@/lib/graph-palette"


export function colorForNode(node: GraphNode, palette: GraphPalette): string {
  return palette[NODE_FAMILY[node.kind]]
}

/**
 * How hard a node glows. Light mode runs almost flat, without bloom to catch
 * it, emissive only bleaches the colour out.
 */
export function emissiveForNode(kind: GraphNode["kind"], theme: GraphTheme): number {
  // Flat on light. Any emissive lifts the colour toward white, which is exactly
  // the wrong direction on paper, it's what made the inks look chalky.
  if (theme === "light") return 0
  if (kind === "self") return 2.4
  return kind === "tech" ? 0.7 : 1.6
}

export function radiusForNode(node: GraphNode): number {
  return NODE_SIZE[node.kind]
}

/**
 * A rim light, done the way film does it: bright where the surface turns away
 * from the viewer, dark where it faces them.
 *
 * This is the difference between a coloured ball and a lit object. The nodes
 * were flat discs of colour with a glow bolted on, which is exactly why the
 * graph read as a diagram rather than a photograph of something.
 *
 * Additively blended, so it only ever adds light, over a near-black background
 * that gives the edge of each node a filament brightness that bloom then picks
 * up and spreads.
 */
function makeRimMaterial(color: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      // Tight falloff: a wide rim looks like fog around the node instead of
      // light catching its edge.
      uPower: { value: 2.6 },
      uOpacity: { value: 1 },
    },
    vertexShader: `
      varying vec3 vNormalW;
      varying vec3 vViewW;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        // Nodes only ever scale uniformly (the entrance animation), so the
        // model matrix can rotate the normal without an inverse-transpose.
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewW = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uOpacity;
      varying vec3 vNormalW;
      varying vec3 vViewW;
      void main() {
        float facing = clamp(dot(normalize(vNormalW), normalize(vViewW)), 0.0, 1.0);
        float rim = pow(1.0 - facing, uPower);
        gl_FragColor = vec4(uColor * rim, rim * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
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
    node appeared, leaving all of them stuck at zero scale, permanently.
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
 * catch and a soft outer shell for volume. Labels are HTML (components/graph/graph-labels.ts).
 *
 * Objects are cached per node id, `nodeThreeObject` is called on every graph
 * refresh, and rebuilding geometry each time would leak GPU memory.
 */
export function createNodeObjectFactory(palette: GraphPalette) {
  const cache = new Map<string, THREE.Object3D>()
  const theme = palette.theme

  function nodeObject(node: GraphNode): THREE.Object3D {
    const cached = cache.get(node.id)
    if (cached) return cached

    const group = new THREE.Group()
    const color = colorForNode(node, palette)
    const radius = radiusForNode(node)

    // Transparent in both cases so section de-emphasis can actually fade a node
    // out, without it only the glow dimmed and the sphere stayed put.
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

    // Rim light and halo are dark-theme only. On the light theme a pale ring of
    // a dark ink is just a grey smudge, and one around every node was what made
    // the whole graph look muddy, light mode reads as print, not film.
    if (theme === "dark") {
      // Sits just proud of the surface so the rim traces the node's silhouette
      // rather than z-fighting with it.
      const rim = new THREE.Mesh(
        new THREE.IcosahedronGeometry(radius * 1.04, 3),
        makeRimMaterial(color),
      )
      rim.raycast = () => {}
      group.add(rim)

      const haloOpacity = node.kind === "tech" ? 0.04 : 0.08
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

    group.userData.nodeId = node.id
    group.userData.kind = node.kind
    // Which wave this node arrives in. Built from the middle outwards, the
    // person, then where he's been, then what came out of it, then the tools,
    // so the graph assembles in the order the hierarchy reads.
    group.userData.appearOrder = APPEAR_ORDER[node.kind]
    // Entrance starts from nothing. applyEntrance drives this back to 1; if
    // reduced motion is set it's snapped to 1 on the first frame instead.
    group.scale.setScalar(0)
    cache.set(node.id, group)
    return group
  }

  // The cache doubles as the lookup for scroll choreography, the scene reads
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

      // The rim light fades through a uniform rather than material.opacity,
      // which its shader ignores, without this branch a de-emphasised node
      // kept a bright outline while its body dimmed away underneath.
      const uniforms = (material as unknown as THREE.ShaderMaterial).uniforms
      if (uniforms?.uOpacity) {
        uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * lerp
        return
      }

      if (material.emissiveIntensity !== undefined && material.emissive) {
        material.emissiveIntensity += (targetEmissive - material.emissiveIntensity) * lerp
      }
      if (material.transparent) {
        material.opacity += (targetOpacity * (material.userData.baseOpacity ?? 1) - material.opacity) * lerp
      }
    })

  })
}

/** Frees cached geometry and materials. */
export function disposeObject(root: THREE.Object3D) {
  const release = (material: THREE.Material) => {
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

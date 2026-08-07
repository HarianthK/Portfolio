"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import R3fForceGraph from "r3f-forcegraph"
import { useTheme } from "next-themes"
import * as THREE from "three"
import {
  links,
  nodes,
  nodesInSection,
  type GraphNode,
  type NodeKind,
  type SectionId,
} from "@/lib/graph-data"
import {
  applyEntrance,
  applySectionEmphasis,
  colorForNode,
  createNodeObjectFactory,
  disposeObject,
  radiusForNode,
  ENTRANCE_TOTAL,
} from "@/lib/graph-visuals"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

export type GraphFraming = "immersive" | "comfortable"

type Props = {
  /** Node kinds to keep lit. `null` lights the whole graph. */
  highlight?: NodeKind[] | null
  /**
   * Scroll-driven focus. When set, the camera flies to that section's cluster
   * and everything else dims. `null` frames the whole graph.
   */
  focus?: SectionId | null
  /** Immersive lets the graph bleed past the frame; comfortable fits it inside. */
  framing?: GraphFraming
  onNodeFocus?: (node: GraphNode | null) => void
  onNodeSelect?: (node: GraphNode) => void
  /** Stops the render loop entirely — used while the stage is off screen. */
  paused?: boolean
}

type GraphHandle = {
  tickFrame: () => void
}

/** Bounding box of a set of scene objects, in the graph group's local space. */
function boundsOf(objects: THREE.Object3D[]) {
  const box = new THREE.Box3()
  objects.forEach((object) => box.expandByPoint(object.position))
  return box
}

function Scene({ highlight, focus = null, framing = "immersive", onNodeFocus, onNodeSelect }: Props) {
  const graphRef = useRef<GraphHandle | undefined>(undefined)
  const groupRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useSafeReducedMotion()
  const { gl, camera, size } = useThree()

  // Once the visitor grabs the graph they own the camera, until the highlight
  // or the scrolled-to section changes — otherwise auto-framing would fight
  // their dragging.
  const userControlled = useRef(false)
  useEffect(() => {
    userControlled.current = false
  }, [highlight, focus])

  // r3f-forcegraph mutates the objects it's given (it writes x/y/z onto each
  // node), so it gets copies — otherwise the module-level data in graph-data.ts
  // would accumulate simulation state across remounts.
  const graphData = useMemo(
    () => ({
      nodes: nodes.map((node) => ({ ...node })),
      links: links.map((link) => ({ ...link })),
    }),
    [],
  )

  // Label colours are baked into a canvas texture when the sprite is made, so
  // switching theme means rebuilding them rather than restyling in place.
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "light" ? "light" : "dark"

  const { nodeObject, objects } = useMemo(() => createNodeObjectFactory(theme), [theme])

  // Fog tints whatever recedes into the distance, so it has to match the page
  // behind the canvas or the far side of the graph muddies in light mode.
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2(theme === "light" ? "#f7ecdd" : "#0a0704", 0.0016)
    return () => {
      scene.fog = null
    }
  }, [scene, theme])

  // The previous set of meshes and textures is dropped when the theme changes,
  // and again on unmount; neither is reclaimed automatically.
  useEffect(() => {
    return () => {
      objects.forEach(disposeObject)
      objects.clear()
    }
  }, [objects])

  /*
    Which nodes are lit. Two independent sources: the explorer's filter chips
    (by kind) and the scroll position (by section). Scroll wins when both are
    present, since it's the one the reader is actively driving.
  */
  const activeIds = useMemo(() => {
    if (focus) return new Set(nodesInSection(focus))
    if (!highlight || highlight.length === 0) return null
    const kinds = new Set(highlight)
    return new Set(nodes.filter((node) => kinds.has(node.kind)).map((node) => node.id))
  }, [focus, highlight])

  // Drives the assemble-on-arrival animation. Reduced motion skips it whole.
  const entranceElapsed = useRef(0)
  const entranceDone = useRef(false)

  /*
    Edges are held back until the nodes have almost finished arriving. Drawn
    from the start they'd be a web of lines strung between invisible points,
    since a link is positioned by its endpoints regardless of node scale.

    This is a single state flip rather than a per-frame fade: link opacity is a
    prop the graph library reads on refresh, so animating it continuously would
    rebuild the link objects every frame.
  */
  const [linksIn, setLinksIn] = useState(false)
  useEffect(() => {
    if (prefersReducedMotion) {
      setLinksIn(true)
      return
    }
    const timer = setTimeout(() => setLinksIn(true), (ENTRANCE_TOTAL - 0.3) * 1000)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  useFrame((_, delta) => {
    graphRef.current?.tickFrame()

    // Frame-rate independent easing — same feel on a 60Hz and 144Hz display.
    const ease = 1 - Math.exp(-5.5 * delta)

    if (!entranceDone.current) {
      // The clock only starts once there's something to animate, so the stagger
      // isn't spent while the graph is still being built.
      if (objects.size > 0) entranceElapsed.current += delta
      entranceDone.current = applyEntrance(objects, entranceElapsed.current, prefersReducedMotion)
    }

    applySectionEmphasis(objects, activeIds, ease, theme)

    const group = groupRef.current
    if (!group || objects.size === 0) return

    /*
      What the camera frames. Without a scroll focus this is the whole graph —
      filter chips dim nodes rather than removing them, so re-fitting to the lit
      ones would make the camera lurch on every chip press.

      With a focus it deliberately does the opposite: flying to the cluster is
      the entire point of the sticky rail.
    */
    const framed =
      focus && activeIds
        ? [...objects.entries()].filter(([id]) => activeIds.has(id)).map(([, object]) => object)
        : [...objects.values()]

    const box = boundsOf(framed.length > 0 ? framed : [...objects.values()])
    const centre = box.getCenter(new THREE.Vector3())
    const span = box.getSize(new THREE.Vector3())
    // A lone cluster can be small enough to fill the frame uncomfortably, so
    // the floor is lower when focused but never zero.
    //
    // The allowance is for labels, and only applies when focused. Bounds are
    // built from node *positions*, but a name sits beside its node and runs
    // well past it, so a tight cluster gets its outermost labels sliced off by
    // the edge of the panel. The unfocused hero is meant to bleed, so it keeps
    // the tighter fit.
    const radius = Math.max(span.x, span.y, focus ? 190 : 330) / 2 + (focus ? 46 : 0)

    group.position.lerp(centre.clone().negate(), ease)

    if (userControlled.current) return

    const perspective = camera as THREE.PerspectiveCamera
    const vFov = (perspective.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height))
    const margin = framing === "immersive" ? 0.82 : 1.02
    const desired = (radius / Math.tan(Math.min(vFov, hFov) / 2)) * margin

    // Only the distance is touched, never the direction — that leaves
    // OrbitControls' rotation and auto-rotate free to do their own thing.
    camera.position.setLength(THREE.MathUtils.damp(camera.position.length(), desired, 4.5, delta))
  })

  /**
   * Hit testing is done here rather than through the graph library's hover
   * callback, which reported entering a node but never leaving one — so the
   * first node touched stayed described in the corner regardless of where the
   * cursor went afterwards.
   *
   * Raycasting the node objects directly also makes the hit area exactly the
   * circle that's drawn, since labels and glow halos opt out of raycasting.
   */
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  const nodeAtPointer = useCallback(
    (event: PointerEvent): GraphNode | null => {
      const rect = gl.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      for (const hit of raycaster.intersectObjects([...objects.values()], true)) {
        let object: THREE.Object3D | null = hit.object
        while (object && !object.userData?.nodeId) object = object.parent
        const id = object?.userData?.nodeId as string | undefined
        if (id) return nodes.find((node) => node.id === id) ?? null
      }
      return null
    },
    [camera, gl, objects, pointer, raycaster],
  )

  useEffect(() => {
    const canvas = gl.domElement
    const clear = () => onNodeFocus?.(null)

    const handleMove = (event: PointerEvent) => {
      const node = nodeAtPointer(event)
      canvas.style.cursor = node ? "pointer" : "grab"
      onNodeFocus?.(node)
    }
    const handleUp = (event: PointerEvent) => {
      const node = nodeAtPointer(event)
      if (node) onNodeSelect?.(node)
    }

    canvas.addEventListener("pointermove", handleMove)
    canvas.addEventListener("pointerup", handleUp)
    canvas.addEventListener("pointerleave", clear)
    // Scrolling slides the canvas beneath a stationary cursor without firing a
    // pointer event, which would otherwise leave the last node latched.
    window.addEventListener("scroll", clear, { passive: true })

    return () => {
      canvas.removeEventListener("pointermove", handleMove)
      canvas.removeEventListener("pointerup", handleUp)
      canvas.removeEventListener("pointerleave", clear)
      window.removeEventListener("scroll", clear)
    }
  }, [gl, nodeAtPointer, onNodeFocus, onNodeSelect])

  return (
    <>
      {/* Low ambient so the emissive cores do the lighting work, plus key
          lights to give the halos some form. */}
      <ambientLight intensity={0.55} />
      <pointLight position={[120, 120, 120]} intensity={1.2} color="#ffd9a0" />
      <pointLight position={[-140, -80, -60]} intensity={0.5} color="#4a9fc4" />

      <group ref={groupRef}>
        <R3fForceGraph
          // The library's ref type is generic over node/link shapes and doesn't
          // infer cleanly here; only `tickFrame` is used.
          ref={graphRef as never}
          graphData={graphData}
          nodeThreeObject={nodeObject as never}
          nodeVal={(node: GraphNode) => radiusForNode(node)}
          // Custom node objects are supplied above, so this only governs the
          // library's own hit spheres. At the default of 4 they were several
          // times wider than the circle actually drawn, which made empty space
          // around a node report as a hover.
          nodeRelSize={1}
          nodeColor={(node: GraphNode) => colorForNode(node, theme)}
          // A neutral rule on paper, rather than another brown competing with
          // the node inks.
          linkColor={() => (theme === "light" ? "#6b5f52" : "#8a7a5f")}
          linkOpacity={linksIn ? (theme === "light" ? 0.45 : 0.22) : 0}
          linkWidth={0.4}
          // Particles travelling the edges read as data moving through the
          // graph — the thing these systems actually do. Held back with the
          // edges they travel along.
          linkDirectionalParticles={prefersReducedMotion || !linksIn ? 0 : 2}
          linkDirectionalParticleWidth={1.1}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={() => "#f0b429"}
          d3AlphaDecay={0.018}
          d3VelocityDecay={0.32}
          warmupTicks={80}
          cooldownTime={prefersReducedMotion ? 0 : 9000}
          // Hover and click are handled above, by raycasting directly.
        />
      </group>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.45}
        minDistance={80}
        maxDistance={1400}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={0.28}
        onStart={() => {
          userControlled.current = true
        }}
      />

      {/* Bloom only makes sense on the dark theme. It works by adding light,
          and on a pale background there's nothing brighter than the page to add
          — it just bleaches the graph out, worst of all around the near-white
          centre node. */}
      {!prefersReducedMotion && theme === "dark" && (
        <EffectComposer>
          {/* Eased down from 1.15. At native resolution the old value spread
              far enough to soften the very edges the sharper canvas exists to
              show. */}
          <Bloom intensity={0.95} luminanceThreshold={0.2} luminanceSmoothing={0.45} mipmapBlur />
        </EffectComposer>
      )}
    </>
  )
}

export default function GraphCanvas({ paused = false, ...props }: Props) {
  const [tabVisible, setTabVisible] = useState(true)

  /*
    Render at the display's own resolution. This was capped at 1.75 to protect
    the frame rate, which on a retina screen meant drawing 23% fewer pixels than
    the panel had — the graph was being magnified, and it read as blurry.

    Multisampling is dropped in exchange on those screens. At two device pixels
    per CSS pixel the geometry edges are already sampled finely enough that MSAA
    is mostly paying for itself twice, and it's the expensive half of the two.

    Read once on mount: this component is only ever loaded with `ssr: false`
    (see graph-stage.tsx), so there's no server render to mismatch.
  */
  const [{ dpr, antialias }] = useState(() => {
    const ratio = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1
    return { dpr: Math.min(ratio, 2), antialias: ratio < 2 }
  })

  // The force simulation is a continuous render loop; there's no reason to burn
  // GPU on it while the tab is in the background.
  useEffect(() => {
    const handleVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  // The page mounts two of these — the hero and the explorer. Left running,
  // both drive a full render loop with a bloom pass whether or not they're on
  // screen, which measured at 15fps. Only the visible one should be drawing.
  const running = tabVisible && !paused

  return (
    <Canvas
      // Starts further out than it settles, so the opening move is a dolly in
      // towards the graph as it assembles rather than a static shot.
      camera={{ position: [0, 60, 520], fov: 52, near: 1, far: 4000 }}
      gl={{ antialias, powerPreference: "high-performance" }}
      dpr={dpr}
      frameloop={running ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  )
}

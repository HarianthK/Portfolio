"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing"
import R3fForceGraph from "r3f-forcegraph"
import * as THREE from "three"
import { Atmosphere } from "@/components/graph/atmosphere"
import { makeLabels, measureLabels, placeLabels, type Label } from "@/components/graph/graph-labels"
import {
  HERO_LABELS,
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
import { useGraphPalette } from "@/lib/graph-palette"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

export type GraphFraming = "immersive" | "comfortable"

/** The graph is always centred on the origin, so that's where the lens focuses. */
const FOCUS_TARGET = new THREE.Vector3(0, 0, 0)
// How much of the explorer box the outermost nodes reach: 8% to spare on each side.
const FILL = 0.84
const ndc = new THREE.Vector3()

/*
  The opening move.

  The page used to fade a finished graph in and leave it turning, which is
  atmosphere without an event, nothing to actually watch. Instead the camera
  starts inside the cloud, close enough that a couple of nodes fill the frame,
  and retreats until the whole structure resolves around it. The nodes are
  igniting family by family while that happens, so the reveal and the assembly
  land together.

  Long enough to read as a camera move rather than a zoom, short enough that
  nobody is kept waiting to use the page, and it can be interrupted at any
  point by touching the graph.
*/
const INTRO_DURATION = 3.1
const INTRO_START_DISTANCE = 64

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
  /** Stops the render loop entirely, used while the stage is off screen. */
  paused?: boolean
  /** A node tapped or clicked open, which keeps its label up. */
  pinnedId?: string | null
  onReady?: () => void
}

// Lower ranks claim label space first.
const LABEL_RANK: Record<NodeKind, number> = { self: 0, role: 1, project: 2, education: 3, outcome: 4, tech: 5 }
const nodeById = new Map(nodes.map((node) => [node.id, node]))

type GraphHandle = {
  tickFrame: () => void
}

/** Bounding box of a set of scene objects, in the graph group's local space. */
function boundsOf(objects: THREE.Object3D[]) {
  const box = new THREE.Box3()
  objects.forEach((object) => box.expandByPoint(object.position))
  return box
}

function Scene({
  highlight,
  focus = null,
  framing = "immersive",
  onNodeFocus,
  onNodeSelect,
  pinnedId = null,
  labelLayer,
  onReady,
}: Props & { labelLayer: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<GraphHandle | undefined>(undefined)
  const groupRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useSafeReducedMotion()
  const { gl, camera, size } = useThree()

  // Once the visitor grabs the graph they own the camera, until the highlight
  // or the scrolled-to section changes, otherwise auto-framing would fight
  // their dragging.
  const userControlled = useRef(false)
  useEffect(() => {
    userControlled.current = false
  }, [highlight, focus])

  // r3f-forcegraph mutates the objects it's given (it writes x/y/z onto each
  // node), so it gets copies, otherwise the module-level data in graph-data.ts
  // would accumulate simulation state across remounts.
  const graphData = useMemo(
    () => ({
      nodes: nodes.map((node) => ({ ...node })),
      links: links.map((link) => ({ ...link })),
    }),
    [],
  )

  // Colours are baked into materials, so a theme or look change rebuilds the node objects.
  const palette = useGraphPalette()
  const theme = palette.theme

  const { nodeObject, objects } = useMemo(() => createNodeObjectFactory(palette), [palette])

  // Fog tints whatever recedes into the distance, so it has to match the page
  // behind the canvas or the far side of the graph muddies in light mode.
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2(palette.fog, 0.0016)
    return () => {
      scene.fog = null
    }
  }, [scene, palette])

  const labels = useRef<Map<string, Label>>(new Map())
  useEffect(() => {
    const layer = labelLayer.current
    if (!layer) return
    const made = makeLabels(layer, nodes)
    labels.current = made
    // Widths change once the web font arrives.
    document.fonts?.ready.then(() => measureLabels(made))
    return () => {
      made.forEach((label) => label.el.remove())
      labels.current = new Map()
    }
  }, [labelLayer])

  const hoveredId = useRef<string | null>(null)

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
  // The explorer crossfades from its still picture, so it arrives assembled.
  const entrancePlayed = useRef(framing === "comfortable")
  const readySent = useRef(false)
  const framedOnce = useRef(false)

  /*
    The opening camera move. Only the hero performs it, and only once, so that
    scrolling back up to the top doesn't replay it every time, and reduced
    motion skips it entirely, landing straight on the framed view.
  */
  const intro = useRef(0)
  const introRunning = useRef(framing === "immersive" && !prefersReducedMotion)

  /*
    Switching theme throws away every node object and builds new ones, because
    the colours and the label textures are baked in at construction. Those new
    objects are born at zero scale, waiting for the entrance to grow them, and
    the entrance had already run and marked itself finished, so nothing ever
    did. Every node vanished and only the edges were left.

    Resetting here re-arms it for the rebuilt objects. The replay is instant
    rather than animated: an assembling graph is the right way to arrive on the
    page, and the wrong way to respond to someone flipping a colour scheme.
  */
  useEffect(() => {
    entranceElapsed.current = 0
    entranceDone.current = false
  }, [objects])

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
    if (prefersReducedMotion || framing === "comfortable") {
      setLinksIn(true)
      return
    }
    const timer = setTimeout(() => setLinksIn(true), (ENTRANCE_TOTAL - 0.3) * 1000)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion, framing])

  // The hero names only a few nodes; the explorer names the structure, or every lit node under a filter.
  const labelRank = useCallback(
    (id: string) => {
      const node = nodeById.get(id)
      if (!node) return null
      if (id === hoveredId.current || id === pinnedId) return -1
      if (activeIds && !activeIds.has(id)) return null
      if (framing === "immersive") return HERO_LABELS.has(id) ? LABEL_RANK[node.kind] : null
      if (!activeIds && (node.kind === "tech" || node.kind === "outcome")) return null
      return LABEL_RANK[node.kind]
    },
    [activeIds, framing, pinnedId],
  )

  useFrame((_, delta) => {
    advance(delta)
    // Fog scales with the camera's distance, so a wider framing doesn't wash the whole graph out.
    if (scene.fog instanceof THREE.FogExp2) scene.fog.density = 0.44 / Math.max(camera.position.length(), 1)
    camera.updateMatrixWorld()
    const edge = framing === "comfortable" ? 8 : 4
    placeLabels(labels.current, objects, camera as THREE.PerspectiveCamera, size.width, size.height, labelRank, edge)
    // Ready once there is a graph on screen, not when the context is made, so the still fades into it.
    if (!readySent.current && objects.size > 0 && (entranceDone.current || framing === "immersive")) {
      readySent.current = true
      onReady?.()
    }
  })

  // The widest node on screen, in clip space, with the camera as it stands.
  const extent = (list: THREE.Object3D[]) => {
    camera.updateMatrixWorld()
    let e = 0.01
    for (const object of list) {
      object.getWorldPosition(ndc).project(camera)
      e = Math.max(e, Math.abs(ndc.x), Math.abs(ndc.y))
    }
    return e
  }

  function advance(delta: number) {
    graphRef.current?.tickFrame()

    // Frame-rate independent easing, same feel on a 60Hz and 144Hz display.
    const ease = 1 - Math.exp(-5.5 * delta)

    if (!entranceDone.current) {
      // The clock only starts once there's something to animate, so the stagger
      // isn't spent while the graph is still being built.
      if (objects.size > 0) entranceElapsed.current += delta
      const instant = prefersReducedMotion || entrancePlayed.current
      entranceDone.current = applyEntrance(objects, entranceElapsed.current, instant)
      if (entranceDone.current) entrancePlayed.current = true
    }

    applySectionEmphasis(objects, activeIds, ease, theme)

    const group = groupRef.current
    if (!group || objects.size === 0) return

    /*
      What the camera frames. Without a scroll focus this is the whole graph, since
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
    // z counts too: the graph turns, so its depth becomes width.
    const radius = Math.max(span.x, span.y, span.z, focus ? 190 : 330) / 2 + (focus ? 46 : 0)

    group.position.lerp(centre.clone().negate(), ease)

    /*
      Lean the whole graph a few degrees towards the pointer. It's a small
      angle on purpose, enough that the scene feels like it's aware of you and
      has volume, not so much that it fights the orbit controls or makes people
      seasick. Heavily damped, so a fast mouse doesn't whip it around.
    */
    if (!prefersReducedMotion) {
      const lean = 0.13
      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        parallax.current.x * lean,
        2.2,
        delta,
      )
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        parallax.current.y * lean * 0.6,
        2.2,
        delta,
      )
    }

    if (userControlled.current) return

    const perspective = camera as THREE.PerspectiveCamera
    const vFov = (perspective.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height))
    // The hero fits its own column; the explorer zooms in a little to fill its box.
    const margin = framing === "immersive" ? 1.35 : 0.86
    let desired = (radius / Math.tan(Math.min(vFov, hFov) / 2)) * margin
    if (framing === "comfortable" && !focus) {
      // Fit what is actually on screen, so the box is filled at any angle and nothing runs off it.
      if (!framedOnce.current) {
        framedOnce.current = true
        group.position.copy(centre).negate()
        camera.position.setLength(desired)
        for (let i = 0; i < 4; i++) camera.position.setLength(camera.position.length() * (extent(framed) / FILL))
        return
      }
      desired = camera.position.length() * (extent(framed) / FILL)
    }

    /*
      The opening pull-back, on the hero only. The explorer is somewhere people
      arrive at deliberately and want to use straight away, so it gets no
      performance.

      Driven explicitly rather than through the damping below, because damping
      is exponential: it moves fastest at the start and crawls at the end, which
      is precisely backwards for a reveal. This accelerates away from the nodes
      and settles softly.
    */
    // The reduced-motion setting is only known after the first render, so the intro may have started; snap instead.
    if (introRunning.current && prefersReducedMotion) {
      camera.position.setLength(desired)
      introRunning.current = false
      return
    }
    if (introRunning.current) {
      intro.current = Math.min(1, intro.current + delta / INTRO_DURATION)
      /*
        Ease in *and* out, quartic. The first attempt used an ease-out, which
        front-loads the movement: eighty per cent of the distance was gone
        within the first second and the remaining two were an imperceptible
        crawl, so there was nothing to watch. This holds inside the cloud for a
        beat, sweeps out through the middle of the move, and settles softly.
      */
      const t = intro.current
      const eased = t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
      camera.position.setLength(THREE.MathUtils.lerp(INTRO_START_DISTANCE, desired, eased))
      if (intro.current >= 1) introRunning.current = false
      return
    }

    // Only the distance is touched, never the direction, that leaves
    // OrbitControls' rotation and auto-rotate free to do their own thing.
    camera.position.setLength(THREE.MathUtils.damp(camera.position.length(), desired, 4.5, delta))
  }

  /**
   * Hit testing is done here rather than through the graph library's hover
   * callback, which reported entering a node but never leaving one, so the
   * first node touched stayed described in the corner regardless of where the
   * cursor went afterwards.
   *
   * Raycasting the node objects directly also makes the hit area exactly the
   * circle that's drawn, since labels and glow halos opt out of raycasting.
   */
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  /*
    Where the pointer is, in -1..1, used to lean the graph a few degrees towards
    the viewer. Kept in a ref and applied per frame rather than held in state:
    this changes on every mouse move, and re-rendering the scene graph at that
    rate would cost far more than the effect is worth.
  */
  const parallax = useRef({ x: 0, y: 0 })

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
    const clear = () => {
      hoveredId.current = null
      onNodeFocus?.(null)
    }

    const handleMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      parallax.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      parallax.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1

      const node = nodeAtPointer(event)
      canvas.style.cursor = node ? "pointer" : "grab"
      hoveredId.current = node?.id ?? null
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
          nodeColor={(node: GraphNode) => colorForNode(node, palette)}
          // Light edges are faint rules on paper, so they never outweigh the labels.
          linkColor={() => palette.link}
          linkOpacity={linksIn ? (theme === "light" ? 0.3 : 0.22) : 0}
          linkWidth={0.4}
          // Particles travelling the edges read as data moving through the
          // graph, the thing these systems actually do. Held back with the
          // edges they travel along.
          linkDirectionalParticles={prefersReducedMotion || !linksIn ? 0 : 2}
          linkDirectionalParticleWidth={1.1}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={() => palette.particle}
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
        /* Slower than it was, and no longer the only movement in the scene.
           A constant even spin is the least cinematic move there is, it reads
           as a screensaver. Most of the motion now comes from the parallax
           below, which responds to the viewer instead of ignoring them. */
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={0.16}
        onStart={() => {
          userControlled.current = true
        }}
      />

      {/* Atmosphere is part of the same argument as the rim light: something
          has to sit between the eye and the subject for the scene to have
          depth. Dark only, on paper, floating motes are just specks. */}
      {theme === "dark" && !prefersReducedMotion && <Atmosphere color={palette.role} />}

      {/* The filmic pass, and dark-theme only for the same reason bloom is:
          these effects all work by adding light or crushing blacks, and on a
          pale background there is nothing brighter than the page to add.

          Order matters. Depth of field runs first so bloom spreads from an
          already-blurred image, the other way round, bloom haloes the sharp
          edges and the blur then smears the haloes. */}
      {!prefersReducedMotion && theme === "dark" && (
        <EffectComposer>
          {/*
            Focus is pinned to the graph's centre, which is the origin, since
            the group is positioned to put it there and the controls orbit it,
            rather than a hand-tuned distance. A fixed `focusDistance` is in
            normalised units against the far plane, and at far=4000 the value
            that looked right on paper put the focal plane roughly 250 units in
            front of the graph, so the entire scene blurred.

            Deliberately restrained, so far nodes soften without smearing.
            Labels are HTML above the canvas and never pass through this blur.
          */}
          <DepthOfField target={FOCUS_TARGET} focalLength={0.012} bokehScale={0.6} height={480} />
          {/* Eased down from 1.15. At native resolution the old value spread
              far enough to soften the very edges the sharper canvas exists to
              show. */}
          <Bloom intensity={0.95} luminanceThreshold={0.2} luminanceSmoothing={0.45} mipmapBlur />
          {/* Pulls the corners down so the frame has a centre of attention
              rather than being evenly lit wall to wall. */}
          <Vignette offset={0.28} darkness={0.72} eskil={false} />
        </EffectComposer>
      )}
    </>
  )
}

export default function GraphCanvas({ paused = false, onReady, ...props }: Props) {
  const labelLayer = useRef<HTMLDivElement>(null)
  const [tabVisible, setTabVisible] = useState(true)

  /*
    Render at the display's own resolution. This was capped at 1.75 to protect
    the frame rate, which on a retina screen meant drawing 23% fewer pixels than
    the panel had, the graph was being magnified, and it read as blurry.

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

  // The page mounts two of these, the hero and the explorer. Left running,
  // both drive a full render loop with a bloom pass whether or not they're on
  // screen, which measured at 15fps. Only the visible one should be drawing.
  const running = tabVisible && !paused

  return (
    <>
    <Canvas
      /* The hero starts deep inside the cloud for its intro; the explorer starts
         from another side so it doesn't repeat the hero's picture. */
      camera={{
        position: props.framing === "comfortable" ? [70, 34, 26] : [0, 7.4, 63.6],
        fov: 52,
        near: 1,
        far: 4000,
      }}
      gl={{ antialias, powerPreference: "high-performance" }}
      dpr={dpr}
      frameloop={running ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} labelLayer={labelLayer} onReady={onReady} />
    </Canvas>
    <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </>
  )
}

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import R3fForceGraph from "r3f-forcegraph"
import * as THREE from "three"
import { links, nodes, nodesInSection, type GraphNode, type SectionId } from "@/lib/graph-data"
import {
  applySectionEmphasis,
  colorForNode,
  createNodeObjectFactory,
  radiusForNode,
} from "@/lib/graph-visuals"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

type Props = {
  activeSection: SectionId
  onNodeFocus?: (node: GraphNode | null) => void
  onNodeSelect?: (node: GraphNode) => void
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

function Scene({ activeSection, onNodeFocus, onNodeSelect }: Props) {
  const graphRef = useRef<GraphHandle | undefined>(undefined)
  const groupRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useSafeReducedMotion()
  const { gl, camera, size } = useThree()

  // Once the visitor grabs the graph they own the camera, until they scroll to
  // a different section — otherwise auto-framing would fight their dragging.
  const userControlled = useRef(false)
  useEffect(() => {
    userControlled.current = false
  }, [activeSection])

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

  const { nodeObject, objects } = useMemo(() => createNodeObjectFactory(), [])

  // Node ids the current section cares about. `null` means "the whole graph",
  // which is what the hero shows.
  const activeIds = useMemo(() => {
    if (activeSection === "hero") return null
    const ids = nodesInSection(activeSection)
    return ids.length > 0 ? new Set(ids) : null
  }, [activeSection])

  useFrame((_, delta) => {
    graphRef.current?.tickFrame()

    // Frame-rate independent easing — same feel on a 60Hz and 144Hz display.
    // Kept brisk: at slower rates the camera never actually arrived before the
    // next section took over, so it read as permanently chasing the scroll.
    const ease = 1 - Math.exp(-5.5 * delta)

    applySectionEmphasis(objects, activeIds, ease)

    const group = groupRef.current
    if (!group || objects.size === 0) return

    const focus = activeIds
      ? [...objects.entries()].filter(([id]) => activeIds.has(id)).map(([, object]) => object)
      : [...objects.values()]

    if (focus.length === 0) return

    const box = boundsOf(focus)
    const centre = box.getCenter(new THREE.Vector3())
    const span = box.getSize(new THREE.Vector3())
    // Floor the radius: a section cluster can be only a handful of nodes, and
    // fitting that tightly flies the camera uncomfortably close.
    const radius = Math.max(span.x, span.y, 330) / 2

    // On wide screens the written content sits in a left column, so the graph
    // is nudged right to sit beside it rather than underneath it.
    const lateralOffset = size.width >= 1024 ? radius * 0.26 : 0
    const desiredGroupPos = centre.clone().negate().setX(-centre.x + lateralOffset)

    group.position.lerp(desiredGroupPos, ease)

    if (userControlled.current) return

    const perspective = camera as THREE.PerspectiveCamera
    const vFov = (perspective.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height))
    // The hero sits slightly inside a perfect fit so the graph bleeds past the
    // frame edges and feels immersive. Section views back off to a true fit,
    // where clipped nodes would just read as broken rather than dramatic.
    const margin = activeIds ? 0.88 : 0.82
    const desired = (radius / Math.tan(Math.min(vFov, hFov) / 2)) * margin

    // Only the distance is touched, never the direction — that leaves
    // OrbitControls' rotation and auto-rotate free to do their own thing.
    camera.position.setLength(THREE.MathUtils.damp(camera.position.length(), desired, 4.5, delta))
  })

  const handleHover = useCallback(
    (node: GraphNode | null) => {
      gl.domElement.style.cursor = node ? "pointer" : "grab"
      onNodeFocus?.(node)
    },
    [gl, onNodeFocus],
  )

  // Moving the cursor from the canvas onto the text column never produces a
  // "no node" event from the graph, so without this the last hovered node stays
  // latched and its readout won't go away.
  useEffect(() => {
    const canvas = gl.domElement
    const clear = () => onNodeFocus?.(null)
    canvas.addEventListener("pointerleave", clear)
    return () => canvas.removeEventListener("pointerleave", clear)
  }, [gl, onNodeFocus])

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
          nodeColor={(node: GraphNode) => colorForNode(node)}
          linkColor={() => "#8a7a5f"}
          linkOpacity={0.22}
          linkWidth={0.4}
          // Particles travelling the edges read as data moving through the
          // graph — the thing these systems actually do.
          linkDirectionalParticles={prefersReducedMotion ? 0 : 2}
          linkDirectionalParticleWidth={1.1}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={() => "#f0b429"}
          d3AlphaDecay={0.018}
          d3VelocityDecay={0.32}
          warmupTicks={80}
          cooldownTime={prefersReducedMotion ? 0 : 9000}
          onNodeHover={handleHover as never}
          onNodeClick={((node: GraphNode) => onNodeSelect?.(node)) as never}
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

      {!prefersReducedMotion && (
        <EffectComposer>
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  )
}

export default function GraphCanvas({ activeSection, onNodeFocus, onNodeSelect }: Props) {
  const [visible, setVisible] = useState(true)

  // The force simulation is a continuous render loop; there's no reason to burn
  // GPU on it while the tab is in the background.
  useEffect(() => {
    const handleVisibility = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 40, 280], fov: 52, near: 1, far: 4000 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "never"}
      onCreated={({ scene }) => {
        // Fog gives the far side of the graph depth instead of a flat cloud.
        scene.fog = new THREE.FogExp2("#0a0704", 0.0016)
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene
        activeSection={activeSection}
        onNodeFocus={onNodeFocus}
        onNodeSelect={onNodeSelect}
      />
    </Canvas>
  )
}

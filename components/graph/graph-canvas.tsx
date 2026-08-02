"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import R3fForceGraph from "r3f-forcegraph"
import * as THREE from "three"
import { links, nodes, type GraphNode } from "@/lib/graph-data"
import { colorForNode, createNodeObjectFactory, radiusForNode } from "@/lib/graph-visuals"
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion"

type Props = {
  onNodeFocus?: (node: GraphNode | null) => void
}

type GraphHandle = {
  tickFrame: () => void
  getGraphBbox: () => { x: [number, number]; y: [number, number]; z: [number, number] }
}

function Scene({ onNodeFocus }: Props) {
  const graphRef = useRef<GraphHandle | undefined>(undefined)
  const prefersReducedMotion = useSafeReducedMotion()
  const { gl, camera, size } = useThree()
  // Distance the camera should sit at to frame the whole graph. Starts null and
  // is computed from the real layout once the simulation has spread out.
  const targetDistance = useRef<number | null>(null)
  // Auto-framing is only active while the layout is still moving. Once it
  // settles we stop touching the camera so OrbitControls owns it outright and
  // the two aren't writing to the same position every frame.
  const isAutoFraming = useRef(true)
  const groupRef = useRef<THREE.Group>(null)

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

  const nodeObject = useMemo(() => createNodeObjectFactory(), [])

  // The force simulation only advances when something ticks it. The same loop
  // eases the camera out to whatever distance frames the settled layout —
  // without this the graph spreads past the viewport and gets clipped.
  useFrame((_, delta) => {
    graphRef.current?.tickFrame()

    if (!isAutoFraming.current) return

    const bbox = graphRef.current?.getGraphBbox?.()
    if (bbox && groupRef.current) {
      const spanX = bbox.x[1] - bbox.x[0]
      const spanY = bbox.y[1] - bbox.y[0]
      // Only the on-screen axes decide how wide the frustum needs to be.
      // Folding depth in as well pushes the camera much too far back, since a
      // 3D layout is roughly as deep as it is wide.
      const radius = Math.max(spanX, spanY, 1) / 2

      if (Number.isFinite(radius)) {
        // The simulation's centroid drifts away from the origin as it settles,
        // so the whole graph is shifted back to centre rather than moving the
        // orbit target (which OrbitControls owns).
        const centre = new THREE.Vector3(
          (bbox.x[0] + bbox.x[1]) / 2,
          (bbox.y[0] + bbox.y[1]) / 2,
          (bbox.z[0] + bbox.z[1]) / 2,
        )
        groupRef.current.position.lerp(centre.negate(), 1 - Math.exp(-2.5 * delta))

        const perspective = camera as THREE.PerspectiveCamera
        const vFov = (perspective.fov * Math.PI) / 180
        // Portrait viewports are limited by horizontal FOV, so take whichever
        // is tighter.
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height))
        // Slightly under a perfect fit, so the graph fills the frame and bleeds
        // past the edges rather than sitting politely inside them.
        targetDistance.current = (radius / Math.tan(Math.min(vFov, hFov) / 2)) * 0.82
      }
    }

    const desired = targetDistance.current
    if (desired) {
      const current = camera.position.length()
      camera.position.setLength(THREE.MathUtils.damp(current, desired, 1.6, delta))
    }
  })

  const handleHover = useCallback(
    (node: GraphNode | null) => {
      gl.domElement.style.cursor = node ? "pointer" : "grab"
      onNodeFocus?.(node)
    },
    [gl, onNodeFocus],
  )

  return (
    <>
      {/* Low ambient so the emissive cores do the lighting work, plus one key
          light to give the halos some form. */}
      <ambientLight intensity={0.55} />
      <pointLight position={[120, 120, 120]} intensity={1.2} color="#ffd9a0" />
      <pointLight position={[-140, -80, -60]} intensity={0.5} color="#4a9fc4" />

      <group ref={groupRef}>
      <R3fForceGraph
        // The library's ref type is generic over node/link shapes and doesn't
        // infer cleanly here; only `tickFrame` and `getGraphBbox` are used.
        ref={graphRef as never}
        graphData={graphData}
        nodeThreeObject={nodeObject as never}
        nodeVal={(node: GraphNode) => radiusForNode(node)}
        nodeColor={(node: GraphNode) => colorForNode(node)}
        linkColor={() => "#8a7a5f"}
        linkOpacity={0.22}
        linkWidth={0.4}
        // Particles travelling the edges read as data moving through the graph —
        // the thing these systems actually do.
        linkDirectionalParticles={prefersReducedMotion ? 0 : 2}
        linkDirectionalParticleWidth={1.1}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={() => "#f0b429"}
        d3AlphaDecay={0.018}
        d3VelocityDecay={0.32}
        warmupTicks={80}
        cooldownTime={prefersReducedMotion ? 0 : 9000}
        onEngineStop={() => {
          isAutoFraming.current = false
        }}
        onNodeHover={handleHover as never}
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

export default function GraphCanvas({ onNodeFocus }: Props) {
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
      camera={{ position: [0, 40, 280], fov: 52, near: 1, far: 2000 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "never"}
      onCreated={({ scene }) => {
        // Fog gives the far side of the graph depth instead of a flat cloud.
        scene.fog = new THREE.FogExp2("#0a0704", 0.0022)
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene onNodeFocus={onNodeFocus} />
    </Canvas>
  )
}

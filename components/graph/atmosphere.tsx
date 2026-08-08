"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Fine dust hanging in the space around the graph.
 *
 * Nothing sat between the camera and the nodes, so the graph read as flat
 * shapes on a black rectangle with no sense of depth. Particles at varying
 * distances give the eye something to judge distance against, and they're what
 * separates "a diagram on a dark background" from "an object photographed in a
 * room".
 *
 * Drawn as a single `Points` object — one draw call for the whole field, which
 * is why this costs almost nothing next to the nodes themselves.
 */
export function Atmosphere({
  count = 700,
  radius = 900,
  color = "#f0b429",
}: {
  count?: number
  radius?: number
  color?: string
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    // Per-particle so they don't all pulse together, which reads as a strobe.
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      /*
        Cube-root of a uniform random, so the points spread evenly through the
        volume. Without it they bunch towards the centre, because a shell at
        radius r has area proportional to r squared and a naive random radius
        gives every shell the same number of points.
      */
      const r = radius * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      phases[i] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        attribute float aPhase;
        uniform float uTime;
        varying float vFade;

        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);

          // Slow independent twinkle, so the field breathes rather than blinks.
          vFade = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.5 + aPhase));

          // Perspective sizing: near motes are larger, which is most of what
          // sells the depth.
          gl_PointSize = (300.0 / -mv.z) * (0.6 + 0.8 * fract(aPhase));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vFade;

        void main() {
          // Round the square point sprite off and feather its edge, otherwise
          // every mote is a visible little box.
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(uColor, soft * vFade * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [count, radius, color])

  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points) return

    material.uniforms.uTime.value = state.clock.elapsedTime
    // Eased in rather than popped on, so the dust arrives with the graph.
    material.uniforms.uOpacity.value = THREE.MathUtils.damp(
      material.uniforms.uOpacity.value,
      0.5,
      1.4,
      delta,
    )

    // A drift slow enough that you notice it only if you stop and look.
    points.rotation.y += delta * 0.008
    points.rotation.x += delta * 0.003
  })

  return (
    // Dust must never intercept the pointer — the nodes underneath it are the
    // only thing meant to be hoverable.
    <points ref={pointsRef} geometry={geometry} material={material} raycast={() => {}} />
  )
}

"use client"

import StarWarsSky from "@/components/looks/star-wars-sky"
import StarWarsFx from "@/components/looks/star-wars-fx"

// The look's entry chunk: one file per look, composing its effects.
export default function StarWars({ jump }: { jump: boolean }) {
  return (
    <>
      <StarWarsSky jump={jump} />
      <StarWarsFx />
    </>
  )
}

// Only what static-graph.tsx uses. The package ships with r3f-forcegraph and has no types of its own.
declare module "d3-force-3d" {
  type Force = { (alpha: number): void }
  type Sim<N> = {
    force(name: string, force: unknown): Sim<N>
    stop(): Sim<N>
    tick(iterations?: number): Sim<N>
  }
  export function forceSimulation<N>(nodes: N[], dimensions?: number): Sim<N>
  export function forceLink<L>(links: L[]): Force & {
    id(fn: (node: { id: string }) => string): ReturnType<typeof forceLink<L>>
    distance(d: number): ReturnType<typeof forceLink<L>>
  }
  export function forceManyBody(): Force & { strength(s: number): ReturnType<typeof forceManyBody> }
  export function forceX(): Force & { strength(s: number): Force }
  export function forceY(): Force & { strength(s: number): Force }
  export function forceCollide(radius: (node: never) => number): Force
}

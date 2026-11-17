"use client"

import { useEffect, useState } from "react"

export type GraphTheme = "dark" | "light"

// Dark adds light (emissive nodes, bloom); light reads as print, with inks pushed apart in hue.
export const FAMILY_COLOR = {
  dark: { self: "#fff4df", role: "#f0b429", project: "#e07b39", tech: "#4a9fc4" },
  light: { self: "#2b2318", role: "#bd8410", project: "#9c2c1a", tech: "#22607d" },
} as const

export type GraphPalette = {
  theme: GraphTheme
  self: string
  role: string
  project: string
  tech: string
  link: string
  particle: string
  fog: string
}

// The default look keeps its hand-tuned hexes; a fan look supplies its own --node-* tokens.
const DEFAULT: Record<GraphTheme, GraphPalette> = {
  dark: { theme: "dark", ...FAMILY_COLOR.dark, link: "#c9b48c", particle: "#f0b429", fog: "#0a0704" },
  light: { theme: "light", ...FAMILY_COLOR.light, link: "#8c7f70", particle: "#bd8410", fog: "#f7ecdd" },
}

let probe: CanvasRenderingContext2D | null = null

// three.js can't parse oklch, so let the browser resolve the token to pixels and read them back.
function toHex(css: string): string {
  probe ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
    willReadFrequently: true,
  })
  if (!probe) return "#888888"
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#888888"
  probe.fillStyle = css
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
}

export function readGraphPalette(): GraphPalette {
  const root = document.documentElement
  // Every look is drawn dark, even if a light class is left on <html>.
  const theme: GraphTheme = !root.dataset.look && root.classList.contains("light") ? "light" : "dark"
  if (!root.dataset.look) return DEFAULT[theme]
  const style = getComputedStyle(root)
  const token = (name: string) => toHex(style.getPropertyValue(name).trim())
  return {
    theme,
    self: token("--foreground"),
    role: token("--node-role"),
    project: token("--node-project"),
    tech: token("--node-tech"),
    link: token("--muted-foreground"),
    particle: token("--primary"),
    fog: token("--background"),
  }
}

/** The graph's colours, re-read whenever the theme class or the look changes on <html>. */
export function useGraphPalette(): GraphPalette {
  const [palette, setPalette] = useState<GraphPalette>(DEFAULT.dark)
  useEffect(() => {
    const update = () =>
      setPalette((current) => {
        const next = readGraphPalette()
        return JSON.stringify(next) === JSON.stringify(current) ? current : next
      })
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-look"] })
    return () => observer.disconnect()
  }, [])
  return palette
}

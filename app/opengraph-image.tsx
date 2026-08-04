import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"
export const alt = "Harianth Kalavala — AI Engineer"

const BG = "#0a0704"
const FG = "#f8f5ef"
const MUTED = "#a59d92"
const AMBER = "#f2b54a"

// The same four inks the graph uses, so the card is recognisably the same
// object as the page it links to.
const SELF = "#fff4df"
const ROLE = "#f0b429"
const PROJECT = "#e07b39"
const TECH = "#4a9fc4"

const EYEBROW = "AI ENGINEER · PHOENIX, ARIZONA"
const NAME = "Harianth Kalavala"
const LINE = "I build retrieval systems that turn unstructured data into something production can depend on."
const METRICS = "100K+ data assets · ~35% faster retrieval"

/**
 * Satori can't read the app's next/font faces, so the two that carry the
 * identity are fetched directly. Google serves TTF rather than WOFF2 when the
 * request doesn't claim to be a modern browser, which is what satori needs.
 *
 * Returns null instead of throwing: a font CDN hiccup at build time should
 * degrade the card to a system face, not fail the deploy.
 */
async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((res) => res.text())

    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1]
    if (!url) return null

    return await fetch(url).then((res) => res.arrayBuffer())
  } catch {
    return null
  }
}

/** A node and its label-free dot, positioned in the illustration's own space. */
function dot(cx: number, cy: number, r: number, fill: string, opacity = 1) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
}

function edge(x1: number, y1: number, x2: number, y2: number) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8a7a5f" strokeWidth={1.4} opacity={0.4} />
}

export default async function OpengraphImage() {
  // Each face is subset to exactly the text it renders. Satori falls back
  // per-glyph across whatever fonts are registered, so a string with no font
  // covering it gets assembled from several at once — which collapses the word
  // spacing. Every block below therefore names a face loaded with its own text.
  const [body, serif, mono] = await Promise.all([
    googleFont("Manrope", 400, LINE),
    googleFont("Instrument+Serif", 400, NAME),
    googleFont("JetBrains+Mono", 400, EYEBROW + METRICS),
  ])

  const fonts = [
    ...(body ? [{ name: "Manrope", data: body, weight: 400 as const, style: "normal" as const }] : []),
    ...(serif ? [{ name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const }] : []),
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* The graph, bled off the right edge so the card looks like a window
            onto something larger rather than a centred logo. */}
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex" }}>
          <svg width={620} height={630} viewBox="0 0 620 630">
            {edge(330, 315, 170, 180)}
            {edge(330, 315, 500, 200)}
            {edge(330, 315, 200, 470)}
            {edge(330, 315, 470, 440)}
            {edge(330, 315, 340, 120)}
            {edge(330, 315, 155, 345)}
            {edge(170, 180, 250, 60)}
            {edge(170, 180, 95, 195)}
            {edge(500, 200, 580, 90)}
            {edge(500, 200, 555, 320)}
            {edge(200, 470, 120, 560)}
            {edge(470, 440, 390, 545)}
            {edge(470, 440, 555, 320)}
            {edge(155, 345, 60, 430)}
            {edge(340, 120, 250, 60)}

            {/* Tech — smallest and coolest, so they read as background detail. */}
            {dot(250, 60, 8, TECH)}
            {dot(95, 195, 8, TECH)}
            {dot(580, 90, 8, TECH)}
            {dot(555, 320, 8, TECH)}
            {dot(390, 545, 8, TECH)}
            {dot(120, 560, 8, TECH)}
            {dot(60, 430, 8, TECH)}

            {dot(340, 120, 16, PROJECT)}
            {dot(470, 440, 16, PROJECT)}
            {dot(155, 345, 14, PROJECT)}

            {dot(170, 180, 18, ROLE)}
            {dot(500, 200, 18, ROLE)}
            {dot(200, 470, 18, ROLE)}

            {/* Halo then core — plain circles, since satori has no blur. */}
            {dot(330, 315, 54, SELF, 0.12)}
            {dot(330, 315, 30, SELF)}
          </svg>
        </div>

        {/* Fades the graph out beneath the text instead of letting the two
            collide, the same trick the hero uses at its bottom edge. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(to right, ${BG} 48%, rgba(10, 7, 4, 0.85) 64%, rgba(10, 7, 4, 0) 90%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 720,
            height: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: mono ? "JetBrains Mono" : "sans-serif",
              fontSize: 20,
              letterSpacing: 5,
              color: AMBER,
            }}
          >
            {EYEBROW}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: serif ? "Instrument Serif" : "serif",
              fontSize: 92,
              color: FG,
              marginTop: 24,
              lineHeight: 1,
            }}
          >
            {NAME}
          </div>

          <div style={{ display: "flex", width: 92, height: 2, background: AMBER, marginTop: 34 }} />

          <div
            style={{
              display: "flex",
              fontFamily: body ? "Manrope" : "sans-serif",
              fontSize: 26,
              color: MUTED,
              marginTop: 32,
              lineHeight: 1.45,
            }}
          >
            {LINE}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: mono ? "JetBrains Mono" : "sans-serif",
              fontSize: 19,
              color: "#8a8076",
              marginTop: 36,
            }}
          >
            {METRICS}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  )
}

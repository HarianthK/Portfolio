type PulseConfig = {
  type: "right" | "down"
  offset: string
  color: string
  duration: number
  delay: number
}

// Bright, glowing colors — read as an accent against the near-black dark background.
const darkPulses: PulseConfig[] = [
  { type: "right", offset: "18%", color: "#e07b39", duration: 7, delay: 0 },
  { type: "right", offset: "62%", color: "#f0b429", duration: 9, delay: -3.5 },
  { type: "right", offset: "84%", color: "#ffc857", duration: 8, delay: -1.5 },
  { type: "down", offset: "22%", color: "#f0b429", duration: 8.5, delay: -2 },
  { type: "down", offset: "70%", color: "#e07b39", duration: 7.5, delay: -5 },
]

// Deeper, more saturated colors with a soft shadow instead of a glow — a bright
// "neon" bloom disappears (or looks wrong) against a light background, so these
// read more like a marker stroke than a light source.
const lightPulses: PulseConfig[] = [
  { type: "right", offset: "18%", color: "#c2650f", duration: 7, delay: 0 },
  { type: "right", offset: "62%", color: "#a83e17", duration: 9, delay: -3.5 },
  { type: "right", offset: "84%", color: "#8a5a1f", duration: 8, delay: -1.5 },
  { type: "down", offset: "22%", color: "#a83e17", duration: 8.5, delay: -2 },
  { type: "down", offset: "70%", color: "#c2650f", duration: 7.5, delay: -5 },
]

function Pulse({ p, i, brightTip }: { p: PulseConfig; i: number; brightTip: boolean }) {
  const isRight = p.type === "right"
  const tip = brightTip ? "#fff" : p.color
  const shadow = brightTip ? `0 0 12px 1px ${p.color}` : `0 1px 5px 0 ${p.color}88`

  return (
    <div
      key={i}
      className={isRight ? "absolute h-[2px] w-[120px] animate-pulse-right" : "absolute w-[2px] h-[120px] animate-pulse-down"}
      style={{
        [isRight ? "top" : "left"]: p.offset,
        background: isRight
          ? `linear-gradient(to right, transparent, ${p.color} 65%, ${tip})`
          : `linear-gradient(to bottom, transparent, ${p.color} 65%, ${tip})`,
        boxShadow: shadow,
        animationDuration: `${p.duration}s`,
        animationDelay: `${p.delay}s`,
      }}
    />
  )
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Quiet data-grid, a nod to the subject matter rather than pure decoration */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Signal pulses traveling along grid lines — different treatment per theme,
          since a glow that reads as a light source on dark just looks wrong on light. */}
      <div className="hidden dark:block">
        {darkPulses.map((p, i) => (
          <Pulse key={i} p={p} i={i} brightTip />
        ))}
      </div>
      <div className="block dark:hidden">
        {lightPulses.map((p, i) => (
          <Pulse key={i} p={p} i={i} brightTip={false} />
        ))}
      </div>

      {/* Vignette to keep text legible */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  )
}

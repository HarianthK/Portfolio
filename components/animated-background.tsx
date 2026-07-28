const pulses = [
  { type: "right" as const, offset: "18%", color: "#ec4899", duration: 7, delay: 0 },
  { type: "right" as const, offset: "62%", color: "#a855f7", duration: 9, delay: -3.5 },
  { type: "right" as const, offset: "84%", color: "#6366f1", duration: 8, delay: -1.5 },
  { type: "down" as const, offset: "22%", color: "#6366f1", duration: 8.5, delay: -2 },
  { type: "down" as const, offset: "70%", color: "#a855f7", duration: 7.5, delay: -5 },
]

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Quiet data-grid, a nod to the subject matter rather than pure decoration */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,138,196,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,138,196,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Signal pulses traveling along grid lines */}
      {pulses.map((p, i) =>
        p.type === "right" ? (
          <div
            key={i}
            className="absolute h-[2px] w-[120px] animate-pulse-right"
            style={{
              top: p.offset,
              background: `linear-gradient(to right, transparent, ${p.color} 65%, #fff)`,
              boxShadow: `0 0 12px 1px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ) : (
          <div
            key={i}
            className="absolute w-[2px] h-[120px] animate-pulse-down"
            style={{
              left: p.offset,
              background: `linear-gradient(to bottom, transparent, ${p.color} 65%, #fff)`,
              boxShadow: `0 0 12px 1px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ),
      )}

      {/* Vignette to keep text legible */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  )
}

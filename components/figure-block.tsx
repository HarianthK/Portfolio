/**
 * A single number given room to land.
 *
 * The metrics were previously buried mid-sentence in body copy, which is
 * exactly where someone scanning for thirty seconds misses them. This is
 * deliberately *not* a row of four stat tiles — that pattern is the one the
 * template version used. These are meant to punctuate a section, two or three
 * at most, at points where the eye is already resting.
 */
export function FigureBlock({
  value,
  label,
  context,
}: {
  value: string
  label: string
  context?: string
}) {
  return (
    <div className="border-t border-primary/25 pt-4">
      <p className="font-mono text-4xl leading-none text-primary md:text-5xl">{value}</p>
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/80">
        {label}
      </p>
      {context && (
        <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">{context}</p>
      )}
    </div>
  )
}

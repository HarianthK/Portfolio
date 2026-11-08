// One number given room to land, not a row of stat tiles. See DOCS.md, Section shapes.
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
    <div className="pt-1 md:border-t md:border-primary/25 md:pt-4">
      <p className="font-mono text-4xl leading-none text-primary md:text-5xl">{value}</p>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
        {label}
      </p>
      {context && (
        <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">{context}</p>
      )}
    </div>
  )
}

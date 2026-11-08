"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

// The extra text stays in the page, only hidden, so it is still indexed and every claim is there.
export function ReadMore({ more, link }: { more: ReactNode; link: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div>
      <div id={id} hidden={!open} className="mt-3 space-y-3">
        {more}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-6">
        {link}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center gap-1 font-mono text-xs text-foreground/80 underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
        >
          {open ? "Show less" : "Read more"}
          <ChevronDown aria-hidden className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  )
}

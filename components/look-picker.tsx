"use client"

import { useEffect, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LOOKS, LOOK_STORAGE_KEY, type LookId } from "@/lib/looks"

// Each look's effects stay in their own chunk, fetched only when that look is on.
const EFFECTS: Partial<Record<LookId, ComponentType<{ jump: boolean }>>> = {
  "star-wars": dynamic(() => import("@/components/looks/star-wars"), { ssr: false }),
}

// Looks that only make sense on a dark page switch the light/dark theme too.
const DARK_ONLY: LookId[] = ["star-wars"]

export function LookPicker() {
  const { setTheme } = useTheme()
  const [look, setLook] = useState<LookId>("default")
  const [jump, setJump] = useState(false)

  useEffect(() => {
    // The boot script in layout has already applied any saved look to <html>.
    const saved = document.documentElement.dataset.look as LookId | undefined
    if (saved) setLook(saved)
  }, [])

  function choose(next: LookId) {
    const root = document.documentElement
    if (next === "default") root.removeAttribute("data-look")
    else root.setAttribute("data-look", next)
    try {
      if (next === "default") localStorage.removeItem(LOOK_STORAGE_KEY)
      else localStorage.setItem(LOOK_STORAGE_KEY, next)
    } catch {}
    if (DARK_ONLY.includes(next)) setTheme("dark")
    setJump(next !== "default")
    setLook(next)
  }

  const Effect = EFFECTS[look]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        popoverTarget="look-menu"
        aria-label="Choose a look"
        className="text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-[1.1rem] w-[1.1rem]" />
      </Button>
      <div
        id="look-menu"
        popover="auto"
        className="fixed inset-auto right-4 top-14 m-0 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
      >
        <fieldset>
          <legend className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
            Look
          </legend>
          {LOOKS.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input
                type="radio"
                name="look"
                value={option.id}
                checked={look === option.id}
                onChange={() => choose(option.id)}
                className="accent-primary"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </div>
      {Effect && <Effect key={look} jump={jump} />}
    </>
  )
}

"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LOOKS, LOOK_STORAGE_KEY, PREV_THEME_KEY, type LookId } from "@/lib/looks"

// Each look's effects stay in their own chunk, fetched only when that look is on (or about to be).
const LOADERS = {
  "star-wars": () => import("@/components/looks/star-wars"),
  "harry-potter": () => import("@/components/looks/harry-potter"),
  "lord-of-the-rings": () => import("@/components/looks/lord-of-the-rings"),
  "game-of-thrones": () => import("@/components/looks/game-of-thrones"),
}
const EFFECTS = Object.fromEntries(
  Object.entries(LOADERS).map(([id, load]) => [id, dynamic(load, { ssr: false })]),
) as Partial<Record<LookId, ComponentType<{ jump: boolean }>>>

const store = {
  get: (k: string) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k) } catch {} },
}

export function LookPicker() {
  const { resolvedTheme, setTheme } = useTheme()
  const [look, setLook] = useState<LookId>("default")
  const [jump, setJump] = useState(false)
  const [motion, setMotion] = useState(0)
  const prevTheme = useRef<string | null>(null)
  const prefetched = useRef(false)
  const menu = useRef<HTMLDivElement>(null)
  // Arrowing through the radios previews each look; only a deliberate pick plays the Star Wars jump.
  const arrowed = useRef(false)

  useEffect(() => {
    // The boot script in layout has already applied any saved look to <html>.
    const saved = document.documentElement.dataset.look as LookId | undefined
    if (saved) setLook(saved)
    // Turning reduced motion on or off mid-visit remounts the look so it follows at once.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => {
      setJump(false)
      setMotion((n) => n + 1)
    }
    mq.addEventListener("change", onChange)
    // Opening the menu puts focus on the chosen option; the popover returns it to the button on close.
    const el = menu.current
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === "open") el?.querySelector<HTMLInputElement>("input:checked")?.focus()
    }
    el?.addEventListener("toggle", onToggle)
    return () => {
      mq.removeEventListener("change", onChange)
      el?.removeEventListener("toggle", onToggle)
    }
  }, [])

  // Fetch every look's code when the visitor reaches for the button, so a choice shows at once.
  function prefetch() {
    if (prefetched.current) return
    prefetched.current = true
    Object.values(LOADERS).forEach((load) => load().catch(() => {}))
  }

  function choose(next: LookId) {
    const root = document.documentElement
    if (next === "default") {
      root.removeAttribute("data-look")
      store.del(LOOK_STORAGE_KEY)
      // Give back the light/dark choice the visitor had before trying a look.
      const prev = prevTheme.current ?? store.get(PREV_THEME_KEY)
      if (prev) setTheme(prev)
      prevTheme.current = null
      store.del(PREV_THEME_KEY)
    } else {
      // Every look is drawn dark; remember the visitor's own choice on the way in.
      if (look === "default" && resolvedTheme) {
        prevTheme.current = resolvedTheme
        store.set(PREV_THEME_KEY, resolvedTheme)
      }
      root.setAttribute("data-look", next)
      store.set(LOOK_STORAGE_KEY, next)
      setTheme("dark")
    }
    setJump(next !== "default" && !arrowed.current)
    arrowed.current = false
    setLook(next)
  }

  const current = LOOKS.find((l) => l.id === look) ?? LOOKS[0]
  const Effect = EFFECTS[look]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        popoverTarget="look-menu"
        aria-label={`Look: ${current.label}. Choose a look`}
        title={`Look: ${current.label}`}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className="relative size-11 rounded-full text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-[1.1rem] w-[1.1rem]" />
        {look !== "default" && (
          <span
            aria-hidden
            className="absolute right-2 top-2 size-2 rounded-full ring-2 ring-background"
            style={{ background: current.swatch[1] }}
          />
        )}
      </Button>
      <div
        id="look-menu"
        ref={menu}
        popover="auto"
        className="fixed inset-auto right-4 top-16 m-0 md:right-[max(3.5rem,calc((100vw-72rem)/2))] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
      >
        <fieldset onKeyDown={(e) => (arrowed.current = e.key.startsWith("Arrow"))}>
          <legend className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
            Look
          </legend>
          {LOOKS.map((option) => (
            <label
              key={option.id}
              className="flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-1.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring"
            >
              <input
                type="radio"
                name="look"
                value={option.id}
                checked={look === option.id}
                onChange={() => choose(option.id)}
                className="accent-primary focus-visible:outline-none"
              />
              {/* Primary and accent dots on a disc of the look's background, ringed so it shows on any menu. */}
              <span
                aria-hidden
                className="flex items-center gap-0.5 rounded-full p-1 ring-1 ring-border"
                style={{ background: option.swatch[0] }}
              >
                {option.swatch.slice(1).map((c) => (
                  <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
                ))}
              </span>
              {option.label}
            </label>
          ))}
        </fieldset>
      </div>
      {Effect && <Effect key={`${look}-${motion}`} jump={jump} />}
    </>
  )
}

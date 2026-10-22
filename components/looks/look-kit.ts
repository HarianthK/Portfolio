// Shared plumbing for the fan looks: a page-wide canvas, section dividers and heading reveals.
// Each look supplies only its CSS and its drawing. See DOCS.md "Looks".

export const isStill = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches
export const rand = (a: number, b: number) => a + Math.random() * (b - a)

// Clicks on anything a visitor reads or uses never count as a click on the background.
export const NOT_BACKGROUND =
  "a,button,input,textarea,select,label,summary,[role=button],[popover],canvas,svg,img,p,h1,h2,h3,h4,li,dt,dd,span"

export function addStyle(css: string) {
  const style = document.createElement("style")
  style.textContent = css
  document.head.append(style)
  return () => style.remove()
}

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, now: number) => boolean | void

// A fixed canvas at the given stacking level. draw returns false when nothing is moving, which
// idles the loop until wake() is called; with reduced motion it is drawn once per resize.
export function canvasLayer(z: number, draw: Draw, onResize?: (w: number, h: number) => void) {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  canvas.style.cssText = `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${z}`
  document.body.append(canvas)
  const ctx = canvas.getContext("2d")!
  const still = isStill()
  let w = 0, h = 0, frame = 0
  const tick = (now: number) => {
    frame = 0
    ctx.clearRect(0, 0, w, h)
    if (draw(ctx, w, h, now) !== false && !still) frame = requestAnimationFrame(tick)
  }
  const wake = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick)
  }
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    onResize?.(w, h)
    wake()
  }
  const onVisibility = () => (document.hidden ? (cancelAnimationFrame(frame), (frame = 0)) : wake())
  resize()
  window.addEventListener("resize", resize)
  document.addEventListener("visibilitychange", onVisibility)
  return {
    wake,
    stop() {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.remove()
    },
  }
}

// A divider made by make(i) on top of every section below the hero; it gets "lit" when its section
// scrolls into view (at once with reduced motion). Headings get waitClass, then showClass once.
export function decorate(prefix: string, make: (i: number) => HTMLElement, waitClass: string, showClass: string) {
  const still = isStill()
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section")).slice(1)
  const dividers = sections.map((section, i) => {
    const d = make(i)
    d.setAttribute("aria-hidden", "true")
    if (still) d.classList.add(`${prefix}-lit`)
    section.append(d)
    return d
  })
  const headings = Array.from(document.querySelectorAll<HTMLElement>("main > section h2"))
  if (!still) headings.forEach((hd) => hd.classList.add(waitClass))
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const i = sections.indexOf(e.target as HTMLElement)
        if (i >= 0) dividers[i].classList.add(`${prefix}-lit`)
        else e.target.classList.replace(waitClass, showClass)
        io.unobserve(e.target)
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  )
  if (!still) [...sections, ...headings].forEach((el) => io.observe(el))
  return () => {
    io.disconnect()
    dividers.forEach((d) => d.remove())
    headings.forEach((hd) => hd.classList.remove(waitClass, showClass))
  }
}

// Calls fn with the pointer position on mouse movement (fine pointers only) and on background clicks.
export function pointer(onMove: ((x: number, y: number) => void) | null, onClick: ((x: number, y: number) => void) | null) {
  const move = (e: PointerEvent) => e.pointerType === "mouse" && onMove?.(e.clientX, e.clientY)
  const click = (e: MouseEvent) => {
    const target = e.target as Element | null
    if (target?.closest(NOT_BACKGROUND) || String(window.getSelection() ?? "")) return
    onClick?.(e.clientX, e.clientY)
  }
  const moving = onMove && hasFinePointer() && !isStill()
  if (moving) window.addEventListener("pointermove", move, { passive: true })
  if (onClick && !isStill()) document.addEventListener("click", click)
  return () => {
    window.removeEventListener("pointermove", move)
    document.removeEventListener("click", click)
  }
}

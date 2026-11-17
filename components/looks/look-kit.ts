// Shared plumbing for the fan looks: page-wide canvases, section dividers and heading reveals.
// Each look supplies only its CSS and its drawing. See DOCS.md "Looks".

const mq = (q: string) => window.matchMedia(q).matches
// Reduced motion, or the visitor asked to save data: draw one still frame and add no motion.
export const isStill = () =>
  mq("(prefers-reduced-motion: reduce)") || Boolean((navigator as { connection?: { saveData?: boolean } }).connection?.saveData)
export const hasFinePointer = () => mq("(hover: hover) and (pointer: fine)")
// Phones and touch screens get fewer particles and 30 fps.
export const isLite = () => window.innerWidth < 640 || mq("(pointer: coarse)")
export const rand = (a: number, b: number) => a + Math.random() * (b - a)

// Anything a visitor reads or uses: never a click on the background, never under a cursor effect.
export const NOT_BACKGROUND =
  "a,button,input,textarea,select,label,summary,[role=button],[popover],canvas,svg,img,p,h1,h2,h3,h4,li,dt,dd,span"

// Where the page's text, controls and graphs sit, per section, measured from the real layout.
const TEXT = "h1,h2,h3,p,li,dt,dd,a,button,canvas"
type Span = { top: number; bottom: number; left: number; right: number; margin: number }
function measure(): Span[] {
  return Array.from(document.querySelectorAll<HTMLElement>("main > section")).map((sec) => {
    let left = Infinity, right = -Infinity, margin = Infinity
    for (const el of sec.querySelectorAll(TEXT)) {
      const b = el.getBoundingClientRect()
      if (b.width < 2) continue
      left = Math.min(left, b.left)
      right = Math.max(right, b.right)
      if (el.tagName !== "CANVAS") margin = Math.min(margin, b.left, window.innerWidth - b.right)
    }
    const b = sec.getBoundingClientRect()
    return { top: b.top + window.scrollY, bottom: b.bottom + window.scrollY, left, right, margin }
  })
}

// The column of text and graphs across the sections on screen now, and the narrowest text margin
// beside it (graphs aside), on screen now and anywhere on the page.
export function textColumn(spans: Span[]) {
  const y0 = window.scrollY, y1 = y0 + window.innerHeight
  let left = Infinity, right = -Infinity, margin = Infinity, page = Infinity
  for (const s of spans) {
    page = Math.min(page, s.margin)
    if (s.bottom < y0 || s.top > y1) continue
    left = Math.min(left, s.left)
    right = Math.max(right, s.right)
    margin = Math.min(margin, s.margin)
  }
  return { left, right, margin, page }
}

// Fades el to `alpha` over the text column, so effects live in the margins and text stays clean.
// Re-measured when the page's layout changes; on phones the column is the whole width.
export function fadeOverText(el: HTMLElement, alpha: number, onColumn?: (c: ReturnType<typeof textColumn>) => void) {
  let spans = measure()
  let mask = ""
  const update = () => {
    const c = textColumn(spans)
    onColumn?.(c)
    const next = c.left > c.right ? "none"
      : `linear-gradient(90deg, #000 ${c.left - 56}px, rgb(0 0 0 / ${alpha}) ${c.left - 8}px, rgb(0 0 0 / ${alpha}) ${c.right + 8}px, #000 ${c.right + 56}px)`
    if (next !== mask) el.style.maskImage = mask = next
  }
  let queued = 0
  const remeasure = () => {
    queued ||= requestAnimationFrame(() => {
      queued = 0
      spans = measure()
      update()
    })
  }
  const ro = new ResizeObserver(remeasure)
  const main = document.querySelector("main") ?? document.body
  ro.observe(main)
  // The hero graph's canvas mounts after the look, and sizes itself later, so watch for both.
  const mo = new MutationObserver(() => {
    main.querySelectorAll("canvas").forEach((c) => ro.observe(c))
    remeasure()
  })
  mo.observe(main, { childList: true, subtree: true })
  main.querySelectorAll("canvas").forEach((c) => ro.observe(c))
  window.addEventListener("scroll", update, { passive: true })
  update()
  return () => {
    cancelAnimationFrame(queued)
    mo.disconnect()
    ro.disconnect()
    window.removeEventListener("scroll", update)
  }
}

export function addStyle(css: string) {
  const style = document.createElement("style")
  style.textContent = css
  document.head.append(style)
  return () => style.remove()
}

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, now: number) => boolean | void
type LayerOptions = { onResize?: (w: number, h: number) => void; mask?: number }

// A fixed canvas at stacking level z (negative: behind the text). draw returns false when nothing
// moves, which idles the loop until wake(). Still mode draws once per resize; lite caps 30 fps.
export function canvasLayer(z: number, draw: Draw, { onResize, mask }: LayerOptions = {}) {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  canvas.style.cssText = `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${z}`
  document.body.append(canvas)
  let column: ReturnType<typeof textColumn> | null = null
  const unmask = mask === undefined ? null : fadeOverText(canvas, mask, (c) => (column = c))
  const ctx = canvas.getContext("2d")!
  const still = isStill()
  let w = 0, h = 0, frame = 0, last = 0, gap = 0
  const tick = (now: number) => {
    frame = 0
    if (now - last < gap) {
      frame = requestAnimationFrame(tick)
      return
    }
    last = now
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
    gap = isLite() ? 30 : 14
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    onResize?.(w, h)
    last = 0
    wake()
  }
  const onVisibility = () => (document.hidden ? (cancelAnimationFrame(frame), (frame = 0)) : wake())
  resize()
  window.addEventListener("resize", resize)
  document.addEventListener("visibilitychange", onVisibility)
  return {
    wake,
    column: () => column,
    stop() {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      unmask?.()
      canvas.remove()
    },
  }
}

// A divider made by make(i) on top of every section below the hero: "-lit" once its section has
// been in view, "-on" while it is. Headings below the fold get waitClass, then showClass once seen.
export function decorate(prefix: string, make: (i: number) => HTMLElement, waitClass: string, showClass: string) {
  const still = isStill()
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section")).slice(1)
  const dividers = sections.map((section, i) => {
    const d = make(i)
    d.setAttribute("aria-hidden", "true")
    d.dataset.divider = ""
    // Capped and centred, so a wide screen doesn't get a full-width bar.
    Object.assign(d.style, { maxWidth: "720px", marginInline: "auto" })
    if (still) d.classList.add(`${prefix}-lit`)
    section.append(d)
    return d
  })
  // Only headings not yet on screen wait, so a reload mid-page never blinks what is already shown.
  const waiting = still
    ? []
    : Array.from(document.querySelectorAll<HTMLElement>("main > section h2")).filter(
        (hd) => hd.getBoundingClientRect().top > window.innerHeight,
      )
  waiting.forEach((hd) => hd.classList.add(waitClass))
  const show = (hd: Element) => hd.classList.replace(waitClass, showClass)
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const i = sections.indexOf(e.target as HTMLElement)
        if (i >= 0) {
          if (e.isIntersecting) dividers[i].classList.add(`${prefix}-lit`)
          dividers[i].classList.toggle(`${prefix}-on`, e.isIntersecting)
        } else if (e.isIntersecting) {
          show(e.target)
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  )
  // A jump past a heading (anchor link, fast scroll) never fires the observer, so check on scroll too.
  const onScroll = () => waiting.forEach((hd) => hd.getBoundingClientRect().top < window.innerHeight && show(hd))
  if (!still) {
    ;[...sections, ...waiting].forEach((el) => io.observe(el))
    window.addEventListener("scroll", onScroll, { passive: true })
  }
  // An unlit divider shows nothing, not the stub of a hilt or star waiting for its section.
  const unprint = addStyle(`@media print { .${waitClass} { opacity: 1 !important; } }
[data-divider] { transition: opacity 0.4s; }
[data-divider]:not(.${prefix}-lit) { opacity: 0; }`)
  return () => {
    io.disconnect()
    window.removeEventListener("scroll", onScroll)
    unprint()
    dividers.forEach((d) => d.remove())
    waiting.forEach((hd) => hd.classList.remove(waitClass, showClass))
  }
}

// Calls onMove with the pointer position (fine pointers, at most once a frame, never over text or
// controls) and onClick on clicks on the empty background.
export function pointer(onMove: ((x: number, y: number) => void) | null, onClick: ((x: number, y: number) => void) | null) {
  let at = 0
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.timeStamp - at < 16) return
    at = e.timeStamp
    if (!(e.target as Element | null)?.closest?.(NOT_BACKGROUND)) onMove?.(e.clientX, e.clientY)
  }
  const click = (e: MouseEvent) => {
    const target = e.target as Element | null
    if (e.defaultPrevented || target?.closest(NOT_BACKGROUND) || String(window.getSelection() ?? "")) return
    onClick?.(e.clientX, e.clientY)
  }
  const still = isStill()
  if (onMove && hasFinePointer() && !still) window.addEventListener("pointermove", move, { passive: true })
  if (onClick && !still) document.addEventListener("click", click)
  return () => {
    window.removeEventListener("pointermove", move)
    document.removeEventListener("click", click)
  }
}

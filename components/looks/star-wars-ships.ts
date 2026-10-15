// Original vector silhouettes, drawn in a 100-unit box with the nose toward +x. See DOCS.md "Looks".
export type ShipKind = "xwing" | "tie" | "falcon" | "destroyer"

type Ctx = CanvasRenderingContext2D

function poly(ctx: Ctx, fill: string, pts: number[], mirror = false) {
  ctx.fillStyle = fill
  ctx.beginPath()
  for (let i = 0; i < pts.length; i += 2) ctx.lineTo(pts[i], mirror ? -pts[i + 1] : pts[i + 1])
  ctx.closePath()
  ctx.fill()
}

function dot(ctx: Ctx, fill: string, x: number, y: number, r: number) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function glow(ctx: Ctx, x: number, y: number, r: number, color: string) {
  dot(ctx, color, x, y, r * 1.8)
  dot(ctx, "#ffe2b0", x, y, r * 0.8)
}

// Seen from above: the lower pair of wings shows darker and offset, so the X reads.
function xwing(ctx: Ctx) {
  for (const m of [false, true]) {
    poly(ctx, "#7d8591", [-40, 6, -18, 6, -26, 38, -37, 38], m)
    poly(ctx, "#c9ced6", [-38, 6, -14, 6, -21, 46, -33, 46], m)
    poly(ctx, "#d8473c", [-30, 12, -20, 12, -21, 18, -31, 18], m)
    poly(ctx, "#aeb4be", [-35, 44.5, 30, 45.2, 30, 46.8, -35, 47.5], m)
    poly(ctx, "#aeb4be", [-37, 36.5, 20, 37.3, 20, 38.7, -37, 39.5], m)
    poly(ctx, "#9aa1ac", [-47, 5, -24, 5, -24, 8.4, -47, 8.4], m)
    poly(ctx, "#8a919c", [-47, 9.6, -26, 9.6, -26, 13, -47, 13], m)
  }
  poly(ctx, "#d5dae1", [-44, -6, 8, -5, 46, -1.6, 52, 0, 46, 1.6, 8, 5, -44, 6])
  ctx.fillStyle = "#2a3140"
  ctx.beginPath()
  ctx.ellipse(4, 0, 8, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  for (const y of [-11.3, -6.7, 6.7, 11.3]) glow(ctx, -48, y, 1.5, "#ff6a2a")
}

// The familiar three-quarter view, kept upright: two flat hexagon panels on a ball.
function tie(ctx: Ctx) {
  poly(ctx, "#8d949f", [-31, -3, 31, -3, 31, 3, -31, 3])
  for (const s of [-1, 1]) {
    const cx = 40 * s
    poly(ctx, "#a2a9b4", [cx, -45, cx + 11, -22, cx + 11, 22, cx, 45, cx - 11, 22, cx - 11, -22])
    poly(ctx, "#2f3540", [cx, -40, cx + 8, -20, cx + 8, 20, cx, 40, cx - 8, 20, cx - 8, -20])
    ctx.strokeStyle = "#7c8490"
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (const [x, y] of [[0, -40], [8, -20], [8, 20], [0, 40], [-8, 20], [-8, -20]]) {
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx + x, y)
    }
    ctx.stroke()
    dot(ctx, "#7c8490", cx, 0, 3)
  }
  dot(ctx, "#b8bec8", 0, 0, 15)
  dot(ctx, "#232a36", 0, 0, 8)
  ctx.strokeStyle = "#8d949f"
  ctx.lineWidth = 1.2
  ctx.beginPath()
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8)
  }
  ctx.stroke()
}

// From above: a disc, two forward mandibles with a slot between, the cockpit on the right.
function falcon(ctx: Ctx) {
  ctx.globalCompositeOperation = "lighter"
  ctx.strokeStyle = "#6fc3ff"
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.arc(-8, 0, 33, Math.PI * 0.75, Math.PI * 1.25)
  ctx.stroke()
  ctx.globalCompositeOperation = "source-over"
  poly(ctx, "#c3c8cf", [16, 4, 50, 5, 50, 15, 22, 22], false)
  poly(ctx, "#c3c8cf", [16, 4, 50, 5, 50, 15, 22, 22], true)
  dot(ctx, "#c3c8cf", -8, 0, 34)
  poly(ctx, "#c3c8cf", [4, 22, 30, 27, 32, 33, 6, 33])
  dot(ctx, "#c3c8cf", 31, 30, 5)
  dot(ctx, "#232a36", 33, 30, 2.6)
  dot(ctx, "#9aa1ac", -8, 0, 12)
  dot(ctx, "#c3c8cf", -8, 0, 6)
  dot(ctx, "#8a919c", 2, -18, 5)
  poly(ctx, "#9aa1ac", [-36, -3, -20, -3, -20, 3, -36, 3])
}

// In profile: a long wedge, stepped decks and the bridge tower with its two globes.
function destroyer(ctx: Ctx) {
  poly(ctx, "#8b929d", [52, 0, -48, -8, -48, 0])
  poly(ctx, "#5c636f", [52, 0, -48, 0, -48, 8])
  poly(ctx, "#9aa1ac", [-46, -7.8, -12, -5.1, -18, -11, -44, -11])
  poly(ctx, "#a7aeb8", [-41, -11, -21, -11, -25, -15, -39, -15])
  poly(ctx, "#a7aeb8", [-34, -15, -27, -15, -28, -22, -33, -22])
  poly(ctx, "#b4bac3", [-39, -22, -22, -22, -22, -25, -39, -25])
  dot(ctx, "#b4bac3", -37, -26.5, 2)
  dot(ctx, "#b4bac3", -24, -26.5, 2)
  for (const y of [-4, 0, 4]) glow(ctx, -49, y, 1.2, "#7fc8ff")
}

const DRAW: Record<ShipKind, (ctx: Ctx) => void> = { xwing, tie, falcon, destroyer }

// size is the drawn length in CSS pixels.
export function drawShip(ctx: Ctx, kind: ShipKind, x: number, y: number, angle: number, size: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(size / 100, size / 100)
  DRAW[kind](ctx)
  ctx.restore()
}

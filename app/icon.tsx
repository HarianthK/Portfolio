import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

/**
 * A node with three neighbours rather than initials. Two reasons: a gradient
 * monogram is the stock look every site-builder ships, and at 32px two letters
 * are illegible anyway — a shape survives the size where text doesn't.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg width={32} height={32} viewBox="0 0 32 32">
          <rect width={32} height={32} rx={7} fill="#0a0704" />

          <g stroke="#f0b429" strokeWidth={1.3} opacity={0.55}>
            <line x1={16} y1={16} x2={7} y2={8} />
            <line x1={16} y1={16} x2={25} y2={10} />
            <line x1={16} y1={16} x2={18} y2={26} />
          </g>

          <circle cx={7} cy={8} r={2.6} fill="#f0b429" />
          <circle cx={25} cy={10} r={2.6} fill="#e07b39" />
          <circle cx={18} cy={26} r={2.6} fill="#4a9fc4" />
          <circle cx={16} cy={16} r={4.6} fill="#fff4df" />
        </svg>
      </div>
    ),
    { ...size },
  )
}

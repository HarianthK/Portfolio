import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16130f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f0b429 0%, #e07b39 100%)",
            color: "#16130f",
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          HK
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
          }}
        >
          Harianth Kalavala
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#f0b429",
          }}
        >
          AI Engineer — LLMs | RAG Systems | Graph-based Agents
        </div>
      </div>
    ),
    { ...size },
  )
}

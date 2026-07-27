import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteUrl } from "@/lib/site"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const title = "Harianth Kalavala | AI Engineer"
const description = "AI Engineer specializing in LLM pipelines and RAG systems"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Harianth Kalavala",
  },
  description,
  generator: "v0.app",
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Harianth Kalavala",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

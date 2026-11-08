import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond, IM_Fell_English, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteUrl } from "@/lib/site"
import { ScrollProgress } from "@/components/scroll-progress"
import { ThemeProvider } from "@/components/theme-provider"
import { CornerResume } from "@/components/corner-resume"
import { ThemeToggle } from "@/components/theme-toggle"
import { LookPicker } from "@/components/look-picker"
import { lookBootScript } from "@/lib/looks"
import "./globals.css"

// Three faces, three jobs. The serif carries the human voice, the mono carries
// machine output (node labels, metrics, readouts), and Manrope stays out of the
// way for body copy. Deliberately avoids Inter and Geist — both read as
// framework defaults rather than a choice.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal"],
  variable: "--font-display",
})

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-data",
})

// Fan-look heading faces. Not preloaded, so a browser fetches one only when a look's CSS uses it.
const lookHp = IM_Fell_English({ weight: "400", subsets: ["latin"], preload: false, variable: "--font-look-hp" })
const lookLotr = Cormorant_Garamond({ weight: "600", subsets: ["latin"], preload: false, variable: "--font-look-lotr" })
const lookGot = Cinzel({ weight: "600", subsets: ["latin"], preload: false, variable: "--font-look-got" })
const lookFonts = [lookHp, lookLotr, lookGot].map((f) => f.variable).join(" ")

const title = "Harianth Kalavala | AI Engineer"
// This is what shows in search results and in a shared link, so it says what
// the page says. The old wording led with RAG, which the site itself now
// describes moving on from.
const description =
  "AI Engineer in Phoenix, Arizona, building retrieval systems and knowledge graphs that turn unstructured data into something production can depend on."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Harianth Kalavala",
  },
  description,
  alternates: { canonical: "/" },
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} ${lookFonts}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: lookBootScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ScrollProgress />
          {/* The nav bar is gone with the single-page layout, so the theme
              control lives on its own in the corner. */}
          <header className="fixed right-4 top-4 z-50 flex items-center rounded-full border border-border/60 bg-background/60 p-0.5 backdrop-blur-md">
            <CornerResume />
            <LookPicker />
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

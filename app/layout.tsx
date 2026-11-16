import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteUrl } from "@/lib/site"
import { ScrollProgress } from "@/components/scroll-progress"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

// Three faces, three jobs. The serif carries the human voice, the mono carries
// machine output (node labels, metrics, readouts), and Manrope stays out of the
// way for body copy. Deliberately avoids Inter and Geist — both read as
// framework defaults rather than a choice.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ScrollProgress />
          <a
            href="#now"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

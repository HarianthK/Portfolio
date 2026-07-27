import type { Metadata } from "next"
import { AboutSection } from "@/components/about-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About",
  description: "AI Engineer specializing in LLM pipelines, RAG architectures, and graph-based agents.",
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <AboutSection />
        <Footer />
      </div>
    </main>
  )
}

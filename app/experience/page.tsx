import type { Metadata } from "next"
import { ExperienceSection } from "@/components/experience-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience across AI engineering, software development, and backend systems.",
}

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <ExperienceSection />
        <Footer />
      </div>
    </main>
  )
}

import type { Metadata } from "next"
import { EducationSkillsSection } from "@/components/education-skills-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Education & Skills",
  description: "M.S. Information Technology from Arizona State University, plus a full technical skill set spanning LLMs, backend, and cloud.",
}

export default function EducationSkillsPage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <EducationSkillsSection />
        <Footer />
      </div>
    </main>
  )
}

import { EducationSkillsSection } from "@/components/education-skills-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

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

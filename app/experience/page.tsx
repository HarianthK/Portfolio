import { ExperienceSection } from "@/components/experience-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <ExperienceSection />
      </div>
    </main>
  )
}

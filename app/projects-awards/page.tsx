import { ProjectsAwardsSection } from "@/components/projects-awards-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ProjectsAwardsPage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <ProjectsAwardsSection />
        <Footer />
      </div>
    </main>
  )
}

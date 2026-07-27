import type { Metadata } from "next"
import { ProjectsAwardsSection } from "@/components/projects-awards-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Projects & Awards",
  description: "Featured projects in LLM agents, full-stack development, and recognition for outstanding contributions.",
}

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

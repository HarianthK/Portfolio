import { AboutSection } from "@/components/about-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <AboutSection />
      </div>
    </main>
  )
}

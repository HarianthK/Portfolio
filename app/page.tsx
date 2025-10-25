import { HeroSection } from "@/components/hero-section"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
      </div>
    </main>
  )
}

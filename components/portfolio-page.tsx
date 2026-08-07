import { BuiltSection } from "@/components/sections/built-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ExplorerSection } from "@/components/sections/explorer-section"
import { FoundationsSection } from "@/components/sections/foundations-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NowSection } from "@/components/sections/now-section"
import { StorySection } from "@/components/sections/story-section"

/**
 * Order matters: a person, then the current work and the thinking behind it,
 * then the graph as something to play with, then the record. Each section owns
 * its own layout — the previous version repeated one shape all the way down,
 * which is what made it feel templated no matter how good the graph was.
 */
export function PortfolioPage() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <NowSection />
      <ExplorerSection />
      <BuiltSection />
      <FoundationsSection />
      <ContactSection />
    </main>
  )
}

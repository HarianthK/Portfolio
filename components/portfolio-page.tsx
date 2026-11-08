import { BuiltSection } from "@/components/sections/built-section"
import { ContactSection } from "@/components/sections/contact-section"
import { StaticGraph } from "@/components/graph/static-graph"
import { ExplorerSection } from "@/components/sections/explorer-section"
import { FoundationsSection } from "@/components/sections/foundations-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NowSection } from "@/components/sections/now-section"
import { StorySection } from "@/components/sections/story-section"

// A person, the current work, the graph to play with, then the record. Each section owns its layout.
export function PortfolioPage() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <NowSection />
      <ExplorerSection fallback={<StaticGraph labels caption="Loading the graph" />} />
      <BuiltSection />
      <FoundationsSection />
      <ContactSection />
    </main>
  )
}

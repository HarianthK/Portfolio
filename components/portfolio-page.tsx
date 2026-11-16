import { BuiltSection } from "@/components/sections/built-section"
import { ContactSection } from "@/components/sections/contact-section"
import { StaticGraph } from "@/components/graph/static-graph"
import { ExplorerSection } from "@/components/sections/explorer-section"
import { FoundationsSection } from "@/components/sections/foundations-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NowSection } from "@/components/sections/now-section"
import { StorySection } from "@/components/sections/story-section"

// Who, the current job, the record, the projects, the graph, then the person. See DOCS.md.
export function PortfolioPage() {
  return (
    <main id="main" tabIndex={-1}>
      <HeroSection />
      <NowSection />
      <FoundationsSection />
      <BuiltSection />
      <ExplorerSection fallback={<StaticGraph labels caption="Loading the graph" />} />
      <StorySection />
      <ContactSection />
    </main>
  )
}

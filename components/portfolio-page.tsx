import { ContactSection } from "@/components/sections/contact-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NarrativeRail } from "@/components/sections/narrative-rail"
import { StorySection } from "@/components/sections/story-section"

/**
 * Order matters: a person, then the current work and the thinking behind it,
 * then the graph as something to play with, then the record.
 *
 * The middle three sections and the explorer now live inside NarrativeRail,
 * which keeps the graph beside them the whole way down instead of letting it
 * disappear for three sections and come back as a static widget.
 */
export function PortfolioPage() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <NarrativeRail />
      <ContactSection />
    </main>
  )
}

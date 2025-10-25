import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Navigation } from "@/components/navigation"

export default function ContactPage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <div className="relative z-10">
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

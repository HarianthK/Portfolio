import { LookPicker } from "@/components/look-picker"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV = [
  { label: "Work", href: "#now" },
  { label: "Background", href: "#foundations" },
  { label: "Projects", href: "#built" },
  { label: "Graph", href: "#explorer" },
  { label: "Contact", href: "#contact" },
]

// One bar: the name, the way to each section, the résumé, the look picker and the theme switch.
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:px-14">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3">
        <a href="#hero" className="inline-flex min-h-11 items-center font-serif text-xl leading-none text-foreground">
          Harianth Kalavala
        </a>

        <div className="flex items-center">
          <nav aria-label="Sections" className="mr-3 hidden items-center lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Résumé (PDF)"
            className="mr-1 inline-flex min-h-9 items-center rounded-full border border-primary/50 px-4 font-mono text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Résumé
          </a>
          <LookPicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

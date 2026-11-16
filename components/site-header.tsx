import { ThemeToggle } from "@/components/theme-toggle"
import { links } from "@/lib/site"

const NAV = [
  { label: "Work", href: "#now" },
  { label: "Background", href: "#foundations" },
  { label: "Projects", href: "#built" },
  { label: "Graph", href: "#explorer" },
  { label: "Contact", href: "#contact" },
]

// Fixed so the name, the résumé and the way to each section never scroll away.
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-6 md:px-14">
        <a href="#hero" className="font-serif text-xl leading-none text-foreground">
          Harianth Kalavala
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Sections" className="mr-2 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-primary/50 px-4 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

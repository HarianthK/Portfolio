import { links } from "@/lib/site"

const LINKS = [
  { label: links.emailLabel, href: links.email, primary: true },
  { label: "GitHub", href: links.github, external: true },
  { label: "LinkedIn", href: links.linkedin, external: true },
  { label: "Résumé", href: links.resume, external: true },
]

/**
 * The close. Was a 672px column like the story section; now the headline runs
 * across the page at display size and the links sit out on the right, so the
 * last thing on the screen fills it rather than trailing off in the middle.
 */
export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-20 md:px-14 md:py-28">
      <div className="mx-auto max-w-368">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-muted-foreground">06</span> Contact
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <h2 className="font-serif text-5xl leading-[1.05] text-foreground md:text-7xl xl:text-8xl">
              Open to AI engineering roles
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              If you&apos;re building retrieval systems that have to hold up in production,
              I&apos;d like to hear about it.
            </p>
          </div>

          <ul className="flex flex-col gap-4 lg:pt-4">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`inline-block border-b pb-1 font-mono text-sm transition-colors ${
                    link.primary
                      ? "border-primary/40 text-primary hover:border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-28 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Harianth Kalavala
        </p>
      </div>
    </section>
  )
}

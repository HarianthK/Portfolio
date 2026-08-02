const LINKS = [
  { label: "hkalaval@asu.edu", href: "mailto:hkalaval@asu.edu", primary: true },
  { label: "GitHub", href: "https://github.com/HarianthK", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harianthk/", external: true },
  { label: "Résumé", href: "/resume.pdf", external: true },
]

/** The quiet close — one statement, four links, nothing else competing. */
export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-14 md:py-40">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-primary/50">06</span> Contact
        </p>

        <h2 className="mt-8 font-serif text-4xl leading-tight text-foreground md:text-6xl">
          Open to AI engineering roles
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          If you&apos;re building retrieval systems that have to hold up in production, I&apos;d
          like to hear about it.
        </p>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`border-b pb-0.5 font-mono text-sm transition-colors ${
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

        <p className="mt-24 font-mono text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Harianth Kalavala
        </p>
      </div>
    </section>
  )
}

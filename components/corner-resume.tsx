import { FileText } from "lucide-react"

// Always reachable: the text link from small screens up, an icon on phones.
export function CornerResume() {
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Résumé (PDF)"
      className="inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground sm:px-3"
    >
      <FileText aria-hidden className="size-[1.1rem] sm:hidden" />
      <span aria-hidden className="hidden sm:inline">
        Résumé
      </span>
    </a>
  )
}

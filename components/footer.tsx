import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="py-12 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/HarianthK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/harianthk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:harianth.kalavala@asu.edu"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-6 w-6" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">© 2025 Harianth Kalavala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

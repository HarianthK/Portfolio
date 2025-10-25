"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full">
        <div
          className={cn(
            "space-y-8 text-center transition-all duration-1000",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Harianth Kalavala
            </h1>
            <div className="relative inline-block">
              <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-mono font-semibold">
                AI Engineer — LLMs | RAG Systems | Graph-based Agents
              </p>
              <div className="absolute -inset-1 bg-primary/20 blur-xl -z-10 animate-pulse-glow" />
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Transforming unstructured data into intelligent retrieval systems. Building the future of AI with cutting-edge LLM pipelines and graph-based agents.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 group" asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Contact Me
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent group" asChild>
              <a href="https://drive.google.com/file/d/1oB0gJgwCJ4UPWV2GfZoqP7unmwRXth4R/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                View Resume
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-8">
            <Link
              href="https://github.com/HarianthK"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-110"
            >
              <Github className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="sr-only">GitHub</span>
              <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/harianthk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="sr-only">LinkedIn</span>
              <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </Link>
            <Link
              href="mailto:hkalaval@asu.edu"
              className="group relative p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-110"
            >
              <Mail className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="sr-only">Email</span>
              <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </Link>
          </div>

          <div className="pt-12 animate-bounce">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Explore More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function AboutSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 pt-24">
      <div className="max-w-5xl w-full">
        <div
          className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            About Me
          </h2>
          <Card className="p-8 md:p-12 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
            <div className="grid md:grid-cols-[240px_1fr] gap-8 items-center">
              <div className="mx-auto md:mx-0 relative">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-7xl font-bold relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 animate-gradient bg-[length:200%_auto]" />
                  <span className="relative z-10">HK</span>
                </div>
                <div className="absolute -inset-2 bg-primary/30 blur-2xl -z-10 animate-pulse-glow rounded-full" />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-primary">Professional Summary</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                  AI Engineer specializing in Large Language Model (LLM) pipelines and advanced Retrieval-Augmented
                  Generation (RAG) architectures. Experienced in building graph-based agents that transform unstructured
                  data into high-accuracy retrieval systems. Passionate about combining backend engineering and applied
                  AI to deliver scalable, production-ready intelligence systems.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {["LLMs", "RAG Systems", "Graph Agents", "Backend AI"].map((tech) => (
                    <div
                      key={tech}
                      className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-sm hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

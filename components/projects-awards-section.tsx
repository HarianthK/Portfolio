"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Code, Award } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const projects = [
  {
    title: "LangGraph Agent Automation",
    description: "Built an LLM agent pipeline with graph-based memory nodes and modular API integration.",
    link: "https://github.com/HarianthK/Langgraph-agent-automation",
    type: "github",
    tech: ["LangGraph", "Python", "LLMs"],
  },
  {
    title: "Registry Points",
    description: "Web app for competitive dancers with dynamic visualization and leaderboards.",
    link: "https://registry-points.vercel.app",
    type: "live",
    tech: ["React", "Next.js", "Vercel"],
  },
  {
    title: "Re-commercio",
    description: "Full-stack MERN e-commerce app with secure JWT authentication and payment integration.",
    link: "https://github.com/HarianthK/Re-commercio",
    type: "github",
    tech: ["MongoDB", "Express", "React", "Node.js"],
  },
]

const awards = [
  {
    title: "Tomalee Doan LibAid Award – 2nd Place",
    organization: "ASU Library",
    period: "Fall 2024",
    description: "Recognized for outstanding contributions to student success and innovative solutions in library services.",
  },
]

export function ProjectsAwardsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="min-h-screen py-20 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Projects Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-12">
              <Code className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Featured Projects
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="p-6 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 group relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-pretty">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="gap-2 w-full group/btn hover:bg-primary/10" asChild>
                        <Link href={project.link} target="_blank" rel="noopener noreferrer">
                          {project.type === "github" ? (
                            <>
                              <Github className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                              View Code
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              Visit Site
                            </>
                          )}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards Section */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Award className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Awards & Recognition
              </h2>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              {awards.map((award, index) => (
                <Link
                  key={index}
                  href="https://lib.asu.edu/news/library-student-workers-honored-libaid-fall-2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card
                    className="p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="p-4 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">{award.title}</h3>
                        <p className="text-muted-foreground mb-2 font-medium">{award.organization} • {award.period}</p>
                        <p className="text-muted-foreground leading-relaxed">{award.description}</p>
                        <p className="text-primary text-sm mt-3 group-hover:text-accent transition-colors">Click to read more about this award →</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

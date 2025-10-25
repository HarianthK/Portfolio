"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Briefcase } from "lucide-react"

const experiences = [
  {
    company: "XNode AI",
    role: "AI Engineer Intern",
    period: "06/2025 – Present",
    location: "Remote",
    achievements: [
      "Built an intelligent document analysis agent converting PDFs into graph-based knowledge systems for instant context-aware retrieval.",
      "Engineered a scalable architecture projected to replace traditional RAG pipelines (40% faster responses).",
      "Built real-time transcription using Faster-Whisper + WebSockets (65% latency reduction).",
    ],
  },
  {
    company: "ASU Library",
    role: "Library Aide",
    period: "10/2023 – 05/2025",
    location: "Mesa, AZ",
    achievements: [
      "Developed an archival inventory system indexing 9,500+ records.",
      "Automated metadata validation (20% less duplication).",
      "Integrated Alma & ArchivesSpace APIs (30% less manual entry).",
    ],
  },
  {
    company: "Idori Inc.",
    role: "Software Engineering Intern",
    period: "05/2024 – 08/2024",
    location: "Boston, MA",
    achievements: [
      "Engineered interactive Unity maps with hover animations (+54% engagement).",
      "Built modular C# components using Unity UI Toolkit.",
      "Improved agile sprint delivery speed by 25%.",
    ],
  },
]

export function ExperienceSection() {
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
          <div className="flex items-center justify-center gap-4 mb-12">
            <Briefcase className="h-10 w-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Experience
            </h2>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="p-6 md:p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-semibold text-primary group-hover:text-accent transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-xl font-medium text-foreground">{exp.company}</p>
                  </div>
                  <div className="text-muted-foreground md:text-right space-y-1">
                    <p className="font-medium font-mono text-primary">{exp.period}</p>
                    <p className="text-sm">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed group/item">
                      <span className="text-primary mt-1.5 text-xl group-hover/item:scale-125 transition-transform">
                        ▹
                      </span>
                      <span className="text-pretty text-base md:text-lg">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

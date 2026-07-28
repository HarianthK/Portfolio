"use client"

import { Card } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const experiences = [
  {
    company: "XNode AI",
    role: "AI Engineer",
    period: "06/2025 – Present",
    location: "Remote, USA",
    achievements: [
      "Architected an enterprise Information Catalog unifying metadata across PostgreSQL and 5+ data sources, enabling AI-powered discovery and lineage tracking across 100,000+ data assets.",
      "Built production knowledge graph systems using Neo4j and Graphiti to model relationships between data assets and business entities — reducing contextual search time by ~35% and improving RAG retrieval quality.",
      "Engineered AI-driven entity and relationship extraction pipelines transforming structured and unstructured data into knowledge repositories powering enterprise RAG applications.",
      "Developed scalable Python-based ingestion, validation, and indexing workflows supporting RAG and metadata management, achieving 99%+ pipeline uptime via CI/CD and production monitoring.",
    ],
  },
  {
    company: "Arizona State University · Library Systems",
    role: "Data & Operations Analyst",
    period: "10/2023 – 05/2025",
    location: "Mesa, USA",
    achievements: [
      "Managed data integrity across a 2.5M+ item physical and digital repository — one of the largest university collection systems in the US — ensuring accurate metadata, retrieval efficiency, and operational continuity.",
      "Built an archival inventory and reporting system indexing 9,500+ records, improving operational visibility by 40% and enabling data-driven resource allocation and collection strategy decisions.",
      "Authored Python scripts and SQL queries to automate metadata validation and root-cause analysis, reducing record duplication by 20%; produced recurring reports and ad-hoc analyses for executive stakeholders.",
    ],
  },
  {
    company: "Idori Inc.",
    role: "Software Engineering Intern · Interactive Media",
    period: "05/2024 – 08/2024",
    location: "Boston, USA",
    achievements: [
      "Analyzed user interaction data to surface behavioral insights, driving 3 targeted feature improvements and a 54% increase in user engagement.",
      "Built modular, data-driven UI components and collaborated cross-functionally in Agile sprints.",
    ],
  },
]

export function ExperienceSection() {
  return (
    <section className="min-h-screen py-20 px-4 pt-24">
      <div className="max-w-5xl w-full mx-auto">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Briefcase className="h-10 w-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Experience
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-primary/20"
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <Reveal key={exp.company} delay={index * 0.15} y={32}>
                <div className="relative pl-10 md:pl-14">
                  <div className="absolute left-0 top-2 h-[31px] w-[31px] md:h-10 md:w-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
                  </div>

                  <TiltCard>
                    <Card className="p-6 md:p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-colors duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
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
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

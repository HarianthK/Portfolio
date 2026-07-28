"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Cpu } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const education = [
  {
    school: "Arizona State University",
    degree: "M.S. Information Technology",
    gpa: "4.0/4.0",
    period: "Aug 2023 – May 2025",
  },
  {
    school: "Neil Gogte Institute of Technology",
    degree: "B.E. Computer Science and Engineering",
    gpa: "8.2/10",
    period: "Aug 2019 – Jun 2023",
  },
]

const skillCategories = [
  {
    category: "Languages & Scripting",
    skills: ["Python", "SQL", "JavaScript", "REST APIs", "WebSockets", "Bash"],
  },
  {
    category: "AI & Machine Learning",
    skills: [
      "LLMs",
      "RAG",
      "Agentic AI",
      "LangChain",
      "LangGraph",
      "Prompt Engineering",
      "Fine-Tuning",
      "Knowledge Graphs",
      "Vector Databases",
    ],
  },
  {
    category: "Data Engineering",
    skills: [
      "ETL/ELT Pipelines",
      "Data Modeling",
      "Metadata Management",
      "Data Lineage",
      "Information Catalogs",
      "Real-Time Streaming",
      "Data Quality Monitoring",
    ],
  },
  {
    category: "Databases & Search",
    skills: ["PostgreSQL", "Neo4j", "Graphiti", "Pinecone", "Chroma", "Entity & Relationship Extraction", "SQL Optimization"],
  },
  {
    category: "Cloud & Infrastructure",
    skills: ["AWS", "CI/CD Pipelines", "API Integrations", "Production Monitoring", "Scalable System Design", "Modular Architecture"],
  },
  {
    category: "Product & Collaboration",
    skills: [
      "Agile/Scrum",
      "Technical Roadmapping",
      "Stakeholder Communication",
      "Data-Driven Decision Making",
      "Dashboard Development",
    ],
  },
]

const alsoWorkedWith = [
  "Java",
  "C/C++",
  "TypeScript",
  "MongoDB",
  "React",
  "Django",
  "MERN",
  "Flask",
  "Angular",
  "Unity",
  "Docker",
  "Jenkins",
  "GitHub Actions",
  "GCP",
  "Git",
  "Postman",
  "Tableau",
  "Figma",
  "Alma",
  "ArchivesSpace",
]

export function EducationSkillsSection() {
  return (
    <section className="min-h-screen py-20 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Education Section */}
        <div className="mb-20">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-12">
              <GraduationCap className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Education
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <Reveal key={edu.school} delay={index * 0.1}>
                <TiltCard>
                  <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-colors duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-accent transition-colors">{edu.school}</h3>
                        <p className="text-muted-foreground mb-2">{edu.degree}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary font-semibold">GPA: {edu.gpa}</span>
                          <span className="text-muted-foreground">{edu.period}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Cpu className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Skills & Technologies
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <Reveal key={category.category} delay={index * 0.08}>
                <TiltCard>
                  <Card className="p-6 md:p-8 h-full border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-colors duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6 text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-accent transition-colors" />
                      {category.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm font-mono hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-300 cursor-default border border-primary/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 p-6 rounded-xl border border-border/50 bg-secondary/20">
              <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">Also worked with</p>
              <div className="flex flex-wrap gap-2">
                {alsoWorkedWith.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="px-3 py-1 text-xs font-mono text-muted-foreground border-border hover:text-primary hover:border-primary/40 transition-colors cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

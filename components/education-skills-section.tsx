"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { GraduationCap, Cpu } from "lucide-react"

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
    category: "Languages",
    skills: ["Python", "Java", "C/C++", "JavaScript", "TypeScript", "SQL", "MongoDB"],
  },
  {
    category: "Frameworks",
    skills: ["LangGraph", "React", "Django", "MERN", "Flask", "Angular", "REST APIs", "WebSockets", "Unity"],
  },
  {
    category: "Cloud/DevOps",
    skills: ["AWS (EC2, S3, Lambda, DynamoDB)", "GCP", "Docker", "Jenkins", "GitHub Actions", "CI/CD"],
  },
  {
    category: "Tools",
    skills: ["Git", "Postman", "Tableau", "Figma", "Anaconda", "Trello", "Agile/Scrum", "Alma", "ArchivesSpace"],
  },
]

export function EducationSkillsSection() {
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
          {/* Education Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-12">
              <GraduationCap className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Education
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <Card
                  key={index}
                  className="p-6 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-12">
              <Cpu className="h-10 w-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Skills & Technologies
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories.map((category, index) => (
                <Card
                  key={index}
                  className="p-6 md:p-8 border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

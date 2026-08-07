import { FigureBlock } from "@/components/figure-block"

type Entry = {
  period: string
  title: string
  org: string
  place: string
  notes: string[]
}

const ENTRIES: Entry[] = [
  {
    period: "10/2023 – 05/2025",
    title: "Data & Operations Analyst",
    org: "Arizona State University · Library Systems",
    place: "Mesa, AZ",
    notes: [
      "Managed data integrity across a 2.5M+ item physical and digital repository, one of the largest university collection systems in the US.",
      "Built an archival inventory and reporting system indexing 9,500+ records, improving operational visibility by 40%.",
      "Automated metadata validation and root-cause analysis in Python and SQL, cutting record duplication by 20%.",
      "Tomalee Doan LibAid Award, 2nd place — Fall 2024.",
    ],
  },
  {
    period: "05/2024 – 08/2024",
    title: "Software Engineering Intern · Interactive Media",
    org: "Idori Inc.",
    place: "Boston, MA",
    notes: [
      "Analysed user interaction data to surface behavioural insights, driving three targeted feature improvements and a 54% increase in engagement.",
      "Built modular, data-driven UI components in Agile sprints.",
    ],
  },
]

const EDUCATION = [
  {
    school: "Arizona State University",
    award: "M.S. Information Technology (STEM)",
    detail: "GPA 4.0 / 4.0 · May 2025",
  },
  {
    school: "Neil Gogte Institute of Technology",
    award: "B.E. Computer Science & Engineering",
    detail: "GPA 8.2 / 10 · Jun 2023",
  },
]

/**
 * A compact record rather than more prose. Everything before the current role
 * belongs here, and it's set as a table so it can be scanned in seconds instead
 * of read — a deliberately different shape to the sections around it.
 */
export function FoundationsSection() {
  return (
    <section id="foundations" className="section-grid relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              <span className="text-primary/50">05</span> Foundations
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Where the data instincts came from
            </h2>
          </div>
          <div className="w-full max-w-[15rem]">
            <FigureBlock
              value="2.5M+"
              label="Item repository"
              context="Physical and digital collection kept accurate and retrievable."
            />
          </div>
        </div>

        <dl className="mt-16">
          {ENTRIES.map((entry) => (
            <div
              key={entry.title}
              className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10"
            >
              <dt>
                <p className="font-mono text-xs text-primary">{entry.period}</p>
                <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
                  {entry.place}
                </p>
              </dt>
              <dd>
                <p className="font-serif text-2xl leading-tight text-foreground">{entry.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{entry.org}</p>
                <ul className="mt-5 space-y-2.5">
                  {entry.notes.map((note) => (
                    <li
                      key={note}
                      className="max-w-2xl text-sm leading-relaxed text-muted-foreground"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}

          <div className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10">
            <dt>
              <p className="font-mono text-xs text-primary">Education</p>
            </dt>
            <dd className="grid gap-8 sm:grid-cols-2">
              {EDUCATION.map((item) => (
                <div key={item.school}>
                  <p className="font-serif text-xl leading-tight text-foreground">{item.school}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.award}</p>
                  <p className="mt-1 font-mono text-xs text-primary">{item.detail}</p>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

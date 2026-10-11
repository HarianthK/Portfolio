import { FigureBlock } from "@/components/figure-block"
import { cn } from "@/lib/utils"

type Project = {
  name: string
  summary: string
  stack: string[]
  href: string
  hrefLabel: string
  figure?: { value: string; label: string; context: string }
}

const PROJECTS: Project[] = [
  {
    name: "LangGraph Agentic Platform",
    summary:
      "A multi-agent system for supply chain resilience: real-time news analytics, geospatial risk scoring, and automated alerting. I designed the orchestration layer: state management, tool routing, memory, and the LLM decision loops.",
    stack: ["LangGraph", "LangChain", "Python", "LLMs"],
    href: "https://github.com/HarianthK/Langgraph-agent-automation",
    hrefLabel: "View code",
    figure: {
      value: "~60%",
      label: "Less manual monitoring",
      context: "Agent orchestration replacing hand-watched supply-chain signals.",
    },
  },
  {
    // Describes what actually loads, because a claim that does not survive a
    // click costs you every other claim on the page. See DOCS.md.
    name: "Registry Points",
    summary:
      "A lookup over the World Swing Dance Council's competitor registry. Type part of a name and it finds the dancer, then returns their points by division, how close they are to moving up, a chart of their competitions over time, and a comparison against other dancers on the same axis. Lookups take about a seventh of a second: the original asked the registry for a session token first, and nothing ever checked it.",
    stack: ["Next.js", "React", "REST APIs", "Vercel"],
    href: "https://registry-points.vercel.app",
    hrefLabel: "Visit site",
    figure: {
      value: "10",
      label: "Dependencies, down from 53",
      context: "Twenty-eight Radix packages removed for components that are a few lines of markup.",
    },
  },
  {
    // The scoring is the part worth describing, and it is checkable against the
    // roads the state already calls scenic.
    name: "Trailblaze AZ",
    summary:
      "A route planner that picks the pretty way instead of the quick one. Every drivable road in Arizona is scored for how close it runs to woodland, wilderness and water, then checked against the roads the state has officially designated scenic. Ask it for Phoenix to Sedona and it sends you over the Mogollon Rim rather than up the interstate, shows the climb that explains the extra two hours, and works out when to leave to arrive in golden hour.",
    stack: ["Next.js", "OSRM", "OpenStreetMap", "Python", "MapLibre"],
    href: "https://trailblaze-az.vercel.app",
    hrefLabel: "Visit site",
    figure: {
      value: "931,043",
      label: "Roads scored",
      context: "Every drivable way in Arizona, rated against the state's own designated byways.",
    },
  },
  {
    // Built to read the files the instrumentation work kept producing.
    name: "Retrace",
    summary:
      "Drop in an OpenTelemetry trace of an LLM app and see what it did: the calls as a tree with timing, and for each one the model, the token counts with cache and reasoning details, the conversation that was sent and what came back, the tool calls, the tools offered and any error. It reads the four shapes such a file comes in, the Python SDK's JSON, OTLP and both of Phoenix's exports, and needs no server or account. The sample is five real spans exported by the OpenTelemetry SDK. It came out of fixing the instrumentors that write these files: six pull requests to four projects, Arize's OpenInference, Traceloop's OpenLLMetry, OpenLIT and Comet's Opik, the first merged the same day.",
    stack: ["JavaScript", "OpenTelemetry", "OpenInference"],
    href: "https://retrace-llm.vercel.app/?sample=1",
    hrefLabel: "Open the sample",
    figure: {
      value: "4",
      label: "File shapes read",
      context: "Every reader is checked in headless Chrome against the same five spans, which must give the same tree whichever shape they arrive in. The two Phoenix readers were corrected against exports from a Phoenix run locally.",
    },
  },
  {
    // A ledger kept by hand for a week, turned into a page.
    name: "Upstream",
    summary:
      "Type a GitHub username and see every pull request that person has sent to somebody else's project, grouped by project, each marked merged, open or closed with how long it took, and the totals: sent, merged, projects, maintainers, median time to a merge. One search against GitHub's API from the browser, nothing stored. It exists because the profile page counts everything and answers nothing; this answers the one question that matters when you work on other people's code.",
    stack: ["JavaScript", "GitHub API"],
    href: "https://upstream-prs.vercel.app/?user=HarianthK",
    hrefLabel: "See mine",
    figure: {
      value: "33",
      label: "Pull requests upstream",
      context: "Sent to twenty eight projects and twenty five maintainers, twelve merged so far, each one a bug proved with a program before it was sent.",
    },
  },
  {
    // Written to find out what the operating system's resolver hides.
    name: "Resolve",
    summary:
      "A DNS resolver in one Python file, no libraries: it builds the query bytes, starts at a root server and follows each referral down itself instead of asking someone else's resolver to do it. Ask it for en.wikipedia.org with -v and you watch a root server hand it to .org, .org hand it to Wikimedia, and Wikimedia answer with an alias it then chases from scratch. It handles the parts that make real name servers awkward: compression pointers into the same packet, referrals that arrive without the addresses they refer to, and replies too big for a UDP packet, which have to be asked again over TCP. Since then it has learned what a resolver run in production does: it caches answers and missing names for as long as their records allow, offers EDNS0 so big answers fit in one packet, believes each server only about its own zone, and tells each server only the next label down, so the root learns you wanted something in .org and nothing more.",
    stack: ["Python", "DNS", "Sockets"],
    href: "https://github.com/HarianthK/resolve",
    hrefLabel: "View code",
    figure: {
      value: "3",
      label: "Hops from the root",
      context: "The root names .org, .org names Wikimedia, Wikimedia answers. The test checks one live name against the system resolver and must agree exactly.",
    },
  },
  {
    // A file format is only understood when somebody else's program reads your output.
    name: "deflate",
    summary:
      "A gzip compressor built from its two ideas: LZ77, which replaces anything already seen with go back and copy, and Huffman coding, which spends fewer bits on the symbols that occur most. It writes real .gz files, picks the cheapest of the format's three block types so incompressible input never grows, and every test hands the file to Python's gzip, to zlib and to the gzip program, because a compressor checked by its own decompressor only proves the two share the same misunderstanding. It reads gzip files too, but for the same reason its decompressor is only ever tested on files zlib wrote, at every level, and on broken ones it must refuse.",
    stack: ["Python", "DEFLATE", "Huffman"],
    href: "https://github.com/HarianthK/deflate",
    hrefLabel: "View code",
    figure: {
      value: "1 to 3%",
      label: "Off gzip -9 on real text",
      context: "Smaller than gzip on repetitive input. Lazy matching, gzip's own trick of checking whether a match one byte later is longer, closed most of the gap that was there.",
    },
  },
  {
    // The checks avoid comparing pictures, which only ever says something changed.
    name: "trace-rays",
    summary:
      "A ray tracer in one Python file: spheres on a checkered floor with shadows, reflections, a highlight and a glass ball that turns the floor behind it upside down, written to a PNG it encodes itself. Every pixel is one question asked backwards, from the eye rather than the lamp, and shadows and reflections are the same question asked again from the surface. The checks never compare pictures: they pin the geometry, compare one point of floor with and without the sphere that shadows it, and let Pillow decode the PNG.",
    stack: ["Python", "Graphics"],
    href: "https://github.com/HarianthK/trace-rays",
    hrefLabel: "View code",
    figure: {
      value: "13",
      label: "Breakages caught",
      context: "The occlusion test, the PNG filter byte, the quadratic's roots and the surface normal first, then seven for the glass and two for its shadow, each removed on purpose and each failing a check.",
    },
  },
  {
    // Built in five phases, each checked by breaking it on purpose before moving on.
    name: "ember",
    summary:
      "A programming language written in Rust with no dependencies: a compiler to bytecode, a stack virtual machine, closures that share the variables they capture, lists and maps, a mark and sweep garbage collector and a REPL. Breaking each phase on purpose found two bugs from the first week, errors reported on the wrong line and every accented string corrupted, and two collector rules no test depended on. A tree-walking interpreter was written only to race it. A misspelt name or map key now suggests the one probably meant, the way Python does.",
    stack: ["Rust", "Compilers", "Garbage collection"],
    href: "https://github.com/HarianthK/ember",
    hrefLabel: "View code",
    figure: {
      value: "3 to 5x",
      label: "Faster than a tree-walker",
      context: "Over the same syntax tree, on recursion, a tight loop and a closure called a million times; level with CPython on recursion and just ahead of it on the closure.",
    },
  },
  {
    // Worth building only because the machine under it was already proven.
    name: "Nibble",
    summary:
      "A small language that compiles to CHIP-8 machine code, written for the emulator below. Variables, arrays, constants, sprites, routines, loops, collisions, numbers and text: press compile and play it, with the real output shown as bytes under the screen and read back as Octo source beside them. Meteors, a dodging game with a score, three lives and a proper ending, comes to 418 of them, down from 504 as the compiler learned to flip a skip instead of jumping and to share one copy of what it repeats. Snake, Pong and Breakout followed once there were arrays, and Lights Out once there were bit operators; multiplication, which the machine lacks, is built from shifts and adds. Every program was recorded frame by frame before each change and matched exactly after.",
    stack: ["JavaScript", "Compilers", "Canvas"],
    href: "https://nibble-lang.vercel.app",
    hrefLabel: "Write a program",
    figure: {
      value: "53",
      label: "Bytes from a dozen lines",
      context: "Every test compiles a program and runs it on the machine. Each example must also come out identical under the six instructions interpreters disagree about.",
    },
  },
  {
    // The figure is the bug it was hiding, not the coverage. See DOCS.md.
    name: "CHIP-8",
    summary:
      "A virtual machine from 1977, rebuilt from its instruction set and running in a browser, with both of the extensions people later built on it: SUPER-CHIP's larger screen and scrolling, and XO-CHIP's second colour plane, sixty four kilobytes of memory and waveform sound. Every program in the community archive runs, and because none of them record how they are played, the page works out which keys each one watches by playing it. It can also read any program back as Octo source, telling code from sprites by walking every path the machine could take; all 104 listings compile back to the identical bytes through Octo's own compiler. It is also the machine Nibble compiles for.",
    stack: ["JavaScript", "Canvas", "Web Audio"],
    href: "https://harianthk.github.io/chip8/",
    hrefLabel: "Play it",
    figure: {
      value: "86",
      label: "Programs quietly running wrong",
      context: "Six instructions have two accepted readings, and the archive records which each program expects. It had been ignoring that. It reads them now.",
    },
  },
]

// An asymmetric stack rather than a grid of equal cards, which would flatten
// everything to the same importance. See DOCS.md.
export function BuiltSection() {
  return (
    <section id="built" className="relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-primary/50">04</span> Built
        </p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Outside the day job
        </h2>

        <div className="mt-16 space-y-20">
          {PROJECTS.map((project, i) => {
            const hasFigure = Boolean(project.figure)
            // Alternate the figure's side so the eye keeps moving, but only when
            // there is one, or the text gets squeezed into an empty grid cell.
            const figureLeft = hasFigure && i % 2 === 1

            return (
            <article
              key={project.name}
              className={cn(
                "border-t border-border pt-10",
                hasFigure && "grid gap-8 md:gap-14",
                hasFigure &&
                  (figureLeft
                    ? "md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
                    : "md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]"),
              )}
            >
              <div className={cn(figureLeft && "md:order-2")}>
                <h3 className="font-serif text-3xl leading-tight text-foreground">
                  {project.name}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((item) => (
                    <li key={item} className="font-mono text-xs text-muted-foreground/70">
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-block border-b border-primary/40 pb-0.5 font-mono text-xs text-primary transition-colors hover:border-primary"
                >
                  {project.hrefLabel} →
                </a>
              </div>

              {project.figure && (
                <div className={cn(figureLeft && "md:order-1")}>
                  <FigureBlock {...project.figure} />
                </div>
              )}
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

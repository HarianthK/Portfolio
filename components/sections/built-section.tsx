import { FigureBlock } from "@/components/figure-block"
import { ReadMore } from "@/components/read-more"
import { cn } from "@/lib/utils"

export type Project = {
  name: string
  summary: string
  stack: string[]
  href: string
  hrefLabel: string
  figure?: { value: string; label: string; context: string }
}

export const PROJECTS: Project[] = [
  {
    // Describes what the linked repo does; the old supply-chain text did not match it. See DOCS.md.
    name: "LangGraph Form Agent",
    summary:
      "An agent that registers a business through a web form on its own, built in a one-day sprint. A LangGraph state graph runs three steps, extract, validate and submit: it gathers location and demographic data from API Ninjas, has Mistral running locally on Ollama pick the business's NAICS industry code, saves the record to PostgreSQL and fills in the form with Selenium, behind a FastAPI service and an Angular dashboard.",
    stack: ["LangGraph", "Python", "Ollama", "Selenium", "Angular"],
    href: "https://github.com/HarianthK/Langgraph-agent-automation",
    hrefLabel: "View code",
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
      context: "28 Radix packages removed for components that are a few lines of markup.",
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
      value: "4 of 6",
      label: "Instrumentor fixes merged",
      context: "One each into Arize's OpenInference, Traceloop's OpenLLMetry, OpenLIT and Comet's Opik, as of November 2026; the first merged the same day. Every file shape Retrace reads is checked against the same five spans.",
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
      context: "Sent to 28 projects and 25 maintainers, 13 merged as of November 2026; the live page has today's count. Most fix a bug, shown first with a program that reproduces it.",
    },
  },
  {
    // Written to find out what the operating system's resolver hides.
    name: "Resolve",
    summary:
      "A DNS resolver in one Python file, no libraries: it builds the query bytes, starts at a root server and follows each referral down itself instead of asking someone else's resolver to do it. Ask it for en.wikipedia.org with -v and you watch a root server hand it to .org, .org hand it to Wikimedia, and Wikimedia answer with an alias it then chases again from the .org servers it already knows. It handles the parts that make real name servers awkward: compression pointers into the same packet, referrals that arrive without the addresses they refer to, and replies too big for a UDP packet, which have to be asked again over TCP. Since then it has learned what a resolver run in production does: it caches answers and missing names for as long as their records allow, offers EDNS0 so big answers fit in one packet, believes each server only about its own zone, and tells each server only the next label down, so the root learns you wanted something in .org and nothing more. Run with --serve and it becomes a small DNS server that other programs on the machine can ask, keeping missing names, empty answers and failures apart the way a real one must.",
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
      "A gzip compressor built from its two ideas: LZ77, which replaces anything already seen with a pointer back to the earlier copy, and Huffman coding, which spends fewer bits on the symbols that occur most. It writes real .gz files, picks the cheapest of the format's three block types so incompressible input grows by at most the 5 bytes a stored block needs, and every test hands the file to Python's gzip, to zlib and to the gzip program, because a compressor checked by its own decompressor only proves the two share the same misunderstanding. It reads gzip files too, and its decompressor is tested on files zlib wrote at every level, and on broken ones it must refuse. The same compressor writes PNGs, and turns a picture of 256 colours or fewer into a palette, which halves a chart.",
    stack: ["Python", "DEFLATE", "Huffman"],
    href: "https://github.com/HarianthK/deflate",
    hrefLabel: "View code",
    figure: {
      value: "7 of 7",
      label: "Inputs no bigger than gzip -9",
      context: "At -9 against gzip -9, from repeated text and random bytes to 59 KB of Rust. At its default level it is 0.3% bigger on the Rust file and smaller or level on the rest.",
    },
  },
  {
    // Each half is checked by somebody else's: Pillow reads what it writes, libjpeg wrote what it reads.
    name: "jpeg",
    summary:
      "A JPEG encoder and decoder in one Python file with no dependencies. It writes baseline and progressive .jpg files any viewer opens, with Huffman tables built for the picture and restart markers, and reads the baseline, progressive and arithmetic-coded files other programs wrote, turning a phone photo upright from its EXIF tag. Every file it writes is decoded by Pillow, and the files its reader is tested on were written by libjpeg, so neither half is only ever checked against itself.",
    stack: ["Python", "JPEG", "DCT"],
    href: "https://github.com/HarianthK/jpeg",
    hrefLabel: "View code",
    figure: {
      value: "0.18 dB",
      label: "Behind libjpeg at most",
      context: "From quality 25 to 90 on every picture in the test, and never more than 3% bigger, with Pillow decoding both files and measuring how close the pixels came back.",
    },
  },
  {
    // The checks avoid comparing pictures, which only ever says something changed.
    name: "trace-rays",
    summary:
      "A ray tracer in one Python file: spheres on a checkered floor with shadows, reflections, a highlight and a glass ball that turns the floor behind it upside down, written to a PNG it encodes itself. Since then: triangle meshes, a lens that blurs what is out of focus, and a lamp with a size, so shadows soften at their edges. Every pixel is one question asked backwards, from the eye rather than the lamp, and shadows and reflections are the same question asked again from the surface. The checks never compare against a saved picture: they pin the geometry, compare one point of floor with and without the sphere that shadows it, and let Pillow decode the PNG.",
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
    // The fast part of a SAT solver is knowing which dead ends not to walk into twice.
    name: "sat",
    summary:
      "A SAT solver in one Python file: give it a formula of true or false variables and it finds values that make every clause true, or proves there are none. It is CDCL, the algorithm behind every modern solver, with watched literals, learned clauses, restarts, and clause deletion and minimization as Glucose and MiniSat do them. A no comes with a DRAT proof, the format SAT competitions require, which it can check on its own, and it solves under assumptions as MiniSat does, so one solver can be asked many questions and keep what it learned between them.",
    stack: ["Python", "SAT", "Logic"],
    href: "https://github.com/HarianthK/sat",
    hrefLabel: "View code",
    figure: {
      value: "6 to 48x",
      label: "Fewer dead ends than DPLL",
      context: "Conflicts on random formulas from 40 to 100 variables, against the plain backtracking solver kept in the same file. The gap grows with size.",
    },
  },
  {
    // Built in five phases, each checked by breaking it on purpose before moving on.
    name: "ember",
    summary:
      "A programming language written in Rust with no dependencies: a compiler to bytecode, a stack virtual machine, closures that share the variables they capture, lists and maps, a mark and sweep garbage collector and a REPL. Breaking each phase on purpose found two bugs from the first week, errors reported on the wrong line and every accented string corrupted, and two collector rules no test depended on. A tree-walking interpreter was written only to race it. A misspelt name or map key now suggests the one probably meant, the way Python does. It has since gained try and catch, default parameters, ** for powers and xs[a:b] slices.",
    stack: ["Rust", "Compilers", "Garbage collection"],
    href: "https://github.com/HarianthK/ember",
    hrefLabel: "View code",
    figure: {
      value: "3 to 6.7x",
      label: "Faster than a tree-walker",
      context: "Over the same syntax tree, on recursion, a tight loop and a closure called a million times; level with CPython on recursion and just ahead of it on the closure.",
    },
  },
  {
    // Worth building only because the machine under it was already proven.
    name: "Nibble",
    summary:
      "A small language that compiles to CHIP-8 machine code, written for the CHIP-8 emulator in this list. Variables, arrays, constants, sprites, routines, loops, collisions, numbers and text: press compile and play it, with the real output shown as bytes under the screen and read back as Octo source beside them. Meteors, a dodging game with a score, three lives and a proper ending, comes to 418 of them, down from 504 as the compiler learned to flip a skip instead of jumping and to share one copy of what it repeats. Snake, Pong and Breakout followed once there were arrays, and Lights Out once there were bit operators; multiplication, which the machine lacks, is built from shifts and adds. Every program was recorded frame by frame before each change and matched exactly after.",
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
      "A virtual machine from 1977, rebuilt from its instruction set and running in a browser, with both of the extensions people later built on it: SUPER-CHIP's larger screen and scrolling, and XO-CHIP's second colour plane, 64 KB of memory and waveform sound. Because none of the archive's programs record how they are played, the page works out which keys each one watches by playing it. It can also read any program back as Octo source, telling code from sprites by walking every path the machine could take; every listing compiles back to the identical bytes through Octo's own compiler. Hold Backspace and the game runs backwards, up to ten seconds, with every frame of every archive program checked to come back exactly. It is also the machine Nibble compiles for.",
    stack: ["JavaScript", "Canvas", "Web Audio"],
    href: "https://harianthk.github.io/chip8/",
    hrefLabel: "Play it",
    figure: {
      value: "88",
      label: "Programs it was reading wrong",
      context: "Six instructions have two accepted readings, and the archive records which each program expects. It had been ignoring that. It reads them now.",
    },
  },
]

// The AI work gets the full treatment; the rest sit in a compact list with the
// detail behind "More", so every claim stays on the page. See DOCS.md.
const FEATURED = ["LangGraph Form Agent", "Retrace", "Upstream"]

// Sentences end at a stop followed by a capital, so ".gz" and ".org" do not end one.
function lead(summary: string, sentences = 1) {
  let at = 0
  for (let n = 0; n < sentences; n++) {
    const m = summary.slice(at).match(/^(.+?[.!?])\s+(?=[A-Z])/)
    if (!m) return [summary, ""]
    at += m[0].length
  }
  return [summary.slice(0, at).trim(), summary.slice(at)]
}

// Labels are written to stand alone in capitals; after a number they read as a phrase.
const inSentence = (label: string) => (/^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label)

function Featured({ project, i }: { project: Project; i: number }) {
  const hasFigure = Boolean(project.figure)
  const [first, rest] = lead(project.summary, 2)
  // Alternate the figure's side so the eye keeps moving, but only when
  // there is one, or the text gets squeezed into an empty grid cell.
  const figureLeft = hasFigure && i % 2 === 1
  const link = <ProjectLink project={project} />
  return (
    <article
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
        <h4 className="font-serif text-3xl leading-tight text-foreground">{project.name}</h4>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{first}</p>
        <Stack items={project.stack} />
        {rest ? (
          <ReadMore
            link={link}
            more={<p className="max-w-xl text-base leading-relaxed text-muted-foreground">{rest}</p>}
          />
        ) : (
          <div className="mt-2">{link}</div>
        )}
      </div>
      {project.figure && (
        <div className={cn(figureLeft && "md:order-1")}>
          <FigureBlock {...project.figure} />
        </div>
      )}
    </article>
  )
}

function Compact({ project }: { project: Project }) {
  const [first, rest] = lead(project.summary)
  return (
    <article className="border-t border-border pt-6">
      <h4 className="font-mono text-xl text-foreground">{project.name}</h4>
      {project.figure && (
        <p className="mt-3 font-mono text-sm text-primary">
          {project.figure.value}{" "}
          <span className="text-foreground/80">{inSentence(project.figure.label)}</span>
        </p>
      )}
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{first}</p>
      <Stack items={project.stack} />
      <ReadMore
        link={<ProjectLink project={project} />}
        more={
          <>
            {rest && <p className="text-base leading-relaxed text-muted-foreground">{rest}</p>}
            {project.figure && (
              <p className="text-sm leading-relaxed text-muted-foreground">{project.figure.context}</p>
            )}
          </>
        }
      />
    </article>
  )
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <li key={item} className="font-mono text-xs text-muted-foreground">
          {item}
        </li>
      ))}
    </ul>
  )
}

function ProjectLink({ project, className }: { project: Project; className?: string }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center font-mono text-xs text-primary transition-colors",
        className,
      )}
    >
      <span className="border-b border-primary/40 pb-0.5 hover:border-primary">
        {project.hrefLabel} →
      </span>
    </a>
  )
}

export function BuiltSection() {
  const featured = PROJECTS.filter((p) => FEATURED.includes(p.name))
  const rest = PROJECTS.filter((p) => !FEATURED.includes(p.name))
  return (
    <section id="built" className="relative px-6 py-28 md:px-14 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span aria-hidden className="text-primary/70">04</span> Built
        </p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Outside the day job
        </h2>

        <h3 className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-primary">
          AI and LLM work
        </h3>
        <div className="mt-6 space-y-20">
          {featured.map((project, i) => (
            <Featured key={project.name} project={project} i={i} />
          ))}
        </div>

        <h3 className="mt-28 font-mono text-xs uppercase tracking-[0.25em] text-primary">
          Systems, apps and experiments
        </h3>
        <div className="mt-6 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {rest.map((project) => (
            <Compact key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The career as a knowledge graph.
 *
 * This isn't decoration, it's the same shape of structure Harianth builds at
 * work (entity/relationship extraction into a navigable graph), applied to his
 * own history. Nodes are real entities; edges are real, typed relationships.
 *
 * Everything here traces to the resume. Nothing is invented to fill the graph
 * out: if a claim isn't backed by something real, it isn't a node.
 */

import { PROJECTS } from "@/components/sections/built-section"

export type NodeKind = "self" | "role" | "education" | "project" | "outcome" | "tech"

export type EdgeKind = "worked-at" | "studied-at" | "built" | "built-with" | "produced" | "uses"

/**
 * Which scroll section pulls the camera to this node's cluster. "hero" and
 * "contact" deliberately own no nodes, both show the whole graph, so the piece
 * opens and closes on the complete picture.
 */
export type SectionId = "hero" | "now" | "work" | "foundations" | "contact"

export type GraphNode = {
  id: string
  label: string
  kind: NodeKind
  /** One line, shown when the node is focused. */
  detail?: string
  /** Secondary line, dates, org, scale. */
  meta?: string
  section?: SectionId
}

export type GraphLink = {
  source: string
  target: string
  kind: EdgeKind
}

/**
 * Visual weight per kind. The graph should read as hierarchy at a glance,
 * you, then where you've been, then what came out of it, then the tools.
 */
export const NODE_SIZE: Record<NodeKind, number> = {
  self: 9,
  role: 6.5,
  project: 6,
  education: 5,
  outcome: 4,
  tech: 2.6,
}

/**
 * Three colour families, not six. Warm for people and institutions, copper for
 * things built and what they produced, cool for technology, so the graph has
 * structure instead of being a monochrome cloud. Values are read from CSS
 * custom properties at runtime so both themes stay correct.
 */
export const NODE_FAMILY: Record<NodeKind, "self" | "role" | "project" | "tech"> = {
  // The person sits in a family of one, so it can be coloured apart from
  // everything it connects to.
  self: "self",
  role: "role",
  education: "role",
  project: "project",
  outcome: "project",
  tech: "tech",
}

const baseNodes: GraphNode[] = [
  {
    id: "self",
    label: "Harianth Kalavala",
    kind: "self",
    detail: "AI Engineer: retrieval systems that production can depend on",
    meta: "Phoenix, Arizona",
    section: "hero",
  },

  // ── Roles ────────────────────────────────────────────────────────────────
  {
    // Labelled by role rather than employer. The company name is written once,
    // in the experience entry, and shouldn't resurface in graph readouts.
    id: "xnode",
    label: "AI Engineer",
    kind: "role",
    detail: "Current role: retrieval systems and knowledge graphs",
    meta: "06/2025 – Present · Remote",
    section: "now",
  },
  {
    id: "asu-library",
    label: "ASU Library Systems",
    kind: "role",
    detail: "Data & Operations Analyst",
    meta: "10/2023 – 05/2025 · Mesa, AZ",
    section: "foundations",
  },
  {
    id: "idori",
    label: "Idori Inc.",
    kind: "role",
    detail: "Software Engineering Intern · Interactive Media",
    meta: "05/2024 – 08/2024 · Boston, MA",
    section: "foundations",
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    id: "asu",
    label: "Arizona State University",
    kind: "education",
    detail: "M.S. Information Technology (STEM)",
    meta: "GPA 4.0 / 4.0 · May 2025",
    section: "foundations",
  },
  {
    id: "ngit",
    label: "Neil Gogte Institute",
    kind: "education",
    detail: "B.E. Computer Science & Engineering",
    meta: "GPA 8.2 / 10 · Jun 2023",
    section: "foundations",
  },

  // ── Projects ─────────────────────────────────────────────────────────────
  {
    id: "info-catalog",
    label: "Enterprise Information Catalog",
    kind: "project",
    detail: "Unified metadata across PostgreSQL and 5+ sources for AI-powered discovery and lineage",
    // Employer is named once, in the role node, professional work is attributed
    // generically everywhere else.
    meta: "Professional work",
    section: "now",
  },
  {
    id: "kg-systems",
    label: "Production Knowledge Graphs",
    kind: "project",
    detail: "Modelled relationships between data assets and business entities to improve RAG retrieval",
    meta: "Professional work",
    section: "now",
  },
  {
    id: "archival-system",
    label: "Archival Inventory System",
    kind: "project",
    detail: "Inventory and reporting system indexing 9,500+ records",
    meta: "ASU Library Systems",
    section: "foundations",
  },

  // ── Outcomes ─────────────────────────────────────────────────────────────
  {
    id: "o-assets",
    label: "100K+ data assets",
    kind: "outcome",
    detail: "Discoverable and lineage-tracked through the catalog",
    section: "now",
  },
  {
    id: "o-search",
    label: "~35% less search time",
    kind: "outcome",
    detail: "Contextual search time after modelling relationships explicitly",
    section: "now",
  },
  {
    id: "o-uptime",
    label: "99%+ pipeline uptime",
    kind: "outcome",
    detail: "Ingestion, validation and indexing workflows in production",
    section: "now",
  },
  {
    id: "o-repository",
    label: "2.5M+ item repository",
    kind: "outcome",
    detail: "One of the largest university collection systems in the US",
    section: "foundations",
  },
  {
    id: "o-visibility",
    label: "+40% operational visibility",
    kind: "outcome",
    detail: "From the archival inventory and reporting system",
    section: "foundations",
  },
  {
    id: "o-dedupe",
    label: "20% less duplication",
    kind: "outcome",
    detail: "Automated metadata validation and root-cause analysis",
    section: "foundations",
  },
  {
    id: "o-award",
    label: "Tomalee Doan LibAid Award",
    kind: "outcome",
    detail: "2nd place, for contributions to student success and library services",
    meta: "ASU Library · Fall 2024",
    section: "foundations",
  },

  // ── Technology ───────────────────────────────────────────────────────────
  { id: "python", label: "Python", kind: "tech" },
  { id: "sql", label: "SQL", kind: "tech" },
  { id: "javascript", label: "JavaScript", kind: "tech" },
  { id: "llms", label: "LLMs", kind: "tech" },
  { id: "rag", label: "RAG", kind: "tech" },
  { id: "agentic", label: "Agentic AI", kind: "tech" },
  { id: "langgraph-lib", label: "LangGraph", kind: "tech" },
  { id: "langchain", label: "LangChain", kind: "tech" },
  { id: "knowledge-graphs", label: "Knowledge Graphs", kind: "tech" },
  { id: "neo4j", label: "Neo4j", kind: "tech" },
  { id: "graphiti", label: "Graphiti", kind: "tech" },
  { id: "postgres", label: "PostgreSQL", kind: "tech" },
  { id: "vector-db", label: "Vector Databases", kind: "tech" },
  { id: "entity-extraction", label: "Entity Extraction", kind: "tech" },
  { id: "etl", label: "ETL / ELT", kind: "tech" },
  { id: "lineage", label: "Data Lineage", kind: "tech" },
  { id: "metadata", label: "Metadata Management", kind: "tech" },
  { id: "aws", label: "AWS", kind: "tech" },
  { id: "cicd", label: "CI/CD", kind: "tech" },
  { id: "rest", label: "REST APIs", kind: "tech" },
  { id: "react", label: "React", kind: "tech" },
  { id: "nextjs", label: "Next.js", kind: "tech" },
]

const baseLinks: GraphLink[] = [
  // Where he's been
  { source: "self", target: "xnode", kind: "worked-at" },
  { source: "self", target: "asu-library", kind: "worked-at" },
  { source: "self", target: "idori", kind: "worked-at" },
  { source: "self", target: "asu", kind: "studied-at" },
  { source: "self", target: "ngit", kind: "studied-at" },

  // What each role produced
  { source: "xnode", target: "info-catalog", kind: "built" },
  { source: "xnode", target: "kg-systems", kind: "built" },
  { source: "asu-library", target: "archival-system", kind: "built" },
  { source: "asu-library", target: "o-repository", kind: "produced" },
  { source: "asu-library", target: "o-award", kind: "produced" },
  { source: "asu", target: "asu-library", kind: "worked-at" },

  // Outcomes traced to the work that caused them
  { source: "info-catalog", target: "o-assets", kind: "produced" },
  { source: "kg-systems", target: "o-search", kind: "produced" },
  { source: "info-catalog", target: "o-uptime", kind: "produced" },
  { source: "archival-system", target: "o-visibility", kind: "produced" },
  { source: "archival-system", target: "o-dedupe", kind: "produced" },

  // What things were built with
  { source: "info-catalog", target: "postgres", kind: "built-with" },
  { source: "info-catalog", target: "metadata", kind: "built-with" },
  { source: "info-catalog", target: "lineage", kind: "built-with" },
  { source: "info-catalog", target: "etl", kind: "built-with" },
  { source: "info-catalog", target: "python", kind: "built-with" },
  { source: "info-catalog", target: "cicd", kind: "built-with" },

  { source: "kg-systems", target: "neo4j", kind: "built-with" },
  { source: "kg-systems", target: "graphiti", kind: "built-with" },
  { source: "kg-systems", target: "knowledge-graphs", kind: "built-with" },
  { source: "kg-systems", target: "entity-extraction", kind: "built-with" },
  { source: "kg-systems", target: "rag", kind: "built-with" },
  { source: "kg-systems", target: "vector-db", kind: "built-with" },

  { source: "langgraph", target: "agentic", kind: "built-with" },


  { source: "archival-system", target: "python", kind: "built-with" },
  { source: "archival-system", target: "sql", kind: "built-with" },
  { source: "archival-system", target: "metadata", kind: "built-with" },

  // Cross-links that make the graph a graph rather than a tree
  { source: "rag", target: "vector-db", kind: "uses" },
  { source: "rag", target: "knowledge-graphs", kind: "uses" },
  { source: "knowledge-graphs", target: "neo4j", kind: "uses" },
  { source: "agentic", target: "llms", kind: "uses" },
  { source: "langgraph-lib", target: "langchain", kind: "uses" },
  { source: "entity-extraction", target: "llms", kind: "uses" },
  { source: "xnode", target: "aws", kind: "uses" },
  { source: "etl", target: "postgres", kind: "uses" },
]

// The personal projects come from the Built section, so the graph can't drift from it.
const PROJECT_ID: Record<string, string> = { "LangGraph Form Agent": "langgraph" }
const projectId = (name: string) => PROJECT_ID[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

// Stack entries that become tool nodes even though nothing else on the graph uses them yet.
const EXTRA_TECH = new Set(["OpenTelemetry", "Rust"])

/** The Built entry's opening clause: its first sentence, cut at a colon or a later comma. */
export function openingClause(summary: string): string {
  const sentence = summary.split(/\.(\s|$)/)[0].split(":")[0]
  const comma = sentence.indexOf(", ", 40)
  return comma > 0 ? sentence.slice(0, comma) : sentence
}

function deriveProjects() {
  const techByLabel = new Map(baseNodes.filter((n) => n.kind === "tech").map((n) => [n.label, n.id]))
  const uses = new Map<string, number>()
  PROJECTS.forEach((p) => p.stack.forEach((t) => uses.set(t, (uses.get(t) ?? 0) + 1)))

  const extraNodes: GraphNode[] = []
  const extraLinks: GraphLink[] = []
  for (const project of PROJECTS) {
    const id = projectId(project.name)
    extraNodes.push({
      id,
      label: project.name,
      kind: "project",
      detail: openingClause(project.summary),
      meta: project.figure ? `${project.figure.value} · ${project.figure.label}` : "Personal project",
      section: "work",
    })
    extraLinks.push({ source: "self", target: id, kind: "built" })
    for (const tool of project.stack) {
      let techId = techByLabel.get(tool)
      if (!techId && ((uses.get(tool) ?? 0) > 1 || EXTRA_TECH.has(tool))) {
        techId = tool.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        techByLabel.set(tool, techId)
        extraNodes.push({ id: techId, label: tool, kind: "tech" })
      }
      if (techId) extraLinks.push({ source: id, target: techId, kind: "built-with" })
    }
  }
  // Nibble compiles for the CHIP-8 machine; both Built entries say so.
  extraLinks.push({ source: "nibble", target: "chip-8", kind: "uses" })
  return { extraNodes, extraLinks }
}

const derived = deriveProjects()
export const nodes: GraphNode[] = [...baseNodes, ...derived.extraNodes]
export const links: GraphLink[] = [...baseLinks, ...derived.extraLinks]

/** The few nodes the hero names outright; the rest reveal themselves on hover or tap. */
export const HERO_LABELS = new Set([
  "self",
  "xnode",
  "kg-systems",
  "langgraph",
  "retrace",
  "upstream",
  "trailblaze-az",
  "chip-8",
  "ember",
])

/** Node ids that belong to a section, for camera targeting and highlighting. */
export function nodesInSection(section: SectionId): string[] {
  return nodes.filter((node) => node.section === section).map((node) => node.id)
}

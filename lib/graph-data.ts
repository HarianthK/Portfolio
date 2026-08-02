/**
 * The career as a knowledge graph.
 *
 * This isn't decoration — it's the same shape of structure Harianth builds at
 * work (entity/relationship extraction into a navigable graph), applied to his
 * own history. Nodes are real entities; edges are real, typed relationships.
 *
 * Everything here traces to the resume. Nothing is invented to fill the graph
 * out: if a claim isn't backed by something real, it isn't a node.
 */

export type NodeKind = "self" | "role" | "education" | "project" | "outcome" | "tech"

export type EdgeKind = "worked-at" | "studied-at" | "built" | "built-with" | "produced" | "uses"

/** Which scroll section pulls the camera to this node's cluster. */
export type SectionId = "hero" | "now" | "work" | "foundations"

export type GraphNode = {
  id: string
  label: string
  kind: NodeKind
  /** One line, shown when the node is focused. */
  detail?: string
  /** Secondary line — dates, org, scale. */
  meta?: string
  section?: SectionId
}

export type GraphLink = {
  source: string
  target: string
  kind: EdgeKind
}

/**
 * Visual weight per kind. The graph should read as hierarchy at a glance —
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
 * things built and what they produced, cool for technology — so the graph has
 * structure instead of being a monochrome cloud. Values are read from CSS
 * custom properties at runtime so both themes stay correct.
 */
export const NODE_FAMILY: Record<NodeKind, "role" | "project" | "tech"> = {
  self: "role",
  role: "role",
  education: "role",
  project: "project",
  outcome: "project",
  tech: "tech",
}

export const nodes: GraphNode[] = [
  {
    id: "self",
    label: "Harianth Kalavala",
    kind: "self",
    detail: "AI Engineer — retrieval systems that production can depend on",
    meta: "Phoenix, Arizona",
    section: "hero",
  },

  // ── Roles ────────────────────────────────────────────────────────────────
  {
    id: "xnode",
    label: "XNode AI",
    kind: "role",
    detail: "AI Engineer",
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
    meta: "XNode AI",
    section: "now",
  },
  {
    id: "kg-systems",
    label: "Production Knowledge Graphs",
    kind: "project",
    detail: "Modelled relationships between data assets and business entities to improve RAG retrieval",
    meta: "XNode AI",
    section: "now",
  },
  {
    id: "langgraph",
    label: "LangGraph Agentic Platform",
    kind: "project",
    detail: "Multi-agent system: real-time news analytics, geospatial risk scoring, automated alerting",
    meta: "Personal project",
    section: "work",
  },
  {
    id: "registry-points",
    label: "Registry Points",
    kind: "project",
    detail: "Full-stack data app — auth, time-series tracking, interactive visualisation",
    meta: "Personal project · live on Vercel",
    section: "work",
  },
  {
    id: "archival-system",
    label: "Archival Inventory System",
    kind: "project",
    detail: "Indexed and reported across a 2.5M+ item physical and digital repository",
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
    label: "~35% faster retrieval",
    kind: "outcome",
    detail: "Reduction in contextual search time after graph modelling",
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
    id: "o-monitoring",
    label: "~60% less manual monitoring",
    kind: "outcome",
    detail: "Agent orchestration replacing hand-watched supply-chain signals",
    section: "work",
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
    detail: "2nd place — contributions to student success and library services",
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

export const links: GraphLink[] = [
  // Where he's been
  { source: "self", target: "xnode", kind: "worked-at" },
  { source: "self", target: "asu-library", kind: "worked-at" },
  { source: "self", target: "idori", kind: "worked-at" },
  { source: "self", target: "asu", kind: "studied-at" },
  { source: "self", target: "ngit", kind: "studied-at" },
  { source: "self", target: "langgraph", kind: "built" },
  { source: "self", target: "registry-points", kind: "built" },

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
  { source: "langgraph", target: "o-monitoring", kind: "produced" },
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

  { source: "langgraph", target: "langgraph-lib", kind: "built-with" },
  { source: "langgraph", target: "langchain", kind: "built-with" },
  { source: "langgraph", target: "agentic", kind: "built-with" },
  { source: "langgraph", target: "llms", kind: "built-with" },
  { source: "langgraph", target: "python", kind: "built-with" },

  { source: "registry-points", target: "react", kind: "built-with" },
  { source: "registry-points", target: "nextjs", kind: "built-with" },
  { source: "registry-points", target: "rest", kind: "built-with" },
  { source: "registry-points", target: "javascript", kind: "built-with" },

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

/** Node ids that belong to a section, for camera targeting and highlighting. */
export function nodesInSection(section: SectionId): string[] {
  return nodes.filter((node) => node.section === section).map((node) => node.id)
}

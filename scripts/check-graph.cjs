// Run: node scripts/check-graph.cjs. Fails if a Built project left the graph with a dangling edge or id.
const ts = require("typescript")
const fs = require("fs"), os = require("os"), path = require("path")
const root = path.join(__dirname, ".."), out = fs.mkdtempSync(path.join(os.tmpdir(), "graph-"))
const tr = (src, dst) => {
  let code = ts.transpileModule(fs.readFileSync(path.join(root, src), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText
  code = code.replace('require("@/components/sections/built-section")', 'require("./built.js")').replace(/require\("(@\/[^"]+|react\/jsx-runtime)"\)/g, "({})")
  fs.writeFileSync(path.join(out, dst), code)
}
tr("components/sections/built-section.tsx", "built.js")
tr("lib/graph-data.ts", "gd.js")
const { nodes, links, HERO_LABELS } = require(path.join(out, "gd.js"))
const { PROJECTS } = require(path.join(out, "built.js"))
const ids = new Set(nodes.map((n) => n.id))
const fail = (msg) => { console.error(msg); process.exit(1) }
if (ids.size !== nodes.length) fail("duplicate node id")
for (const l of links) if (!ids.has(l.source) || !ids.has(l.target)) fail("dangling edge " + JSON.stringify(l))
for (const id of HERO_LABELS) if (!ids.has(id)) fail("hero label for a missing node: " + id)
for (const p of PROJECTS) if (!nodes.some((n) => n.label === p.name && n.kind === "project")) fail("no node for " + p.name)
console.log(`ok: ${nodes.length} nodes, ${links.length} edges, ${PROJECTS.length} Built projects on the graph`)

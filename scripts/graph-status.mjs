#!/usr/bin/env node
// graph-status.mjs — read-only Graphify graph stats for the /initialize dashboard.
// Usage:
//   node scripts/graph-status.mjs                  # JSON to stdout
//   node scripts/graph-status.mjs --format=markdown
//   node scripts/graph-status.mjs --test           # fixture assertions (exit 1 on failure)
// Never blocks: missing or corrupt graph yields {available:false, hint} and exit 0.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

export function readGraphStatus(dir = path.join(rootDir, "graphify-out"), opts = {}) {
  const graphPath = path.join(dir, "graph.json");
  const costPath = path.join(dir, "cost.json");

  if (!fs.existsSync(graphPath)) {
    return { available: false, hint: "graph: not built — run /graphify . (see docs/integrations/graphify.md)" };
  }

  let g;
  try {
    g = JSON.parse(fs.readFileSync(graphPath, "utf8"));
    if (!Array.isArray(g.nodes) || !Array.isArray(g.links)) throw new Error("missing nodes/links");
  } catch {
    return { available: false, hint: "graph: invalid graph.json — re-run /graphify ." };
  }

  const communities = new Set(g.nodes.map((n) => n.community).filter((c) => c != null));
  const ambiguous = g.links.filter((l) => l.confidence === "AMBIGUOUS").length;

  // Staleness: commits since the last run's timestamp (spec: git rev-list --count --since)
  let staleness = null;
  try {
    const cost = JSON.parse(fs.readFileSync(costPath, "utf8"));
    const lastRun = cost.runs?.[cost.runs.length - 1]?.date;
    if (lastRun && typeof lastRun === "string" && !opts.noGit) {
      const n = execFileSync("git", ["rev-list", "--count", "--since", lastRun, "HEAD"], {
        cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      staleness = { commitsBehind: parseInt(n, 10) || 0, lastBuilt: lastRun };
    }
  } catch { /* cost.json or git unavailable — staleness stays null */ }

  return {
    available: true,
    nodes: g.nodes.length,
    edges: g.links.length,
    communities: communities.size,
    ambiguousEdges: ambiguous,
    builtAtCommit: g.built_at_commit || null,
    staleness,
  };
}

export function renderStatusMarkdown(s) {
  if (!s.available) return `  ${s.hint}`;
  const lines = [
    `  ${s.nodes.toLocaleString("en-US")} nodes · ${s.edges.toLocaleString("en-US")} edges · ${s.communities} communities · ${s.ambiguousEdges} ambiguous edge${s.ambiguousEdges === 1 ? "" : "s"}`,
  ];
  if (s.staleness && s.staleness.commitsBehind > 0) {
    lines.push(`  ⚠ graph is ${s.staleness.commitsBehind} commit(s) behind — /close will update it`);
  } else if (s.staleness) {
    lines.push(`  graph is current (built ${String(s.staleness.lastBuilt).split("T")[0]})`);
  }
  return lines.join("\n");
}

function runTests() {
  const fx = path.join(__dirname, "test", "graph-fixtures");
  let failures = 0;
  const assert = (cond, msg) => {
    if (!cond) { console.error(`  ✗ ${msg}`); failures++; } else { console.log(`  ✓ ${msg}`); }
  };

  const s = readGraphStatus(fx, { noGit: true });
  assert(s.available === true, "fixture graph loads");
  assert(s.nodes === 12, `node count is 12 (got ${s.nodes})`);
  assert(s.edges === 8, `edge count is 8 (got ${s.edges})`);
  assert(s.communities === 3, `community count is 3 (got ${s.communities})`);
  assert(s.ambiguousEdges === 1, `ambiguous edge count is 1 (got ${s.ambiguousEdges})`);
  assert(s.builtAtCommit === "fixturecommit000", "built_at_commit read");

  const missing = readGraphStatus(path.join(fx, "does-not-exist"));
  assert(missing.available === false && missing.hint.includes("not built"), "missing graph degrades with hint");

  // Corrupt: point at a dir where graph.json is the corrupt fixture
  const corruptDir = fs.mkdtempSync(path.join(fx, "tmp-"));
  fs.copyFileSync(path.join(fx, "corrupt-graph.json"), path.join(corruptDir, "graph.json"));
  const corrupt = readGraphStatus(corruptDir);
  fs.rmSync(corruptDir, { recursive: true, force: true });
  assert(corrupt.available === false && corrupt.hint.includes("invalid"), "corrupt graph degrades with hint");

  console.log(failures === 0 ? "graph-status: all tests passed" : `graph-status: ${failures} test(s) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

const isMain = !!process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes("--test")) {
    runTests();
  } else {
    const status = readGraphStatus();
    if (args.includes("--format=markdown")) console.log(renderStatusMarkdown(status));
    else console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  }
}

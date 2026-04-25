#!/usr/bin/env node

/**
 * Dashboard Generator — {{ORG_NAME}}
 *
 * Reads org state from initialize.mjs and generates a static HTML dashboard.
 *
 * Usage:
 *   node generate.mjs              # Generate dashboard.html
 *   node generate.mjs --json       # Output raw JSON state
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const args = process.argv.slice(2);

// Gather org state
let state;
try {
  const output = execSync("node scripts/initialize.mjs", {
    cwd: rootDir,
    encoding: "utf-8",
  });
  state = JSON.parse(output);
} catch (e) {
  console.error("Failed to gather org state:", e.message);
  process.exit(1);
}

if (args.includes("--json")) {
  console.log(JSON.stringify(state, null, 2));
  process.exit(0);
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.identity?.name || "Org OS"} — Dashboard</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --text-muted: #8b949e;
      --accent: #58a6ff;
      --green: #3fb950;
      --yellow: #d29922;
      --red: #f85149;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.2rem; color: var(--accent); margin: 2rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    .meta { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1rem;
    }
    .card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
    .card p { color: var(--text-muted); font-size: 0.85rem; }
    .status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
    .status.active { background: var(--green); }
    .status.urgent { background: var(--yellow); }
    .status.critical { background: var(--red); }
    ul { list-style: none; padding: 0; }
    li { padding: 0.3rem 0; font-size: 0.9rem; border-bottom: 1px solid var(--border); }
    li:last-child { border-bottom: none; }
    .tag { background: var(--border); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
    .generated { text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 3rem; }
  </style>
</head>
<body>
  <h1>🌱 ${state.identity?.name || "Organization"}</h1>
  <div class="meta">
    ${state.identity?.type || "Organization"} ·
    ${state.status?.runtime || "none"} ·
    Peers: ${state.status?.peerCount || 0} ·
    Skills: ${state.status?.skillCount || 0} ·
    Memory: ${state.status?.lastMemoryAge || "none"}
  </div>

  <h2>Active Projects</h2>
  <div class="grid">
    ${(state.projects || []).map(p => `
    <div class="card">
      <h3><span class="status active"></span>${p.name}</h3>
      <p>Stage: ${p.stage || "idea"} · Lead: ${p.lead || "—"}</p>
    </div>`).join("")}
  </div>

  <h2>Tasks</h2>
  <ul>
    ${(state.tasks?.critical || []).map(t => `<li><span class="status critical"></span><strong>${t.text}</strong> <span class="tag">CRITICAL</span></li>`).join("")}
    ${(state.tasks?.urgent || []).map(t => `<li><span class="status urgent"></span>${t.text} <span class="tag">URGENT</span></li>`).join("")}
    ${(state.tasks?.upcoming || []).slice(0, 10).map(t => `<li>${t.text}</li>`).join("")}
  </ul>

  <h2>Funding Deadlines</h2>
  <ul>
    ${(state.funding?.upcoming || []).map(f => `<li><span class="status ${f.daysLeft <= 7 ? 'critical' : 'urgent'}"></span>${f.title || f.fund || "—"} — ${f.daysLeft}d left</li>`).join("")}
  </ul>

  <h2>Recent Memory</h2>
  <ul>
    ${(state.recentMemory || []).map(m => `<li><strong>${m.date}</strong>: ${m.summary}</li>`).join("")}
  </ul>

  <h2>Skills</h2>
  <div class="grid">
    ${(state.skills || []).map(s => `
    <div class="card">
      <h3>${s.name}</h3>
      <p>${s.description}</p>
    </div>`).join("")}
  </div>

  <div class="generated">Generated: ${state.generated || new Date().toISOString()}</div>
</body>
</html>`;

const outPath = path.join(__dirname, "dashboard.html");
fs.writeFileSync(outPath, html, "utf-8");
console.log(`Dashboard generated: ${outPath}`);

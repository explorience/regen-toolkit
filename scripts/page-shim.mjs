#!/usr/bin/env node

/**
 * page-shim.mjs — transitional bridge for `npm run page <id>`
 *
 * Until the full TUI renderer ships (see docs/agent-plans/tui-dashboard-implementation.md
 * Task 12), this script provides a minimal markdown rendering for the most common
 * page ids using the existing scripts/initialize.mjs JSON output and DECISIONS.md.
 *
 * When the real renderer (`packages/tui/src/modes/print.mjs`) is wired in,
 * the `page` script in package.json gets retargeted there. This file becomes
 * obsolete and should be removed.
 *
 * Usage:
 *   npm run page <id>                      # dashboard, projects, tasks, instances, decisions, this-week, plans
 *   node scripts/page-shim.mjs <id>
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { renderPage } from "../packages/cloudflare-os-integration/src/page-core/render-page.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const SUPPORTED = ["dashboard", "projects", "tasks", "instances", "decisions", "plans", "this-week"];

const pageId = process.argv[2];

if (!pageId) {
  process.stderr.write(
    "Usage: npm run page <id>\n" +
      `Available pages (shim): ${SUPPORTED.join(", ")}\n` +
      "Full page list will be available once the TUI renderer ships (see docs/agent-plans/tui-dashboard-implementation.md).\n",
  );
  process.exit(2);
}

// Dashboard — delegate to the existing rich markdown renderer.
if (pageId === "dashboard") {
  try {
    const out = execSync("node scripts/initialize.mjs --format=markdown", { cwd: rootDir });
    process.stdout.write(out);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`page-shim: dashboard render failed: ${err.message}\n`);
    process.exit(1);
  }
}

// All other pages: derive from the JSON output.
let state;
try {
  const json = execSync("node scripts/initialize.mjs", { cwd: rootDir, encoding: "utf-8" });
  state = JSON.parse(json);
} catch (err) {
  process.stderr.write(`page-shim: could not load state: ${err.message}\n`);
  process.exit(1);
}

// The renderers now live in the shared page core, which the Cloudflare OS gatekeeper's
// `get_page` capability renders from the same state shape. They were ported verbatim, so this
// script's output is byte-identical to the pre-delegation version — any diff is a porting bug
// in the core, not something to patch here.
//
// The core reads DECISIONS.md / QUEUE.md off the state object rather than from disk (it also
// runs in a Worker, with no fs), so the shim supplies them as raw strings.
state.decisionsRaw = fs.existsSync(path.join(rootDir, "DECISIONS.md"))
  ? fs.readFileSync(path.join(rootDir, "DECISIONS.md"), "utf-8")
  : null;
const queuePath = path.join(rootDir, "docs/agent-plans/QUEUE.md");
state.plansRaw = fs.existsSync(queuePath) ? fs.readFileSync(queuePath, "utf-8") : null;

let out;
try {
  out = renderPage(pageId, state);
} catch {
  process.stderr.write(
    `page-shim: page "${pageId}" is not yet available in shim mode.\n` +
      `Available pages: ${SUPPORTED.join(", ")}\n` +
      `Full page list will arrive when the TUI renderer ships (Task 12 of docs/agent-plans/tui-dashboard-implementation.md).\n`,
  );
  process.exit(2);
}

process.stdout.write(out);
process.exit(0);

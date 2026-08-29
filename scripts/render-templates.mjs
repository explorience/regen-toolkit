#!/usr/bin/env node
/**
 * render-templates.mjs — render org-os's own README/GETTING-STARTED from templates.
 *
 * Dogfoods the templates/render.mjs engine on this very framework. Output:
 *   README.md (rendered from templates/README.framework.md)
 *   GETTING-STARTED.md (rendered from templates/GETTING-STARTED.md)
 *
 * For instances, the cloning engine (scripts/clone-framework.mjs, P10) will
 * pick the right template by org.type and render with instance-specific data.
 *
 * Usage:
 *   node scripts/render-templates.mjs           # render to repo root
 *   node scripts/render-templates.mjs --dry     # print to stdout, don't write
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { render } from "../templates/render.mjs";
import { SITE_URL } from "../site/base.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const templatesDir = path.join(rootDir, "templates");
const partialsDir = path.join(templatesDir, "partials");
const dry = process.argv.includes("--dry");

// Derive data from existing org-os state
const pkg = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf-8"));
const fed = yaml.load(readFileSync(path.join(rootDir, "federation.yaml"), "utf-8")) || {};
const packagesMatrix = yaml.load(readFileSync(path.join(rootDir, "data", "packages-matrix.yaml"), "utf-8")) || {};
const instancesYaml = yaml.load(readFileSync(path.join(rootDir, "data", "instances.yaml"), "utf-8")) || {};

// Curated documentation spine — editorial order and real blurbs, deliberately not
// `readdirSync().sort().slice(0, 12)`. The old alphabetical slice produced entries with
// empty blurbs ("— " and nothing after it) and silently truncated anything past the
// twelfth filename, which is why docs/MODULES.md could never appear. Mirrors the site's
// curated set in site/src/data/docs-allowlist.ts; keep the two in step.
const DOC_SPINE = [
  { file: "ARCHITECTURE.md", title: "Architecture", blurb: "How an instance is put together" },
  { file: "MODULES.md", title: "Modules", blurb: "The v0.5 catalog — what ships, what's planned" },
  { file: "FEDERATION.md", title: "Federation", blurb: "Peers, trust levels, lineage, drift" },
  { file: "DATA-MODEL.md", title: "Data Model", blurb: "The registries and their cross-references" },
  { file: "EIP4824-GUIDE.md", title: "EIP-4824 Guide", blurb: "Machine-readable org schemas, generated from your data" },
  { file: "AGENTIC-ARCHITECTURE.md", title: "Agentic Architecture", blurb: "How agents read, act on, and improve the workspace" },
  { file: "OPERATOR-GUIDE.md", title: "Operator Guide", blurb: "Running a downstream instance day to day" },
  { file: "COMMANDS.md", title: "Commands", blurb: "Session lifecycle and the slash-command set" },
  { file: "FILE-STRUCTURE.md", title: "File Structure", blurb: "Canonical paths, and what validate:structure enforces" },
  { file: "SKILL-PROMOTION.md", title: "Skill Promotion", blurb: "How instance-proven patterns become canonical" },
  { file: "RAD-ORG-OS.md", title: "rad-org-os", blurb: "The sovereign distribution — org-os on Radicle" },
  { file: "VAULT-SAFETY.md", title: "Vault Safety", blurb: "Snapshots, audits, and the destructive-op bans" },
];

const missingDocs = DOC_SPINE.filter((d) => !existsSync(path.join(rootDir, "docs", d.file)));
if (missingDocs.length) {
  console.error(
    `render-templates: DOC_SPINE names docs that don't exist: ${missingDocs.map((d) => d.file).join(", ")}`,
  );
  process.exit(1);
}

const docs = DOC_SPINE.map((d) => ({ title: d.title, path: `docs/${d.file}`, blurb: d.blurb }));

const data = {
  org: {
    name: fed.identity?.name || "org-os",
    tagline: "shared operating system for a federation of regenerative organizations",
    short_description: fed.identity?.short_description || "Framework + standards + orchestration hub.",
    version: pkg.version,
    // Live site URL — single source of truth is site/base.config.mjs, so a
    // deploy-path change re-renders the README instead of drifting from it.
    site: SITE_URL,
    status: "active",
    bootstrap_date: "2026-04-24",
  },
  federation: {
    network: fed.network || "",
    peers: (fed.peers || []).map((p) => (typeof p === "string" ? p : p.id || p.name)).filter(Boolean),
    downstream: (instancesYaml.instances || []).map((i) => ({
      name: i.id || i.name,
      type: i.type || "instance",
      status: i.status || "unknown",
    })),
  },
  counts: {
    // data/skills-matrix.yaml also carries unpromoted candidates (DAO-module skills
    // living in dao-os) and the generated skills/commands/ mirror — neither ships in
    // this repo's skills/. Count what's actually here: top-level skills/<name>/SKILL.md.
    skills: readdirSync(path.join(rootDir, "skills"), { withFileTypes: true }).filter(
      (e) => e.isDirectory() && existsSync(path.join(rootDir, "skills", e.name, "SKILL.md")),
    ).length,
    packages: (packagesMatrix.packages || []).length,
  },
  docs,
};

const sources = [
  { template: "README.framework.md", target: "README.md" },
  // Session/adoption one-pager (WS-I I4) — rendered so its numbers stay live.
  { template: "session-one-pager.md", target: "docs/sessions/2026-09-10-one-pager.md" },
];

for (const { template, target } of sources) {
  const tmpl = readFileSync(path.join(templatesDir, template), "utf-8");
  const out = render(tmpl, data, { partialsDir });
  if (dry) {
    console.log(`=== ${target} ===`);
    console.log(out);
    console.log();
  } else {
    writeFileSync(path.join(rootDir, target), out);
    console.log(`✓ wrote ${target} (from templates/${template})`);
  }
}

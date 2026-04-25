#!/usr/bin/env node

/**
 * update-knowledge-index.mjs — Auto-Indexing for LLM Knowledge Base
 *
 * Runs after compile-knowledge.mjs to:
 *   1. Update data/knowledge-manifest.yaml with actual page counts and dates
 *   2. Update each domain's index.md with a Knowledge Pages table
 *   3. Generate knowledge/README.md as the top-level hub
 *
 * Usage:
 *   node scripts/update-knowledge-index.mjs
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const knowledgeDir = path.join(rootDir, "knowledge");
const manifestPath = path.join(rootDir, "data", "knowledge-manifest.yaml");

function today() {
  return new Date().toISOString().split("T")[0];
}

// ── 1. Scan knowledge pages ─────────────────────────────────────────────────

function scanDomain(domainDir) {
  if (!fs.existsSync(domainDir)) return [];

  const files = fs
    .readdirSync(domainDir)
    .filter((f) => f.endsWith(".md") && f !== "index.md");

  const pages = [];
  for (const file of files) {
    const filePath = path.join(domainDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    let fm = {};
    try {
      fm = matter(raw).data;
    } catch {
      // skip unparseable files
    }

    const stat = fs.statSync(filePath);
    const sourceCount = (fm.source_refs || []).length + (fm.compiled_from || []).length;
    const hasLlmMarkers = raw.includes("<!-- LLM-SYNTHESIZE");
    const wordCount = raw
      .replace(/---[\s\S]*?---/, "")
      .replace(/<[^>]+>/g, "")
      .split(/\s+/)
      .filter(Boolean).length;

    pages.push({
      file: file.replace(".md", ""),
      title: fm.title || file.replace(".md", "").replace(/-/g, " "),
      type: fm.type || "unknown",
      date_updated: fm.date_updated || stat.mtime.toISOString().split("T")[0],
      sources: sourceCount,
      complete: !hasLlmMarkers,
      wordCount,
    });
  }

  return pages;
}

// ── 2. Update manifest ──────────────────────────────────────────────────────

function updateManifest(domainStats) {
  const raw = fs.readFileSync(manifestPath, "utf-8");
  const data = yaml.load(raw);

  if (!data?.knowledge_manifest?.domains) {
    console.warn("  ⚠ Could not parse knowledge-manifest.yaml");
    return;
  }

  for (const domain of data.knowledge_manifest.domains) {
    const stats = domainStats[domain.id];
    if (stats) {
      domain.page_count = stats.pageCount;
      domain.last_updated = today();
      if (stats.pageCount === 0) domain.coverage = "none";
      else if (stats.pageCount <= 3) domain.coverage = "partial";
      else domain.coverage = "comprehensive";
    }
  }

  const output = yaml.dump(data, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });

  // Preserve the schema_version and comments at the top
  const header = `schema_version: "2.0"\n\n# Knowledge Manifest — {{ORG_NAME}}\n# Auto-updated by scripts/update-knowledge-index.mjs on ${today()}\n\n`;
  fs.writeFileSync(manifestPath, header + output.replace(/^schema_version:.*\n/, ""), "utf-8");
  console.log("  ✓ Updated data/knowledge-manifest.yaml");
}

// ── 3. Update domain index.md ───────────────────────────────────────────────

function updateDomainIndex(domainId, pages) {
  const indexPath = path.join(knowledgeDir, domainId, "index.md");
  if (!fs.existsSync(indexPath)) return;

  let content = fs.readFileSync(indexPath, "utf-8");

  // Remove existing Knowledge Pages section if present
  const marker = "## Knowledge Pages";
  const markerIdx = content.indexOf(marker);
  if (markerIdx !== -1) {
    content = content.slice(0, markerIdx).trimEnd();
  }

  // Build new section
  let section = "\n\n## Knowledge Pages\n\n";

  if (pages.length === 0) {
    section += "_No compiled pages yet. Run `npm run compile:knowledge` to generate._\n";
  } else {
    section += "| Page | Type | Updated | Sources | Status |\n";
    section += "|------|------|---------|---------|--------|\n";

    for (const p of pages) {
      const status = p.complete ? "complete" : "needs synthesis";
      section += `| [[${p.file}\\|${p.title}]] | ${p.type} | ${p.date_updated} | ${p.sources} | ${status} |\n`;
    }

    section += `\n_${pages.length} pages compiled. Last updated: ${today()}_\n`;
  }

  content += section;
  fs.writeFileSync(indexPath, content, "utf-8");
}

// ── 4. Generate knowledge/README.md ─────────────────────────────────────────

function generateReadme(domainStats) {
  const totalPages = Object.values(domainStats).reduce((sum, d) => sum + d.pageCount, 0);
  const totalComplete = Object.values(domainStats).reduce((sum, d) => sum + d.completeCount, 0);
  const totalWords = Object.values(domainStats).reduce((sum, d) => sum + d.totalWords, 0);

  let content = `---
title: Knowledge Base
type: index
date_updated: ${today()}
---

# {{ORG_NAME}} Knowledge Base

> ${totalPages} knowledge pages across ${Object.keys(domainStats).length} domains. ${totalComplete} complete, ${totalPages - totalComplete} awaiting synthesis. ~${Math.round(totalWords / 1000)}K words.

## Domains

| Domain | Pages | Coverage | Status | Last Updated |
|--------|-------|----------|--------|--------------|
`;

  for (const [domainId, stats] of Object.entries(domainStats)) {
    const name = domainId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const coverage = stats.pageCount === 0 ? "none" : stats.pageCount <= 3 ? "partial" : "comprehensive";
    const status = stats.incompleteCount > 0 ? `${stats.incompleteCount} need synthesis` : "up to date";
    content += `| [[${domainId}/index\\|${name}]] | ${stats.pageCount} | ${coverage} | ${status} | ${today()} |\n`;
  }

  content += `
## Quick Links

- [[regenerative-finance/funding-landscape|Funding Landscape]] — ${Object.values(domainStats).reduce((s, d) => s, 0)} tracked opportunities
- [[regenerant-catalunya/program-timeline|Program Timeline]] — Chronological program record
- [[local-governance/normalization-summary|Data Normalization]] — Cross-source canonical values

## Pipeline

\`\`\`
Raw Sources (meetings, projects, funding, Notion)
    ↓  npm run compile:knowledge
Compiled Pages (knowledge/<domain>/*.md)
    ↓  knowledge-curator skill
Synthesized Wiki (prose sections completed)
    ↓  npm run lint:knowledge
Validated Knowledge Base
\`\`\`

## Commands

| Command | Description |
|---------|-------------|
| \`npm run compile:knowledge\` | Extract sources + compile pages + update indexes |
| \`npm run lint:knowledge\` | Health check (structure, freshness, links, content) |
| \`npm run knowledge\` | Full pipeline (compile + lint) |

_Auto-generated by \`scripts/update-knowledge-index.mjs\` on ${today()}_
`;

  fs.writeFileSync(path.join(knowledgeDir, "README.md"), content, "utf-8");
  console.log("  ✓ Generated knowledge/README.md");
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("Updating knowledge indexes...\n");

  // Get domain list from manifest
  const manifestRaw = fs.readFileSync(manifestPath, "utf-8");
  const manifest = yaml.load(manifestRaw);
  const domains = (manifest?.knowledge_manifest?.domains || []).map((d) => d.id);

  if (domains.length === 0) {
    console.log("  ⚠ No domains found in knowledge-manifest.yaml");
    return;
  }

  const domainStats = {};

  for (const domainId of domains) {
    const domainDir = path.join(knowledgeDir, domainId);
    const pages = scanDomain(domainDir);

    domainStats[domainId] = {
      pageCount: pages.length,
      completeCount: pages.filter((p) => p.complete).length,
      incompleteCount: pages.filter((p) => !p.complete).length,
      totalWords: pages.reduce((sum, p) => sum + p.wordCount, 0),
      pages,
    };

    // Update domain index.md
    updateDomainIndex(domainId, pages);
    console.log(`  ✓ ${domainId}: ${pages.length} pages indexed`);
  }

  // Update manifest
  updateManifest(domainStats);

  // Generate README
  generateReadme(domainStats);

  const total = Object.values(domainStats).reduce((s, d) => s + d.pageCount, 0);
  console.log(`\n✓ Indexed ${total} knowledge pages across ${domains.length} domains`);
}

main();

#!/usr/bin/env node

/**
 * lint-knowledge.mjs — Knowledge Base Health Checks
 *
 * Validates the knowledge base for structural integrity, freshness,
 * link integrity, content completeness, and consistency.
 *
 * Modeled on validate-structure.mjs (same check/warn/pass-fail pattern).
 *
 * Usage:
 *   node scripts/lint-knowledge.mjs
 *
 * Exit codes:
 *   0 — all checks passed (warnings are OK)
 *   1 — hard failures found
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

let passed = 0;
let failed = 0;
let warnings = 0;

function check(description, condition) {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.log(`  ✗ ${description}`);
    failed++;
  }
}

function warn(description) {
  console.log(`  ⚠ ${description}`);
  warnings++;
}

function readYamlSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const docEnd = content.indexOf("\n---\n", 1);
    const yamlContent = docEnd > 0 ? content.slice(0, docEnd) : content;
    return yaml.load(yamlContent);
  } catch {
    return null;
  }
}

function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// ── 1. Structural Checks ───────────────────────────────────────────────────

function checkStructure() {
  console.log("\n1. Structure");

  // Manifest exists
  check("knowledge-manifest.yaml exists", fs.existsSync(manifestPath));

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];

  check(`Manifest declares domains (${domains.length})`, domains.length > 0);

  // Each domain has a directory and index.md
  let dirCount = 0;
  let indexCount = 0;
  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    if (fs.existsSync(domainDir)) dirCount++;
    else warn(`Missing directory: knowledge/${domain.id}/`);

    const indexPath = path.join(domainDir, "index.md");
    if (fs.existsSync(indexPath)) indexCount++;
    else warn(`Missing index: knowledge/${domain.id}/index.md`);
  }

  check(`All ${domains.length} domain directories exist`, dirCount === domains.length);
  check(`All ${domains.length} domain indexes exist`, indexCount === domains.length);

  // README exists
  check("knowledge/README.md exists", fs.existsSync(path.join(knowledgeDir, "README.md")));
}

// ── 2. Frontmatter Checks ───────────────────────────────────────────────────

function checkFrontmatter() {
  console.log("\n2. Page Frontmatter");

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];
  const requiredFields = ["title", "domain", "type"];

  let validPages = 0;
  let totalPages = 0;

  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    if (!fs.existsSync(domainDir)) continue;

    const files = fs
      .readdirSync(domainDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md");

    for (const file of files) {
      totalPages++;
      const filePath = path.join(domainDir, file);
      let fm = {};
      try {
        fm = matter(fs.readFileSync(filePath, "utf-8")).data;
      } catch {
        warn(`Cannot parse frontmatter: ${domain.id}/${file}`);
        continue;
      }

      const missing = requiredFields.filter((f) => !fm[f]);
      if (missing.length > 0) {
        warn(`${domain.id}/${file}: missing frontmatter fields: ${missing.join(", ")}`);
      } else {
        validPages++;
      }
    }
  }

  check(`All ${totalPages} pages have required frontmatter`, validPages === totalPages);
}

// ── 3. Freshness Checks ────────────────────────────────────────────────────

function checkFreshness() {
  console.log("\n3. Freshness");

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];
  const STALE_DAYS = 30;

  let staleCount = 0;
  let emptyCount = 0;

  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    if (!fs.existsSync(domainDir)) continue;

    const files = fs
      .readdirSync(domainDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md");

    if (files.length === 0) {
      warn(`${domain.id}: no knowledge pages (coverage: none)`);
      emptyCount++;
      continue;
    }

    for (const file of files) {
      const filePath = path.join(domainDir, file);
      let fm = {};
      try {
        fm = matter(fs.readFileSync(filePath, "utf-8")).data;
      } catch {
        continue;
      }

      const days = daysSince(fm.date_updated);
      if (days > STALE_DAYS) {
        warn(`${domain.id}/${file}: last updated ${days} days ago (> ${STALE_DAYS}d threshold)`);
        staleCount++;
      }
    }
  }

  check(`No empty domains`, emptyCount === 0);
  if (staleCount > 0) {
    warn(`${staleCount} pages are stale (> ${STALE_DAYS} days old)`);
  } else {
    check("All pages within freshness threshold", true);
  }
}

// ── 4. Link Integrity ──────────────────────────────────────────────────────

function checkLinks() {
  console.log("\n4. Wiki Links");

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];

  // Build a set of all known page names (for wiki link resolution)
  const knownPages = new Set();
  for (const domain of domains) {
    knownPages.add(domain.id);
    knownPages.add(`${domain.id}/index`);
    const domainDir = path.join(knowledgeDir, domain.id);
    if (!fs.existsSync(domainDir)) continue;
    const files = fs.readdirSync(domainDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      knownPages.add(`${domain.id}/${file.replace(".md", "")}`);
      knownPages.add(file.replace(".md", ""));
    }
  }
  // Also add meeting IDs as known (they're referenced via [[meeting-id]])
  const meetingsData = readYamlSafe(path.join(rootDir, "data", "meetings.yaml"));
  if (meetingsData?.meetings) {
    for (const m of meetingsData.meetings) {
      if (m.id) knownPages.add(m.id);
    }
  }
  // Meeting files (both full name and partial matches for fuzzy meeting refs)
  const meetingsDir = path.join(rootDir, "packages", "operations", "meetings");
  if (fs.existsSync(meetingsDir)) {
    for (const f of fs.readdirSync(meetingsDir).filter((f) => f.endsWith(".md"))) {
      knownPages.add(f.replace(".md", ""));
      // Also add the frontmatter id if parseable
      try {
        const raw = fs.readFileSync(path.join(meetingsDir, f), "utf-8");
        const fm = matter(raw).data;
        if (fm.id) knownPages.add(fm.id);
      } catch { /* skip */ }
    }
  }

  // Treat any wiki link starting with "meeting-" as a meeting reference (always valid)
  const isMeetingRef = (target) => target.startsWith("meeting-") || target.match(/^\d{6}/)

  let brokenLinks = 0;
  let totalLinks = 0;

  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    if (!fs.existsSync(domainDir)) continue;

    const files = fs.readdirSync(domainDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(domainDir, file), "utf-8");
      // Match [[target]] and [[target|display]]
      const wikiLinks = content.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g);
      for (const match of wikiLinks) {
        totalLinks++;
        const target = match[1].replace(/\\/g, "");
        if (!knownPages.has(target) && !isMeetingRef(target)) {
          // Check if it's a valid relative path
          const absPath = path.join(knowledgeDir, target + ".md");
          const absPath2 = path.join(knowledgeDir, target, "index.md");
          if (!fs.existsSync(absPath) && !fs.existsSync(absPath2)) {
            brokenLinks++;
          }
        }
      }
    }
  }

  check(
    `Wiki links resolve (${totalLinks} total, ${brokenLinks} broken)`,
    brokenLinks === 0
  );
  if (brokenLinks > 0) {
    warn(`${brokenLinks} broken wiki links found`);
  }
}

// ── 5. Content Completeness ─────────────────────────────────────────────────

function checkContent() {
  console.log("\n5. Content Completeness");

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];

  let synthesizeCount = 0;
  let stubCount = 0;
  let totalPages = 0;
  const STUB_THRESHOLD = 100;

  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    if (!fs.existsSync(domainDir)) continue;

    const files = fs
      .readdirSync(domainDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md");

    for (const file of files) {
      totalPages++;
      const content = fs.readFileSync(path.join(domainDir, file), "utf-8");

      if (content.includes("<!-- LLM-SYNTHESIZE")) {
        synthesizeCount++;
      }

      const wordCount = content
        .replace(/---[\s\S]*?---/, "")
        .replace(/<[^>]+>/g, "")
        .split(/\s+/)
        .filter(Boolean).length;

      if (wordCount < STUB_THRESHOLD) {
        warn(`${domain.id}/${file}: stub (${wordCount} words, < ${STUB_THRESHOLD} threshold)`);
        stubCount++;
      }
    }
  }

  if (synthesizeCount > 0) {
    warn(
      `${synthesizeCount}/${totalPages} pages have <!-- LLM-SYNTHESIZE --> markers (run knowledge-curator to complete)`
    );
  } else {
    check("All pages fully synthesized", true);
  }

  if (stubCount > 0) {
    warn(`${stubCount} stub pages (< ${STUB_THRESHOLD} words) — may need more content`);
  } else {
    check("No stub pages", true);
  }
}

// ── 6. Manifest Consistency ─────────────────────────────────────────────────

function checkConsistency() {
  console.log("\n6. Consistency");

  const manifest = readYamlSafe(manifestPath);
  const domains = manifest?.knowledge_manifest?.domains || [];

  let mismatchCount = 0;

  for (const domain of domains) {
    const domainDir = path.join(knowledgeDir, domain.id);
    const actualCount = fs.existsSync(domainDir)
      ? fs.readdirSync(domainDir).filter((f) => f.endsWith(".md") && f !== "index.md").length
      : 0;

    if (domain.page_count !== actualCount) {
      warn(
        `${domain.id}: manifest says ${domain.page_count} pages, actual is ${actualCount}`
      );
      mismatchCount++;
    }
  }

  check(
    "Manifest page_counts match actual files",
    mismatchCount === 0
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log("Knowledge Base Health Check");
console.log("===========================");

checkStructure();
checkFrontmatter();
checkFreshness();
checkLinks();
checkContent();
checkConsistency();

console.log("\n───────────────────────────────────────────────────────────────");
console.log(
  `Results: ${passed} passed, ${failed} failed, ${warnings} warnings`
);

if (failed > 0) {
  console.log("\n✗ Knowledge base has hard failures that need fixing.");
  process.exit(1);
} else if (warnings > 0) {
  console.log(
    "\n⚠ Knowledge base is functional but has warnings to address."
  );
  process.exit(0);
} else {
  console.log("\n✓ Knowledge base is healthy.");
  process.exit(0);
}

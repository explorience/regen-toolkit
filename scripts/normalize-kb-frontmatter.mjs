#!/usr/bin/env node
/**
 * normalize-kb-frontmatter.mjs — knowledge base frontmatter normalizer (framework version)
 *
 * - Ensures every .md file has YAML frontmatter with title
 * - Adds aliases for renamed files so wiki-links resolve
 * - Strips non-standard fields
 * - Adds title from first # heading if missing
 *
 * Configuration:
 *   --content-dir <path>      Directory to scan (default: derived from
 *                             data/knowledge-aliases.yaml or knowledge/)
 *   --aliases <path>          Path to aliases YAML
 *                             (default: data/knowledge-aliases.yaml)
 *
 * Aliases file format (per-instance):
 *   content_dir: "repos/refi-bcn-knowledge/content"   # optional
 *   strip_fields: ["Assignee", "Status", "Archive?"]   # optional
 *   aliases:
 *     "about/unconference.md": ["ReFi UNCONFERENCE Barcelona"]
 *     "ecosystem/global/refi-dao.md": ["ReFi DAO"]
 *
 * If no aliases file exists, the script normalizes frontmatter for the
 * given content-dir without applying aliases.
 *
 * Usage:
 *   node scripts/normalize-kb-frontmatter.mjs --content-dir knowledge/
 *   node scripts/normalize-kb-frontmatter.mjs --aliases data/knowledge-aliases.yaml
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// CLI arg parsing
function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

const aliasesPath = path.resolve(rootDir, getArg("--aliases") || "data/knowledge-aliases.yaml");

let config = {};
if (fs.existsSync(aliasesPath)) {
  config = yaml.load(fs.readFileSync(aliasesPath, "utf-8")) || {};
}

const contentDir = path.resolve(rootDir, getArg("--content-dir") || config.content_dir || "knowledge");
const ALIAS_MAP = config.aliases || {};
const STRIP_FIELDS = config.strip_fields || ["Assignee", "Status", "Archive?", "Parent item", "Archive"];

if (!fs.existsSync(contentDir)) {
  console.error(`✗ Content directory does not exist: ${contentDir}`);
  console.error(`  Provide --content-dir <path> or set content_dir in ${aliasesPath}`);
  process.exit(1);
}

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      results.push(...getAllMdFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: null, body: content, raw: "" };

  const raw = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = {};

  for (const line of raw.split("\n")) {
    const m = line.match(/^(\w[\w\s?]*?):\s*(.*)$/);
    if (m) {
      let value = m[2].trim();
      if (value.startsWith("[")) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch { /* keep as string */ }
      }
      if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[m[1].trim()] = value;
    }
  }

  return { frontmatter, body, raw };
}

function titleFromBody(body) {
  const match = body.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

function titleFromFilename(filepath) {
  const name = path.basename(filepath, ".md");
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function buildFrontmatter(fields) {
  let yamlOut = "---\n";
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      yamlOut += `${key}: [${value.map(v => `"${v}"`).join(", ")}]\n`;
    } else {
      const needsQuote = typeof value === "string" && (value.includes(":") || value.includes("#") || value.includes('"') || value.includes("'") || value.includes("[") || value.includes("?") || value.includes("!"));
      yamlOut += needsQuote ? `${key}: "${value.replace(/"/g, '\\"')}"\n` : `${key}: ${value}\n`;
    }
  }
  yamlOut += "---\n";
  return yamlOut;
}

let updated = 0;
let added = 0;
let stripped = 0;

const files = getAllMdFiles(contentDir);

for (const filepath of files) {
  const relPath = path.relative(contentDir, filepath);
  const content = fs.readFileSync(filepath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  const aliases = ALIAS_MAP[relPath] || null;
  let needsWrite = false;

  if (frontmatter) {
    const newFields = { ...frontmatter };

    if (!newFields.title) {
      newFields.title = titleFromBody(body) || titleFromFilename(filepath);
      needsWrite = true;
    }

    if (aliases && !newFields.aliases) {
      newFields.aliases = aliases;
      needsWrite = true;
    }

    for (const field of STRIP_FIELDS) {
      if (newFields[field] !== undefined) {
        delete newFields[field];
        stripped++;
        needsWrite = true;
      }
    }

    if (needsWrite) {
      const newContent = buildFrontmatter(newFields) + "\n" + body;
      fs.writeFileSync(filepath, newContent);
      updated++;
    }
  } else {
    const title = titleFromBody(body) || titleFromFilename(filepath);
    const fields = { title };
    if (aliases) fields.aliases = aliases;

    const newContent = buildFrontmatter(fields) + "\n" + content;
    fs.writeFileSync(filepath, newContent);
    added++;
  }
}

console.log(`Content dir: ${path.relative(rootDir, contentDir)}`);
console.log(`Aliases:     ${fs.existsSync(aliasesPath) ? path.relative(rootDir, aliasesPath) : "(none)"}`);
console.log(`Processed ${files.length} files`);
console.log(`  Added frontmatter: ${added}`);
console.log(`  Updated frontmatter: ${updated}`);
console.log(`  Stripped non-standard fields: ${stripped}`);

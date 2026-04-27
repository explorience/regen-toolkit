#!/usr/bin/env node
// Mechanical extraction of resource entries from docs/MASTER.md → data/resources.yaml.
// Plan: docs/plans/resources-lift.md
// Scope: lines 1089-2668 (1-indexed inclusive).

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const SRC = "docs/MASTER.md";
const OUT = "data/resources.yaml";
const START_LINE = 1089;
const END_LINE = 2668;

const SUPER_HEADINGS = new Set([
  "Resources - Full",
  "Full Resource List (Raw Aggregation)",
  "Resources - Articles, Research",
  "Resource Graph",
  "Project Outline",
  "Project Details",
  "System Architecture",
]);

function cleanHeading(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\\([\-_*])/g, "$1")
    .replace(/^\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\d.\s]+/u, "")
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractUrls(line) {
  const urls = [];
  const re = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    urls.push({ label: m[1], url: m[2] });
  }
  return urls;
}

function normalizeUrl(u) {
  if (!u) return null;
  try {
    const parsed = new URL(u);
    for (const k of [...parsed.searchParams.keys()]) {
      if (k.toLowerCase().startsWith("utm_")) parsed.searchParams.delete(k);
    }
    return parsed.toString().replace(/\/$/, "") || u;
  } catch {
    return u.trim();
  }
}

function stripTitleNoise(text) {
  return text
    .replace(/\\([\-_*])/g, "$1")
    .replace(/\s+\[[^\]]*\]\([^)]+\)\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function looksLikeUrlOnly(text) {
  const stripped = text.replace(/\[[^\]]*\]\([^)]+\)/g, "").trim();
  return stripped.length === 0;
}

const src = fs.readFileSync(SRC, "utf8").split(/\r?\n/);

let h1 = null;
let h2 = null;
let h3 = null;

const entries = [];
const idCounts = new Map();

let i = START_LINE - 1;
while (i < END_LINE && i < src.length) {
  const lineNo = i + 1;
  const raw = src[i];
  const line = raw;

  // Heading detection
  const h1m = line.match(/^#\s+(.+?)\s*$/);
  const h2m = line.match(/^##\s+(.+?)\s*$/);
  const h3m = line.match(/^###\s+(.+?)\s*$/);
  if (h1m && !line.startsWith("##")) {
    const txt = cleanHeading(h1m[1]);
    if (!SUPER_HEADINGS.has(txt) && txt.length > 0) {
      h1 = txt;
      h2 = null;
      h3 = null;
    }
    i += 1;
    continue;
  }
  if (h2m) {
    h2 = cleanHeading(h2m[1]);
    h3 = null;
    i += 1;
    continue;
  }
  if (h3m) {
    h3 = cleanHeading(h3m[1]);
    i += 1;
    continue;
  }

  // Bullet detection: * or -
  const bm = line.match(/^(\s*)([*\-])\s+(.+?)\s*$/);
  if (!bm) {
    i += 1;
    continue;
  }
  const [, indent, , bulletContent] = bm;
  if (indent.length > 0) {
    // Indented continuation — skip; primary parser already grabbed it via lookahead
    i += 1;
    continue;
  }

  // Skip URL-only continuation lines that slipped through
  if (looksLikeUrlOnly(bulletContent)) {
    i += 1;
    continue;
  }

  let title = stripTitleNoise(bulletContent);
  let urls = extractUrls(bulletContent);
  let endLine = lineNo;

  // Look ahead for indented continuation lines (URLs or sub-bullets).
  // The MASTER.md format puts URLs on a SEPARATE indented line WITHOUT a bullet:
  //   * Title — Author
  //      [https://url.example/](https://url.example/)
  let j = i + 1;
  while (j < END_LINE && j < src.length) {
    const next = src[j];
    if (next.match(/^\s*$/)) break; // blank line ends entry block
    // Indented sibling sub-bullet ends the lookahead but not the entry
    const indentedBullet = next.match(/^(\s+)[*\-]\s+(.+?)\s*$/);
    if (indentedBullet) {
      // Treat indented bullets as part of this entry's notes if URL-only
      if (looksLikeUrlOnly(indentedBullet[2])) {
        urls.push(...extractUrls(indentedBullet[2]));
        endLine = j + 1;
        j += 1;
        continue;
      }
      break;
    }
    // Top-level bullet starts a new entry
    if (next.match(/^[*\-]\s+/)) break;
    // Indented non-bullet continuation: typically a URL line
    const indented = next.match(/^(\s+)(.+?)\s*$/);
    if (indented) {
      const content = indented[2];
      const newUrls = extractUrls(content);
      if (newUrls.length > 0) {
        urls.push(...newUrls);
        endLine = j + 1;
      }
      j += 1;
      continue;
    }
    break;
  }

  if (!title || title.length < 2) {
    i = j;
    continue;
  }

  const url = urls.length > 0 ? normalizeUrl(urls[0].url) : null;
  const baseId = slugify(title) || "resource";
  const count = (idCounts.get(baseId) || 0) + 1;
  idCounts.set(baseId, count);
  const id = count === 1 ? baseId : `${baseId}-${count}`;

  const domain = h2 || h1 || "uncategorized";
  const subcategory = h3 || null;

  entries.push({
    id,
    title,
    url,
    domain,
    subcategory,
    source_lines: [lineNo, endLine],
  });

  i = j;
}

const out = {
  schema_version: "1.0",
  generated_from: `${SRC} lines ${START_LINE}-${END_LINE}`,
  generated_at: new Date().toISOString().slice(0, 10),
  generator: "scripts/lift-resources.mjs",
  note: "Mechanical extraction. Pending Brandon's curation pass (Layer 1 owner).",
  resources: entries,
};

fs.writeFileSync(
  OUT,
  yaml.dump(out, {
    lineWidth: 200,
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false,
  }),
);

console.log(`✓ ${entries.length} resources extracted from ${SRC} → ${OUT}`);
console.log(`  with-url: ${entries.filter((e) => e.url).length}`);
console.log(`  text-only: ${entries.filter((e) => !e.url).length}`);
const domainCounts = entries.reduce((acc, e) => {
  acc[e.domain] = (acc[e.domain] || 0) + 1;
  return acc;
}, {});
console.log(`  domains: ${Object.keys(domainCounts).length}`);
for (const [d, c] of Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(`    ${c.toString().padStart(4)} — ${d}`);
}

#!/usr/bin/env node

/**
 * compile-knowledge.mjs — LLM Knowledge Base Compiler
 *
 * Reads raw organizational sources (meetings, projects, funding, normalization log)
 * and compiles them into domain-organized knowledge pages under knowledge/.
 *
 * Two phases:
 *   1. EXTRACT — parse all sources, route content to domains by signal keywords
 *   2. COMPILE — generate .md knowledge pages with frontmatter, wiki links, provenance
 *
 * Pages include <!-- LLM-SYNTHESIZE --> markers where an agent should write prose.
 *
 * Usage:
 *   node scripts/compile-knowledge.mjs
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// ── Domain Signal Mapping ───────────────────────────────────────────────────

const DOMAIN_SIGNALS = {
  "regenerative-finance": [
    "finance",
    "funding",
    "refi",
    "grants",
    "gitcoin",
    "celo",
    "treasury",
    "budget",
    "allocation",
    "payout",
    "safe",
    "octant",
    "artisan",
    "superfluid",
  ],
  "local-governance": [
    "governance",
    "cooperative",
    "legal",
    "decision",
    "bloc4",
    "incubation",
    "constitution",
    "assembly",
    "voting",
    "statutes",
    "ess",
    "sccl",
  ],
  "bioregional-finance": [
    "bioregion",
    "local-currency",
    "circular",
    "catalonia",
    "territori",
    "community-currency",
  ],
  "cooperative-web3-bridging": [
    "web3",
    "blockchain",
    "karma",
    "onchain",
    "dao",
    "multisig",
    "wallet",
    "token",
    "idk",
    "hum",
    "smart-contract",
  ],
  "regenerant-catalunya": [
    "regenerant",
    "regenera",
    "phase-2",
    "phase-1",
    "workshop",
    "miceli",
    "fundicio",
    "keras",
    "localism",
    "seira",
  ],
};

const DOMAINS = Object.keys(DOMAIN_SIGNALS);

// ── Helpers ─────────────────────────────────────────────────────────────────

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function readYamlSafe(filePath) {
  const content = readFileSafe(filePath);
  if (!content) return null;
  try {
    // Some YAML files have a trailing --- followed by markdown.
    // Only parse the first YAML document.
    const docEnd = content.indexOf("\n---\n", 1);
    const yamlContent = docEnd > 0 ? content.slice(0, docEnd) : content;
    return yaml.load(yamlContent);
  } catch (e) {
    console.warn(`  ⚠ YAML parse error in ${filePath}: ${e.reason || e.message}`);
    return null;
  }
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Route a piece of content to domains based on signal keywords */
function routeToDomains(text, signals = []) {
  const matches = new Set();
  const lowerText = (text || "").toLowerCase();
  const lowerSignals = signals.map((s) => String(s).toLowerCase());

  for (const [domain, keywords] of Object.entries(DOMAIN_SIGNALS)) {
    for (const kw of keywords) {
      if (
        lowerSignals.includes(kw) ||
        lowerText.includes(kw)
      ) {
        matches.add(domain);
        break;
      }
    }
  }

  return [...matches];
}

/** Extract sections from meeting markdown */
function extractSections(content) {
  const sections = {};
  const lines = content.split("\n");
  let currentSection = null;
  let currentLines = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      if (currentSection) {
        sections[currentSection] = currentLines.join("\n").trim();
      }
      currentSection = headingMatch[1].trim();
      currentLines = [];
    } else if (currentSection) {
      currentLines.push(line);
    }
  }
  if (currentSection) {
    sections[currentSection] = currentLines.join("\n").trim();
  }
  return sections;
}

// ── Phase 1: EXTRACT ────────────────────────────────────────────────────────

function extractMeetings() {
  const meetingsDir = path.join(rootDir, "packages", "operations", "meetings");
  const entries = [];

  if (!fs.existsSync(meetingsDir)) return entries;

  const files = fs.readdirSync(meetingsDir).filter((f) => f.endsWith(".md") && f !== "README.md");

  for (const file of files) {
    const filePath = path.join(meetingsDir, file);
    const raw = readFileSafe(filePath);
    if (!raw) continue;

    let parsed;
    try {
      parsed = matter(raw);
    } catch {
      continue;
    }

    const fm = parsed.data;
    if (!fm.date && !fm.id) continue; // skip non-meeting files

    const sections = extractSections(parsed.content);
    const signals = fm.signals || [];
    const textForRouting = [
      fm.title || "",
      sections["Key Decisions"] || "",
      sections["Action Items"] || "",
      sections["Main Topics"] || "",
      ...signals,
    ].join(" ");

    const domains = routeToDomains(textForRouting, signals);

    const dateStr = fm.date instanceof Date
      ? fm.date.toISOString().split("T")[0]
      : String(fm.date || "");

    entries.push({
      id: fm.id || slug(file.replace(".md", "")),
      file: `packages/operations/meetings/${file}`,
      date: dateStr || null,
      title: fm.title || file.replace(".md", ""),
      participants: fm.participants || [],
      signals,
      domains,
      decisions: sections["Key Decisions"] || "",
      actions: sections["Action Items"] || "",
      topics: sections["Main Topics"] || "",
    });
  }

  // Sort by date descending
  entries.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return entries;
}

function extractProjects() {
  const data = readYamlSafe(path.join(rootDir, "data", "projects.yaml"));
  if (!data?.projects) return [];

  return data.projects
    .filter((p) => p.status === "active" || p.status === "in_progress")
    .map((p) => {
      const textForRouting = [
        p.name || "",
        p.description || "",
        ...(p.tags || []),
      ].join(" ");
      const domains = routeToDomains(textForRouting, p.tags || []);

      return {
        id: p.id,
        name: p.name,
        description: p.description || "",
        status: p.status,
        owner: p.owner || null,
        tags: p.tags || [],
        domains,
        notion_url: p.notion_url || null,
      };
    });
}

function extractFunding() {
  const data = readYamlSafe(
    path.join(rootDir, "data", "funding-opportunities.yaml")
  );
  if (!data?.opportunities) return [];

  return data.opportunities.map((o) => ({
    id: o.id,
    name: o.name,
    type: o.type,
    funder: o.funder || null,
    link: o.link || null,
    amount: o.amount || null,
    deadline: o.deadline || null,
    status: o.status || "monitoring",
    fit_score: o.fit_assessment?.score || null,
    fit_rationale: o.fit_assessment?.rationale || "",
    next_step: o.next_step || "",
    notes: o.notes || "",
  }));
}

function extractNormalizationLog() {
  const filePath = path.join(rootDir, "knowledge", "normalization-log.md");
  const raw = readFileSafe(filePath);
  if (!raw) return [];

  const entries = [];
  const blocks = raw.split(/^###\s+/m).slice(1);
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const topic = lines[0]?.trim() || "Unknown";
    const content = lines.slice(1).join("\n").trim();
    const resolved = !content.toLowerCase().includes("unresolved");
    entries.push({ topic, content, resolved });
  }
  return entries;
}

// ── Phase 2: COMPILE ────────────────────────────────────────────────────────

function generateFrontmatter(opts) {
  const fm = {
    title: opts.title,
    domain: opts.domain,
    type: "compiled",
    compiled_from: opts.compiled_from || [],
    source_refs: opts.source_refs || [],
    tags: opts.tags || [],
    date_created: today(),
    date_updated: today(),
  };
  return `---\n${yaml.dump(fm, { lineWidth: 120 })}---`;
}

function generateMeetingsDigest(domain, meetings) {
  const domainMeetings = meetings.filter((m) => m.domains.includes(domain));
  if (domainMeetings.length === 0) return null;

  const sourceRefs = domainMeetings.map((m) => ({
    type: "meeting",
    id: m.id,
    date: m.date,
  }));

  const compiledFrom = [
    ...new Set(domainMeetings.map((m) => m.file)),
  ];

  const domainInfo = DOMAIN_SIGNALS[domain];
  const domainName = domain
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let content = generateFrontmatter({
    title: `${domainName} — Meetings Digest`,
    domain,
    compiled_from: compiledFrom.slice(0, 20),
    source_refs: sourceRefs.slice(0, 30),
    tags: [domain, "meetings", "digest"],
  });

  content += `\n\n# ${domainName} — Meetings Digest\n\n`;
  content += `> Compiled from ${domainMeetings.length} meetings (${domainMeetings[domainMeetings.length - 1]?.date || "?"} to ${domainMeetings[0]?.date || "?"}).\n\n`;

  content += `## Summary\n\n`;
  content += `<!-- LLM-SYNTHESIZE: Write a 2-3 paragraph synthesis of the key themes and evolution across all ${domainMeetings.length} meetings related to ${domainName}. Highlight major decisions, turning points, and current trajectory. -->\n\n`;

  content += `## Key Decisions\n\n`;
  for (const m of domainMeetings) {
    if (!m.decisions || m.decisions === "null" || m.decisions.trim() === "") continue;
    content += `### ${m.date} — ${m.title}\n\n`;
    // Clean up decision text
    const decisions = m.decisions
      .split("\n")
      .filter((l) => l.trim() && l.trim() !== "- null" && l.trim() !== "null");
    if (decisions.length > 0) {
      for (const d of decisions) {
        const line = d.trim().startsWith("-") ? d.trim() : `- ${d.trim()}`;
        content += `${line} — Source: [[${m.id}]]\n`;
      }
      content += "\n";
    }
  }

  content += `## Action Items\n\n`;
  for (const m of domainMeetings) {
    if (!m.actions || m.actions === "null" || m.actions.trim() === "" || m.actions.includes("No specific action")) continue;
    content += `### ${m.date}\n\n`;
    const actions = m.actions
      .split("\n")
      .filter((l) => l.trim() && l.trim() !== "- null");
    for (const a of actions) {
      content += `${a.trim().startsWith("-") ? a.trim() : `- ${a.trim()}`}\n`;
    }
    content += "\n";
  }

  content += `## Related\n\n`;
  content += `- [[${domain}|${domainName} Index]]\n`;
  for (const d of DOMAINS) {
    if (d !== domain) {
      const crossMeetings = domainMeetings.filter((m) => m.domains.includes(d));
      if (crossMeetings.length > 0) {
        const dName = d.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        content += `- [[${d}|${dName}]] (${crossMeetings.length} shared meetings)\n`;
      }
    }
  }

  return content;
}

function generateProjectStatus(domain, projects) {
  const domainProjects = projects.filter((p) => p.domains.includes(domain));
  if (domainProjects.length === 0) return null;

  const domainName = domain
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  let content = generateFrontmatter({
    title: `${domainName} — Active Projects`,
    domain,
    compiled_from: ["data/projects.yaml"],
    source_refs: domainProjects.map((p) => ({
      type: "project",
      id: p.id,
    })),
    tags: [domain, "projects", "status"],
  });

  content += `\n\n# ${domainName} — Active Projects\n\n`;
  content += `> ${domainProjects.length} active projects related to ${domainName}.\n\n`;

  content += `## Summary\n\n`;
  content += `<!-- LLM-SYNTHESIZE: Write a brief overview of how these ${domainProjects.length} projects relate to ${domainName} and their collective progress. -->\n\n`;

  content += `## Projects\n\n`;
  for (const p of domainProjects) {
    content += `### ${p.name}\n\n`;
    content += `- **Status:** ${p.status}\n`;
    if (p.owner) content += `- **Owner:** ${p.owner}\n`;
    if (p.description) content += `- **Description:** ${p.description}\n`;
    if (p.tags.length) content += `- **Tags:** ${p.tags.join(", ")}\n`;
    if (p.notion_url) content += `- **Notion:** [link](${p.notion_url})\n`;
    content += "\n";
  }

  content += `## Related\n\n`;
  content += `- [[${domain}|${domainName} Index]]\n`;
  content += `- [[${domain}/meetings-digest|Meetings Digest]]\n`;

  return content;
}

function generateFundingLandscape(funding) {
  if (funding.length === 0) return null;

  const domain = "regenerative-finance";

  let content = generateFrontmatter({
    title: "Funding Landscape",
    domain,
    compiled_from: ["data/funding-opportunities.yaml"],
    source_refs: funding.map((f) => ({
      type: "funding",
      id: f.id,
    })),
    tags: ["regenerative-finance", "funding", "grants", "landscape"],
  });

  content += `\n\n# Funding Landscape\n\n`;
  content += `> ${funding.length} tracked funding opportunities.\n\n`;

  content += `## Summary\n\n`;
  content += `<!-- LLM-SYNTHESIZE: Write a strategic overview of the funding landscape for {{ORG_NAME}}. Group by type (grants, quadratic funding, retroactive), highlight the most promising opportunities, and note the overall funding strategy trajectory. -->\n\n`;

  // Group by status
  const byStatus = {};
  for (const f of funding) {
    const s = f.status || "unknown";
    if (!byStatus[s]) byStatus[s] = [];
    byStatus[s].push(f);
  }

  for (const [status, opps] of Object.entries(byStatus)) {
    content += `## ${status.charAt(0).toUpperCase() + status.slice(1)} (${opps.length})\n\n`;
    for (const o of opps) {
      content += `### ${o.name}\n\n`;
      content += `- **Funder:** ${o.funder || "TBD"}\n`;
      content += `- **Type:** ${o.type || "grant"}\n`;
      if (o.amount) {
        content += `- **Amount:** ${o.amount.min ? `${o.amount.min}–${o.amount.max}` : "TBD"} ${o.amount.currency || ""}\n`;
      }
      if (o.deadline) content += `- **Deadline:** ${o.deadline}\n`;
      if (o.fit_score) content += `- **Fit:** ${o.fit_score} — ${o.fit_rationale}\n`;
      if (o.next_step) content += `- **Next step:** ${o.next_step}\n`;
      if (o.link) content += `- **Link:** [${o.funder || o.name}](${o.link})\n`;
      content += "\n";
    }
  }

  content += `## Related\n\n`;
  content += `- [[regenerative-finance|Regenerative Finance Index]]\n`;
  content += `- [[regenerative-finance/meetings-digest|Meetings Digest]]\n`;
  content += `- See: \`data/funding-opportunities.yaml\`\n`;

  return content;
}

function generateProgramTimeline(meetings, projects) {
  const domain = "regenerant-catalunya";
  const domainMeetings = meetings.filter((m) => m.domains.includes(domain));
  const domainProjects = projects.filter((p) => p.domains.includes(domain));

  if (domainMeetings.length === 0 && domainProjects.length === 0) return null;

  const allEvents = [
    ...domainMeetings.map((m) => ({ date: m.date, type: "meeting", data: m })),
    ...domainProjects.map((p) => ({ date: p.start_date || "2024-01", type: "project", data: p })),
  ].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  let content = generateFrontmatter({
    title: "Regenerant Catalunya — Program Timeline",
    domain,
    compiled_from: [
      "data/projects.yaml",
      ...domainMeetings.map((m) => m.file).slice(0, 15),
    ],
    source_refs: [
      ...domainMeetings.slice(0, 20).map((m) => ({ type: "meeting", id: m.id, date: m.date })),
      ...domainProjects.map((p) => ({ type: "project", id: p.id })),
    ],
    tags: ["regenerant-catalunya", "timeline", "program"],
  });

  content += `\n\n# Regenerant Catalunya — Program Timeline\n\n`;
  content += `> Chronological record of ${domainMeetings.length} meetings and ${domainProjects.length} projects.\n\n`;

  content += `## Summary\n\n`;
  content += `<!-- LLM-SYNTHESIZE: Write a narrative timeline of the Regenerant Catalunya program from inception to current state. Highlight the key phases (Phase 1 planning, execution, Phase 2 kickoff), critical decisions, and current trajectory. -->\n\n`;

  content += `## Timeline\n\n`;
  for (const event of allEvents) {
    if (event.type === "meeting") {
      const m = event.data;
      content += `### ${m.date} — ${m.title}\n\n`;
      if (m.decisions && m.decisions !== "null" && m.decisions.trim()) {
        const decs = m.decisions.split("\n").filter((l) => l.trim() && l.trim() !== "- null" && l.trim() !== "null");
        if (decs.length > 0) {
          content += `**Decisions:**\n`;
          for (const d of decs) {
            content += `${d.trim().startsWith("-") ? d.trim() : `- ${d.trim()}`}\n`;
          }
          content += "\n";
        }
      }
    }
  }

  content += `## Related\n\n`;
  content += `- [[regenerant-catalunya|Regenerant Catalunya Index]]\n`;
  content += `- [[regenerant-catalunya/meetings-digest|Meetings Digest]]\n`;
  content += `- [[regenerant-catalunya/project-status|Active Projects]]\n`;
  content += `- [[regenerative-finance/funding-landscape|Funding Landscape]]\n`;

  return content;
}

function generateNormalizationSummary(normalizations) {
  if (normalizations.length === 0) return null;

  let content = generateFrontmatter({
    title: "Data Normalization — Canonical Values",
    domain: "local-governance",
    compiled_from: ["knowledge/normalization-log.md"],
    source_refs: [{ type: "knowledge", path: "knowledge/normalization-log.md" }],
    tags: ["governance", "normalization", "data-integrity"],
  });

  content += `\n\n# Data Normalization — Canonical Values\n\n`;
  content += `> ${normalizations.length} cross-source conflicts reconciled.\n\n`;

  content += `## Summary\n\n`;
  content += `<!-- LLM-SYNTHESIZE: Write a brief overview of the data normalization process — what kinds of conflicts were found, how they were resolved, and what the one unresolved blocker means for operations. -->\n\n`;

  const resolved = normalizations.filter((n) => n.resolved);
  const unresolved = normalizations.filter((n) => !n.resolved);

  if (unresolved.length > 0) {
    content += `## Unresolved (${unresolved.length})\n\n`;
    for (const n of unresolved) {
      content += `### ${n.topic}\n\n${n.content}\n\n`;
    }
  }

  if (resolved.length > 0) {
    content += `## Resolved (${resolved.length})\n\n`;
    for (const n of resolved) {
      content += `### ${n.topic}\n\n${n.content}\n\n`;
    }
  }

  content += `## Related\n\n`;
  content += `- [[local-governance|Local Governance Index]]\n`;
  content += `- Source: \`knowledge/normalization-log.md\`\n`;

  return content;
}

// ── Main ────────────────────────────────────────────────────────────────────

/**
 * Extract synthesized (non-marker) Summary sections from an existing page.
 * Returns a map of marker descriptions → existing prose that replaced them.
 */
function extractExistingSynthesis(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const existing = fs.readFileSync(filePath, "utf-8");
  // If the file still has LLM-SYNTHESIZE markers, no synthesis to preserve
  if (!existing.includes("<!-- LLM-SYNTHESIZE")) return {};
  // No synthesis present at all — nothing to preserve
  return {};
}

function preserveSynthesis(newContent, filePath) {
  if (!fs.existsSync(filePath)) return newContent;

  const existing = fs.readFileSync(filePath, "utf-8");
  // If the existing page has no synthesis (still has markers), use new content
  if (existing.includes("<!-- LLM-SYNTHESIZE")) return newContent;

  // Existing page is fully synthesized. Extract synthesis sections.
  // Strategy: find each ## Summary section in existing and new, replace new's
  // marker with existing's prose.
  const markerRegex = /<!-- LLM-SYNTHESIZE:[^>]*-->/g;
  let result = newContent;
  let match;
  const markers = [];
  while ((match = markerRegex.exec(newContent)) !== null) {
    markers.push({ marker: match[0], index: match.index });
  }

  if (markers.length === 0) return newContent;

  // For each marker in the new content, find the corresponding section in the
  // existing content by looking at the heading before it.
  for (const { marker } of markers) {
    // Find the heading before this marker in new content
    const beforeMarker = result.slice(0, result.indexOf(marker));
    const headings = beforeMarker.match(/^## .+$/gm);
    if (!headings || headings.length === 0) continue;
    const heading = headings[headings.length - 1];

    // Find same heading in existing content
    const existingHeadingIdx = existing.indexOf(heading);
    if (existingHeadingIdx === -1) continue;

    // Extract text between this heading and the next ## heading in existing
    const afterHeading = existing.slice(existingHeadingIdx + heading.length);
    const nextHeadingIdx = afterHeading.search(/\n## /);
    const sectionContent = nextHeadingIdx > 0
      ? afterHeading.slice(0, nextHeadingIdx).trim()
      : afterHeading.trim();

    // Only use if it's not empty and not a marker itself
    if (sectionContent && !sectionContent.includes("<!-- LLM-SYNTHESIZE")) {
      result = result.replace(marker, sectionContent);
    }
  }

  return result;
}

function writePage(domain, filename, content) {
  if (!content) return false;
  const dir = path.join(rootDir, "knowledge", domain);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, filename);

  // Preserve existing synthesis if the page was already completed
  content = preserveSynthesis(content, filePath);

  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

function main() {
  console.log("Compiling knowledge base...\n");

  // Phase 1: Extract
  console.log("Phase 1: Extracting from sources...");
  const meetings = extractMeetings();
  console.log(`  ✓ ${meetings.length} meetings extracted`);

  const projects = extractProjects();
  console.log(`  ✓ ${projects.length} active projects extracted`);

  const funding = extractFunding();
  console.log(`  ✓ ${funding.length} funding opportunities extracted`);

  const normalizations = extractNormalizationLog();
  console.log(`  ✓ ${normalizations.length} normalization entries extracted`);

  // Phase 2: Compile pages per domain
  console.log("\nPhase 2: Compiling knowledge pages...");

  let totalPages = 0;
  const stats = {};

  for (const domain of DOMAINS) {
    let domainPages = 0;

    // Meetings digest
    if (writePage(domain, "meetings-digest.md", generateMeetingsDigest(domain, meetings))) {
      domainPages++;
    }

    // Project status
    if (writePage(domain, "project-status.md", generateProjectStatus(domain, projects))) {
      domainPages++;
    }

    stats[domain] = domainPages;
  }

  // Domain-specific pages
  if (writePage("regenerative-finance", "funding-landscape.md", generateFundingLandscape(funding))) {
    stats["regenerative-finance"]++;
  }

  if (writePage("regenerant-catalunya", "program-timeline.md", generateProgramTimeline(meetings, projects))) {
    stats["regenerant-catalunya"]++;
  }

  if (writePage("local-governance", "normalization-summary.md", generateNormalizationSummary(normalizations))) {
    stats["local-governance"]++;
  }

  // Summary
  console.log("");
  for (const [domain, count] of Object.entries(stats)) {
    totalPages += count;
    const icon = count > 0 ? "✓" : "○";
    console.log(`  ${icon} ${domain}: ${count} pages`);
  }

  console.log(`\n✓ Compiled ${totalPages} knowledge pages across ${DOMAINS.length} domains`);
  console.log(`  Pages contain <!-- LLM-SYNTHESIZE --> markers for agent completion.`);
  console.log(`  Run knowledge-curator skill to synthesize prose sections.`);
}

main();

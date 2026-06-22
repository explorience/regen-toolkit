#!/usr/bin/env node
// Task 3 — Process the 119 toolkit articles (src/content/docs/*.md) through the framework:
//   - emit `encyclopedia-entry` objects → data/encyclopedia.yaml
//   - conservatively extract `concept-lineage` candidates → data/concepts.yaml
//
// Honest-state discipline (NON-NEGOTIABLE, per docs/MASTER.md):
//   These articles are AI-pipeline drafts that happen to be live on Heenal's v1 site.
//   The master doc repeats: "Do not treat AI synthesis as human-reviewed" and
//   "human review is still needed for published AI-assisted drafts." The pipeline's
//   `review_done: true` is a PIPELINE STAGE flag (research→draft→factcheck→review→critique),
//   NOT independent human sign-off. So:
//     - maturity default = `draft` (never `reviewed` unless slug ∈ HUMAN_REVIEWED, which is EMPTY)
//     - ai_assisted = true on all
//     - public_use = `source-linked-unreviewed` (written/published, not human-reviewed)
//
// Every emitted object is validated via the framework API (validateObject); the script
// REFUSES to write if any object is invalid (exit non-zero).
//
// Exported functions are reused by Task 4/5. main() is guarded so importing has no side effects.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

import { validateObject } from '../packages/toolkit-framework/src/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, '..');
const DOCS_DIR = join(REPO_ROOT, 'src', 'content', 'docs');
const ENCYCLOPEDIA_OUT = join(REPO_ROOT, 'data', 'encyclopedia.yaml');
const CONCEPTS_OUT = join(REPO_ROOT, 'data', 'concepts.yaml');
const GENERATED_AT = '2026-06-17';

// --- honest-state constants --------------------------------------------------

// Slugs known to be INDEPENDENTLY HUMAN-REVIEWED (not merely run through the AI
// pipeline's `review_done` stage). EMPTY: there is no evidence any of the 119 has
// had independent human sign-off, and the master doc is explicit that these are
// AI-assisted drafts still needing human review. Only slugs here may be `reviewed`.
export const HUMAN_REVIEWED = new Set([]);

const DEFAULT_MATURITY = 'draft';
const DEFAULT_PUBLIC_USE = 'source-linked-unreviewed';

// --- frontmatter -------------------------------------------------------------

/** Parse raw markdown into { data (frontmatter), content (body) }. */
export function parseFrontmatter(raw) {
  return matter(raw);
}

// --- page_type inference -----------------------------------------------------

const PAGE_TYPE_ENUM = new Set([
  'concept', 'framework', 'comparison', 'guide', 'case-linked', 'anti-pattern', 'frontier',
]);

/**
 * Infer the encyclopedia `page_type` from title + body using ordered heuristics.
 * Returns one of the schema enum values. Default when ambiguous = `concept`
 * (the most defensible default: an explanatory page about a thing). Documented
 * in the Task 3 report.
 */
export function inferPageType(title = '', body = '') {
  const t = String(title).toLowerCase();
  const b = String(body).toLowerCase();
  const both = `${t}\n${b}`;

  // 1. anti-pattern — failure-mode pages (checked early so "pitfalls" doesn't fall to comparison).
  if (/\b(pitfall|pitfalls|mistake|mistakes|anti-pattern|antipattern|don't|avoid(ing)?|trap|traps|gotcha|scam|scams|what not to)\b/.test(t)) {
    return 'anti-pattern';
  }

  // 2. comparison — explicit "vs", or a choosing/decision page ("which X", "is X right", "compared").
  if (/\bvs\.?\b|\bversus\b|\bcompared\b|\bcomparison\b/.test(t)) return 'comparison';
  if (/^which\b|\bwhich\b.*\bright\b|^is\b.*\bright\b|\bright for\b|\bchoosing\b|\bchoose\b|\bspectrum\b|\bcustodial\b|\bhot vs|\bcold\b/.test(t)) {
    return 'comparison';
  }

  // 3. guide — actionable how-to pages.
  if (/^how (to|transactions)\b|\bhow to\b|\bguide\b|\bplaybook\b|\bsetting up\b|\bset up\b|\bsetup\b|\brunning\b|\bwriting\b|\bonboarding\b|\bget(ting)? (your )?(first|started)\b|\bfirst \d+ days\b|\bstep(-| )by(-| )step\b|\bmanagement\b|\bplanning\b|\brecovery\b|\bbest practices\b|\bworkflow\b/.test(t)) {
    return 'guide';
  }

  // 4. frontier — emerging/speculative.
  if (/\bfuture of\b|\bfrontier\b|\bemerging\b|\bspeculative\b|\bbeyond\b|\bwhat web3 can('|)t\b/.test(t)) {
    return 'frontier';
  }

  // 5. concept — defined-term / explanatory pages.
  if (/^what (is|are)\b|\bexplained\b|\bunderstanding\b|^why\b|\bwhat it means\b|\bmatters\b|\ba-z\b|\bkey terms\b/.test(t)) {
    return 'concept';
  }

  // 6. framework — models / architectures / systems-for.
  if (/\bframework\b|\bmodel\b|\barchitecture\b|\bmechanism design\b|\bsystem for\b|\bpattern\b|\bstandards?\b|\bontology\b|\btaxonomy\b/.test(t)) {
    return 'framework';
  }

  // 7. case-linked — references a concrete named case/protocol/deployment.
  if (/\bcase stud(y|ies)\b|\bexamples? of\b|\bstories\b|\bprotocol\b|\bgitcoin\b|\bgiveth\b|\bsilvi\b|\bhypercert\b/.test(both) && !/^what (is|are)\b/.test(t)) {
    return 'case-linked';
  }

  // default — explanatory concept page (more defensible than `guide` for ambiguous titles).
  return 'concept';
}

// --- article → encyclopedia-entry --------------------------------------------

/** Normalize a frontmatter `related` value to an array of slug strings, or undefined. */
function relatedConcepts(frontmatter) {
  const r = frontmatter?.related;
  if (Array.isArray(r) && r.length) return r.map(String);
  return undefined;
}

/**
 * Build a VALID encyclopedia-entry from a parsed article.
 * @param {{slug:string,title:string,description?:string,body?:string,frontmatter?:object}} a
 */
export function articleToEntry(a) {
  const { slug, title, description, frontmatter = {}, body = '' } = a;
  const maturity = HUMAN_REVIEWED.has(slug) ? 'reviewed' : DEFAULT_MATURITY;

  const entry = {
    id: slug,
    title,
    type: 'encyclopedia-entry',
    page_type: inferPageType(title, body),
    maturity,
    public_use: DEFAULT_PUBLIC_USE,
    ai_assisted: true,
    source_lineage: `src/content/docs/${slug}.md`,
  };
  if (description) entry.summary = description;

  const rel = relatedConcepts(frontmatter);
  if (rel) entry.related_concepts = rel;

  return entry;
}

// --- concept extraction (conservative) ---------------------------------------

/**
 * Conservative predicate: is this article a "what is X" / defined-term concept article?
 * Criterion: slug begins `what-is-` / `what-are-` (the explicit defined-term pattern),
 * OR title begins "What is/are X" and is NOT a how-to/comparison/pitfall. Deliberately
 * narrow to avoid over-extraction (target ~10–25, not 119).
 */
export function isConceptArticle(slug = '', title = '') {
  const s = String(slug);
  const t = String(title).toLowerCase();
  if (/\b(vs\.?|versus|how to|pitfall|guide|playbook|right\?|setting up)\b/.test(t)) return false;
  if (/^what-(is|are)-/.test(s)) return true;
  if (/^what (is|are)\b/.test(t)) return true;
  return false;
}

/** Strip leading "What is/are " and trailing "?" to get the bare term, Title-Cased lightly. */
function conceptTitle(title) {
  return String(title)
    .replace(/^\s*what\s+(is|are)\s+(a|an|the)?\s*/i, '')
    .replace(/\?\s*$/, '')
    .trim() || String(title).trim();
}

/**
 * Build a VALID concept-lineage from a parsed "what is X" article.
 * Honest: does NOT fabricate source_traditions / distinctions we don't have.
 */
export function articleToConcept(a) {
  const { slug, title, description } = a;
  const concept = {
    id: slug,
    title: conceptTitle(title),
    type: 'concept-lineage',
    maturity: 'draft',
    ai_assisted: true,
    source_lineage: `src/content/docs/${slug}.md`,
  };
  if (description) concept.short_description = description;
  // source_traditions / adjacent_meanings / important_distinctions intentionally omitted —
  // not invented (honest-state). A human lineage pass (Layer 4 owner) fills these in.
  return concept;
}

// --- main --------------------------------------------------------------------

/** Read + parse every article into { slug, title, description, body, frontmatter }. */
export function readArticles(docsDir = DOCS_DIR) {
  return readdirSync(docsDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data, content } = parseFrontmatter(readFileSync(join(docsDir, f), 'utf8'));
      return {
        slug,
        title: data.title ? String(data.title) : slug,
        description: data.description ? String(data.description) : undefined,
        body: content,
        frontmatter: data,
      };
    });
}

export function main() {
  const articles = readArticles();

  const entries = articles.map(articleToEntry);
  const concepts = articles.filter((a) => isConceptArticle(a.slug, a.title)).map(articleToConcept);

  // Validate EVERYTHING through the framework before writing. Refuse on any invalid object.
  const failures = [];
  for (const e of entries) {
    const { valid, errors } = validateObject('encyclopedia-entry', e);
    if (!valid) failures.push(`encyclopedia-entry ${e.id}: ${errors.join('; ')}`);
  }
  for (const c of concepts) {
    const { valid, errors } = validateObject('concept-lineage', c);
    if (!valid) failures.push(`concept-lineage ${c.id}: ${errors.join('; ')}`);
  }
  if (failures.length) {
    console.error(`✖ ${failures.length} object(s) failed framework validation — refusing to write:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exitCode = 1;
    return { ok: false, failures };
  }

  const header = (kind, list, generator) => ({
    schema_version: '0.1.0',
    generated_from: 'src/content/docs/*.md',
    generated_at: GENERATED_AT,
    generator,
    honest_state_note:
      'AI-pipeline drafts (live on Heenal v1 site) — NOT human-reviewed. maturity=draft, ' +
      'public_use=source-linked-unreviewed, ai_assisted=true. See docs/MASTER.md.',
    [kind]: list,
  });

  const dumpOpts = { lineWidth: 200, quotingType: '"', forceQuotes: false, sortKeys: false };
  writeFileSync(ENCYCLOPEDIA_OUT, yaml.dump(header('entries', entries, 'scripts/process-content.mjs'), dumpOpts));
  writeFileSync(CONCEPTS_OUT, yaml.dump(header('concepts', concepts, 'scripts/process-content.mjs'), dumpOpts));

  // Report.
  const dist = entries.reduce((acc, e) => ((acc[e.page_type] = (acc[e.page_type] || 0) + 1), acc), {});
  console.log(`✓ ${entries.length} encyclopedia entries → ${ENCYCLOPEDIA_OUT}`);
  console.log(`✓ ${concepts.length} concept-lineage candidates → ${CONCEPTS_OUT}`);
  console.log('  page_type distribution:');
  for (const [k, v] of Object.entries(dist).sort((x, y) => y[1] - x[1])) {
    console.log(`    ${String(v).padStart(4)} — ${k}`);
  }
  console.log(`  maturity: all "${DEFAULT_MATURITY}" (HUMAN_REVIEWED allowlist size: ${HUMAN_REVIEWED.size})`);
  console.log(`  public_use: all "${DEFAULT_PUBLIC_USE}", ai_assisted: true`);
  return { ok: true, entries, concepts, dist };
}

// Guard: only run when invoked directly (so the test can import functions side-effect-free).
// pathToFileURL handles spaces/percent-encoding in the path (this repo lives under "03 Libraries").
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

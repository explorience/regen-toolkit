#!/usr/bin/env node
// Task 2 — Lift the V3 resource DB → instance Resource Graph + Source Systems.
//
// Consumes the framework's SP7 lift (read-only) and partitions the result by the
// crosswalk's own `toolkit_route` column:
//   • route contains "Source System"  → transform to a `source-system` object (data/source-systems.yaml)
//   • route is a clearly-resource destination → `resource` object (data/resources.yaml)
//   • review-queue routes (Social Signal Review, People/Account Review, empty, …) → HELD
//     (NOT written — counted + recorded in the report; the rows stay in the CSV).
//
// Honest-state discipline: nothing is auto-promoted past `raw` / `raw-lead`. The V3 DB is
// a raw-lead database; review_status is preserved (in notes) but never used to promote.
// Every emitted object is validated against its framework schema (validateObject) before write.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';
import { parseCsv, liftRow } from '../packages/toolkit-framework/src/lift.mjs';
import { validateObject } from '../packages/toolkit-framework/src/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const CSV_PATH = join(repoRoot, 'data/resources/csv/toolkit-layer-crosswalk.csv');
const RESOURCES_OUT = join(repoRoot, 'data/resources.yaml');
const SOURCE_SYSTEMS_OUT = join(repoRoot, 'data/source-systems.yaml');
const GENERATED_AT = '2026-06-17';

// --- routing -----------------------------------------------------------------

// Review-queue routes: HELD this pass (not lifted, recorded, never silently dropped).
const HELD_ROUTE_RE = /(social signal|people\/account review|structural integrity review|public-use review|public-use safeguard|public-use caution|builder safeguards|media safeguards|deployment safeguards|automated curation|review model)/i;

function isSourceSystemRoute(route) {
  return /source system/i.test(route);
}

function isHeldRoute(route) {
  const r = String(route || '').trim();
  if (r === '') return true; // empty route → held (review-queue / unrouted)
  // A compound route that also names a curated artifact (e.g. "Tooling; Source System")
  // is handled by source-system routing first (checked before this). Pure review-queue
  // routes are held.
  return HELD_ROUTE_RE.test(r);
}

// Routes that clearly name a curated artifact → Resource Graph. The crosswalk's own
// "Resource Graph" route is the bulk; the rest are explicit resource destinations.
const RESOURCE_ROUTE_RE = /(resource graph|resource registry|resource lead|books papers articles|datasets|maps|directorie|projects? initiative|tooling|tool\b|concept entry|concept\/option|option library|implementation memory|infrastructure|public goods builder|public goods funding|local node builder|refi track|encyclopedia|ontology|theory of change|repositories|codebase|repositor|podcasts|media shows|events|conferences|gatherings|funding mechanism|funding mechanisms|entity lead|claims|evidence|forum post|dmrv track|ecological mrv|crypto altruists)/i;

function isResourceRoute(route) {
  return RESOURCE_ROUTE_RE.test(String(route || ''));
}

// --- source-system type inference (enum: required values only) ----------------
// enum: wiki, map, repo, forum, knowledge-garden, directory, archive, database,
//       library, docs-site, convening, podcast, newsletter, dataset
function inferSourceSystemType(primaryType, route) {
  const hay = `${primaryType || ''} ${route || ''}`.toLowerCase();
  const rules = [
    [/podcast|media feed|media show|episode|talk|recording|youtube/, 'podcast'],
    [/newsletter/, 'newsletter'],
    [/repositor|codebase|\brepo\b/, 'repo'],
    [/dataset/, 'dataset'],
    [/\bmap\b|maps/, 'map'],
    [/directorie|directory/, 'directory'],
    [/archive/, 'archive'],
    [/\bwiki\b/, 'wiki'],
    [/knowledge garden|garden|pattern library/, 'knowledge-garden'],
    [/forum|governance forum/, 'forum'],
    [/docs|documentation|docs-site/, 'docs-site'],
    [/library/, 'library'],
    [/event|conference|gathering|convening/, 'convening'],
  ];
  for (const [re, t] of rules) if (re.test(hay)) return t;
  return 'database'; // documented fallback when type can't be inferred
}

// Transform a lifted (resource-shaped) row into a `source-system`-shaped object.
function toSourceSystem(row, lifted) {
  const inferredType = inferSourceSystemType(row.primary_type, row.toolkit_route);
  const obj = {
    title: lifted.title,
    type: inferredType,                       // best-fit enum value
    url: lifted.url || '',
    steward: 'UNKNOWN — needs identification',
    return_path: 'UNKNOWN — needs return_path', // required field; non-empty marker
    what_it_curates: row.notes || '',
    use_type: '',
    toolkit_route: row.toolkit_route || '',
    original_source: lifted.original_source || '',
    extraction_status: 'raw-lead',
    maturity: 'raw',
    public_use: 'raw-lead',
    lifecycle_state: 'raw-lead',
    ai_assisted: lifted.ai_assisted,
    review_needs: 'steward, return_path, type confirmation',
    notes: lifted.notes || '',
  };
  if (obj.url === '') delete obj.url; // keep optional empties out of the file
  return obj;
}

// --- de-dupe key --------------------------------------------------------------
function normTitle(t) {
  return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// --- main --------------------------------------------------------------------
const text = readFileSync(CSV_PATH, 'utf8');
const fileLineCount = text.split('\n').filter((l) => l.length > 0).length - 1; // minus header
const rows = parseCsv(text);

const resources = [];
const sourceSystems = [];
const held = [];        // { route, row }
const skippedNoise = []; // route noise guard (http / >60 chars) — matches liftRows
const unrouted = [];     // routes we couldn't classify (recorded, not silently dropped)

for (const row of rows) {
  const route = String(row.toolkit_route || '');
  // noise guard — same as framework liftRows
  if (route.includes('http') || route.length > 60) { skippedNoise.push(row); continue; }

  const lifted = liftRow(row);

  if (isSourceSystemRoute(route)) {
    sourceSystems.push({ row, obj: toSourceSystem(row, lifted) });
  } else if (isHeldRoute(route)) {
    held.push({ route: route.trim() === '' ? '(empty route)' : route.trim(), row });
  } else if (isResourceRoute(route)) {
    resources.push({ row, obj: lifted });
  } else {
    unrouted.push({ route: route.trim(), row });
  }
}

// De-dupe resources by normalized title (stable), keeping global_id provenance.
const resSeen = new Map();
let resDeduped = 0;
const resourcesOut = [];
for (const { row, obj } of resources) {
  const key = normTitle(obj.title) || row.global_id;
  if (resSeen.has(key)) { resDeduped++; continue; }
  resSeen.set(key, true);
  resourcesOut.push({ ...obj, original_source: obj.original_source });
}

// De-dupe source systems by normalized title too.
const ssSeen = new Map();
let ssDeduped = 0;
const sourceSystemsOut = [];
for (const { obj } of sourceSystems) {
  const key = normTitle(obj.title);
  if (ssSeen.has(key)) { ssDeduped++; continue; }
  ssSeen.set(key, true);
  sourceSystemsOut.push(obj);
}

// --- validate every emitted object -------------------------------------------
const resErrors = [];
for (const obj of resourcesOut) {
  const { valid, errors } = validateObject('resource', obj);
  if (!valid) resErrors.push({ title: obj.title, errors });
}
const ssErrors = [];
for (const obj of sourceSystemsOut) {
  const { valid, errors } = validateObject('source-system', obj);
  if (!valid) ssErrors.push({ title: obj.title, errors });
}

if (resErrors.length || ssErrors.length) {
  console.error('VALIDATION FAILURES — NOT WRITING FILES');
  for (const e of resErrors.slice(0, 20)) console.error('  resource:', e.title, e.errors);
  for (const e of ssErrors.slice(0, 20)) console.error('  source-system:', e.title, e.errors);
  console.error(`total: ${resErrors.length} resource + ${ssErrors.length} source-system failures`);
  process.exit(1);
}

// --- held breakdown by route --------------------------------------------------
const heldByRoute = {};
for (const { route } of held) heldByRoute[route] = (heldByRoute[route] || 0) + 1;
const unroutedByRoute = {};
for (const { route } of unrouted) unroutedByRoute[route] = (unroutedByRoute[route] || 0) + 1;

// --- write files --------------------------------------------------------------
const header = (kind, count) => ({
  schema_version: '2.0',
  generated_from: 'data/resources/csv/toolkit-layer-crosswalk.csv',
  generated_at: GENERATED_AT,
  generator: 'scripts/lift-v3-resources.mjs (framework SP7 lift)',
  note: `V3 resource DB lifted through the framework. Raw leads — never auto-promoted (honest-state discipline). ${count} ${kind}.`,
});

writeFileSync(
  RESOURCES_OUT,
  yaml.dump({ ...header('resources (Resource Graph)', resourcesOut.length), resources: resourcesOut }, { lineWidth: -1, noRefs: true }),
);
writeFileSync(
  SOURCE_SYSTEMS_OUT,
  yaml.dump({ ...header('source systems', sourceSystemsOut.length), source_systems: sourceSystemsOut }, { lineWidth: -1, noRefs: true }),
);

// --- report counts to stdout --------------------------------------------------
const report = {
  csv_file_line_count: fileLineCount,
  parsed_rows: rows.length,
  resources_emitted: resourcesOut.length,
  source_systems_emitted: sourceSystemsOut.length,
  held_total: held.length,
  held_by_route: heldByRoute,
  unrouted_total: unrouted.length,
  unrouted_by_route: unroutedByRoute,
  skipped_noise: skippedNoise.length,
  resources_deduped: resDeduped,
  source_systems_deduped: ssDeduped,
  resources_validate: resErrors.length === 0,
  source_systems_validate: ssErrors.length === 0,
};
console.log(JSON.stringify(report, null, 2));

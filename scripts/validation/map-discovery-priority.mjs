// T3b Phase 3 — bounded Discovery_Pool promotion (Zone A → review-gated ingest).
//
// Promotes Matty's curated **Priority Working Set** (114 rows) — NOT the 4,951-row pool.
// Selective per the Guide: match (dedup vs the canonical corpus already ingested) →
// classify (object_type → schema) → route → ingest, all `raw`/review-gated. Workbook-meta
// rows (extraction packages, expansion batches) are skipped as non-content and reported.
//
// Usage: node scripts/validation/map-discovery-priority.mjs --wo-dir <dir> [--dry]
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';
import { parseCsv } from '../../packages/toolkit-framework/src/lift.mjs';

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : undefined; };
const WO_DIR = flag('wo-dir') && flag('wo-dir') !== true ? flag('wo-dir') : '.workorders';
const DRY = Boolean(flag('dry'));
const SRC = '.tmp/handoff-full/discovery/priority-working-set.csv';
const SHEET = 'Priority Working Set';
const KB = 'kb-handoff/objects';

const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const clean = (s) => (s == null ? '' : String(s).trim());
const nz = (s) => { const v = clean(s); return v.length ? v : undefined; };

// build canonical dedup index (names already ingested as identity-bearing objects)
const canon = new Set();
for (const t of ['source-system', 'organization', 'resource', 'person', 'concept-lineage']) {
  const d = join(KB, t);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) if (f.endsWith('.yaml')) canon.add(slug(yaml.load(readFileSync(join(d, f), 'utf8')).title || ''));
}

function classify(objType, candType) {
  const t = `${objType} ${candType}`.toLowerCase();
  if (/source system|source-system/.test(t)) return 'source-system';
  if (/option/.test(t)) return 'option-entry';
  if (/claim/.test(t)) return 'claim-evidence';
  if (/implementation memory|implementation-memory/.test(t)) return 'implementation-record';
  if (/org lineage/.test(t)) return 'organization';
  if (/thinker lineage|standard lineage|concept/.test(t)) return 'concept-lineage';
  if (/thinker|person/.test(t)) return 'person';
  if (/track/.test(t)) return 'resource'; // track candidate → resource w/ review flag (route to track on review)
  if (/extraction package|expansion batch|workbook update|working set/.test(t)) return null; // workbook meta — skip
  return 'resource';
}

const HIGH_RISK_RE = /\b(surveillance|persecut\w*|refugee|undocumented|traffick\w*|violence|violent|indigenous|at-risk|vulnerable|displacement|criminaliz\w*|clandestine|repression|dox\w*|activists?)\b/i;

const rows = parseCsv(readFileSync(SRC, 'utf8'));
const out = [];
const skipped = { meta: 0, dup: 0 };
const bySchema = {};
for (const r of rows) {
  const name = clean(r.name);
  if (!name) continue;
  const schema = classify(clean(r.object_type), clean(r.candidate_type));
  if (!schema) { skipped.meta++; continue; }
  if (canon.has(slug(name))) { skipped.dup++; continue; } // already canonical — don't re-promote
  const rid = clean(r.record_id) || 'RKC-?????';
  const url = nz(r.primary_url);
  const caution = nz(r.public_use_caution);
  const reason = nz(r.priority_reason);
  const notes = [reason && `Priority: ${reason}`, nz(r.next_action) && `Next: ${clean(r.next_action)}`, nz(r.notes) && `Notes: ${clean(r.notes)}`].filter(Boolean).join(' · ') || undefined;
  const born = { maturity: 'raw', ai_assisted: true, provenance: { origin: `Discovery_Pool.xlsx#${SHEET}!${rid}` } };
  if (url) born.provenance.source_lineage = url;
  const trackFlag = /track/i.test(`${r.object_type} ${r.candidate_type}`);
  let obj;
  if (schema === 'source-system') obj = { title: name, type: 'directory', steward: name, return_path: 'unset — establish via register-source', url, why_it_matters: reason, toolkit_route: nz(r.related_toolkit_layer), notes, review_needs: `Discovery_Pool promotion (${clean(r.priority_tier)}) — source-verify + confirm type`, ...born };
  else if (schema === 'option-entry') obj = { title: name, type: 'option-entry', category: 'coordination', what_it_is: reason, notes, review_needs: 'Discovery_Pool promotion — confirm category + source', ...born };
  else if (schema === 'claim-evidence') obj = { title: name.length > 80 ? name.slice(0, 77) + '…' : name, type: 'claim-evidence', claim: name, uncertainty: caution, notes, review_needs: 'Discovery_Pool promotion — verify claim + evidence', ...born };
  else if (schema === 'implementation-record') obj = { title: name, type: 'implementation-record', source_position: 'third-party-observer', record_stage: 'prospective', context: reason, notes, review_needs: 'Discovery_Pool promotion — prospective candidate', ...born };
  else if (schema === 'organization') obj = { title: name, type: 'organization', org_type: nz(r.object_type), url, notes, review_needs: 'Discovery_Pool promotion — confirm', ...born };
  else if (schema === 'person') obj = { title: name, type: 'person', full_name: name, consent_status: 'unverified — default non-public (Principle 8)', url, notes, review_needs: 'Discovery_Pool promotion — consent + confirm', ...born };
  else if (schema === 'concept-lineage') obj = { title: name, type: 'concept-lineage', short_description: reason, notes, review_needs: 'Discovery_Pool promotion — confirm lineage', ...born };
  else obj = { title: name, type: 'resource', resource_type: nz(r.object_type), url, toolkit_route: nz(r.related_toolkit_layer), notes, review_needs: `Discovery_Pool promotion${trackFlag ? ' (track candidate — route to track schema on review)' : ''} — confirm`, ...born };
  if (caution && HIGH_RISK_RE.test(caution)) obj.high_risk = true;
  for (const k of Object.keys(obj)) if (obj[k] === undefined) delete obj[k];
  bySchema[schema] = (bySchema[schema] || 0) + 1;
  out.push({ schema, object: obj, rid, name });
  if (obj.type === 'person' || obj.high_risk) {
    out.push({ schema: 'public-use-boundary', rid, name: `boundary-${name}`, object: { title: `Boundary — ${name}`, type: 'public-use-boundary', tier: obj.type === 'person' ? 'never-publish-without-consent' : 'requires-domain-review', consent_note: caution || 'Discovery promotion — review before public use.', review_type: obj.type === 'person' ? 'consent-review' : 'domain-review', applies_to: `Discovery_Pool.xlsx#${SHEET}!${rid}` } });
    bySchema['public-use-boundary'] = (bySchema['public-use-boundary'] || 0) + 1;
  }
}

console.log('=== DISCOVERY PROMOTION (Priority Working Set) ===');
console.log(`rows: ${rows.length}  →  promoted: ${out.length} objs  [${Object.entries(bySchema).map(([k, v]) => `${k}:${v}`).join(' ')}]`);
console.log(`skipped: ${skipped.meta} workbook-meta · ${skipped.dup} already-canonical (deduped)`);
if (DRY) { console.log('\n(dry — nothing written)\n', yaml.dump(out[0])); process.exit(0); }

// resolve WO for the discovery source + write candidates
const woId = readdirSync(WO_DIR).filter((f) => f.endsWith('.yaml'))
  .map((f) => yaml.load(readFileSync(join(WO_DIR, f), 'utf8')))
  .find((w) => w && basename(String(w.source_path || '')) === 'priority-working-set.csv' && w.status === 'open')?.id;
if (!woId) { console.error('✗ no open WO for priority-working-set.csv — run ingest prepare first'); process.exit(1); }
const candDir = join(WO_DIR, woId, 'candidates');
rmSync(candDir, { recursive: true, force: true }); mkdirSync(candDir, { recursive: true });
out.forEach((c, i) => writeFileSync(join(candDir, `${String(i + 1).padStart(4, '0')}-${(c.schema === 'public-use-boundary' ? 'boundary-' : '')}${slug(c.name).slice(0, 55) || 'x'}.yaml`), yaml.dump({ schema: c.schema, object: c.object })));
console.log(`\nwrote ${out.length} candidates → ${candDir} (wo=${woId})`);

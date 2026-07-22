// T3b Phase 1 — deterministic crosswalk-driven mapper (hybrid ETL).
//
// Reads the 6 exported Canonical_DB families (.tmp/handoff-full/families/*.csv) +
// Matty's normalization config (_norm/*.csv), maps each row → one or more typed
// framework candidate objects, and writes them into the matching work order's
// candidates/ dir as { schema, object } for the framework's accept gate to validate.
//
// Faithful to the framework's own ETL (src/lift.mjs) and to Matty's DoD #1 (idempotent
// re-run). Every object: born-rules stamped (ai_assisted:true · maturity:raw ·
// provenance.origin=Canonical_DB.xlsx#<Sheet>!row<N>), Matty's exact text preserved,
// inferred values flagged for the human review gate, Matty's 87 dup-flags annotated.
//
// Usage:
//   node scripts/validation/map-handoff-full.mjs [--limit N] [--family <file.csv>] [--dry]
//     --limit N     only the first N data rows per family (sampling for validation)
//     --family f    only that family CSV (e.g. relationship-leads.csv)
//     --dry         print the summary + a sample object, write nothing
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';
import { parseCsv } from '../../packages/toolkit-framework/src/lift.mjs';

const FAM_DIR = '.tmp/handoff-full/families';
const NORM_DIR = '.tmp/handoff-full/_norm';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : undefined; };
const LIMIT = flag('limit') ? Number(flag('limit')) : Infinity;
const ONLY = flag('family');
const DRY = Boolean(flag('dry'));
const WO_DIR = flag('wo-dir') && flag('wo-dir') !== true ? flag('wo-dir') : '.workorders';

// ── family → sheet display name (for provenance) ───────────────────────────
const SHEET = {
  'source-system-cards.csv': 'Source-System Cards',
  'new-objects.csv': 'New Objects',
  'option-candidates.csv': 'Option Candidates',
  'claims-cautions.csv': 'Claims and Cautions',
  'implementation-memory.csv': 'Implementation Memory',
  'relationship-leads.csv': 'Relationship Leads',
};

// Tight, genuine domain-review triggers (Matty's caveat: named people, insinuated
// relationships, sensitive communities). Deliberately NOT bare "privacy/safety/consent"
// — those saturate cautionary prose. Person objects get a consent boundary regardless.
const HIGH_RISK_RE = /\b(surveillance|persecut\w*|refugee|undocumented|traffick\w*|violence|violent|indigenous|at-risk|vulnerable|displacement|criminaliz\w*|clandestine|repression|dox\w*|activists?)\b/i;

// ── normalization config loaders ───────────────────────────────────────────
function loadConfig(file) {
  const p = join(NORM_DIR, file);
  return existsSync(p) ? parseCsv(readFileSync(p, 'utf8')) : [];
}
function buildCrosswalk() {
  const map = new Map();
  for (const r of loadConfig('object-type-crosswalk.csv')) {
    const k = String(r['Original Object Type'] || '').trim().toLowerCase();
    if (k) map.set(k, String(r['Canonical Object Class'] || '').trim());
  }
  return map;
}
function buildPredicateMap() {
  const map = new Map();
  for (const r of loadConfig('predicate-map.csv')) {
    const k = String(r['Original Relationship'] || '').trim().toLowerCase();
    if (k) map.set(k, String(r['Canonical Predicate'] || '').trim());
  }
  return map;
}
function buildFlagIndex() {
  // (sheet, dataRow) -> { flagId, identity }
  const idx = new Map();
  for (const r of loadConfig('normalization-flags.csv')) {
    const sheet = String(r['Core Sheet'] || '').trim();
    const rows = String(r['Source Row(s)'] || '').split(/[,;/]/).map((s) => s.trim()).filter(Boolean);
    const flagId = String(r['Flag ID'] || '').trim();
    const identity = String(r['Normalized Identity / Issue'] || '').trim();
    for (const rn of rows) idx.set(`${sheet}::${rn}`, { flagId, identity });
  }
  return idx;
}

// ── type inference (New Objects) ───────────────────────────────────────────
function classToSchema(canonical) {
  const c = (canonical || '').toLowerCase();
  if (c.includes('person')) return 'person';
  if (c.includes('organization') || c.includes('network')) return 'organization';
  if (c.includes('concept')) return 'concept-lineage';
  if (c.includes('claim')) return 'claim-evidence';
  if (c.includes('option')) return 'option-entry';
  // Tool / Technical Infra · Program / Initiative · Source System / Collection ·
  // Case / Place / Infrastructure · Governance / Funding Mechanism · Publication / Media → resource
  return 'resource';
}
function inferObjectType(objType, crosswalk) {
  const key = String(objType || '').trim().toLowerCase();
  let canonical = crosswalk.get(key);
  const inferred = !canonical;
  if (!canonical) {
    const t = key;
    if (/person|individual|\bauthor\b|thinker/.test(t)) canonical = 'Person';
    else if (/organization|network|\bdao\b|collective|coop|institution|alliance|movement/.test(t)) canonical = 'Organization / Network';
    else if (/concept|lens|principle|theory|\bidea\b/.test(t)) canonical = 'Concept';
    else if (/\bclaim\b|caution/.test(t)) canonical = 'Claim';
    else if (/\boption\b/.test(t)) canonical = 'Option';
    else canonical = 'Resource / Tool / Program';
  }
  return { schema: classToSchema(canonical), canonical, inferred };
}

// ── option category inference ──────────────────────────────────────────────
function inferCategory(text) {
  const t = String(text || '').toLowerCase();
  const rules = [
    [/govern|deliberat|assembly|voting|decision|council|constitution|policy/, 'governance'],
    [/fund|capital|grant|treasury|allocation|donation|retro|matching/, 'funding-capital'],
    [/token|incentive|reward|staking|reputation/, 'token-incentive'],
    [/measure|metric|impact|evidence|mrv|verification|monitor|assessment/, 'impact-measurement'],
    [/knowledge|documentation|wiki|archive|ontology|library|curat/, 'knowledge-documentation'],
    [/org structure|membership|cooperative|legal|steward|role/, 'organizational-structure'],
    [/coordinat|network|mapping|signal|interoperab|federation/, 'coordination'],
    [/pilot|experiment|prototype|test/, 'experimentation'],
    [/operat|onboard|workflow|process|deploy/, 'implementation-operations'],
  ];
  for (const [re, cat] of rules) if (re.test(t)) return { category: cat, inferred: true };
  return { category: 'coordination', inferred: true };
}

// ── source-system type inference ───────────────────────────────────────────
function inferSourceType(role, contents) {
  const t = `${role || ''} ${contents || ''}`.toLowerCase();
  const rules = [
    [/podcast/, 'podcast'], [/newsletter/, 'newsletter'], [/\bblog\b/, 'blog'],
    [/wiki/, 'wiki'], [/knowledge garden|digital garden/, 'knowledge-garden'],
    [/\barchive\b/, 'archive'], [/\blibrary\b/, 'library'], [/dataset|data set/, 'dataset'],
    [/database|registry/, 'database'], [/\bforum\b/, 'forum'], [/\bmap\b|atlas/, 'map'],
    [/docs|documentation site|handbook/, 'docs-site'], [/publication|journal|media/, 'publication'],
    [/convening|event|gathering/, 'convening'], [/movement|grassroots|network of/, 'movement'],
    [/platform|protocol|app|dapp|software/, 'platform'],
    [/organization|foundation|institute|\bdao\b|collective/, 'organization'],
    [/repo|repository|github/, 'repo'], [/directory|catalog|index of/, 'directory'],
  ];
  for (const [re, val] of rules) if (re.test(t)) return { type: val, inferred: false };
  return { type: 'directory', inferred: true };
}

// ── predicate normalization (Relationship Leads) ───────────────────────────
function normalizePredicate(raw, predMap) {
  const key = String(raw || '').trim().toLowerCase();
  const canon = predMap.get(key);
  // `review_needed` is Matty's "manual review required" sentinel (248/340 rows), not a
  // real predicate — keep the edge meaningful by normalizing the ORIGINAL verb, flag review.
  if (canon && canon !== 'review_needed') return { predicate: canon, reason: null };
  const norm = key.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'related_to';
  return { predicate: norm, reason: canon === 'review_needed' ? 'Matty predicate map: manual review required' : 'predicate not in map — normalized from original' };
}

// ── born-rules ─────────────────────────────────────────────────────────────
function born(sheet, row, sourceUrl) {
  const o = { maturity: 'raw', ai_assisted: true, provenance: { origin: `Canonical_DB.xlsx#${sheet}!row${row}` } };
  if (sourceUrl) o.provenance.source_lineage = sourceUrl;
  return o;
}
const clean = (s) => (s == null ? '' : String(s).trim());
const nz = (s) => { const v = clean(s); return v.length ? v : undefined; };

// ── per-family row → candidate(s) ──────────────────────────────────────────
function mapSourceSystem(r, sheet, row, flag) {
  const title = clean(r['Source System']) || '(untitled source system)';
  const { type, inferred } = inferSourceType(r['Role'], r['Core Contents']);
  const obj = {
    title, type,
    steward: title, // self-stewarded until register-source establishes otherwise (T3a convention)
    return_path: 'unset — establish via register-source',
    url: nz(r['Primary URL']),
    what_it_curates: nz(r['Core Contents']),
    why_it_matters: nz(r['Why It Matters']),
    caution: nz(r['Caution']),
    extraction_status: nz(r['Distinctive Extraction']),
    notes: [nz(r['Role']) && `Role: ${clean(r['Role'])}`, nz(r['Action']) && `Action: ${clean(r['Action'])}`].filter(Boolean).join(' · ') || undefined,
    ...born(sheet, row, r['Primary URL']),
  };
  if (inferred) obj.review_needs = 'source-system type inferred — confirm';
  applyRisk(obj, `${clean(r['Caution'])} ${clean(r['Why It Matters'])} ${clean(r['Core Contents'])}`);
  annotate(obj, flag);
  const out = [{ schema: 'source-system', object: prune(obj), slug: title }];
  pushBoundary(out, obj, title, obj.caution, sheet, row);
  return out;
}

function mapNewObject(r, sheet, row, flag, crosswalk) {
  const name = clean(r['Name']) || '(untitled)';
  const { schema, canonical, inferred } = inferObjectType(r['Object Type'], crosswalk);
  const desc = nz(r['Short Description']);
  const caution = nz(r['Status / Caution']);
  const why = nz(r['Why Add']);
  const url = r['Primary URL'];
  const parent = nz(r['Parent Source System']);
  const notes = [why && `Why add: ${why}`, caution && `Status/Caution: ${caution}`, parent && `Parent source system: ${parent}`].filter(Boolean).join(' · ') || undefined;
  const b = born(sheet, row, url);
  let obj;
  if (schema === 'person') {
    obj = { title: name, type: 'person', full_name: name, affiliation: parent, consent_status: 'unverified — default non-public (Principle 8)', url: nz(url), notes, ...b };
  } else if (schema === 'organization') {
    obj = { title: name, type: 'organization', org_type: nz(r['Object Type']), url: nz(url), steward: parent, notes, ...b };
  } else if (schema === 'concept-lineage') {
    obj = { title: name, type: 'concept-lineage', short_description: desc, toolkit_usage: why, original_object_type: nz(r['Object Type']), notes, ...b };
  } else if (schema === 'claim-evidence') {
    obj = { title: name, type: 'claim-evidence', claim: desc || name, interpretation: why, uncertainty: caution, notes, ...b };
  } else if (schema === 'option-entry') {
    const { category } = inferCategory(`${name} ${desc}`);
    obj = { title: name, type: 'option-entry', category, what_it_is: desc, potential_uses: why, notes, review_needs: 'option category inferred — confirm', ...b };
  } else {
    obj = { title: name, type: 'resource', resource_type: nz(r['Object Type']), url: nz(url), original_source: parent, notes, ...b };
  }
  obj.original_object_class = canonical;
  if (inferred) obj.review_needs = [obj.review_needs, 'object type inferred (not in crosswalk) — confirm'].filter(Boolean).join('; ');
  applyRisk(obj, `${caution} ${desc} ${name}`);
  annotate(obj, flag);
  const out = [{ schema, object: prune(obj), slug: name }];
  pushBoundary(out, obj, name, caution || why, sheet, row);
  return out;
}

function mapOption(r, sheet, row, flag) {
  const title = clean(r['Option Candidate']) || '(untitled option)';
  const { category } = inferCategory(`${title} ${clean(r['What It Is'])} ${clean(r['Potential Uses'])}`);
  const obj = {
    title, type: 'option-entry', category,
    what_it_is: nz(r['What It Is']),
    potential_uses: nz(r['Potential Uses']),
    dependencies: nz(r['Dependencies']),
    tradeoffs: nz(r['Risks / Tradeoffs']),
    context: nz(r['Source System']),
    review_needs: 'option category inferred — confirm',
    ...born(sheet, row, r['Source URL']),
  };
  applyRisk(obj, `${clean(r['Risks / Tradeoffs'])} ${title}`);
  annotate(obj, flag);
  const out = [{ schema: 'option-entry', object: prune(obj), slug: title }];
  pushBoundary(out, obj, title, obj.tradeoffs, sheet, row);
  return out;
}

function mapClaim(r, sheet, row, flag) {
  const item = clean(r['Item']) || '(untitled claim)';
  const kind = clean(r['Type']).toLowerCase();
  const obj = {
    title: item.length > 80 ? `${item.slice(0, 77)}…` : item,
    type: 'claim-evidence',
    claim: item,
    interpretation: nz(r['Safe Working Language']),
    uncertainty: nz(r['Why It Needs Care']),
    evidence_stance: kind.includes('caution') ? 'qualifying' : 'neutral',
    context: nz(r['Source System']),
    ...born(sheet, row, r['Source URL']),
  };
  applyRisk(obj, `${clean(r['Why It Needs Care'])} ${item}`);
  annotate(obj, flag);
  const out = [{ schema: 'claim-evidence', object: prune(obj), slug: obj.title }];
  pushBoundary(out, obj, obj.title, obj.uncertainty, sheet, row);
  return out;
}

function mapImplementation(r, sheet, row, flag) {
  const title = clean(r['Candidate']) || '(untitled implementation memory)';
  const obj = {
    title, type: 'implementation-record',
    source_position: 'third-party-observer', // curated candidate, not a self-report (T3a convention)
    record_stage: 'prospective', // T4: Implementation Memory rows are prospective candidates
    context: nz(r['What Happened / Case']),
    what_returns_to_commons: nz(r['Why It Matters']),
    notes: [nz(r['What to Capture']) && `What to capture: ${clean(r['What to Capture'])}`, nz(r['Status / Caution']) && `Status/Caution: ${clean(r['Status / Caution'])}`].filter(Boolean).join(' · ') || undefined,
    related_source_system: nz(r['Source System']),
    review_needs: 'prospective candidate — implementation evidence may be incomplete',
    ...born(sheet, row, r['Source URL']),
  };
  applyRisk(obj, `${clean(r['Status / Caution'])} ${clean(r['What Happened / Case'])} ${title}`);
  annotate(obj, flag);
  const out = [{ schema: 'implementation-record', object: prune(obj), slug: title }];
  pushBoundary(out, obj, title, obj.notes, sheet, row);
  return out;
}

function mapRelationship(r, sheet, row, flag, predMap) {
  const subject = clean(r['Subject']);
  const object = clean(r['Object']);
  const rawRel = clean(r['Relationship']);
  const { predicate, reason } = normalizePredicate(rawRel, predMap);
  const obj = {
    subject: subject || '(unspecified)',
    predicate,
    object: object || '(unspecified)',
    type: 'relationship-record',
    title: `${subject} — ${predicate} — ${object}`,
    original_relationship: rawRel || undefined,
    evidence: nz(r['Evidence / Scope']),
    scope: nz(r['Review Note']),
    direction: 'directed', // predicate map: Subject → Object, no inverse edge
    ...born(sheet, row, r['Source URL']),
  };
  if (reason) obj.review_needs = reason;
  // Matty's caveat: insinuated relationships may be wrong → domain-review before public use.
  applyRisk(obj, `${rawRel} ${subject} ${object} ${clean(r['Evidence / Scope'])}`);
  annotate(obj, flag);
  const out = [{ schema: 'relationship-record', object: prune(obj), slug: obj.title }];
  pushBoundary(out, obj, `${subject}-${predicate}-${object}`, obj.review_needs || rawRel, sheet, row);
  return out;
}

// ── risk / boundary / flag helpers ─────────────────────────────────────────
function applyRisk(obj, text) {
  if (HIGH_RISK_RE.test(String(text || ''))) obj.high_risk = true;
}
function pushBoundary(out, obj, name, reason, sheet, row) {
  // Named people → consent gate (Principle 8: default non-public). High-risk content
  // (any family) → domain-review gate. A person that is also high-risk gets the stricter.
  let tier, note, reviewType;
  if (obj.type === 'person') {
    tier = 'never-publish-without-consent';
    note = 'Named individual — consent required before any public use (Principle 8).';
    reviewType = 'consent-review';
  } else if (obj.high_risk) {
    tier = 'requires-domain-review';
    note = nz(reason) || 'High-risk trigger matched — domain review before any public use.';
    reviewType = 'domain-review';
  } else {
    return;
  }
  out.push({
    schema: 'public-use-boundary',
    slug: `boundary-${name}`,
    object: prune({
      title: `Boundary — ${name}`,
      type: 'public-use-boundary',
      tier,
      consent_note: note,
      review_type: reviewType,
      applies_to: `Canonical_DB.xlsx#${sheet}!row${row}`,
    }),
  });
}
function annotate(obj, flag) {
  if (!flag) return;
  obj.normalization_flag = flag.flagId;
  obj.review_needs = [obj.review_needs, `Matty dup-flag ${flag.flagId}: ${flag.identity}`].filter(Boolean).join('; ');
}
function prune(o) { for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o; }

// ── work-order resolution ──────────────────────────────────────────────────
function woForFamily(fname) {
  const wos = readdirSync(WO_DIR).filter((f) => f.endsWith('.yaml'))
    .map((f) => ({ f, wo: yaml.load(readFileSync(join(WO_DIR, f), 'utf8')) }))
    .filter(({ wo }) => wo && basename(String(wo.source_path || '')) === fname);
  // prefer an open one (fresh prepare); else the most recent
  const open = wos.find(({ wo }) => wo.status === 'open');
  return (open || wos[wos.length - 1])?.wo?.id;
}

// ── main ───────────────────────────────────────────────────────────────────
const crosswalk = buildCrosswalk();
const predMap = buildPredicateMap();
const flags = buildFlagIndex();

const FAMILIES = [
  ['source-system-cards.csv', (r, s, n, f) => mapSourceSystem(r, s, n, f)],
  ['new-objects.csv', (r, s, n, f) => mapNewObject(r, s, n, f, crosswalk)],
  ['option-candidates.csv', (r, s, n, f) => mapOption(r, s, n, f)],
  ['claims-cautions.csv', (r, s, n, f) => mapClaim(r, s, n, f)],
  ['implementation-memory.csv', (r, s, n, f) => mapImplementation(r, s, n, f)],
  ['relationship-leads.csv', (r, s, n, f) => mapRelationship(r, s, n, f, predMap)],
];

const summary = [];
for (const [fname, mapper] of FAMILIES) {
  if (ONLY && ONLY !== fname) continue;
  const sheet = SHEET[fname];
  const rows = parseCsv(readFileSync(join(FAM_DIR, fname), 'utf8'));
  const woId = DRY ? null : woForFamily(fname);
  if (!DRY && !woId) { console.error(`✗ no work order found for ${fname} — run \`ingest prepare ${FAM_DIR}\` first`); process.exit(1); }
  const candDir = woId ? join(WO_DIR, woId, 'candidates') : null;
  if (candDir) { rmSync(candDir, { recursive: true, force: true }); mkdirSync(candDir, { recursive: true }); }

  const bySchema = {}; let flagged = 0, risky = 0, boundaries = 0; let sample = null;
  let n = 0;
  for (let i = 0; i < rows.length && n < LIMIT; i++) {
    const r = rows[i];
    // skip fully-empty rows
    if (!Object.values(r).some((v) => clean(v))) continue;
    n++;
    const dataRow = n; // 1-based data-row index (matches Matty's Source Row(s) numbering)
    const flag = flags.get(`${sheet}::${dataRow}`);
    if (flag) flagged++;
    const cands = mapper(r, sheet, dataRow, flag);
    for (const c of cands) {
      bySchema[c.schema] = (bySchema[c.schema] || 0) + 1;
      if (c.schema === 'public-use-boundary') boundaries++;
      if (c.object.high_risk) risky++;
      if (!sample) sample = c;
      if (candDir) {
        const fn = `${String(dataRow).padStart(4, '0')}-${(c.schema === 'public-use-boundary' ? 'boundary-' : '')}${slugSafe(c.slug)}.yaml`;
        writeFileSync(join(candDir, fn), yaml.dump({ schema: c.schema, object: c.object }));
      }
    }
  }
  summary.push({ fname, sheet, woId, rows: n, bySchema, flagged, risky, boundaries });
  if (DRY && sample) { console.log(`\n─── ${fname} · sample (${sample.schema}) ───`); console.log(yaml.dump({ schema: sample.schema, object: sample.object })); }
}

function slugSafe(s) { return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'untitled'; }

console.log('\n=== MAP SUMMARY ===');
let total = 0;
for (const s of summary) {
  const parts = Object.entries(s.bySchema).map(([k, v]) => `${k}:${v}`).join(' ');
  const objs = Object.values(s.bySchema).reduce((a, b) => a + b, 0);
  total += objs;
  console.log(`${s.fname.padEnd(26)} ${String(s.rows).padStart(4)} rows → ${String(objs).padStart(4)} objs  [${parts}]  flagged:${s.flagged} risky:${s.risky} bnd:${s.boundaries}${s.woId ? '  wo=' + s.woId : ''}`);
}
console.log(`${'TOTAL'.padEnd(26)} ${''.padStart(4)}        ${String(total).padStart(4)} objs`);
if (DRY) console.log('\n(dry run — nothing written)');

#!/usr/bin/env node
/**
 * Reprocessing Validation — coverage map + relationship/graph-view diff.
 *
 * PROMPT 2 (review gate) analysis. Compares the framework-reprocessed KB
 * (data/kb/, 722 typed objects) against the old flat 119-article Starlight
 * build (src/content/docs/*.md).
 *
 * Read-only. Emits:
 *   data/validation/coverage-map.yaml   per-article object yield + drops/thinned
 *   data/validation/coverage-map.csv    same, spreadsheet form
 *   data/validation/graph-diff.yaml     old vs new connectivity
 *
 * Run: node scripts/validation/reprocessing-coverage.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const KB_DIR = path.join(ROOT, 'data/kb');
const DOCS_DIR = path.join(ROOT, 'src/content/docs');
const OUT_DIR = path.join(ROOT, 'data/validation');

// ---------- load KB objects ----------
const KB_FILES = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.yaml') && !f.startsWith('_'));
const objects = []; // {key, type, origin, source_lineage, maturity, public_use, related_concepts, related_resources, ...}
for (const file of KB_FILES) {
  const doc = yaml.load(fs.readFileSync(path.join(KB_DIR, file), 'utf8'));
  const entries = doc?.entries || {};
  for (const [key, obj] of Object.entries(entries)) {
    if (!obj || typeof obj !== 'object') continue;
    objects.push({
      key,
      type: obj.type || file.replace('.yaml', ''),
      origin: obj.provenance?.origin || null,
      source_lineage: obj.source_lineage || null,
      maturity: obj.maturity || null,
      public_use: obj.public_use || null,
      transformation: obj.provenance?.transformation || null,
      related_concepts: arr(obj.related_concepts),
      related_resources: arr(obj.related_resources),
      concepts: arr(obj.concepts),
      title: obj.title || key,
    });
  }
}
function arr(x) { return Array.isArray(x) ? x : (x == null ? [] : [x]); }

// ---------- load source articles ----------
// Frontmatter here is faceted, not a flat tag list:
//   tags: { function, domain, systems: [...] }, audience, maturity, category, track,
//   section, related: [slug,...]  (curated article->article graph, present on ~41 articles)
const ARTICLE_FILES = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
const articles = {}; // basename.md -> {file, words, lines, facets, related[], richFrontmatter, hasMdLink}
for (const file of ARTICLE_FILES) {
  const raw = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  let meta = {};
  if (fm) { try { meta = yaml.load(fm[1]) || {}; } catch { /* tolerate malformed frontmatter */ } }
  const t = (meta.tags && typeof meta.tags === 'object' && !Array.isArray(meta.tags)) ? meta.tags : {};
  const facets = {
    function: t.function ? String(t.function) : null,
    domain: t.domain ? String(t.domain) : null,
    systems: arr(t.systems).map(String),           // closest analogue to typed "concepts"
    audience: meta.audience ? String(meta.audience) : null,
    maturity_level: meta.maturity ? String(meta.maturity) : null,
    category: meta.category ? String(meta.category) : null,
    track: meta.track != null ? String(meta.track) : null,
  };
  const related = arr(meta.related).map(s => String(s).trim());   // curated related-article slugs
  const richFrontmatter = !!(t.function || t.systems || meta.related || meta.category);
  const body = fm ? raw.slice(fm[0].length) : raw;
  const words = (body.match(/\S+/g) || []).length;
  const lines = raw.split('\n').length;
  const hasMdLink = /\]\((\.\.?\/|\/)[^)]+\)/.test(body);
  articles[file] = { file, words, lines, facets, related, richFrontmatter, hasMdLink };
}
// slug -> article filename resolver (frontmatter `related:` uses bare slugs, no .md)
const slugToFile = {};
for (const f of Object.keys(articles)) slugToFile[f.replace(/\.mdx?$/, '')] = f;

// ---------- coverage map: group objects by origin article ----------
function originToArticle(o) {
  if (o.origin) return path.basename(o.origin);
  if (o.source_lineage) return o.source_lineage;
  return null;
}
const byArticle = {}; // articleFile -> {counts by type, total, objectKeys}
for (const o of objects) {
  const a = originToArticle(o);
  if (!a) continue;
  const rec = byArticle[a] || (byArticle[a] = { total: 0, byType: {}, keys: [] });
  rec.total++;
  rec.byType[o.type] = (rec.byType[o.type] || 0) + 1;
  rec.keys.push(o.key);
}

// per-article coverage rows
const coverageRows = [];
const droppedArticles = []; // 0 objects
for (const [file, art] of Object.entries(articles)) {
  const cov = byArticle[file] || { total: 0, byType: {}, keys: [] };
  const yieldPer1k = art.words ? +(cov.total / art.words * 1000).toFixed(2) : 0;
  const row = {
    article: file,
    words: art.words,
    rich_frontmatter: art.richFrontmatter,
    curated_related: art.related.length,
    systems_tags: art.facets.systems,
    objects: cov.total,
    yield_per_1k_words: yieldPer1k,
    by_type: cov.byType,
  };
  coverageRows.push(row);
  if (cov.total === 0) droppedArticles.push(file);
}
// objects whose origin article isn't in src/content/docs (orphans)
const orphanOrigins = Object.keys(byArticle).filter(a => !(a in articles));

// thinned = bottom-decile yield among articles that DID produce objects
const withObjects = coverageRows.filter(r => r.objects > 0).sort((a, b) => a.yield_per_1k_words - b.yield_per_1k_words);
const decileIdx = Math.max(1, Math.floor(withObjects.length * 0.1));
const thinned = withObjects.slice(0, decileIdx).map(r => ({ article: r.article, words: r.words, objects: r.objects, yield_per_1k_words: r.yield_per_1k_words }));

coverageRows.sort((a, b) => b.objects - a.objects);

// map granular object `type` values back to schema families (source-system subtypes
// like repo/blog/docs-site/publication/directory/convening/forum/knowledge-garden/database
// all belong to the source-system family; index.json groups them the same way).
const SOURCE_SYSTEM_SUBTYPES = new Set([
  'repo', 'blog', 'docs-site', 'publication', 'directory', 'convening',
  'forum', 'knowledge-garden', 'database', 'website', 'source-system',
]);
function family(t) { return SOURCE_SYSTEM_SUBTYPES.has(t) ? 'source-system' : t; }

const typeTotals = {};       // granular
const familyTotals = {};     // schema-family (matches index.json)
for (const o of objects) {
  typeTotals[o.type] = (typeTotals[o.type] || 0) + 1;
  familyTotals[family(o.type)] = (familyTotals[family(o.type)] || 0) + 1;
}

const coverage = {
  generated: 'reprocessing-coverage.mjs (read-only analysis)',
  scope: '119 source articles (src/content/docs) -> data/kb typed objects',
  summary: {
    articles: Object.keys(articles).length,
    objects_total: objects.length,
    distinct_origin_articles: Object.keys(byArticle).length,
    articles_with_zero_objects: droppedArticles.length,
    orphan_origins_not_in_docs: orphanOrigins,
    objects_per_article_mean: +(objects.length / Object.keys(articles).length).toFixed(2),
    objects_per_article_max: coverageRows[0]?.objects ?? 0,
    objects_per_article_min: Math.min(...coverageRows.map(r => r.objects)),
    articles_with_rich_frontmatter: Object.values(articles).filter(a => a.richFrontmatter).length,
    articles_bare_frontmatter: Object.values(articles).filter(a => !a.richFrontmatter).length,
    type_totals_granular: typeTotals,
    type_totals_by_family: familyTotals,
  },
  dropped_articles: droppedArticles,
  thinned_bottom_decile: thinned,
  per_article: coverageRows,
};

// ---------- graph-view diff: old curated/faceted connectivity vs new typed connectivity ----------
const articleList = Object.keys(articles);
function pairKey(a, b) { return [a, b].sort().join(' <> '); }

// OLD build connectivity has two layers:
//   (a) curated `related:` frontmatter arrays  -> explicit, editor-authored article edges
//   (b) shared `systems:` tag facet            -> implicit faceted co-occurrence
// (function/domain/audience are coarse buckets, not treated as edges — they over-connect.)
const oldCuratedEdges = new Set();
for (const [file, art] of Object.entries(articles)) {
  for (const slug of art.related) {
    const target = slugToFile[slug];
    if (target && target !== file) oldCuratedEdges.add(pairKey(file, target));
  }
}
const oldFacetEdges = new Set();
const systemToArticles = {};
for (const [file, art] of Object.entries(articles)) {
  for (const s of art.facets.systems) (systemToArticles[s] || (systemToArticles[s] = [])).push(file);
}
for (const files of Object.values(systemToArticles)) {
  for (let i = 0; i < files.length; i++)
    for (let j = i + 1; j < files.length; j++)
      oldFacetEdges.add(pairKey(files[i], files[j]));
}
const oldEdges = new Set([...oldCuratedEdges, ...oldFacetEdges]);
const articlesWithMdLink = Object.values(articles).filter(a => a.hasMdLink).length;
const articlesWithRelated = Object.values(articles).filter(a => a.related.length).length;
const distinctSystemsTags = Object.keys(systemToArticles).length;

// NEW build edges: two articles connected if their objects reference a shared concept or resource.
// Build article -> set(concepts), article -> set(resources) from the typed objects.
const artConcepts = {}; // article -> Set(concept)
const artResources = {}; // article -> Set(resource)
for (const o of objects) {
  const a = originToArticle(o);
  if (!a) continue;
  const cset = artConcepts[a] || (artConcepts[a] = new Set());
  for (const c of [...o.related_concepts, ...o.concepts]) cset.add(String(c).toLowerCase().trim());
  const rset = artResources[a] || (artResources[a] = new Set());
  for (const r of o.related_resources) rset.add(String(r).toLowerCase().trim());
}
const newEdges = new Set();
const sharedConceptEdges = new Set();
const sharedResourceEdges = new Set();
for (let i = 0; i < articleList.length; i++) {
  for (let j = i + 1; j < articleList.length; j++) {
    const a = articleList[i], b = articleList[j];
    const ca = artConcepts[a] || new Set(), cb = artConcepts[b] || new Set();
    const ra = artResources[a] || new Set(), rb = artResources[b] || new Set();
    let shared = false;
    for (const c of ca) if (cb.has(c)) { sharedConceptEdges.add(pairKey(a, b)); shared = true; break; }
    for (const r of ra) if (rb.has(r)) { sharedResourceEdges.add(pairKey(a, b)); shared = true; break; }
    if (shared) newEdges.add(pairKey(a, b));
  }
}
// edges the framework surfaces that the flat article set did NOT have
const emergentEdges = [...newEdges].filter(e => !oldEdges.has(e));

// total typed reference-edges (object -> concept/resource) — raw connective volume
let typedRefEdges = 0;
const distinctConcepts = new Set(), distinctResources = new Set();
for (const o of objects) {
  typedRefEdges += o.related_concepts.length + o.related_resources.length + o.concepts.length;
  for (const c of [...o.related_concepts, ...o.concepts]) distinctConcepts.add(String(c).toLowerCase().trim());
  for (const r of o.related_resources) distinctResources.add(String(r).toLowerCase().trim());
}

// sample emergent connections (articles newly linked via a shared concept, no shared tag/link before)
const emergentSamples = [];
for (const e of emergentEdges.slice(0, 25)) {
  const [a, b] = e.split(' <> ');
  const ca = artConcepts[a] || new Set(), cb = artConcepts[b] || new Set();
  const via = [...ca].filter(c => cb.has(c));
  const ra = artResources[a] || new Set(), rb = artResources[b] || new Set();
  const viaRes = [...ra].filter(r => rb.has(r));
  emergentSamples.push({ pair: e, via_concepts: via.slice(0, 5), via_resources: viaRes.slice(0, 5) });
}

const graphDiff = {
  generated: 'reprocessing-coverage.mjs (read-only analysis)',
  old_build: {
    model: 'Starlight articles; connectivity = curated `related:` frontmatter + shared `systems:` tag facet',
    articles: articleList.length,
    articles_with_rich_frontmatter: Object.values(articles).filter(a => a.richFrontmatter).length,
    articles_with_curated_related: articlesWithRelated,
    articles_with_internal_md_links: articlesWithMdLink,
    distinct_systems_tags: distinctSystemsTags,
    curated_related_edges: oldCuratedEdges.size,
    shared_systems_facet_edges: oldFacetEdges.size,
    total_old_edges_union: oldEdges.size,
  },
  new_build: {
    model: 'typed objects; connectivity = shared related_concepts / related_resources across all 119 articles',
    typed_reference_edges_object_level: typedRefEdges,
    distinct_concepts_referenced: distinctConcepts.size,
    distinct_resources_referenced: distinctResources.size,
    article_pairs_connected_via_shared_concept: sharedConceptEdges.size,
    article_pairs_connected_via_shared_resource: sharedResourceEdges.size,
    article_pairs_connected_total: newEdges.size,
  },
  diff: {
    emergent_article_pairs: emergentEdges.length,
    note: 'article pairs connected in the typed graph that had NO curated `related:` edge and no shared `systems:` facet in the old build',
    old_edges: oldEdges.size,
    new_edges: newEdges.size,
    overlap_edges: [...newEdges].filter(e => oldEdges.has(e)).length,
    connectivity_note: 'the two graphs are different KINDS of edge (curated/faceted vs shared-concept); counts are not a single ratio — see report',
  },
  emergent_samples: emergentSamples,
};

// ---------- reference integrity: do related_* keys resolve to real objects? ----------
// (Recommended by the 2026-07-19 faithfulness spot-check: dangling refs like key-terms-a-z's
// related_concepts [DAO, Layer 2] point at no promoted object and break graph-building.)
function norm(s) { return String(s).toLowerCase().trim(); }
function slugify(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
// Two indexes per type: exact slug set + full slug list (for prefix/naming-drift matching).
const conceptExact = new Set(), resourceExact = new Set();
const conceptSlugs = [], resourceSlugs = [];
for (const o of objects) {
  const key = slugify(o.key), title = slugify(o.title);
  const forms = new Set([norm(o.key), norm(o.title), key, title]);
  if (o.type === 'concept-lineage') { forms.forEach(f => conceptExact.add(f)); conceptSlugs.push(key, title); }
  if (family(o.type) === 'resource') { forms.forEach(f => resourceExact.add(f)); resourceSlugs.push(key, title); }
}
// resolution tiers: 'exact' | 'drift' (object exists under a qualified key) | 'dangling' (no object)
function resolveRef(ref, exact, slugs) {
  const r = slugify(ref);
  if (exact.has(norm(ref)) || exact.has(r)) return 'exact';
  // naming-drift: object exists under a qualified/reordered key.
  const rTokens = new Set(r.split('-').filter(Boolean));
  for (const s of slugs) {
    if (s === r) return 'exact';
    if (s.startsWith(r + '-') || r.startsWith(s + '-')) return 'drift';   // prefix/suffix qualifier
    // token-set containment (handles word-order variants, e.g. rid-reference-identifier)
    if (rTokens.size >= 2) {
      const sTokens = new Set(s.split('-').filter(Boolean));
      let subset = true;
      for (const t of rTokens) if (!sTokens.has(t)) { subset = false; break; }
      if (subset) return 'drift';
    }
  }
  return 'dangling';
}
let refsChecked = 0;
const tally = { exact: 0, drift: 0, dangling: 0 };
const driftSamples = [], danglingSamples = [];
for (const o of objects) {
  const check = (ref, exact, slugs, kind) => {
    refsChecked++;
    const res = resolveRef(ref, exact, slugs);
    tally[res]++;
    const row = { object: o.key, type: o.type, [kind]: ref, origin: originToArticle(o) };
    if (res === 'drift' && driftSamples.length < 20) driftSamples.push(row);
    if (res === 'dangling' && danglingSamples.length < 20) danglingSamples.push(row);
  };
  for (const c of o.related_concepts) check(c, conceptExact, conceptSlugs, 'ref_concept');
  for (const r of o.related_resources) check(r, resourceExact, resourceSlugs, 'ref_resource');
}
const referenceIntegrity = {
  refs_checked: refsChecked,
  exact_resolved: tally.exact,
  naming_drift_resolvable: tally.drift,       // object exists under a qualified key — needs an alias layer
  truly_dangling: tally.dangling,             // no object at all — the DAO/Layer 2 case
  exact_resolve_rate_pct: refsChecked ? +((tally.exact / refsChecked) * 100).toFixed(1) : null,
  resolvable_with_alias_pct: refsChecked ? +(((tally.exact + tally.drift) / refsChecked) * 100).toFixed(1) : null,
  note: 'refs use bare concept slugs while objects are keyed with disambiguating suffixes (naming drift); truly_dangling refs point at no object at all. Both break graph-build without an alias/normalization layer.',
  naming_drift_samples: driftSamples,
  truly_dangling_samples: danglingSamples,
};
graphDiff.reference_integrity = referenceIntegrity;

// ---------- write outputs ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'coverage-map.yaml'), yaml.dump(coverage, { lineWidth: 100, sortKeys: false }));
fs.writeFileSync(path.join(OUT_DIR, 'graph-diff.yaml'), yaml.dump(graphDiff, { lineWidth: 100, sortKeys: false }));

// CSV
const allTypes = Object.keys(typeTotals).sort();
const header = ['article', 'words', 'rich_frontmatter', 'curated_related', 'objects', 'yield_per_1k_words', ...allTypes, 'systems_tags'];
const csvLines = [header.join(',')];
for (const r of coverageRows) {
  const cells = [
    r.article, r.words, r.rich_frontmatter, r.curated_related, r.objects, r.yield_per_1k_words,
    ...allTypes.map(t => r.by_type[t] || 0),
    '"' + r.systems_tags.join('; ') + '"',
  ];
  csvLines.push(cells.join(','));
}
fs.writeFileSync(path.join(OUT_DIR, 'coverage-map.csv'), csvLines.join('\n') + '\n');

// ---------- reviewer tracking sheet (one row per article, ready for sign-off) ----------
// Risk flags drive review priority: claim-heavy + boundary-flagged + thinned = review first.
const thinnedSet = new Set(thinned.map(t => t.article));
const REVIEW_DIR = path.join(ROOT, 'docs/reviews');
const trackHeader = [
  'priority', 'article', 'objects', 'types_present',
  'has_claim_evidence', 'has_public_use_boundary', 'thinned',
  'reviewer', 'decision(PROMOTE|FIX|HOLD)', 'privacy_gate(PASS|FAIL)', 'date', 'notes',
];
const trackRows = coverageRows.map(r => {
  const types = Object.keys(r.by_type).sort();
  const hasClaim = !!r.by_type['claim-evidence'];
  const hasPUB = !!r.by_type['public-use-boundary'];
  const isThin = thinnedSet.has(r.article);
  // priority tiers: 1 = sensitivity/completeness risk (boundary-flagged or thinned),
  // 2 = claim-sourcing risk (has claim-evidence), 3 = standard summarization.
  const priority = (hasPUB || isThin) ? 1 : (hasClaim ? 2 : 3);
  return { priority, article: r.article, objects: r.objects, types, hasClaim, hasPUB, isThin };
}).sort((a, b) => a.priority - b.priority || b.objects - a.objects);

const trackLines = [trackHeader.join(',')];
for (const t of trackRows) {
  trackLines.push([
    t.priority, t.article, t.objects, '"' + t.types.join('; ') + '"',
    t.hasClaim, t.hasPUB, t.isThin,
    '', '', '', '', '',   // reviewer, decision, privacy_gate, date, notes (to fill)
  ].join(','));
}
if (fs.existsSync(REVIEW_DIR)) {
  fs.writeFileSync(path.join(REVIEW_DIR, 'reviewer-tracking-sheet.csv'), trackLines.join('\n') + '\n');
}

// ---------- JSON summary — build-input snapshot the /validation Astro page imports ----------
// (Vite imports JSON, not YAML; mirrors how the summary pages import data/kb/index.json.)
// Auto-derived metrics only; the manual faithfulness worked-round result is stated in the page.
const validationSummary = {
  generated_from: 'scripts/validation/reprocessing-coverage.mjs',
  scope: '119 live articles -> data/kb (722 typed objects); all raw, review-gated',
  coverage: {
    articles: Object.keys(articles).length,
    objects: objects.length,
    dropped_articles: droppedArticles.length,
    orphan_objects: orphanOrigins.length,
    objects_per_article_mean: coverage.summary.objects_per_article_mean,
    objects_per_article_min: coverage.summary.objects_per_article_min,
    objects_per_article_max: coverage.summary.objects_per_article_max,
    type_totals_by_family: familyTotals,
    thinned_count: thinned.length,
    thinned: thinned.map(t => ({ article: t.article, objects: t.objects, words: t.words })),
  },
  graph: {
    old_curated_edges: oldCuratedEdges.size,
    old_facet_edges: oldFacetEdges.size,
    old_union: oldEdges.size,
    old_articles_with_related: articlesWithRelated,
    new_article_pairs: newEdges.size,
    new_distinct_concepts: distinctConcepts.size,
    new_distinct_resources: distinctResources.size,
    new_typed_ref_edges: typedRefEdges,
    emergent_pairs: emergentEdges.length,
    overlap_pairs: graphDiff.diff.overlap_edges,
    emergent_samples: emergentSamples.slice(0, 6),
  },
  reference_integrity: {
    refs_checked: referenceIntegrity.refs_checked,
    exact: referenceIntegrity.exact_resolved,
    naming_drift: referenceIntegrity.naming_drift_resolvable,
    dangling: referenceIntegrity.truly_dangling,
    exact_pct: referenceIntegrity.exact_resolve_rate_pct,
    alias_pct: referenceIntegrity.resolvable_with_alias_pct,
    dangling_samples: danglingSamples.slice(0, 8),
  },
  review_tiers: {
    tier1_sensitivity: trackRows.filter(t => t.priority === 1).length,
    tier2_claims: trackRows.filter(t => t.priority === 2).length,
    tier3_standard: trackRows.filter(t => t.priority === 3).length,
  },
};
fs.writeFileSync(path.join(OUT_DIR, 'validation-summary.json'), JSON.stringify(validationSummary, null, 2) + '\n');

// ---------- console summary ----------
console.log('COVERAGE MAP');
console.log('  articles:', coverage.summary.articles, '| objects:', coverage.summary.objects_total,
  '| mean obj/article:', coverage.summary.objects_per_article_mean);
console.log('  distinct origin articles:', coverage.summary.distinct_origin_articles,
  '| zero-object articles:', coverage.summary.articles_with_zero_objects,
  '| orphan origins:', orphanOrigins.length);
console.log('  obj/article range:', coverage.summary.objects_per_article_min, '..', coverage.summary.objects_per_article_max);
console.log('  rich frontmatter:', coverage.summary.articles_with_rich_frontmatter,
  '| bare frontmatter:', coverage.summary.articles_bare_frontmatter);
console.log('  family totals:', JSON.stringify(familyTotals));
console.log('  thinned (bottom decile yield):', thinned.map(t => `${t.article}(${t.objects}/${t.words}w)`).join(', '));
console.log('\nGRAPH DIFF');
console.log('  OLD: curated related edges:', oldCuratedEdges.size, '| shared-systems facet edges:', oldFacetEdges.size,
  '| union:', oldEdges.size, '| articles w/ related:', articlesWithRelated, '| w/ md links:', articlesWithMdLink);
console.log('  NEW: article-pairs connected:', newEdges.size,
  '| typed ref-edges:', typedRefEdges,
  '| distinct concepts:', distinctConcepts.size, '| distinct resources:', distinctResources.size);
console.log('  DIFF: emergent pairs (new, not in old):', emergentEdges.length,
  '| overlap:', graphDiff.diff.overlap_edges);
console.log('  REF-INTEGRITY: refs checked:', refsChecked,
  '| exact:', tally.exact, '| naming-drift:', tally.drift, '| truly-dangling:', tally.dangling);
console.log('               exact resolve:', referenceIntegrity.exact_resolve_rate_pct + '%',
  '| resolvable-with-alias:', referenceIntegrity.resolvable_with_alias_pct + '%');
console.log('\nwrote: data/validation/coverage-map.yaml, coverage-map.csv, graph-diff.yaml');

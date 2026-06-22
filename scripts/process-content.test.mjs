// Test-first (TDD) for scripts/process-content.mjs (Task 3).
// Asserts the article processor emits VALID encyclopedia-entry objects with honest-state
// labels (draft / source-linked-unreviewed, never `reviewed`), infers page_type correctly,
// and conservatively extracts concept-lineage candidates from "what is X" articles.
//
// Run: node --test scripts/process-content.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { validateObject } from '../packages/toolkit-framework/src/index.mjs';
import {
  inferPageType,
  articleToEntry,
  isConceptArticle,
  articleToConcept,
  HUMAN_REVIEWED,
  journeyToTrack,
  deriveTracks,
} from './process-content.mjs';
import { journeys } from '../src/data/journeys.js';

const here = dirname(fileURLToPath(import.meta.url));

// --- inferPageType -----------------------------------------------------------

test('inferPageType: "X vs Y" → comparison', () => {
  assert.equal(
    inferPageType('Centralized vs. Decentralized Systems', 'A comparison of two models.'),
    'comparison',
  );
  assert.equal(inferPageType('ReFi vs. DeFi vs. TradFi', 'three ways to move money'), 'comparison');
});

test('inferPageType: "Which X / Is X right" → comparison (a choosing/decision page)', () => {
  assert.equal(inferPageType('Which Chain is Right for Your Project?', 'pick a chain'), 'comparison');
});

test('inferPageType: "How to X / guide / setting up" → guide', () => {
  assert.equal(inferPageType('How to Get Your First Crypto', 'a step by step walk'), 'guide');
  assert.equal(inferPageType('Setting Up Your First Wallet', 'install and configure'), 'guide');
});

test('inferPageType: "What is X" / explained → concept', () => {
  assert.equal(inferPageType('What Is a Blockchain?', 'a shared notebook'), 'concept');
  assert.equal(inferPageType('Smart Contracts Explained', 'self-executing code'), 'concept');
});

test('inferPageType: pitfalls / mistakes / avoid → anti-pattern', () => {
  assert.equal(
    inferPageType('Common Pitfalls When Starting a Local Node', 'the failure patterns that sink nodes'),
    'anti-pattern',
  );
});

test('inferPageType: framework / model / architecture → framework', () => {
  assert.equal(inferPageType('Governance Mechanism Design', 'a framework for voting models'), 'framework');
  assert.equal(inferPageType('Local Node Model', 'an architecture for nodes'), 'framework');
});

test('inferPageType: always returns a value in the schema enum', () => {
  const enumVals = new Set([
    'concept', 'framework', 'comparison', 'guide', 'case-linked', 'anti-pattern', 'frontier',
  ]);
  assert.ok(enumVals.has(inferPageType('Totally Ambiguous Title', 'some body text')));
});

// --- articleToEntry → a VALID encyclopedia-entry ------------------------------

test('articleToEntry produces a valid encyclopedia-entry (framework validateObject)', () => {
  const entry = articleToEntry({
    slug: 'what-is-blockchain',
    title: 'What Is a Blockchain?',
    description: 'A plain-language introduction to blockchains.',
    body: 'A blockchain is a shared notebook the whole village keeps.',
    frontmatter: {},
  });
  const { valid, errors } = validateObject('encyclopedia-entry', entry);
  assert.ok(valid, `expected valid encyclopedia-entry, got errors: ${JSON.stringify(errors)}`);
});

test('articleToEntry: honest-state defaults — draft maturity, ai_assisted, non-reviewed public_use', () => {
  const entry = articleToEntry({
    slug: 'what-is-blockchain',
    title: 'What Is a Blockchain?',
    description: 'intro',
    body: 'body',
    frontmatter: {},
  });
  // honest maturity default: these are AI-pipeline drafts, NOT human-reviewed.
  assert.equal(entry.maturity, 'draft');
  assert.notEqual(entry.maturity, 'reviewed');
  // honest flag.
  assert.equal(entry.ai_assisted, true);
  // honest public_use: must not be a `reviewed-*` overclaim.
  assert.ok(!/^reviewed-/.test(entry.public_use), `public_use overclaims: ${entry.public_use}`);
  assert.equal(entry.public_use, 'source-linked-unreviewed');
});

test('articleToEntry: NEVER marks reviewed when the human-review allowlist is empty', () => {
  // The allowlist is empty (no evidence of independent human review per the master doc).
  assert.equal(HUMAN_REVIEWED.size, 0);
  const entry = articleToEntry({
    slug: 'centralized-vs-decentralized', // has review_done:true in real frontmatter — must NOT promote it
    title: 'Centralized vs. Decentralized',
    description: 'x',
    body: 'y',
    frontmatter: { review_done: true, published_flag: true, status: 'published' },
  });
  assert.equal(entry.maturity, 'draft');
  assert.notEqual(entry.maturity, 'reviewed');
});

test('articleToEntry: carries description→summary, source_lineage, slug id, page_type', () => {
  const entry = articleToEntry({
    slug: 'how-to-get-crypto',
    title: 'How to Get Your First Crypto',
    description: 'A calm, scam-aware guide.',
    body: 'walk through getting your first crypto',
    frontmatter: {},
  });
  assert.equal(entry.summary, 'A calm, scam-aware guide.');
  assert.equal(entry.source_lineage, 'src/content/docs/how-to-get-crypto.md');
  assert.equal(entry.id, 'how-to-get-crypto');
  assert.equal(entry.type, 'encyclopedia-entry');
  assert.equal(entry.page_type, 'guide');
});

test('articleToEntry: harvests honest related_concepts from frontmatter `related`', () => {
  const entry = articleToEntry({
    slug: 'silvi-protocol',
    title: 'Silvi Protocol Playbook',
    description: 'a guide',
    body: 'using silvi',
    frontmatter: { related: ['dmrv', 'onchain-attestations'] },
  });
  assert.deepEqual(entry.related_concepts, ['dmrv', 'onchain-attestations']);
});

// --- concept extraction (conservative) ---------------------------------------

test('isConceptArticle: true for "what is X" defined-term articles', () => {
  assert.equal(isConceptArticle('what-is-dao', 'What Is a DAO?'), true);
  assert.equal(isConceptArticle('what-is-blockchain', 'What Is a Blockchain?'), true);
});

test('isConceptArticle: false for guides / comparisons / pitfalls (no over-extraction)', () => {
  assert.equal(isConceptArticle('how-to-get-crypto', 'How to Get Your First Crypto'), false);
  assert.equal(isConceptArticle('common-pitfalls', 'Common Pitfalls When Starting a Local Node'), false);
  assert.equal(isConceptArticle('which-chain-right', 'Which Chain is Right for Your Project?'), false);
});

test('articleToConcept produces a valid concept-lineage (framework validateObject)', () => {
  const concept = articleToConcept({
    slug: 'what-is-dao',
    title: 'What Is a DAO?',
    description: 'A plain-language introduction to DAOs.',
    body: 'A DAO is ...',
    frontmatter: {},
  });
  const { valid, errors } = validateObject('concept-lineage', concept);
  assert.ok(valid, `expected valid concept-lineage, got errors: ${JSON.stringify(errors)}`);
  assert.equal(concept.maturity, 'draft');
  assert.equal(concept.ai_assisted, true);
  assert.equal(concept.type, 'concept-lineage');
  assert.equal(concept.source_lineage, 'src/content/docs/what-is-dao.md');
  // honest: do not fabricate traditions/distinctions.
  assert.ok(!concept.source_traditions || concept.source_traditions.length === 0);
});

// --- journeys → tracks (Task 4) ----------------------------------------------

test('deriveTracks: the 3 journeys map to 3 track objects', () => {
  const tracks = deriveTracks(journeys);
  assert.equal(tracks.length, 3);
  assert.deepEqual(
    tracks.map((t) => t.id).sort(),
    ['knowledge-commons', 'local-node', 'newcomer'],
  );
});

test('deriveTracks: every derived track validates against schemas/track.yaml', () => {
  for (const t of deriveTracks(journeys)) {
    const { valid, errors } = validateObject('track', t);
    assert.ok(valid, `track ${t.id} invalid: ${JSON.stringify(errors)}`);
  }
});

test('journeyToTrack: required fields present — title, type=track, non-empty audience', () => {
  const t = journeyToTrack(journeys.newcomer);
  assert.equal(t.title, 'Newcomer Orientation');
  assert.equal(t.type, 'track');
  assert.equal(typeof t.audience, 'string');
  assert.ok(t.audience.length > 0, 'audience must be a non-empty string');
});

test('journeyToTrack: outcome[] array is collapsed to a single string', () => {
  const t = journeyToTrack(journeys.newcomer);
  assert.equal(typeof t.outcome, 'string');
  assert.ok(t.outcome.length > 0);
  // each of the journey's outcome bullets must survive into the joined string.
  for (const bullet of journeys.newcomer.outcome) {
    assert.ok(t.outcome.includes(bullet), `outcome string missing bullet: ${bullet}`);
  }
});

test('journeyToTrack: concepts = flattened, ordered step slugs across all chapters', () => {
  const t = journeyToTrack(journeys.newcomer);
  assert.ok(Array.isArray(t.concepts));
  // newcomer has 16 steps across 4 chapters.
  const expected = journeys.newcomer.chapters.flatMap((c) => c.steps.map((s) => s[0]));
  assert.deepEqual(t.concepts, expected);
  // spot-check a known slug is present and order is preserved.
  assert.ok(t.concepts.includes('what-is-blockchain'));
  assert.equal(t.concepts[0], 'why-regens-interested');
});

test('journeyToTrack: maturity is the valid axis value field-informed (Heenal v1, not auto-promoted to reviewed)', () => {
  const t = journeyToTrack(journeys.newcomer);
  assert.equal(t.maturity, 'field-informed');
  assert.notEqual(t.maturity, 'reviewed');
});

test('journeyToTrack: traceability — id slug + source_lineage back to journeys.js', () => {
  const t = journeyToTrack(journeys['knowledge-commons']);
  assert.equal(t.id, 'knowledge-commons');
  assert.equal(t.source_lineage, 'src/data/journeys.js#knowledge-commons');
});

test('journeyToTrack: options NOT fabricated — left empty (journeys carry no option ids)', () => {
  const t = journeyToTrack(journeys.newcomer);
  assert.deepEqual(t.options, []);
});

// sanity: the module under test lives where we expect.
test('module path sanity', () => {
  assert.ok(join(here, 'process-content.mjs').endsWith('scripts/process-content.mjs'));
});

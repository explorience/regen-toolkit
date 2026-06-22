// gen-instance-stats.mjs
// Snapshot honest counts from the populated data/*.yaml registries to a JSON the
// instance page (src/pages/regen-toolkit-os.astro) can import safely.
//
// Why a prebuild snapshot (same reason as gen-framework-manifest.mjs): importing
// data/*.yaml directly into an Astro page goes through Vite, whose fs-relative
// reads break in the build output. So we read the YAML here in plain Node — where
// fs works — and write a static JSON the page imports.
//
// HONESTY RULE (this page goes in front of the team — do not overclaim):
//   - Headline the canonical framework-typed counts (119 / 8 / 3 / 1616 / 89).
//   - Present the salvaged set SEPARATELY and honestly (144 legacy drafts held for
//     review — 27 with real content, 112 unfinished stubs).
//   - NEVER sum canonical + salvaged into one inflated "263 articles" figure.
//   - The populated registries are AI-pipeline drafts, NOT human-reviewed.
//
// Deterministic: no timestamp, so a rebuild doesn't churn the committed file. It
// changes only when the underlying data actually changes.
//
// Runs before `astro build` (npm "prebuild", chained after gen-framework-manifest).

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const dataDir = join(repoRoot, 'data');
const outDir = join(repoRoot, 'src', 'data');
const outFile = join(outDir, 'instance-stats.json');

function load(file) {
  return yaml.load(readFileSync(join(dataDir, file), 'utf8')) ?? {};
}

// Fail closed: if a registry can't be read, exit non-zero rather than ship a
// silently-wrong (under-counted) stat. Better caught here than in front of the team.
let enc, con, trk, res, ss, encSalv, resSalv;
try {
  enc = load('encyclopedia.yaml');
  con = load('concepts.yaml');
  trk = load('tracks.yaml');
  res = load('resources.yaml');
  ss = load('source-systems.yaml');
  encSalv = load('encyclopedia-salvaged.yaml');
  resSalv = load('resources-salvaged.yaml');
} catch (err) {
  console.error('[gen-instance-stats] failed to read a data registry:', err.message);
  process.exit(1);
}

const encEntries = enc.entries ?? [];
const salvEntries = encSalv.entries ?? [];

// public_use_boundary markers (CSIS high-risk pass) — count across BOTH files,
// since the CSIS pass ran over the whole encyclopedia (canonical + salvaged).
const boundaryCanonical = encEntries.filter((e) => e && e.public_use_boundary).length;
const boundarySalvaged = salvEntries.filter((e) => e && e.public_use_boundary).length;

// Salvaged legacy pipeline status (parsed from the `notes` field the generator wrote,
// e.g. "legacy pipeline status: not-started"). 27 published (real content) /
// 112 not-started (unfinished stubs) / the rest draft/none.
const salvStatus = { published: 0, 'not-started': 0, draft: 0, other: 0 };
for (const e of salvEntries) {
  const m = /legacy pipeline status:\s*(\S+)/.exec(e?.notes ?? '');
  const s = m ? m[1] : '';
  if (s === 'published') salvStatus.published++;
  else if (s === 'not-started') salvStatus['not-started']++;
  else if (s === 'draft') salvStatus.draft++;
  else salvStatus.other++;
}

const stats = {
  // Canonical framework-typed registries (the honest headline figures).
  canonical: {
    encyclopediaEntries: encEntries.length, // 119
    concepts: (con.concepts ?? []).length, // 8
    tracks: (trk.tracks ?? []).length, // 3
    resources: (res.resources ?? []).length, // 1616
    sourceSystems: (ss.source_systems ?? []).length, // 89
  },
  // CSIS high-risk pass — entries flagged with a public_use_boundary.
  publicUseBoundaries: {
    canonical: boundaryCanonical, // 15
    salvaged: boundarySalvaged, // 19
    total: boundaryCanonical + boundarySalvaged, // 34
  },
  // Held SEPARATELY for review — never summed into the canonical counts.
  salvaged: {
    encyclopediaDrafts: salvEntries.length, // 144
    withRealContent: salvStatus.published, // 27
    unfinishedStubs: salvStatus['not-started'], // 112
    otherDraft: salvStatus.draft + salvStatus.other, // the rest (draft/none)
    resourceDumps: (resSalv.resources ?? []).length, // 4
  },
  // V3 resource lift — rows held for review, not lifted (from the report).
  resourcesHeldForReview: 698,
  // Honest state of everything above.
  reviewState: 'draft', // AI-pipeline / lifted — NOT human-reviewed
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(stats, null, 2) + '\n', 'utf8');
console.log(
  `[gen-instance-stats] ${stats.canonical.encyclopediaEntries} entries · ${stats.canonical.concepts} concepts · ${stats.canonical.tracks} tracks · ${stats.canonical.resources} resources · ${stats.canonical.sourceSystems} source-systems · ${stats.publicUseBoundaries.total} boundaries · ${stats.salvaged.encyclopediaDrafts} salvaged → src/data/instance-stats.json`,
);

// src/render.mjs
// Two render outputs (Seam 3 = data → surface). renderDashboardSection() returns an ASCII
// block for the ops dashboard (scripts/initialize.mjs). renderSiteData() copies the
// framework's derived index.json to a site-consumable path; it never hand-authors the index.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export function renderDashboardSection(index = {}) {
  const total = index.total ?? 0;
  const byType = index.by_type || {};
  const rq = index.review_queue;
  const awaiting = Array.isArray(rq) ? rq.length : (rq ?? 0);
  const lines = [];
  lines.push('─── Knowledge Commons ' + '─'.repeat(55));
  lines.push('');
  lines.push(`  ${total} objects · ${Object.keys(byType).length} types · ${awaiting} awaiting review`);
  for (const [t, n] of Object.entries(byType)) lines.push(`  ${String(n).padStart(4)}  ${t}`);
  lines.push('');
  return lines.join('\n');
}

export function renderSiteData({ dir, target, outPath }) {
  // Read from <dir>/<target>/data/kb/index.json (where the adapter wrote the KB, resolved the
  // framework's way: join(dir, target)); write under `dir` (the instance root). In production
  // dir='.'/target='.' so this is unchanged, but --dir <path> is now honored.
  const src = join(dir, target, 'data', 'kb', 'index.json');
  if (!existsSync(src)) return { ok: false, report: 'no data/kb/index.json — run index.rebuild first' };
  const data = JSON.parse(readFileSync(src, 'utf8'));
  const out = join(dir, outPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2));
  return { ok: true, report: { wrote: out } };
}

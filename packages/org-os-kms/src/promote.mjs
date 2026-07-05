// src/promote.mjs
// A→C promotion: compare the develop-in-place package (from) against its canonical home
// (to) and produce a checksum drift manifest. DRAFT-ONLY by default — copying into another
// repo is draft-and-present; a human approves and performs the reviewed copy.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

function walk(root, base = root, acc = []) {
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = join(root, name);
    if (statSync(p).isDirectory()) walk(p, base, acc);
    else acc.push(relative(base, p));
  }
  return acc;
}

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 12);

export function promote({ from, to, apply = false }) {
  const manifest = walk(from).map((rel) => {
    const srcHash = sha(join(from, rel));
    const dst = join(to, rel);
    const dstHash = existsSync(dst) ? sha(dst) : null;
    const status = dstHash === null ? 'new' : dstHash === srcHash ? 'same' : 'changed';
    return { rel, srcHash, dstHash, status };
  });
  const drift = manifest.filter((m) => m.status !== 'same');
  // apply is intentionally inert: the reviewed copy happens outside, after human approval.
  return { applied: false, requested_apply: apply, drift, manifest };
}

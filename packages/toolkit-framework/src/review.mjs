// src/review.mjs — the human gate. "Raw is never auto-promoted" gets its operator.
// NOTE: refs from `store` may be cwd-relative (when --target was relative) —
// review verbs must run from the same cwd as the store that produced them.
import { getAdapter } from './storage.mjs';
import { isValid, checkInvariants } from './index.mjs';
import { isAwaitingReview } from './util.mjs';

export function reviewQueue({ adapter, target }) {
  return getAdapter(adapter).list(target).filter(({ object }) => isAwaitingReview(object));
}

export function promote({ adapter, target, ref, maturity, reviewer, date }) {
  if (!isValid('maturity', maturity)) throw new Error(`"${maturity}" is not a valid maturity (K1)`);
  const needsHuman = maturity !== 'raw';
  if (needsHuman && !reviewer) throw new Error('--reviewer is required to promote beyond raw — AI-assisted ≠ Human-reviewed');
  const a = getAdapter(adapter);
  // Membership lookup: only refs the adapter itself lists are writable (no arbitrary-file writes).
  const entry = a.list(target).find((e) => e.ref === ref);
  if (!entry) throw new Error(`ref not found in this KB: ${ref}`);
  const patch = { maturity };
  if (reviewer) {
    patch.ai_assisted = false;              // reviewed by a human now; provenance.authorship preserves history
    patch.reviewed_by = reviewer;
    patch.last_reviewed = date || new Date().toISOString().slice(0, 10);
  }
  // Validate the MERGED object BEFORE any write — a refused promotion must leave disk untouched.
  const merged = { ...entry.object, ...patch };
  const inv = checkInvariants(merged);
  if (!inv.ok) throw new Error(`promotion would violate invariants — nothing written:\n  - ${inv.violations.join('\n  - ')}`);
  const { object } = a.update(target, ref, patch);
  a.writeIndex(target);
  return { ref, object };
}

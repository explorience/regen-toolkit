// src/review.mjs — the human gate. "Raw is never auto-promoted" gets its operator.
// NOTE: refs from `store` may be cwd-relative (when --target was relative) —
// review verbs must run from the same cwd as the store that produced them.
import { getAdapter } from './storage.mjs';
import { isValid, checkInvariants } from './index.mjs';

export function reviewQueue({ adapter, target }) {
  return getAdapter(adapter).list(target)
    .filter(({ object }) => object.maturity === 'raw' || object.ai_assisted === true);
}

export function promote({ adapter, target, ref, maturity, reviewer, date }) {
  if (!isValid('maturity', maturity)) throw new Error(`"${maturity}" is not a valid maturity (K1)`);
  const needsHuman = maturity !== 'raw';
  if (needsHuman && !reviewer) throw new Error('--reviewer is required to promote beyond raw — AI-assisted ≠ Human-reviewed');
  const a = getAdapter(adapter);
  const patch = { maturity };
  if (reviewer) {
    patch.ai_assisted = false;              // reviewed by a human now; provenance.authorship preserves history
    patch.reviewed_by = reviewer;
    patch.last_reviewed = date || new Date().toISOString().slice(0, 10);
  }
  const { object } = a.update(target, ref, patch);
  const inv = checkInvariants(object);
  if (!inv.ok) throw new Error(`promotion violates invariants:\n  - ${inv.violations.join('\n  - ')}`);
  a.writeIndex(target);
  return { ref, object };
}

// SP8 — the schema-enforceable subset of the 16 distinctions (architecture/invariants.md).
// The rest are review-only (need human judgment) and live in the csis-review skill.
import { SIX_STRUCTURAL_COMPONENTS } from './compatibility.mjs';

/** Check the mechanically-enforceable invariants on an object. Returns { ok, violations }. */
export function checkInvariants(obj = {}) {
  const violations = [];
  const t = obj.type;

  // Track ≠ Deployment — a track must not carry a deployment's structural fields.
  if (t === 'track' || t === 'track-entry') {
    const leaked = SIX_STRUCTURAL_COMPONENTS.filter((c) => obj[c] !== undefined);
    if (leaked.length) {
      violations.push(`Track must not carry Deployment structural fields (${leaked.join(', ')}) — Track ≠ Deployment`);
    }
  }

  // AI-assisted ≠ Human-reviewed — can't claim reviewed maturity while flagged ai_assisted.
  if (obj.ai_assisted === true && obj.maturity === 'reviewed') {
    violations.push('AI-assisted content cannot claim maturity "reviewed" without human review — AI-assisted ≠ Human-reviewed');
  }

  // Inclusion ≠ Endorsement / raw ≠ reviewed — a raw item can't be public_use "reviewed-for-*".
  if ((obj.lifecycle_state === 'raw-lead' || obj.maturity === 'raw') && /^reviewed-for/.test(obj.public_use || '')) {
    violations.push('A raw item cannot be public_use "reviewed-for-*" — Inclusion ≠ Endorsement');
  }

  return { ok: violations.length === 0, violations };
}

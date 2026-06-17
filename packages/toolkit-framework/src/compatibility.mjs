// K6 — the compatibility engine. ONE validator, three callers (options, tracks, deployments).
// Closes the option-library `csis_integration_gap`: options/tracks carry constraints so teams
// can't compose structurally incompatible deployments.

const SIX_COMPONENTS = [
  'decision_system', 'information_requirements', 'power_structure',
  'accountability', 'failure_detection', 'boundaries',
];

const idOf = (o) => o.id || o.title;

/**
 * Check a set of option objects for declared incompatibilities.
 * An option may list `incompatibilities` (other option ids/titles, or categories).
 * Returns { compatible, conflicts: [{a, b, reason}] }.
 */
export function checkOptionCompatibility(options = []) {
  const conflicts = [];
  for (const o of options) {
    const a = idOf(o);
    for (const inc of o.incompatibilities || []) {
      for (const other of options) {
        const b = idOf(other);
        if (b === a) continue;
        if (b === inc || other.category === inc) {
          conflicts.push({ a, b, reason: `"${a}" declares incompatibility with "${inc}"` });
        }
      }
    }
  }
  return { compatible: conflicts.length === 0, conflicts };
}

/**
 * Check a deployment object for structural validity: the 6-component integrity check
 * must be filled, and a readiness_level should be set. Returns { valid, missing, warnings }.
 */
export function checkDeploymentValidity(deployment = {}) {
  const missing = SIX_COMPONENTS.filter((c) => !deployment[c] || String(deployment[c]).trim() === '');
  const warnings = [];
  if (!deployment.readiness_level) warnings.push('no readiness_level set');
  if ((deployment.disqualifiers || []).length === 0) warnings.push('no disqualifiers declared');
  return { valid: missing.length === 0, missing, warnings };
}

/**
 * Check that a track's composed options compose without conflict.
 * `optionIndex` maps option id -> option object. Returns { composable, conflicts, unresolved }.
 */
export function checkTrackComposition(track = {}, optionIndex = {}) {
  const ids = track.options || [];
  const resolved = ids.map((id) => optionIndex[id]).filter(Boolean);
  const unresolved = ids.filter((id) => !optionIndex[id]);
  const { compatible, conflicts } = checkOptionCompatibility(resolved);
  return { composable: compatible, conflicts, unresolved };
}

export const SIX_STRUCTURAL_COMPONENTS = SIX_COMPONENTS;

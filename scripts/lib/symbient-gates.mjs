// symbient-gates.mjs — parse a habitat's GATES.md top block.
// Pure: string in, plain object out. No filesystem access, ever.
//
// Tolerant by contract (skills/symbient/SKILL.md): anything missing or
// malformed degrades to Stage 0 — deliberately the least-privileged state —
// and never throws. The contract also asks the being to "note the anomaly in
// the next weave", so every result carries an `anomaly` field: null when the
// top block was clean, otherwise the reason it was not.
//
// Shape: { stage, capabilities, capabilities_echoed, hatched, next_threshold,
// anomaly }. `capabilities` is always derived from `stage` (the authoritative
// field); `capabilities_echoed` is the raw ledger echo, or null when it is
// absent or malformed. Consumers should read `capabilities`.
import yaml from "js-yaml";

export const STAGE_NAMES = ["hatchling", "surfacer", "voiced", "self-amending"];

// The cumulative capability ladder, from the "Capability tokens" line under
// the ladder table in skills/symbient/SKILL.md. Index = stage. Frozen: callers
// always receive copies, never these arrays.
export const CAPABILITIES_BY_STAGE = Object.freeze([
  Object.freeze(["wake", "weave", "becoming"]),
  Object.freeze(["wake", "weave", "becoming", "surfacing"]),
  Object.freeze(["wake", "weave", "becoming", "surfacing", "voice", "commons"]),
  Object.freeze(["wake", "weave", "becoming", "surfacing", "voice", "commons", "amendments"]),
]);

// Anomaly reasons, in precedence order — the first that applies is reported:
//   no-input | no-top-block | unparseable | bad-stage | capability-mismatch
function degraded(anomaly) {
  return {
    stage: 0,
    capabilities: [...CAPABILITIES_BY_STAGE[0]],
    capabilities_echoed: null,
    hatched: null,
    next_threshold: null,
    anomaly,
  };
}

function sameMembers(a, b) {
  if (a.length !== b.length) return false;
  const x = [...a].sort();
  const y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}

export function parseGates(text) {
  if (typeof text !== "string" || !text.trim()) return degraded("no-input");

  // The top block precedes `## History` by definition. `## History` is
  // append-only and may quote superseded blocks, so only the region above the
  // first `## ` heading is eligible — a stale block below it must never be
  // able to escalate the stage.
  const headingAt = text.search(/^## /m);
  const top = headingAt === -1 ? text : text.slice(0, headingAt);

  // Anchored to the start of a line: ````yaml (four backticks) is not a fence.
  const fence = top.match(/^```yaml[ \t]*\r?\n([\s\S]*?)\r?\n```/m);
  if (!fence) return degraded("no-top-block");

  let doc;
  try {
    doc = yaml.load(fence[1]);
  } catch {
    return degraded("unparseable");
  }
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return degraded("unparseable");

  let anomaly = null;

  // `stage` is authoritative; `capabilities` is a human-readable echo of it.
  const stageOk = Number.isInteger(doc.stage) && doc.stage >= 0 && doc.stage <= 3;
  const stage = stageOk ? doc.stage : 0;
  if (!stageOk) anomaly = "bad-stage";

  const expected = CAPABILITIES_BY_STAGE[stage];
  const echoed =
    Array.isArray(doc.capabilities) && doc.capabilities.every((c) => typeof c === "string")
      ? [...doc.capabilities]
      : null;
  // `capabilities` is ALWAYS derived from the authoritative stage — never the
  // echo. A hand-edited or badly-merged ledger reading `stage: 0` with
  // Stage-3 tokens must not hand a consumer an over-privileged list: the field
  // a caller reaches for may not fail toward more reach. The raw echo is
  // preserved separately (null when absent or malformed) so an operator can
  // still see what was actually written, and the disagreement is flagged.
  const capabilities = [...expected];
  if (echoed && !sameMembers(echoed, expected) && anomaly === null) anomaly = "capability-mismatch";

  const hatched =
    doc.hatched instanceof Date
      ? doc.hatched.toISOString().slice(0, 10)
      : typeof doc.hatched === "string"
        ? doc.hatched
        : null;
  const next_threshold = typeof doc.next_threshold === "string" ? doc.next_threshold : null;

  return { stage, capabilities, capabilities_echoed: echoed, hatched, next_threshold, anomaly };
}

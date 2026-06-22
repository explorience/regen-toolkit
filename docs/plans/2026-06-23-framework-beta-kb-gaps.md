# Framework Beta + Knowledge Base + GAPS Register — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `@regen-commons/toolkit-framework` to a coherent, try-able **0.1.0-beta.1** with a thorough knowledge base (KB index, getting-started, worked-example, glossary), one valid example per object-schema (each passes `validate`, each test-covered), Appendix A–H instance templates, and a `framework/GAPS.md` register that surfaces coverage, contradictions, points-to-develop, and open questions for the team.

**Architecture:** Purely **additive** to `packages/toolkit-framework/` (+ one new file `framework/GAPS.md`). Zero-build ESM + YAML + markdown — no new dependencies. The only executable change is one new test file (`test/examples.test.mjs`) that validates every example against its schema using the existing `validateObject`. Everything else is documentation/templates derived from the master doc and the existing `framework/` design docs. Live site (`src/`, `main` deploy) is never touched; `npm run build`, `npm test`, and `npm run validate:schemas` stay green.

**Tech Stack:** Node `node --test`, `js-yaml`, markdown. CLI: `node packages/toolkit-framework/src/cli.mjs <list-schemas|kernel-check|check-state|validate|context>`.

**Branch:** `regen-toolkit-os` (parallel dev branch — never touch the `main` deploy). Commit incrementally; push at the end.

---

## Reference: the 21 schemas (the executor must not re-derive these)

**16 OBJECT-schemas** (validatable via `node src/cli.mjs validate <schema> <file>`), with minimal required fields:

| schema | required fields | key enums / axis fields |
|---|---|---|
| `frontmatter` | title, type | maturity·public_use·lifecycle_state (K1 axes); ai_assisted/high_risk (bool) |
| `resource` | title, type | link_status enum: active·broken·redirected·inaccessible·paywalled·archived·duplicate·replacement-needed·unresolved; is_source_system_candidate (bool); maturity (axis) |
| `source-system` | title, type, steward, return_path | type enum: wiki·map·repo·forum·knowledge-garden·directory·archive·database·library·docs-site·convening·podcast·newsletter·dataset |
| `option-entry` | title, type, category | category enum: governance·coordination·organizational-structure·funding-capital·token-incentive·knowledge-documentation·impact-measurement·implementation-operations·experimentation; maturity (axis) |
| `track` | title, type, audience | maturity (axis) |
| `deployment` | title, type, decision_system, information_requirements, power_structure, accountability, failure_detection, boundaries | readiness_level enum: L0-idea·L1-internal-draft·L2-internal-pilot·L3-community-pilot·L4-public-beta·L5-reviewed-deployment·L6-field-informed-pattern |
| `implementation-record` | title, type, source_position | source_position enum: self-report·participant-reflection·funder-review·community-member·affected-community·third-party-observer·public-forum·grant-update·ai-assisted-synthesis·anonymous-or-restricted; record_type enum: pilot·campaign·funding-round·governance·local-node·knowledge-commons·ecological-mrv·event·failure-case; maturity (axis) |
| `claim-evidence` | title, type, claim | maturity·public_use (axes) |
| `evolution-record` | title, type, signal_ref, intervention | intervention enum: preserve·update·route·merge·split·review·restrict·cite·flag·deprecate·archive·compost·remove; maturity (axis) |
| `concept-lineage` | title, type | maturity (axis) |
| `encyclopedia-entry` | title, type, page_type | page_type enum: concept·framework·comparison·guide·case-linked·anti-pattern·frontier; maturity·public_use (axes) |
| `update-proposal` | title, type, target, rationale | decision enum: open·accepted·rejected·deferred·promoted-to-core; review_status (lifecycle_state axis) |
| `signal` | title, signal_type | signal_type enum: content·ontology·resource·option·deployment·track·implementation·public-use·source-system·infrastructure; proposed_intervention enum (same 13 as evolution-record intervention) — NOTE: `signal` requires `type` too because it `extends frontmatter` |
| `contribution-record` | contributor, what, where_it_appears | labor_kind enum: capture·routing·extraction·review·synthesis·maintenance·source-system-reciprocity·implementation-learning·stewardship; improved_public_usefulness/reviewed (bool) — NOTE: `contribution-record` extends frontmatter, so `title` + `type` are also required |
| `provenance` | origin | transformation enum: quoted·summarized·synthesized·translated·remixed·inferred; authorship enum: human-authored·ai-assisted·inferred·reviewed·disputed·deprecated·candidate |
| `public-use-boundary` | tier | tier enum: public·public-with-caveat·restricted-working-notes·private-steward-memory·anonymized-lessons·composted-patterns·never-publish-without-consent |

> **CAUTION — `extends frontmatter` adds required fields.** Every schema that `extends: frontmatter` inherits `required: [title, type]`. So `signal` and `contribution-record` (which the table lists with their own required fields) ALSO require `title` + `type`. `provenance` and `public-use-boundary` do NOT extend frontmatter (they are mixin blocks) — they require only their own fields.

**K1 canonical axis values** (from `schemas/review-maturity.yaml` — examples MUST use these exact strings or `validate` fails):
- `maturity`: raw · draft · candidate · source-linked · reviewed · field-informed · pattern-generating · deprecated · archived
- `public_use`: internal-only · raw-lead · ok-with-caveat · source-linked-unreviewed · reviewed-for-explanation · reviewed-for-guidance · requires-community-consent · requires-domain-review · not-public-yet · deprecated
- `lifecycle_state`: raw-lead · routed · extracted · source-linked · ai-synthesis · human-reviewed · field-informed · public-candidate · mature · compost

**5 STRUCTURAL schemas** (NOT per-instance objects — they are themselves the single canonical instance; do **not** fabricate example instances for these): `core-entities`, `extension-entities`, `kernel-profile`, `relationships`, `review-maturity`.

**Validation contract** (`src/index.mjs`): unknown fields are permitted (open model); `enum` fields reject out-of-set values; `axis` fields reject values not in the named K1 axis; `extends` chains inherit `required` + `fields`. `'canonical'` is deliberately NOT a valid maturity (R1 — old vocab rejected).

---

## Task ordering / dependency graph

```
Task 1 (examples + test) ──┬─> Task 6 (KB index)   ─┐
Task 3 (GLOSSARY) ─────────┘                        │
Task 4 (templates) ────────────────────────────────┘
Task 1 ────────────────────> Task 7 (GETTING-STARTED)
Task 1 ────────────────────> Task 8 (WORKED-EXAMPLE)
Task 2 (version bump)  — independent
Task 5 (GAPS register) — independent
Task 9 (integration: full test + build + validate + push) — last, depends on all
```

Independent tasks (1, 2, 3, 4, 5) may run in parallel; 6/7/8 need Task 1's examples to exist; 9 is last.

---

## Task 1: examples/ — one valid instance per object-schema, with a validating test

**Files:**
- Create: `packages/toolkit-framework/examples/resource.example.yaml` (+ 15 more, one per object-schema, see below)
- Create: `packages/toolkit-framework/examples/README.md`
- Test: `packages/toolkit-framework/test/examples.test.mjs`

- [ ] **Step 1: Write the failing test** that globs every `examples/*.example.yaml`, derives the schema name from the filename, and asserts it validates.

`packages/toolkit-framework/test/examples.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';
import { validateObject, loadSchema } from '../src/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const EXAMPLES = join(here, '..', 'examples');

// Every object-schema (validatable via validateObject) must have exactly one example.
const OBJECT_SCHEMAS = [
  'frontmatter', 'resource', 'source-system', 'option-entry', 'track', 'deployment',
  'implementation-record', 'claim-evidence', 'evolution-record', 'concept-lineage',
  'encyclopedia-entry', 'update-proposal', 'signal', 'contribution-record',
  'provenance', 'public-use-boundary',
];

test('examples/ directory exists', () => {
  assert.ok(existsSync(EXAMPLES), 'examples/ must exist');
});

test('every object-schema has exactly one example file', () => {
  for (const name of OBJECT_SCHEMAS) {
    const f = join(EXAMPLES, `${name}.example.yaml`);
    assert.ok(existsSync(f), `missing example for schema: ${name} (${name}.example.yaml)`);
  }
});

test('every example validates against its schema', () => {
  const files = readdirSync(EXAMPLES).filter((f) => f.endsWith('.example.yaml'));
  assert.ok(files.length >= OBJECT_SCHEMAS.length, 'expected one example per object-schema');
  for (const f of files) {
    const schemaName = f.replace(/\.example\.yaml$/, '');
    const obj = yaml.load(readFileSync(join(EXAMPLES, f), 'utf8'));
    const { valid, errors } = validateObject(schemaName, obj);
    assert.equal(valid, true, `${f} failed validation: ${errors.join('; ')}`);
  }
});

test('no example is written for a structural schema (those have no per-instance form)', () => {
  for (const structural of ['core-entities', 'extension-entities', 'kernel-profile', 'relationships', 'review-maturity']) {
    assert.ok(!existsSync(join(EXAMPLES, `${structural}.example.yaml`)),
      `${structural} is structural — it should not have an example instance`);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/toolkit-framework && node --test test/examples.test.mjs`
Expected: FAIL — `examples/ must exist` (directory not yet created).

- [ ] **Step 3: Create the 16 example files.** Each is realistic ReFi-Web3-Toolkit content so it doubles as documentation. Use the exact enum/axis values from the Reference table above.

`examples/frontmatter.example.yaml`:
```yaml
# The metadata base every entry extends (K3). Shown standalone here for reference.
title: Quadratic Funding
type: concept
maturity: reviewed
public_use: reviewed-for-explanation
lifecycle_state: human-reviewed
ai_assisted: false
high_risk: false
domain: funding-capital
function: explains a mechanism
source_lineage: Gitcoin docs; Buterin/Hitzig/Weyl 2018
steward: funding-concepts-steward
last_reviewed: 2026-06-15
```

`examples/resource.example.yaml`:
```yaml
title: Gitcoin Grants
type: resource
maturity: source-linked
public_use: reviewed-for-explanation
url: https://www.gitcoin.co/grants
resource_type: platform
is_source_system_candidate: true
toolkit_route: option-library/quadratic-funding
link_status: active
original_source: Resource DB V3 row 1182
related_concepts: [quadratic-funding, public-goods-funding]
related_options: [quadratic-funding]
```

`examples/source-system.example.yaml`:
```yaml
# K2 — the federation primitive. return_path is the reciprocity hook (Principle 7).
title: Gitcoin Governance Forum
type: forum
steward: Gitcoin DAO stewards
maturity: reviewed
public_use: reviewed-for-explanation
url: https://gov.gitcoin.co
what_it_curates: governance proposals, funding-round retrospectives, steward debate
why_it_matters: primary record of how quadratic-funding rounds are actually governed
how_to_credit: link the thread; name the proposal authors
use_type: reference + implementation-memory source
reuse_conditions: public; attribute the forum thread
return_path: post corrections and derived implementation-records back to the forum thread
update_rhythm: continuous
extraction_status: partially-extracted
toolkit_route: layer-3-resource-graph
```

`examples/option-entry.example.yaml`:
```yaml
title: Quadratic Funding
type: option
category: funding-capital
maturity: field-informed
use_cases: allocating a matching pool to many small public-goods projects by community preference
not_for: small grantee sets; contexts with weak sybil resistance
scale: community to ecosystem
context: requires a matching pool and identity/sybil mitigation
required_deployment_checks: [sybil-resistance, matching-pool-source, eligibility-rules]
common_pairings: [retroactive-public-goods-funding, passport-sybil-defense]
incompatibilities: [pure-1p1v-without-identity]
failure_modes: [sybil-collusion, whale-distortion-without-caps]
related_concepts: [quadratic-funding, public-goods-funding]
```

`examples/track.example.yaml`:
```yaml
title: Fund public goods in your local node
type: track
audience: a local ReFi node treasurer with a small matching pool
maturity: draft
starting_context: you have a treasury and want to allocate it to community projects
outcome: a chosen funding option with its deployment checks surfaced
concepts: [public-goods-funding, quadratic-funding, sybil-resistance]
options: [quadratic-funding, retroactive-public-goods-funding]
deployment_checks: [sybil-resistance, matching-pool-source, eligibility-rules]
failure_modes: [sybil-collusion, whale-distortion-without-caps]
```

`examples/deployment.example.yaml`:
```yaml
# Deployment requires the 6 minimum-structural fields (the "valid only if visible" rule).
title: ReFi BCN Q3 community matching round
type: deployment
decision_system: stewards propose eligibility; community ranks via quadratic vote
information_requirements: project applications, sybil/passport scores, matching-pool balance
power_structure: 3 stewards (separation of duties); no single steward can release funds
accountability: public round retrospective + on-chain disbursement record
failure_detection: collusion-cluster detection + post-round dispute window
boundaries: matching formula fixed; pool size configurable; eligibility rules experimental
selected_options: [quadratic-funding, passport-sybil-defense]
readiness_level: L3-community-pilot
disqualifiers: [no-sybil-mitigation, undisclosed-matching-source]
evidence_requirements: [sybil-score-distribution, pre-round-eligibility-list]
risks: [collusion, low-turnout-distortion]
```

`examples/implementation-record.example.yaml`:
```yaml
title: ReFi BCN Q2 matching round — what actually happened
type: implementation-record
source_position: participant-reflection
maturity: field-informed
record_type: funding-round
related_deployment: ReFi BCN Q2 community matching round
related_track: Fund public goods in your local node
context: 18 projects, 240 voters, 4 ETH matching pool
what_worked: small projects with real community ties got meaningfully matched
what_failed: two collusion clusters required manual review and partial clawback
adaptations: added a pre-round passport threshold and a dispute window mid-round
what_returns_to_commons: a sybil-threshold heuristic + a dispute-window option variant
```

`examples/claim-evidence.example.yaml`:
```yaml
title: Quadratic funding increases small-donor influence
type: claim-evidence
claim: QF shifts allocation toward projects with many small supporters vs few large ones
evidence: Gitcoin round data showing match curves favoring breadth of support
source_lineage: Gitcoin round retrospectives; Buterin/Hitzig/Weyl 2018
interpretation: holds where sybil resistance is adequate; degrades under collusion
uncertainty: effect size varies widely by round design and identity rigor
reviewed_by: funding-concepts-steward
maturity: source-linked
public_use: reviewed-for-explanation
```

`examples/evolution-record.example.yaml`:
```yaml
title: Add a dispute-window variant after Q2 collusion
type: evolution-record
signal_ref: signal/q2-collusion-clusters
intervention: update
maturity: field-informed
affected_layer: layer-4-option-library
interpretation: collusion under QF is a recurring failure mode, not a one-off
integration_note: added dispute-window as a common pairing on the quadratic-funding option
memory_note: keep the Q2 clawback as a cited implementation-record
```

`examples/concept-lineage.example.yaml`:
```yaml
title: Regeneration
type: concept-lineage
maturity: reviewed
short_description: restoring the capacity of a living system to renew itself
source_traditions: [ecology, Indigenous land stewardship, regenerative agriculture, systems thinking]
toolkit_usage: a directional commitment, not a measurable certification claim
adjacent_meanings: [sustainability, restoration, resilience]
important_distinctions: [regeneration-is-not-sustainability, regeneration-is-not-offsetting]
tensions: [marketing-overclaim-vs-evidenced-ecological-change]
risks_of_flattening: collapsing diverse traditions into a single web3 buzzword
```

`examples/encyclopedia-entry.example.yaml`:
```yaml
title: Quadratic Funding
type: encyclopedia-entry
page_type: concept
maturity: reviewed
public_use: reviewed-for-explanation
summary: a matching mechanism that weights community breadth over donation size
audience: contributors choosing a funding option for a public-goods pool
known_tensions: [sybil-resistance-cost, plutocracy-vs-breadth]
related_concepts: [public-goods-funding, sybil-resistance]
related_resources: [gitcoin-grants]
```

`examples/update-proposal.example.yaml`:
```yaml
title: Promote sybil-resistance from tag to Layer-A concept
type: update-proposal
target: schemas/core-entities.yaml
rationale: sybil-resistance now changes routing + review across funding options, meeting the type-vs-tag gate
proposed_change: add `sybil-resistance` as a concept with crosswalk to existing tags
maps_to_core: concept
review_status: routed
decision: open
```

`examples/signal.example.yaml`:
```yaml
# signal extends frontmatter, so `type` is required alongside `signal_type`.
title: Q2 round showed collusion clusters
type: signal
signal_type: option
affected_layer: layer-4-option-library
interpretation: QF without strong identity invites collusion — recurring, not incidental
proposed_intervention: route
```

`examples/contribution-record.example.yaml`:
```yaml
# contribution-record extends frontmatter (title+type required) + its own required fields.
title: added Gitcoin Governance Forum source-system card
type: contribution-record
contributor: luiz
what: a source-system card for the Gitcoin Governance Forum
where_it_appears: data/source-systems.yaml
labor_kind: capture
improved_public_usefulness: true
source_system_reciprocity: agreed to post derived implementation-records back to the forum
reviewed: false
```

`examples/provenance.example.yaml`:
```yaml
# provenance is a mixin block (does NOT extend frontmatter); only `origin` is required.
origin: Gitcoin Grants documentation
surfaced_by: capture-and-route over the Resource DB V3
adapted_from: Gitcoin docs + round retrospectives
transformation: summarized
authorship: ai-assisted
```

`examples/public-use-boundary.example.yaml`:
```yaml
# public-use-boundary is a mixin block (does NOT extend frontmatter); only `tier` is required.
tier: public-with-caveat
consent_note: clearing-house figures are illustrative; verify against the live round before quoting
review_type: domain-review-for-funding-claims
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/toolkit-framework && node --test test/examples.test.mjs`
Expected: PASS (4 tests). If any example fails, read the named schema file in `schemas/` and fix the offending enum/axis/required value, then re-run. **Do not weaken the test** — fix the example.

- [ ] **Step 5: Spot-check via the real CLI** (proves the documented command works):

Run: `cd packages/toolkit-framework && node src/cli.mjs validate source-system examples/source-system.example.yaml`
Expected: `✓ valid (source-system)`

Run: `node src/cli.mjs validate deployment examples/deployment.example.yaml`
Expected: `✓ valid (deployment)`

- [ ] **Step 6: Write `examples/README.md`** — a short index:

```markdown
# examples/

One valid instance per **object-schema** — each validates with
`node src/cli.mjs validate <schema> examples/<schema>.example.yaml`
and is covered by `test/examples.test.mjs`.

These double as documentation: copy one, edit the fields, validate.

| example | schema | what it shows |
|---|---|---|
| `frontmatter.example.yaml` | frontmatter (K3) | the metadata base every entry extends |
| `resource.example.yaml` | resource | a found thing (project/tool/paper) routed into the toolkit |
| `source-system.example.yaml` | source-system (K2) | a peer knowledge environment + the `return_path` reciprocity hook |
| `option-entry.example.yaml` | option-entry | a reusable funding/governance component |
| `track.example.yaml` | track | a guided pathway for an audience |
| `deployment.example.yaml` | deployment | a specified config with the 6 minimum-structural fields |
| `implementation-record.example.yaml` | implementation-record | what actually happened in practice |
| `claim-evidence.example.yaml` | claim-evidence | a claim with evidence + uncertainty |
| `evolution-record.example.yaml` | evolution-record | a signal interpreted and acted on |
| `concept-lineage.example.yaml` | concept-lineage | a concept's traditions, distinctions, tensions |
| `encyclopedia-entry.example.yaml` | encyclopedia-entry | an explanatory page |
| `update-proposal.example.yaml` | update-proposal | a proposed kernel/content change |
| `signal.example.yaml` | signal | a learning/correction that may update the commons |
| `contribution-record.example.yaml` | contribution-record (K5) | a durable contribution attestation + reciprocity |
| `provenance.example.yaml` | provenance | a source-lineage block (mixin) |
| `public-use-boundary.example.yaml` | public-use-boundary | a visibility tier (mixin) |

**Structural schemas** (`core-entities`, `extension-entities`, `kernel-profile`,
`relationships`, `review-maturity`) have no per-instance examples — each schema file
*is* the single canonical instance. Inspect them directly or via
`node src/cli.mjs kernel-check` / `list-schemas` / `context`.
```

- [ ] **Step 7: Commit**

```bash
git add packages/toolkit-framework/examples packages/toolkit-framework/test/examples.test.mjs
git commit -m "feat(framework): examples/ — one validating instance per object-schema + test"
```

---

## Task 2: Beta version bump + README/status polish

**Files:**
- Modify: `packages/toolkit-framework/package.json:3` (version)
- Modify: `packages/toolkit-framework/README.md` (status line + the stale "What's here (v0.0.1)" heading)

- [ ] **Step 1: Confirm all schemas already carry a `description`** (the handoff asks to add any missing — verify it's a no-op):

Run: `cd packages/toolkit-framework && for f in schemas/*.yaml; do grep -Lq '^description:' "$f" && echo "MISSING description: $f"; done; echo "check complete"`
Expected: `check complete` with no `MISSING` lines. (Structural schemas `core-entities`/`extension-entities`/`kernel-profile`/`relationships`/`review-maturity` use top-level `description:` too — if any genuinely lacks one, add a one-line `description:` derived from its header comment, then re-run `node --test`.)

- [ ] **Step 2: Bump the version** in `packages/toolkit-framework/package.json`:

Change line 3 from:
```json
  "version": "0.1.0",
```
to:
```json
  "version": "0.1.0-beta.1",
```

- [ ] **Step 3: Update the README status line + fix the stale heading.** In `packages/toolkit-framework/README.md`:

Change the status line (line 5) from `**Status: v0.1.0 — fully built (SP0–SP10), 34/34 tests green.**` to:
```markdown
> **Status: v0.1.0-beta.1 — try-able beta.** Semantic kernel + 21 schemas + compatibility engine + 3 agentic skills + lift ETL + full architecture/process docs, now with a knowledge base ([`docs/`](docs/README.md)), one validating [`examples/`](examples/) instance per object-schema, Appendix A–H instance [`templates/`](templates/instance/), and a gaps register ([`framework/GAPS.md`](../../framework/GAPS.md)). Tests green. Grows dialectically through adoption (first: ReFi DAO). Design: [`framework/`](../../framework/) · [build plan](../../docs/plans/framework-build/README.md).
```

Change the stale section heading `## What's here (v0.0.1)` to `## What's here (the keystones)`.

Add a "Knowledge base" pointer near the top of "Install / use", immediately after the code fence:
```markdown
**New here? Start with the [knowledge base](docs/README.md)** → [`GETTING-STARTED`](docs/GETTING-STARTED.md) · [`WORKED-EXAMPLE`](docs/WORKED-EXAMPLE.md) · [`GLOSSARY`](docs/GLOSSARY.md).
```

- [ ] **Step 4: Verify the version is live in the CLI and tests still pass**

Run: `cd packages/toolkit-framework && node src/cli.mjs version`
Expected: `0.1.0-beta.1`

Run: `node --test`
Expected: all tests pass (the pre-existing suite + the new `examples.test.mjs` from Task 1).

- [ ] **Step 5: Commit**

```bash
git add packages/toolkit-framework/package.json packages/toolkit-framework/README.md
git commit -m "chore(framework): bump to 0.1.0-beta.1 + KB pointers in README"
```

---

## Task 3: docs/GLOSSARY.md — the load-bearing terms

**Files:**
- Create: `packages/toolkit-framework/docs/GLOSSARY.md`

Source material — master doc **Appendix H** (lines 28945–28974) plus the expanded definitions the executor must fold in. The glossary is a real, populated KB reference doc (distinct from `templates/instance/glossary.md`, which is a fill-in starter for instances).

- [ ] **Step 1: Write `packages/toolkit-framework/docs/GLOSSARY.md`** with these entries. Each entry: the term, a one-line definition (from Appendix H), and a "in the framework" line pointing to the schema/doc that encodes it. Use exactly these definitions:

```markdown
# Glossary — load-bearing terms

The terms this framework treats as load-bearing. Definitions trace the master doc
(Appendix H, lines 28945–28974) and the framework's own schemas/docs. When a term
maps to a schema or architecture doc, the **In the framework** line points there.

## The five kernel objects (the Minimum Operating Kernel)

- **Resource** — *something found that may be useful.* A link, article, tool, paper, map, organization, event, or project. A resource entry is **not** automatically endorsed. — In the framework: `schemas/resource.yaml`, `architecture/kernel-objects.md`.
- **Concept** — *something explained.* Helps people understand meaning, context, frameworks, comparisons, common confusions. — In the framework: `schemas/concept-lineage.yaml` / `schemas/encyclopedia-entry.yaml`.
- **Option** — *something reusable.* A governance, coordination, funding, documentation, measurement, incentive, or operational pattern that can be reused. An option is **not** automatically a deployment. — In the framework: `schemas/option-entry.yaml`.
- **Deployment** — *a specified configuration for use.* Makes roles, authority, decisions, risks, obligations, and review conditions explicit. Valid **only if** the required structures are explicitly defined and visible. A deployment is **not** automatically an implementation. — In the framework: `schemas/deployment.yaml`.
- **Signal** — *something learned or flagged.* Feedback, observation, failure, risk, correction, or learning that may update the commons — interpreted before it modifies anything. — In the framework: `schemas/signal.yaml`, `process/evolution-loop.md`.

## Core distinctions

- **Source** vs **Source system** — a *source* may be one artifact; a **source system** is a *living knowledge environment* (wiki, forum, directory, repo, map, podcast archive, governance forum, knowledge garden) that curates/maintains knowledge over time. Treated as a **peer, not an extractable link pool**; return paths + attribution are essential. — In the framework: `schemas/source-system.yaml` (K2).
- **Track** vs **Deployment** — a **track** is a *guided pathway* across resources, concepts, options, and templates (tracks *prepare*); a **deployment** is a *specific configuration in a real context* (deployments *specify*). — In the framework: `schemas/track.yaml`, `schemas/deployment.yaml`.
- **Deployment** vs **Implementation** — a deployment is the *specified structure*; an **implementation** is *what actually happened in practice*, including the gap between plan and reality. An implementation case is **not** automatically a reusable pattern. — In the framework: `schemas/implementation-record.yaml`.
- **Signal** vs **Metric** — a signal is an *observed indicator that something may need interpretation* (can be qualitative, weak, ambiguous, early); a metric is a *formalized measure*. — In the framework: `process/evolution-loop.md`.

## State & trust vocabulary (K1 — three orthogonal axes)

- **Maturity** — how developed/trustworthy the content itself is: raw → draft → candidate → source-linked → reviewed → field-informed → pattern-generating (ceiling) → deprecated → archived. Maturity is **not** for shaming rough work; it tells people how to use something responsibly. — In the framework: `schemas/review-maturity.yaml` axis `maturity`.
- **Public-use boundary** — whether something is safe to expose: public · public-with-caveat · restricted-working-notes · private-steward-memory · anonymized-lessons · composted-patterns · never-publish-without-consent. — In the framework: `schemas/public-use-boundary.yaml` + `review-maturity.yaml` axis `public_use`.
- **Lifecycle state** — where an item sits in the intake→compost pipeline: raw-lead → routed → extracted → source-linked → ai-synthesis → human-reviewed → field-informed → public-candidate → mature → compost. — In the framework: `review-maturity.yaml` axis `lifecycle_state`.
- **ai_assisted / high_risk** — orthogonal boolean **flags**, not states (Principle 14). — In the framework: `review-maturity.yaml` `flags`.

## Ontology terms

- **Layer A / core entity** — the *smallest safe shared base*: ~15 broadly-useful entity types every fork inherits unchanged, kept stable + interoperable (aligned with Octo/BKC where feasible). The fork-compatibility contract. — In the framework: `schemas/core-entities.yaml`, `architecture/ontology-posture.md`.
- **Layer B / extension entity** — opinionated Toolkit types, each declaring `maps_to_core` back to a Layer-A type; locally extensible without breaking interop. — In the framework: `schemas/extension-entities.yaml`.
- **Minimum Operating Kernel (MOK)** — the five core working objects (Resource · Concept · Option · Deployment · Signal) as a v0.1 *authoring front door*. NOT a separate type system — a curated usage-layer subset of the full ontology (R3). — In the framework: `schemas/kernel-profile.yaml`, `architecture/kernel-objects.md`.

## Integrity & governance

- **CSIS-informed** — *influenced by CSIS concerns and language without claiming conformance.* — In the framework: `process/csis-safeguards.md` (R7).
- **CSIS-conformant** — *assessed against the actual CSIS standards, dependencies, enforcement logic, and violation-detection criteria.* The framework is CSIS-**informed**, not conformant; CSIS is a **separable optional overlay**. — In the framework: `process/csis-safeguards.md`.
- **Knowledge coordination friction** — the difficulty of finding, understanding, verifying, reusing, adapting, and connecting knowledge to action across fragmented systems (the problem the toolkit addresses). — In the framework: `architecture/problems-and-theory-of-change.md`.
- **Knowledge commons** — shared knowledge infrastructure maintained through use, contribution, correction, attribution, stewardship, and learning. — In the framework: `architecture/README.md`.

> **Term not here?** If a term changes routing, relationships, review, templates, permissions, or logic, it likely deserves a **type** (and an entry); otherwise it's a **tag**. See `architecture/type-tag-discipline.md`.
```

- [ ] **Step 2: Verify every schema path referenced above exists** (no dead links):

Run: `cd packages/toolkit-framework && for s in resource concept-lineage encyclopedia-entry option-entry deployment signal source-system track implementation-record review-maturity public-use-boundary core-entities extension-entities kernel-profile; do test -f "schemas/$s.yaml" || echo "MISSING schemas/$s.yaml"; done; for d in kernel-objects ontology-posture type-tag-discipline problems-and-theory-of-change README; do test -f "architecture/$d.md" || echo "MISSING architecture/$d.md"; done; for p in evolution-loop csis-safeguards; do test -f "process/$p.md" || echo "MISSING process/$p.md"; done; echo "link check complete"`
Expected: `link check complete` with no `MISSING` lines.

- [ ] **Step 3: Commit**

```bash
git add packages/toolkit-framework/docs/GLOSSARY.md
git commit -m "docs(framework): GLOSSARY — load-bearing terms (Appendix H + schema map)"
```

---

## Task 4: templates/instance/ — the Appendix A–H fill-in templates

**Files:**
- Create: `packages/toolkit-framework/templates/instance/source-system-card.md` (App A)
- Create: `packages/toolkit-framework/templates/instance/resource-registry-entry.md` (App B)
- Create: `packages/toolkit-framework/templates/instance/deep-intake.md` (App C)
- Create: `packages/toolkit-framework/templates/instance/option-entry.md` (App D)
- Create: `packages/toolkit-framework/templates/instance/deployment.md` (App E)
- Create: `packages/toolkit-framework/templates/instance/implementation-memory.md` (App F)
- Create: `packages/toolkit-framework/templates/instance/social-signal-scan.md` (App G)
- Create: `packages/toolkit-framework/templates/instance/glossary.md` (App H starter)
- Create: `packages/toolkit-framework/templates/instance/README.md` (index)

Each template is a **fill-in markdown form** whose fields come from the named master-doc appendix and align to the corresponding schema (so a filled template can be transcribed into a validating YAML object). Field lists below are authoritative — use them verbatim as form labels.

- [ ] **Step 1: `source-system-card.md`** (App A → `source-system` schema). Fields: Name · URL · Steward / maintainer · Type of source system · Domain and scope · Why it matters · What it contains · Update rhythm · Extraction status · Attribution and reuse needs · Public-use cautions · Possible return path · Suggested Toolkit route · Related concepts · Related options · Related implementation records · Review status · Open questions. Template shape:

```markdown
# Source-System Card — <name>

> Appendix A. A source system is a **living knowledge environment treated as a peer**,
> not an extractable link pool. Schema: `schemas/source-system.yaml` (K2).
> Validate a transcribed YAML with `node src/cli.mjs validate source-system <file>`.

- **Name:**
- **URL:**
- **Steward / maintainer:**            <!-- schema: steward (required) -->
- **Type of source system:**          <!-- schema: type — wiki·map·repo·forum·knowledge-garden·directory·archive·database·library·docs-site·convening·podcast·newsletter·dataset (required) -->
- **Domain and scope:**
- **Why it matters:**
- **What it contains / curates:**
- **Update rhythm:**
- **Extraction status:**
- **Attribution and reuse needs:**     <!-- schema: how_to_credit / reuse_conditions -->
- **Public-use cautions:**
- **Possible return path:**            <!-- schema: return_path (required) — the reciprocity hook -->
- **Suggested Toolkit route:**
- **Related concepts:**
- **Related options:**
- **Related implementation records:**
- **Review status:**                   <!-- maturity / public_use (K1 axes) -->
- **Open questions:**
```

- [ ] **Step 2: `resource-registry-entry.md`** (App B → `resource` schema). Fields: registry ID · original source file · original sheet/tab · original row · original column · original cell text · extracted name · extracted URL · type · category · tags · source-system candidate? · provenance · link status · review status · public-use status · attribution needs · source steward · license/reuse condition · last checked · suggested route · related concepts · related options · related implementation records · notes. Same shape (heading + `> Appendix B … Schema: schemas/resource.yaml` + bulleted fields with schema-field comments on `extracted name`→title, `type`, `link status`→link_status enum, `source-system candidate?`→is_source_system_candidate, `suggested route`→toolkit_route).

- [ ] **Step 3: `deep-intake.md`** (App C → the `capture-and-route` skill). Fields: Submitted thing · Submitted by · Source/URL · What is this as a whole? · What source system does it belong to? · What concepts does it explain? · What resources are inside it? · What tools/projects/orgs are referenced? · What options or mechanisms are present? · What claims are made? · What evidence is offered? · Does it describe an implementation? · Does it surface signals/risks/failures/open questions? · What should be public/restricted/anonymized/reviewed? · Suggested routes · Review status. Header note: `> Appendix C. This is the form the capture-and-route skill fills (skills/capture-and-route/SKILL.md). One input → many typed objects.`

- [ ] **Step 4: `option-entry.md`** (App D → `option-entry` schema). Fields: Name · Short description · Option category · What it helps with · Useful when · Risky when · Required conditions · Incompatible or risky combinations · Related concepts · Source lineage · Example implementations · Failure modes · Public-use cautions · Maturity/review state · Deployment questions · Open questions. Comment the category field with the 9-value enum and `required deployment checks`→required_deployment_checks.

- [ ] **Step 5: `deployment.md`** (App E → `deployment` schema). Fields: Deployment name · Purpose · Context · Who it is for · Selected options · Roles · Decision process · Authority and control points · Funding/treasury flows · Data and privacy requirements · Public-use boundaries · Source lineage · Assumptions · Risks · Failure modes · Disqualifiers · Evidence requirements · Implementation plan · Maintenance plan · Review process · Pause/rollback/escalation path · Learning signals · Readiness level · Open questions. **Header note must state the minimum-structural rule:** `> Appendix E. A deployment is valid only if the 6 minimum structures are explicit + visible: decision_system, information_requirements, power_structure, accountability, failure_detection, boundaries. Schema: schemas/deployment.yaml.` Map: Decision process→decision_system, Authority and control points→power_structure, Readiness level→readiness_level (L0–L6 enum).

- [ ] **Step 6: `implementation-memory.md`** (App F → `implementation-record` schema). Fields: Implementation name · Location/context · Group or project · Timeframe · Source position · What was attempted · Why it was attempted · Options used · Deployment assumptions · What happened · Evidence · What worked · What failed · Surprises · Unresolved tensions · Who was affected · What should change next time · What should return to the commons · Public-use boundary · Review status. Comment `Source position`→source_position enum, `What should return to the commons`→what_returns_to_commons.

- [ ] **Step 7: `social-signal-scan.md`** (App G → `signal` schema). Fields: Source account · Date · Post URL · Retweeted/quoted account · Referenced organization/project/tool/event/resource · Included link · Theme · Signal type · Suggested Toolkit route · Source-system candidate? · Person-node caution? · Notes · Review status. Header: `> Appendix G. Captures discovery leads / bridge figures / emerging themes. Schema: schemas/signal.yaml. NOTE the person-node caution (Principle: people are not extractable link pools).`

- [ ] **Step 8: `glossary.md`** (App H starter — an instance fills/extends with its domain terms). Header note: `> Appendix H starter. Seed your instance glossary from the framework glossary (docs/GLOSSARY.md), then add domain terms. Keep definitions one line; flag any term that should become a TYPE (see architecture/type-tag-discipline.md).` Then a 2-column table pre-seeded with the cross-instance terms (Source system, Resource, Concept, Option, Track, Deployment, Implementation, Signal, Public-use boundary, CSIS-informed, CSIS-conformant) and a blank row marker `| <your term> | <one-line definition> |` for instance additions.

- [ ] **Step 9: `README.md`** — the templates index:

```markdown
# templates/instance/

Fill-in markdown forms for standing up an instance. Each maps to a master-doc
**Appendix** and to a framework **schema** — fill the form, transcribe to YAML,
then `node src/cli.mjs validate <schema> <file>`.

| template | master-doc | schema | object |
|---|---|---|---|
| `source-system-card.md` | Appendix A | `source-system` (K2) | a peer knowledge environment |
| `resource-registry-entry.md` | Appendix B | `resource` | a found resource, with provenance |
| `deep-intake.md` | Appendix C | (capture-and-route skill) | one input → many typed objects |
| `option-entry.md` | Appendix D | `option-entry` | a reusable component |
| `deployment.md` | Appendix E | `deployment` | a specified, valid-only-if-visible config |
| `implementation-memory.md` | Appendix F | `implementation-record` | what actually happened |
| `social-signal-scan.md` | Appendix G | `signal` | a discovery / learning lead |
| `glossary.md` | Appendix H | — | instance glossary starter |

See also: populated framework glossary at [`docs/GLOSSARY.md`](../../docs/GLOSSARY.md),
validating examples at [`examples/`](../../examples/).
```

- [ ] **Step 10: Verify the templates round-trip** — confirm the 8 templates + README exist and the schema references in them are real:

Run: `cd packages/toolkit-framework && ls templates/instance/ && for s in source-system resource option-entry deployment implementation-record signal; do test -f "schemas/$s.yaml" || echo "MISSING schemas/$s.yaml"; done; echo "templates check complete"`
Expected: 9 files listed; `templates check complete` with no `MISSING` lines.

- [ ] **Step 11: Commit**

```bash
git add packages/toolkit-framework/templates
git commit -m "docs(framework): templates/instance — Appendix A–H fill-in forms"
```

---

## Task 5: framework/GAPS.md — the gaps / contradictions / points-to-develop register

**Files:**
- Create: `framework/GAPS.md`

This is the artifact Matty + the group review. Source material is below — the executor must **not** re-derive it. Frame each item as **a concrete question + our recommendation** so it's easy to decide. The four sections map to the handoff's (a)–(d).

- [ ] **Step 1: Write `framework/GAPS.md`** with this structure and content:

**Header** — what this is, how to read it, where it comes from (`framework/COVERAGE.md`, `framework/RECONCILIATIONS.md`, `framework/FEEDBACK-LOOPS.md`, and gaps surfaced while building the beta). State the cadence: these batch into the next master-doc iteration as **draft-and-present proposals** (never edit `docs/MASTER.md` directly — Loop 2).

**(a) Coverage — what the framework covers vs the master doc.** Point to `framework/COVERAGE.md` as the authoritative map. Summarize the keystones table (K1–K8) with one-line status each:
- K1 `review-maturity` — canonical state model (3 axes + flags) — **built** (`schemas/review-maturity.yaml`).
- K2 `source-system` — federation primitive w/ `return_path` — **built**.
- K3 `frontmatter` — shared metadata base — **built**.
- K4 semantic kernel — core+extension entities, relationships, kernel-profile, JSON-LD context, fork-compat validator — **built** (lift needs the real V3 review pass).
- K5 `contribution-record` — durable attestation + reciprocity hook — **built**.
- K6 compatibility engine (`src/compatibility.mjs`) — option×option / track / deployment validity — **built**.
- K7 `capture-and-route` skill — raw lead → typed objects — **built** (skill spec; not yet exercised at scale).
- K8 the 16 distinctions + minimum structural rule — **built** (`architecture/invariants.md` + `src/invariants.mjs`).
State plainly: **all 8 keystones exist and pass tests; what remains is depth, real-content exercise, and the group's ratification of the reconciliations below.**

**(b) Contradictions in the master doc that need the group's call** — the R1–R10 reconciliations as plain-language decisions. For each, write: **the contradiction**, **our resolution**, **the decision we need** (ratify / amend), and **who** (Matt/Durgadas/Rather/Heenal). Use this content:

- **R1 (the big one) — Maturity vocabulary.** Contradiction: ~7+ divergent maturity/state ladders across the doc (ontology 5, master-doc 13, Encyclopedia 8, Resource-Graph 13, Option 9, Track 7, Deployment L0–L6, Concept 9, Implementation 9, contribution 10, public-use 10). Resolution: **three orthogonal axes** — `maturity` (9), `public_use` (10), `lifecycle_state` (10) — + two boolean flags (`ai_assisted`, `high_risk`); every per-layer ladder crosswalks to `maturity`. Decision: **ratify collapsing the scattered ladders into these three named axes** in Cross-Cutting Principles + each layer section. Owner: Matt (+ Durgadas on public_use tiers). *Biggest single feedback item.*
- **R2 — Three trust axes conflated.** Contradiction: maturity-state vs public-use-status vs contribution-lifecycle-state used interchangeably. Resolution: model as **independent fields** (resolved with R1). Decision: ratify keeping them orthogonal. Owner: Matt.
- **R3 — Kernel vs ontology.** Contradiction: the 5-object kernel reads as separate from the ~45-type ontology. Resolution: **MOK is a curated authoring profile ("front door"), not a parallel type system** — the 5 most-used entity types promoted as the v0.1 entry surface. Decision: state explicitly that MOK is a usage-layer subset. Owner: Matt.
- **R4 — 10 vs 11 layers.** Contradiction: next working draft splits Source-System Registry into its own layer; the canonical table folds it into L3. Resolution: **10 layers; Source-System Registry = sub-layer L3a.** Decision: confirm 10. Owner: Matt/Heenal. (No master-doc edit strictly required — architecture doc clarifies.)
- **R5 — Layer sequence vs object loop ordering.** Contradiction: "Deployment → Tracks" (layer sequence) vs "Track → Deployment" (object/Compose→Specify loop). Resolution: **lifecycle is the human spine, layer sequence is the data-model view**; a bridge table reconciles them (`architecture/operating-loop.md`). Decision: accept both views + document the bridge. Owner: Heenal/Matt.
- **R6 — Cross-cutting stated twice.** Contradiction: the 9-row cross-cutting-systems table ≈ the 18 principles. Resolution: **encode once — the 18 principles are the home;** the 9-row table is a coarser rollup. Decision: accept. Owner: Matt.
- **R7 — CSIS/Octo posture mismatch.** Contradiction: `data/ontology/*.yaml` hardcodes "MUST resolve to Octo base" + firm `csis_requirement`, but the master doc softened to "Octo candidate, CSIS-informed not conformant." Resolution: **adopt the master-doc posture** — framework defines its own kernel + ships crosswalks; `maps_to_core` encouraged but optional; CSIS = separable optional overlay. Decision: ratify CSIS-informed-not-conformant as the standing posture. Owner: Durgadas.
- **R8 — Role lists.** Contradiction: §15 (12 roles), §13.9 (11), §17 (17) diverge. Resolution: **one reconciled superset — 19 scoped roles** with an "appears in" provenance column (`process/roles.md`). Decision: adopt the single role registry. Owner: Matt.
- **R9 — Two relationship grammars.** Contradiction: `data/ontology/relationships.yaml` (formal-semantic) vs master §6.3 (contributor-facing). Resolution: **unify into one `relationships.yaml`** — `core_interop` + domain groups + separable optional `governance_csis` module. Decision: unify the two grammars. Owner: Matt/Durgadas.
- **R10 — Wrong feedback loop.** Contradiction: `data/feedback-process.yaml` (Capture/Classify/Review/Update/Communicate/Version) vs the master-doc adaptive loop. Resolution: **adopt the canonical adaptive loop** — Signal→Sensemaking→Balance→Intervention→Integration→Memory (`process/evolution-loop.md`); retire the old one. Decision: codify the canonical loop. Owner: Matt.

**(c) Points-to-develop — what's a stub/scaffold vs done.** As concrete next-steps with our recommendation:
- `org-os-kms` is a **scaffold** (module + profile, 2/2 tests) — real org-os binding pending first adoption. Recommendation: develop against ReFi DAO adoption (Loop 3).
- Crosswalks (`octo`/`superbenefit`/`csis`) are **starters** — need a real mapping pass. Recommendation: fill during the V3 lift review.
- The **lift ETL** ran but the resource DB needs the **real V3 review pass** (28 CSVs / 12,456 rows; raw never auto-promoted). Recommendation: schedule the human review pass before publishing lifted resources.
- Reward-economy is **design-seed only**. Recommendation: keep as design-seed until an instance needs it.
- The 3 skills (`capture-and-route`, `compose-journey`, `csis-review`) are **spec-complete but not exercised at scale** — and `type-tag-discipline.md` is concise. Recommendation: deepen with worked examples as adoption surfaces them (the beta `WORKED-EXAMPLE.md` is the first).
- `data/option-library.yaml` is a **9-category stub**; `data/sources.yaml` is **mis-shaped** (do not build on). Recommendation: enrich the option library to 10 real entries (already a backlog item); reshape sources to the `source-system` schema.

**(d) Open questions surfaced by building.** Each as a question + our recommendation:
- **D1 — architecture spine:** the 10 layers OR the Knowledge Lifecycle as the framework's primary spine? Recommendation (per master doc Structure Options): **lifecycle as the spine, layers as the data-model view** — both documented via the bridge table. Decide before deepening `architecture/`.
- **Layer-A core membership: 12 vs 15?** The kernel currently freezes 15 core types. Recommendation: keep 15 for the beta; treat any reduction as a governed Layer-A change (breaking).
- **Schema serialization format:** YAML now; do we also ship JSON Schema / SHACL for external consumers? Recommendation: keep YAML as source of truth + generate JSON-LD `@context` (already supported via `node src/cli.mjs context`); add JSON Schema export only if an adopter needs it (YAGNI).
- **Steward: phase or cross-cut?** Is "Steward" a lifecycle phase or a cross-cutting role? Recommendation: cross-cutting role (it appears across phases) — encoded in `process/roles.md`.
- **Package name/scope + `org-os-kms` home + repo-mirror timing** (PLACEMENT.md §8): recommendation — keep `@regen-commons/toolkit-framework`, develop `org-os-kms` here, mirror to a public repo when stable.
- **Journey site generator: framework or instance?** (SEPARATION.md). Recommendation: generator = framework, the 3 ReFi journeys = instance. Heenal to confirm.

**Footer — Top 5 decisions we need from the group** (the executable ask): R1 (three-axis maturity model), R7 (CSIS-informed posture), R8 (single 19-role registry), R3 (MOK-as-subset), and D1 (lifecycle-as-spine). Each one line: the question + our recommendation.

- [ ] **Step 2: Verify the cross-referenced design docs exist** (GAPS points to them):

Run: `cd "$(git rev-parse --show-toplevel)" && for f in framework/COVERAGE.md framework/RECONCILIATIONS.md framework/FEEDBACK-LOOPS.md framework/PLACEMENT.md; do test -f "$f" || echo "MISSING $f"; done; echo "gaps xref check complete"`
Expected: `gaps xref check complete` with no `MISSING` lines.

- [ ] **Step 3: Commit**

```bash
git add framework/GAPS.md
git commit -m "docs(framework): GAPS.md — coverage, R1–R10 decisions, points-to-develop, open questions"
```

---

## Task 6: docs/README.md — the KB index ("start here")

**Files:**
- Create: `packages/toolkit-framework/docs/README.md`

**Depends on:** Task 1 (examples), Task 3 (glossary), Task 4 (templates) — this index links them, so they must exist first.

- [ ] **Step 1: Write `packages/toolkit-framework/docs/README.md`** as one coherent map. Structure (use this grouping — it follows the natural reading order Concepts → Architecture → Process → Federation → Skills → Reference):

```markdown
# Knowledge Base — @regen-commons/toolkit-framework

The operational distillation of the [master doc](../../../docs/MASTER.md): **adopt the
package, not the 30k-line doc.** This is the map. New here? Read top to bottom; you'll
have the whole framework in ~20 minutes.

## Start here (3 docs)
1. [`GETTING-STARTED.md`](GETTING-STARTED.md) — install + use in 5 minutes (CLI tour).
2. [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md) — one real input → typed objects → a track, end to end.
3. [`../architecture/README.md`](../architecture/README.md) — the framework in one shot: the problem, the values, the spine.

## The five-object kernel (the front door)
[`../architecture/kernel-objects.md`](../architecture/kernel-objects.md) — Resource ·
Concept · Option · Deployment · Signal. The Minimum Operating Kernel. See also
[`GLOSSARY.md`](GLOSSARY.md).

## Architecture (what exists + how it relates)
- [`problems-and-theory-of-change.md`](../architecture/problems-and-theory-of-change.md) — the diagnosis + the regeneration-claim boundary.
- [`layers.md`](../architecture/layers.md) — the 10-layer data model (what exists, what each layer must NOT do).
- [`operating-loop.md`](../architecture/operating-loop.md) — the 8-move Core Movement + the lifecycle↔layer bridge (reconciles R5).
- [`invariants.md`](../architecture/invariants.md) — the 16 distinctions that keep the system coherent (the conformance surface).
- [`type-tag-discipline.md`](../architecture/type-tag-discipline.md) — when to add a TYPE vs a TAG (anti-sprawl).
- [`ontology-posture.md`](../architecture/ontology-posture.md) — the two-layer semantic kernel (Layer A frozen + Layer B `maps_to_core`).
- [`fork-compatibility.md`](../architecture/fork-compatibility.md) — how forks stay interoperable.

## Process (how it learns + stays trustworthy)
- [`principles.md`](../process/principles.md) — the 18 cross-cutting commitments (the ethos, encoded in schemas).
- [`contribution.md`](../process/contribution.md) — the contributor front door + the 10 contribution types.
- [`review.md`](../process/review.md) — review scales with risk (12 review types, 4 workflows).
- [`roles.md`](../process/roles.md) — the 19 stewardship roles + role-failure safeguards.
- [`evolution-loop.md`](../process/evolution-loop.md) — Signal→Sensemaking→Balance→Intervention→Integration→Memory.
- [`ontology-change-process.md`](../process/ontology-change-process.md) — how the kernel changes without silent drift.
- [`csis-safeguards.md`](../process/csis-safeguards.md) — CSIS-informed, not conformant (R7).
- [`federation.md`](../process/federation.md) — interconnect gardens, don't centralize (return paths, contribute-back).

## Skills (the agentic machinery)
- [`capture-and-route`](../skills/capture-and-route/SKILL.md) — one input → many typed objects (deep intake).
- [`compose-journey`](../skills/compose-journey/SKILL.md) — assemble a track + run the compatibility engine.
- [`csis-review`](../skills/csis-review/SKILL.md) — structural-integrity review (flags, never certifies).

## Reference
- **Schemas** (`../schemas/`) — 21 total: 16 object-schemas + 5 structural. Full table below.
- **Examples** ([`../examples/`](../examples/)) — one validating instance per object-schema.
- **Templates** ([`../templates/instance/`](../templates/instance/)) — Appendix A–H fill-in forms.
- **Glossary** ([`GLOSSARY.md`](GLOSSARY.md)) — the load-bearing terms.
- **Site model** ([`../site/journey-model.md`](../site/journey-model.md)) — generator-agnostic front-door model.

### Schema reference (every schema, its example, its keystone)
<!-- one row per schema; mark object vs structural; link the example for object-schemas -->
| schema | kind | keystone | example |
|---|---|---|---|
| `review-maturity` | structural | K1 | — (canonical state model) |
| `frontmatter` | object | K3 | [example](../examples/frontmatter.example.yaml) |
| `source-system` | object | K2 | [example](../examples/source-system.example.yaml) |
| `contribution-record` | object | K5 | [example](../examples/contribution-record.example.yaml) |
| `core-entities` | structural | K4 | — (Layer A) |
| `extension-entities` | structural | K4 | — (Layer B) |
| `relationships` | structural | K4 | — (predicate vocab) |
| `kernel-profile` | structural | K4 / R3 | — (MOK-5 front door) |
| `resource` | object | L3 | [example](../examples/resource.example.yaml) |
| `option-entry` | object | L4 | [example](../examples/option-entry.example.yaml) |
| `track` | object | L7 | [example](../examples/track.example.yaml) |
| `deployment` | object | L5 | [example](../examples/deployment.example.yaml) |
| `implementation-record` | object | L6 | [example](../examples/implementation-record.example.yaml) |
| `claim-evidence` | object | — | [example](../examples/claim-evidence.example.yaml) |
| `evolution-record` | object | — | [example](../examples/evolution-record.example.yaml) |
| `concept-lineage` | object | — | [example](../examples/concept-lineage.example.yaml) |
| `encyclopedia-entry` | object | L2 | [example](../examples/encyclopedia-entry.example.yaml) |
| `update-proposal` | object | — | [example](../examples/update-proposal.example.yaml) |
| `signal` | object | — | [example](../examples/signal.example.yaml) |
| `provenance` | object | — | [example](../examples/provenance.example.yaml) |
| `public-use-boundary` | object | — | [example](../examples/public-use-boundary.example.yaml) |

> **Status:** v0.1.0-beta.1. Gaps, contradictions, and open questions are tracked in
> [`framework/GAPS.md`](../../../framework/GAPS.md) — that's the artifact the group reviews.
```

- [ ] **Step 2: Verify every relative link target in the KB index exists** (this is the index — dead links here are the worst). Run a link-existence check from `packages/toolkit-framework/docs/`:

Run:
```bash
cd packages/toolkit-framework/docs && python3 - <<'PY'
import re, os
txt = open('README.md').read()
links = re.findall(r'\]\((\.\./[^)]+)\)', txt)
missing = [l for l in links if not os.path.exists(os.path.normpath(l))]
print("MISSING:", missing if missing else "none")
PY
```
Expected: `MISSING: none`. (If any path is missing, fix the link — do not delete the row.)

- [ ] **Step 3: Commit**

```bash
git add packages/toolkit-framework/docs/README.md
git commit -m "docs(framework): KB index — one coherent start-here map"
```

---

## Task 7: docs/GETTING-STARTED.md — try the framework in 5 minutes

**Files:**
- Create: `packages/toolkit-framework/docs/GETTING-STARTED.md`

**Depends on:** Task 1 (examples must exist — the doc validates one).

- [ ] **Step 1: Run each command first and capture real output**, so the doc shows true output (no invented terminal text):

```bash
cd packages/toolkit-framework
node src/cli.mjs list-schemas | head -5
node src/cli.mjs kernel-check
node src/cli.mjs check-state maturity reviewed
node src/cli.mjs check-state maturity canonical; echo "exit=$?"
node src/cli.mjs validate source-system examples/source-system.example.yaml
node src/cli.mjs context | head -8
node --test 2>&1 | tail -3
```

- [ ] **Step 2: Write `packages/toolkit-framework/docs/GETTING-STARTED.md`** using the captured output. Structure:

```markdown
# Getting Started (5 minutes)

Zero-build. You need Node ≥18 and one dependency (`js-yaml`).

## 0. Get it
```bash
git clone <repo> && cd repos/regen-toolkit/packages/toolkit-framework
npm install            # installs js-yaml only
```

## 1. See the schemas (the vocabulary)
```bash
node src/cli.mjs list-schemas
```
21 schemas: 16 object-schemas you instantiate + 5 structural (the kernel itself).

## 2. Check the kernel is consistent (the interoperability contract)
```bash
node src/cli.mjs kernel-check
```
→ `✓ kernel consistent (every extension maps to a real core type)`
This is the fork-compatibility guarantee: every Layer-B type maps to a real Layer-A core type.

## 3. Validate a value against the canonical state model (K1)
```bash
node src/cli.mjs check-state maturity reviewed     # ✓
node src/cli.mjs check-state maturity canonical    # ✗ (old vocab, rejected — see R1)
```
One state model, three orthogonal axes (`maturity`, `public_use`, `lifecycle_state`) — not 7 competing ladders.

## 4. Validate a real object against its schema
```bash
node src/cli.mjs validate source-system examples/source-system.example.yaml
```
→ `✓ valid (source-system)`. Now open that file, change `type:` to something off-enum, and re-run — it fails. That's the schema doing its job.

## 5. See the AI-readable serialization
```bash
node src/cli.mjs context        # emits the JSON-LD @context generated from the kernel
```

## 6. Run the tests
```bash
node --test
```
All green — including one validating example per object-schema.

## Next
- Copy a template from [`../templates/instance/`](../templates/instance/), fill it, transcribe to YAML, validate.
- Walk the [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md) (input → typed objects → track).
- Read the [`README.md`](README.md) knowledge-base map.
```
Replace the inline `→` result lines with the **actual** captured output from Step 1 where they differ.

- [ ] **Step 3: Re-run the two load-bearing commands to confirm the doc is accurate**

Run: `cd packages/toolkit-framework && node src/cli.mjs kernel-check && node src/cli.mjs validate source-system examples/source-system.example.yaml`
Expected: `✓ kernel consistent …` then `✓ valid (source-system)`.

- [ ] **Step 4: Commit**

```bash
git add packages/toolkit-framework/docs/GETTING-STARTED.md
git commit -m "docs(framework): GETTING-STARTED — try it in 5 minutes (real CLI output)"
```

---

## Task 8: docs/WORKED-EXAMPLE.md — one input, end to end

**Files:**
- Create: `packages/toolkit-framework/docs/WORKED-EXAMPLE.md`

**Depends on:** Task 1 (examples — reuse the Gitcoin/QF objects so the narrative and the validating files line up).

- [ ] **Step 1: Write `packages/toolkit-framework/docs/WORKED-EXAMPLE.md`** that traces ONE real input through the operating loop, reusing the example objects from Task 1 (so every object shown is a real, validating file). Narrative:

```markdown
# Worked Example — from one shared link to a track

A contributor drops one link into the commons: **the Gitcoin Grants page**
(`https://www.gitcoin.co/grants`). Here's the whole journey through the framework.

## 1. Capture & route (the `capture-and-route` skill)
One input decomposes into several **typed objects** — not one blob. The deep-intake
questions (Appendix C / `templates/instance/deep-intake.md`) produce:

- a **resource** — the Gitcoin Grants page → [`examples/resource.example.yaml`](../examples/resource.example.yaml)
- a **source-system** — the Gitcoin Governance Forum behind it (a peer, with a `return_path`) → [`examples/source-system.example.yaml`](../examples/source-system.example.yaml)
- a **concept** — Quadratic Funding, with its lineage → [`examples/concept-lineage.example.yaml`](../examples/concept-lineage.example.yaml)
- an **option** — Quadratic Funding as a reusable funding component → [`examples/option-entry.example.yaml`](../examples/option-entry.example.yaml)
- a **provenance** block + **public-use boundary** on anything sensitive.

Each carries state (K1): the resource is `source-linked`, the option is `field-informed`.
Nothing is auto-promoted; raw stays raw until reviewed.

Validate any of them:
```bash
node src/cli.mjs validate option-entry examples/option-entry.example.yaml   # ✓ valid (option-entry)
```

## 2. Explain it (Encyclopedia)
The concept gets an explanatory page → [`examples/encyclopedia-entry.example.yaml`](../examples/encyclopedia-entry.example.yaml),
with known tensions (sybil-resistance cost, plutocracy vs breadth) made visible.

## 3. Compose a track (the `compose-journey` skill)
For a real audience — *"a local node treasurer with a small matching pool"* — we compose a
**track** that selects the concept + option and surfaces the deployment checks →
[`examples/track.example.yaml`](../examples/track.example.yaml). A track **prepares**; it does
not specify. The compatibility engine checks the option pairings.

## 4. Specify a deployment
When the node actually runs it, the track becomes a **deployment** — valid *only if* the six
minimum structures are explicit → [`examples/deployment.example.yaml`](../examples/deployment.example.yaml)
(decision system, information requirements, power structure, accountability, failure detection,
boundaries). Readiness `L3-community-pilot`.

## 5. Learn from it (Implementation + Signal + Evolution)
After the round, an **implementation-record** captures what actually happened →
[`examples/implementation-record.example.yaml`](../examples/implementation-record.example.yaml)
(two collusion clusters; a clawback). That surfaces a **signal** →
[`examples/signal.example.yaml`](../examples/signal.example.yaml), interpreted into an
**evolution-record** → [`examples/evolution-record.example.yaml`](../examples/evolution-record.example.yaml)
that adds a dispute-window variant to the option. The loop closes:
Signal→Sensemaking→Balance→Intervention→Integration→Memory.

## 6. Contribute back (federation)
A **contribution-record** → [`examples/contribution-record.example.yaml`](../examples/contribution-record.example.yaml)
attests the work and names the `source_system_reciprocity` — the dispute-window heuristic flows
back to the Gitcoin forum via its `return_path`. Peers, not extraction.

---
**The shape:** one link → Resource + Source-System + Concept + Option → Encyclopedia → Track →
Deployment → Implementation → Signal → Evolution → Contribution. Five kernel objects carry the
spine; everything validates; nothing is overclaimed.
```

- [ ] **Step 2: Verify every example file the walkthrough links to exists** (the narrative must be backed by real files):

Run: `cd packages/toolkit-framework && for s in resource source-system concept-lineage option-entry encyclopedia-entry track deployment implementation-record signal evolution-record contribution-record; do test -f "examples/$s.example.yaml" || echo "MISSING examples/$s.example.yaml"; done; echo "worked-example xref complete"`
Expected: `worked-example xref complete` with no `MISSING` lines.

- [ ] **Step 3: Commit**

```bash
git add packages/toolkit-framework/docs/WORKED-EXAMPLE.md
git commit -m "docs(framework): WORKED-EXAMPLE — one link → typed objects → track → loop"
```

---

## Task 9: Integration — full suite green, build intact, push

**Files:** none created — verification + push only.

- [ ] **Step 1: Run the full framework test suite**

Run: `cd packages/toolkit-framework && node --test 2>&1 | tail -5`
Expected: all tests pass; count is the prior 34 **plus** the new `examples.test.mjs` tests (≈38). If anything fails, fix the offending example/schema reference — do not weaken a test.

- [ ] **Step 2: Confirm the live site still builds** (never break `main`'s deploy surface):

Run: `cd "$(git rev-parse --show-toplevel)" && npm run build 2>&1 | tail -5`
Expected: build succeeds (124 pages, per checkpoint). The framework package is not imported by the site build, so this should be unaffected — but confirm.

- [ ] **Step 3: Confirm org-os schema validation is still clean**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run validate:schemas 2>&1 | tail -5`
Expected: validation passes (these are the org-os `.well-known/` schemas, separate from the framework — confirm Session 1 changed nothing there).

- [ ] **Step 4: Review the full diff for accidental edits to `docs/MASTER.md`, `src/`, or `main`-deploy files**

Run: `git diff main --stat | tail -40`
Expected: only additions under `packages/toolkit-framework/{docs,examples,templates,test}/`, `packages/toolkit-framework/{package.json,README.md}`, `framework/GAPS.md`, and `docs/plans/2026-06-23-framework-beta-kb-gaps.md`. **No changes to `docs/MASTER.md`, `src/`, or `astro.config.mjs`.**

- [ ] **Step 5: Push to the parallel dev branch**

Run: `git push origin regen-toolkit-os`
Expected: push succeeds.

- [ ] **Step 6: Write the closeout** — a one-paragraph summary of what changed + the **top 5 decisions we need from the group** (lift them verbatim from `framework/GAPS.md`'s footer: R1 three-axis maturity, R7 CSIS-informed posture, R8 single 19-role registry, R3 MOK-as-subset, D1 lifecycle-as-spine). This is the DONE condition; surface it to the operator (and it feeds Session 3's share pack).

---

## Self-review (completed during planning)

- **Spec coverage:** handoff DO-list items map to tasks — KB README→T6, GETTING-STARTED→T7, WORKED-EXAMPLE→T8, examples/→T1, templates/instance/→T4, GLOSSARY→T3; beta polish (version + descriptions + every schema has example + referenced from index + example tests)→T2/T1/T6; GAPS (a/b/c/d)→T5; DONE (tests green + build + push + summary + top-5)→T9. ✓
- **Placeholder scan:** example YAML is fully inlined; template field lists are verbatim from the appendices; GAPS R1–R10 + open-questions content is inlined; doc structures are concrete. No "TBD"/"add appropriate"/"similar to Task N". ✓
- **Type/name consistency:** example filenames `<schema>.example.yaml` are consistent across T1 (creation), the T1 test (`OBJECT_SCHEMAS` list), the T6 schema-reference table, and the T8 worked-example links. Schema names match `listSchemas()` output. K1 axis values match `review-maturity.yaml`. The `extends frontmatter` caution (signal/contribution-record require title+type) is encoded in those two examples. ✓
```

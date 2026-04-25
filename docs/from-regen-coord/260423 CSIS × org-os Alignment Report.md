# CSIS × org-os Alignment Report

**Date**: 2026-04-23
**Scope**: Map the Coordination Structural Integrity Suite (CSIS) against the org-os framework and template, identify where they converge, where they diverge, and where the framework needs concrete additions to claim a coherent CSIS posture.

**Sources**:
- CSIS reference: `docs/CSIS.md`, https://github.com/coordination-structural-integrity-suite/suite
- org-os framework: this workspace (`03 Libraries/regen-coordination-os/`) — per its CLAUDE.md, "the org-os framework — the template and standards"
- org-os template + framework docs: `03 Libraries/organizational-os/packages/{framework,template}/`
- Structured CSIS extractions: `data/deployment-requirements.yaml`, `data/feedback-process.yaml`, `data/ontology/regen-toolkit-*.yaml`, `data/option-library.yaml`

---

## 1. The two systems in one paragraph each

**CSIS** is a structural integrity standard for coordination systems. It names the structural conditions that a coordination deployment must satisfy to be legible, accountable, and sustainable (6 components: decision system, information requirements, power structure, accountability, failure detection, structural classification) and distinguishes **compressive** (floors/constraints) from **generative** (capacity-building, shared understanding, conflict transformation) standards. It is not a toolkit or a governance model; it is a checklist that any real deployment should be able to pass or explicitly waive.

**org-os** is a file-based framework for running an organization through a Git-backed, agent-readable workspace. Five principles (Web3-optional, Standards-first, Federated-by-design, Progressive-enhancement, Agent-native) and a 9-file startup sequence (SOUL · IDENTITY · AGENTS · USER · MEMORY · HEARTBEAT · TOOLS · MASTERPLAN · federation.yaml) boot any agent into context. Structured data lives in 14 `data/*.yaml` registries; EIP-4824 JSON-LD exports are generated from those YAMLs into `.well-known/`. Two sibling packages at `organizational-os/packages/`: `framework/` (meta docs + schemas) and `template/` (skeleton instance).

---

## 2. High-level alignment: natural fit, uneven execution

CSIS and org-os are structurally compatible. Both are **file-based, schema-driven, versioned-by-git, agent-readable standards** for making coordination legible. Both insist on **types distinct from tags**, **explicit relationships**, and **structural clarity over implicit convention**. Both treat **feedback loops as first-class**.

The asymmetry: **org-os has strong primitives for identity, data, federation, and agent bootstrapping but weak primitives for the six CSIS structural components.** The framework defines what an org *is* (SOUL, IDENTITY, federation.yaml) and what it *tracks* (14 registries) but not the structural conditions that make the org's coordination *valid*. CSIS fills that gap — but to wire it in, org-os needs concrete schema changes, not just reference material.

---

## 3. Component-by-component alignment (the 6 CSIS structural components)

### 3.1 Decision System

**CSIS requires**: mechanism · scope · proposal rights · decision authority · decision record location.

**org-os has**:
- `data/meetings.yaml` — per-meeting `decisions[]` array (string blobs, no ID, no mechanism, no authority field)
- `MEMORY.md` Key Decisions section (human-curated text)
- IDENTITY.md mentions governance model in prose
- `federation.yaml` identity block references governance tool (Gardens/Snapshot) loosely

**Gap**: No `data/decisions.yaml` registry. No decision schema with `mechanism`, `scope`, `proposal_rights`, `authority`, `record_location` fields. The information exists in scattered prose/blobs; it's not machine-queryable. An instance could have 40 Key Decisions in MEMORY.md and still fail CSIS because none of them specifies the mechanism used or the authority invoked.

**Fit**: Strong — org-os already treats decisions as a primitive, just not a structured one.

**Recommendation**: Add `data/decisions.yaml` (registry) + `data/governance.yaml` (decision-system declaration). Template schema below in §6.

---

### 3.2 Information Requirements

**CSIS requires**: minimum knowledge to participate · core knowledge · role-specific knowledge · advanced/optional knowledge.

**org-os has**:
- `data/knowledge-manifest.yaml` — domain coverage (none/partial/comprehensive) per knowledge domain
- `USER.md` — operator profile (what they care about)
- `AGENTS.md` — agent operating manual
- BOOTSTRAP.md startup sequence — orders 9 files to read
- `knowledge/` directory — the commons itself

**Gap**: Knowledge is tracked by *domain coverage*, not by *role-gated requirement*. There's no schema for "to participate as a Contributor you must have read X, Y, Z"; no "core knowledge package" per role. The 9-file bootstrap is *agent* information requirements, not *human-role* information requirements.

**Fit**: Medium — the raw knowledge layer exists; the role-gating layer doesn't.

**Recommendation**: Add a `roles[]` array in `members.yaml` with `required_reading` per role, or (cleaner) a new `data/roles.yaml` that declares role-specific information requirements.

---

### 3.3 Power Structure

**CSIS requires**: formal authority · operational control · resource control · named roles · admin/multisig/infrastructure control points.

**org-os has**:
- `federation.yaml` → identity.safe (treasury address, CAIP-2), identity.hats (Hats Protocol tree), identity.type
- `members.yaml` — roles (coordinator, anchor-node, local-node, contributor, observer), status
- IDENTITY.md — council model in prose
- EIP-4824 `dao.json` export captures chain + safe + governance infra

**Gap**: Multisig/Hats references exist in `federation.yaml` but most instances leave them blank (Regen instance: governance tool TBD, no safe deployed). There is no registry of *control points* — the places where power is exercised (GitHub admin, domain registrar, npm publish rights, cloud account root, GitHub Actions secrets, etc.). The framework captures on-chain power well but off-chain/infrastructure power not at all.

**Fit**: Medium-strong on-chain; weak off-chain.

**Recommendation**: Add `control_points[]` in `federation.yaml` or a new `data/power.yaml`:
```yaml
control_points:
  - id: github-org-admin
    type: "github"
    held_by: [did:refi-bcn:luiz-fernando]
    fallback: [did:refi-bcn:afo]
    rotation_policy: "annual review"
  - id: treasury-safe
    type: "multisig"
    address: "eip155:100:0x..."
    signers: [...]
    threshold: 3
```

---

### 3.4 Accountability System

**CSIS requires**: work tracking · outcome evaluation · review cadence · visible tracking mechanism.

**org-os has**:
- `data/projects.yaml` — status (idea/develop/execute/archive), milestones, target_completion, lead, contributors
- `data/meetings.yaml` — `action_items[]` with assignee/task/due/status
- `HEARTBEAT.md` — active tasks, urgency, weekly/daily/on-demand cadences
- Session lifecycle: `/close` writes daily memory, updates HEARTBEAT, commits
- Dashboard: `npm run initialize` surfaces pipeline, projects, tasks

**Gap**: Work tracking is present (and strong). Outcome evaluation is not — projects move from `execute` to `archive` without any required retrospective or outcome record. Review cadence is implied in HEARTBEAT but not enforced; there's no "this project is overdue for review" check. The visible tracking mechanism (dashboard) exists but doesn't surface *accountability* signals like "no review in N weeks."

**Fit**: Strong on work tracking; weak on outcome evaluation and review cadence enforcement.

**Recommendation**: Add `review_cadence` + `last_reviewed` + `retrospective_url` to projects.yaml schema. Add a dashboard section for "overdue reviews." Add a retrospective template to `packages/operations/projects/templates/`.

---

### 3.5 Failure Detection System

**CSIS requires**: issue reporting channel · escalation path · response responsibility · feedback surfacing mechanism.

**org-os has**:
- `data/feedback-process.yaml` — 6-step loop (capture → classify → review → update → communicate → version) with source/type taxonomies
- `data/channels.yaml` — communication channels by purpose
- Git issues (GitHub)
- Memory + HEARTBEAT surfacing

**Gap**: Feedback *process* is defined (you added it); feedback *channel* is not routed. There is no declared issue reporting channel (is it the forum? GitHub issues? Telegram?), no declared escalation path ("if no response in 72h, escalate to X"), no declared response responsibility ("channel Y is monitored by role Z with SLA N"). The framework has the loop — it doesn't have the wiring.

**Fit**: Strong on loop definition; weak on channel routing and SLAs.

**Recommendation**: Extend `data/channels.yaml` with `monitored_by`, `response_sla`, `escalation_to`. Add explicit `issue_reporting` block to `federation.yaml`:
```yaml
issue_reporting:
  primary_channel: telegram-main
  escalation_to: council
  response_sla_hours: 72
```

---

### 3.6 Structural Classification

**CSIS requires**: explicit declaration of what is **fixed**, **configurable**, and **experimental** — applied to governance, coordination, funding, tools, and role systems.

**org-os has**:
- IDENTITY.md prose ("Council consensus model, TBD governance tool under evaluation" = configurable)
- MEMORY.md historical decisions (implicit marker of what was fixed when)
- Project `status` field (idea/develop/execute/archive)

**Gap**: Nothing declares fixed/configurable/experimental at the system level. A new instance has no way to say "our governance model is fixed at steward-council for 2 years, our funding mechanism is experimental (quadratic funding pilot), our comms channels are configurable." This is the single most-CSIS-shaped gap in org-os.

**Fit**: Weak. Framework has no primitive for it.

**Recommendation**: Add a `structural_classification` top-level block in `federation.yaml`, or a dedicated `data/structural-classification.yaml`:
```yaml
structural_classification:
  governance:
    status: fixed      # fixed | configurable | experimental
    until: "2027-01-01"
    rationale: "Council consensus formalized via v3 proposal."
  funding:
    status: experimental
    pilot_ends: "2026-09-30"
  coordination:
    status: configurable
  tools:
    status: configurable
  role_systems:
    status: fixed
    until: "2027-01-01"
```

---

## 4. Meta-structural alignment

### 4.1 Compressive vs generative standards

**CSIS distinguishes**:
- *Compressive* — floors/constraints/minimums (decision system defined, power visible, etc.)
- *Generative* — conditions under which coordination *capacity* develops and is sustained (capacity-building, shared understanding, conflict transformation)

**org-os posture**:
- Heavy compressive leanings: schemas, validation, file structure enforcement
- Some generative primitives: `knowledge-manifest.yaml` (shared understanding), skills system (capacity-building), `/initialize` + `/close` session lifecycle (reflection)
- **No explicit separation**. A new instance can pass all schema validation and still be generatively hollow (no onboarding, no retro practice, no conflict protocol).

**Gap**: Framework should name the distinction and provide primitives for generative concerns. Candidates:
- `data/onboarding.yaml` — capacity-building plan per new member
- `data/retrospectives.yaml` or `retrospective_url` field on projects
- `data/conflict-protocol.yaml` — declared conflict transformation process

---

### 4.2 Conformance posture

**CSIS requires**: explicit marking of what is *CSIS-inspired* vs *CSIS-applied*.

**org-os posture**:
- `docs/CSIS.md` (this workspace) already defines conformance scope per layer (Deployment = strict, Feedback = secondary, Ontology = informed, everything else = inspired).
- **No machine-readable declaration**. An instance can't claim "I am CSIS-strict on deployment" in its `federation.yaml` or `dao.json`.

**Gap**: Fit is conceptual; machinery missing.

**Recommendation**: Add a `standards_conformance[]` block to `federation.yaml`:
```yaml
standards_conformance:
  - standard: csis
    version: "TBD"
    scope: deployment-layer
    posture: strict
    reference: "docs/CSIS.md"
  - standard: csis
    scope: ontology
    posture: informed
  - standard: eip-4824
    posture: strict
```
Generate a conformance badge/section into `.well-known/dao.json` or a new `.well-known/conformance.json` for downstream peers to read.

---

### 4.3 Ontology principles

**CSIS gives 5 ontology integrity principles** (clarity over volume, distinguish abstraction levels, power legibility, support disagreement, separate types from tags).

**org-os posture**:
- Data model uses types (Group, Person, Practice, etc.) cleanly via Regen Toolkit ontology extraction; EIP-4824 types are authoritative for identity.
- Classification layers (domain, function, maturity, stage, scale, context, tech_surface, capital) treated as attributes, not types — **good alignment**.
- Power legibility — partial (see §3.3).
- Support disagreement — weak. Framework has no `questions`, `claims`, `evidence` registries despite defining those entity types in the ontology.

**Gap**: Entity types are declared but not operationalized at the instance data layer. Org-os has `members.yaml`, `projects.yaml`, etc., but not `claims.yaml`, `questions.yaml`, `evidence.yaml`. Disagreement is currently captured in prose (forum threads, meeting notes), not structurally.

**Recommendation**: Add optional registries `data/claims.yaml`, `data/questions.yaml`, `data/evidence.yaml` to the framework. Even as stubs (mostly empty), they signal that structured disagreement is a first-class citizen.

---

## 5. Alignment matrix (at a glance)

| CSIS requirement | org-os primitive | Status | Gap severity |
|---|---|---|---|
| Decision System | `meetings.yaml` decisions, MEMORY.md | structured prose, no schema | **High** — need `decisions.yaml` + `governance.yaml` |
| Information Requirements | `knowledge-manifest.yaml`, AGENTS.md | domain-level only, not role-gated | Medium |
| Power Structure (on-chain) | `federation.yaml` identity.safe/hats | strong primitive, often empty | Low (primitive exists) |
| Power Structure (off-chain) | — | no primitive for control points | **High** |
| Accountability — work tracking | `projects.yaml`, `meetings.yaml` action_items, HEARTBEAT | strong | Low |
| Accountability — outcome eval | — | no retrospective schema | Medium |
| Accountability — review cadence | HEARTBEAT loose mentions | no enforcement | Medium |
| Failure Detection — process | `feedback-process.yaml` | strong (added in this pass) | Low |
| Failure Detection — channel routing | `channels.yaml` | no monitored_by / SLA / escalation | Medium |
| Structural Classification | — | no primitive | **High** |
| Compressive/generative distinction | — | implicit, not named | Medium |
| Conformance posture | `docs/CSIS.md` | prose only, not machine-readable | Medium |
| Types distinct from tags | data registry schemas + ontology | strong | Low |
| Support disagreement | — | no `claims/questions/evidence` registries | Medium |
| Feedback loop | `feedback-process.yaml` + session lifecycle | strong | Low |
| Ontology ↔ interop | `data/ontology/regen-toolkit-octo-mapping.yaml` | strong (Regen-specific) | Low (needs generalization to framework) |

Four high-severity gaps: **Decision System schema**, **Power Structure (off-chain control points)**, **Structural Classification**, and the absence of machine-readable **conformance posture**.

---

## 6. Recommended framework changes (concrete)

If the goal is "org-os becomes CSIS-coherent by default," the changes are:

### 6.1 New / extended registries

| File                                                            | Purpose                                                                    | Status            |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------- |
| `data/decisions.yaml`                                           | Structured decision log with mechanism/authority/record                    | **new**           |
| `data/governance.yaml`                                          | Decision system declaration (mechanism, scope, proposal rights, authority) | **new**           |
| `data/roles.yaml`                                               | Roles + required_reading + permissions + control_points held               | **new**           |
| `data/retrospectives.yaml`                                      | Outcome evaluation records linked to projects                              | **new**           |
| `data/claims.yaml`, `data/questions.yaml`, `data/evidence.yaml` | Structured disagreement                                                    | **new, optional** |
| `data/channels.yaml`                                            | Add `monitored_by`, `response_sla_hours`, `escalation_to`                  | extend            |
| `data/projects.yaml`                                            | Add `review_cadence`, `last_reviewed`, `retrospective_url`                 | extend            |
| `data/members.yaml`                                             | Add `role_ref` (FK to roles.yaml)                                          | extend            |
| `data/deployment-requirements.yaml`                             | Already present; keep as canonical CSIS reference                          | —                 |
| `data/feedback-process.yaml`                                    | Already present                                                            | —                 |

### 6.2 New `federation.yaml` blocks

```yaml
structural_classification:
  governance:    { status: fixed | configurable | experimental, until: "..." }
  funding:       { ... }
  coordination:  { ... }
  tools:         { ... }
  role_systems:  { ... }

control_points:
  - id: ..., type: ..., held_by: [...], fallback: [...], rotation_policy: "..."

issue_reporting:
  primary_channel: ...
  escalation_to: ...
  response_sla_hours: ...

standards_conformance:
  - standard: csis, scope: deployment-layer, posture: strict, reference: "docs/CSIS.md"
```

### 6.3 New EIP-4824 export: `.well-known/conformance.json`

Downstream peers should be able to read a peer's conformance posture without parsing prose. Generate from `standards_conformance` + `structural_classification` blocks.

### 6.4 Dashboard surfacing

Add sections for:
- **Structural integrity** — validates each of the 6 CSIS components are defined; flags "invalid conditions" (decision process undefined, power implicit, no review loop, etc.)
- **Overdue reviews** — projects past `review_cadence`
- **Open failure signals** — unresolved items in the feedback process

### 6.5 Validation command

`npm run validate:csis` — runs the `data/deployment-requirements.yaml` checklist against current instance state. Returns pass/fail per component, referencing the canonical invalid conditions.

### 6.6 Docs additions

- Add `docs/02-standards/csis-integration.md` in `organizational-os/packages/framework/docs/` — how CSIS is wired into the framework, conformance scope, how to claim postures.
- Add `docs/ONBOARDING.md` — capacity-building / generative standard (currently absent).
- Add `docs/CONFLICT-PROTOCOL.md` template — generative standard (currently absent).

---

## 7. Five framework principles — mapped to CSIS

| org-os principle | CSIS compatibility |
|---|---|
| **Web3-optional** | Compatible. CSIS is Web3-agnostic. Chain-based power legibility is a *convenience* for CSIS compliance, not a requirement. |
| **Standards-first** | **Highly compatible**. CSIS is a standard; org-os claiming EIP-4824 as a standard primitive is exactly the posture CSIS wants. Adding CSIS alongside EIP-4824 is additive, not conflicting. |
| **Federated-by-design** | Compatible with nuance. CSIS wants conformance postures to be *legibly shared* across federated peers — which requires `standards_conformance` in federation.yaml. Currently peers can't tell if another node is CSIS-strict. |
| **Progressive enhancement** | **Strongly compatible**. CSIS's "inspired → informed → applied → strict" gradient is native progressive enhancement. An instance could start "CSIS-inspired" and harden to "CSIS-strict on Deployment" over time. |
| **Agent-native** | Compatible. Machine-readable CSIS declarations (YAML + JSON-LD) let agents validate, surface gaps, and propose fixes. |

**Verdict**: CSIS is a natural next standard for org-os to adopt alongside EIP-4824. The principles don't conflict — they compound.

---

## 8. Risks and open questions

1. **CSIS versioning** — the GitHub suite is in active development. org-os needs to pin to a CSIS release tag in `standards_conformance`, and plan for version migrations.
2. **Template vs framework** — `organizational-os/packages/template/` has only 4 YAML registries (finances, funding-opportunities, members, projects). Adding CSIS primitives to the framework means making hard calls about which are *required* in the template vs *optional enhancements*.
3. **Generative standards underspecified** — CSIS names compressive vs generative but the Regen Toolkit master doc admits the generative layer is weakly defined. org-os can't lead on this without outside input from the CSIS repo itself.
4. **Conflict protocol templates** — CSIS implies conflict transformation; no public template exists in either codebase. Likely requires collaboration with Durgadas or adoption of an external standard (Sociocracy 3.0, etc.).
5. **Durgadas alignment** — before committing org-os to CSIS as a first-class standard, worth confirming with Durgadas that the `standards_conformance` approach is consistent with how they intend CSIS to be claimed by downstream systems.
6. **Framework vs Regen Toolkit scope** — several CSIS extractions currently live in `data/` at the regen-coordination-os level (deployment-requirements, feedback-process, ontology). They arguably belong in `organizational-os/packages/framework/` as part of the canonical framework, not in an instance. Decide whether to promote.

---

## 9. One-page summary

**Is CSIS compatible with org-os?** Yes, structurally — both are file-based, schema-driven, agent-readable, federated standards that privilege explicit structure over convention.

**Is org-os CSIS-compliant today?** No. It has **strong primitives for identity, data, federation, and agent operation** but **weak primitives for the 6 CSIS structural components**. Four gaps are high-severity: decision system schema, off-chain power/control-points, structural classification (fixed/configurable/experimental), and machine-readable conformance posture.

**What's the shortest path to coherent CSIS posture?**
1. Add `data/decisions.yaml`, `data/governance.yaml`, `data/roles.yaml` (structured primitives the framework is missing).
2. Extend `federation.yaml` with `structural_classification`, `control_points`, `issue_reporting`, `standards_conformance` blocks.
3. Generate `.well-known/conformance.json` for peer-readable posture.
4. Add `npm run validate:csis` against `data/deployment-requirements.yaml`.
5. Write `docs/02-standards/csis-integration.md` in the framework docs.

**What's the order of difficulty?** Easy: conformance posture declaration + validation command. Medium: decision/governance/roles schemas + federation.yaml extensions. Hard: generative standards primitives (onboarding, conflict protocol) — these need external input.

**Net**: org-os adopting CSIS as a second standard alongside EIP-4824 is a small body of work (~5 new YAML schemas, 4 new federation.yaml blocks, 1 validation command, 1 export), consistent with the framework's 5 principles, and would make org-os one of the first file-based organizational frameworks with a machine-readable structural integrity posture.

---

## See also

- `docs/CSIS.md` — CSIS reference page
- `docs/260423 Regen Web3 Toolkit - Master Doc Briefing.md` — master doc briefing
- `data/deployment-requirements.yaml` — the 6 structural components, canonical
- `data/feedback-process.yaml` — feedback loop schema
- `data/ontology/regen-toolkit-*.yaml` — ontology + Octo interop mapping
- https://github.com/coordination-structural-integrity-suite/suite — CSIS upstream

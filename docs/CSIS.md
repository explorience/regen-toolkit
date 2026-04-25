# CSIS — Coordination Structural Integrity Suite

> External standard developed by Durgadas. The Regen Web3 Toolkit treats CSIS as its structural integrity framework, applied primarily in the Deployment Layer.

- **Repo**: https://github.com/coordination-structural-integrity-suite/suite
- **Author**: Durgadas
- **Registered in**: `data/sources.yaml` (id: `csis-suite`)
- **Related project**: Regen Web3 Toolkit

---

## What CSIS is

A structural integrity framework for coordination systems. It defines the **structural conditions under which coordination is legible, accountable, and sustainable** — and names the failure modes when those conditions aren't met.

CSIS is not a governance model or a toolkit. It is a **standard** — a set of requirements any real coordination deployment should be able to satisfy or explicitly waive.

### Key CSIS distinctions

- **Compressive vs generative standards**
  - *Compressive* — floors, constraints, minimum structural requirements (decision systems defined, power visible, failure reporting path exists)
  - *Generative* — conditions under which coordination capacity develops and is sustained over time (capacity building, shared understanding, conflict transformation)
  - Most deployments only encode the compressive side. Generative is where most systems silently fail.

- **Partial adoption vs full conformance**
  - Projects should clearly state where they are *inspired by* CSIS vs *implementing* CSIS. Conflating them produces false confidence.

- **Power legibility**
  - Ontology and deployments must make visible: who acts, who decides, who controls systems, how coordination actually occurs. No implicit power.

---

## How Regen Web3 Toolkit applies CSIS

From the master doc (canonical stance, line 195):

> *"The Regen Toolkit is not a CSIS implementation. It is a broader knowledge, design, and deployment system that is increasingly informed by CSIS as a structural integrity framework. CSIS is applied most directly in the Deployment Layer, where options and tracks must be translated into explicit structural conditions, and secondarily in the Feedback Layer, where tensions, failures, and adaptations are surfaced and integrated."*

### Conformance scope by layer

| Layer | CSIS posture |
|---|---|
| Resource Graph | inspired |
| Encyclopedia | inspired |
| Ontology | informed (5 CSIS principles baked into integrity rules) |
| Option Library | inspired (options *should* be annotated with CSIS constraints — not yet done) |
| **Deployment Layer** | **strict** — 6 required structural components, invalid conditions defined |
| Tracks | should be strict (not yet enforced — tracks can currently compose invalid deployments) |
| Implementations | strict via Deployment |
| Feedback Layer | secondary — tensions/failures/adaptations feed back into structure |

### The 6 structural components of a valid deployment

Extracted to `data/deployment-requirements.yaml`. Summary:

1. **Decision System** — mechanism, scope, proposal rights, authority, record location
2. **Information Requirements** — minimum, core, role-specific, advanced knowledge
3. **Power Structure** — formal authority, operational control, resource control, named roles, admin/multisig control points
4. **Accountability System** — work tracking, outcome evaluation, review cadence, visible tracking
5. **Failure Detection System** — issue reporting channel, escalation path, response responsibility, feedback surface
6. **Structural Classification** — what is fixed vs configurable vs experimental (across governance, coordination, funding, tools, roles)

**Invalid deployment conditions** (any one = broken):
- decision process undefined
- required knowledge undefined
- power implicit or hidden
- no review loop
- no failure reporting path
- everything treated as flexible

### CSIS principles baked into the ontology

1. Clarity over volume — only add entity types with distinct meaning and relationships
2. Distinguish abstraction levels — Concept / Pattern / Protocol / Playbook / Practice
3. Power legibility — make acting/deciding/controlling visible
4. Support disagreement — allow competing claims + supporting/opposing evidence; avoid forced consensus
5. Separate types from tags — entity type (what) ≠ classification (how)

### CSIS overlay on entity types (constraints, not type changes)

From `data/ontology/regen-toolkit-octo-mapping.yaml`:

| Entity | CSIS requirement |
|---|---|
| Practice | must define actor, context, outcome |
| Pattern | must define problem + abstraction |
| Protocol | must define rules + authority |
| Mechanism | must define incentives + risks |
| Tool | must define control + dependency |
| Group | must define decision + power structure |

---

## Open gaps vs CSIS (from the briefing backlog)

These are structural integrity items the Regen Web3 Toolkit has not yet closed:

- [ ] **Compressive vs generative standards** — not yet distinguished in the architecture. Generative conditions (capacity building, shared understanding, conflict transformation) are not separated from compressive constraints.
- [ ] **Conformance posture** — no explicit mark of which parts are strict vs advisory. Current posture (this page) is consistent but not machine-checkable.
- [ ] **No validation mechanism** — Deployment Layer defines requirements but nothing checks if a real deployment is actually valid. Need valid/invalid examples + minimum criteria per section.
- [ ] **Option Library disconnected from CSIS** — options (governance, funding, etc.) are not annotated with required constraints or typical failure modes. Teams can currently pick structurally incompatible components.
- [ ] **Tracks don't enforce CSIS** — tracks are compositions but not pre-validated against structural requirements. Every track should pre-satisfy CSIS + include constraint templates.

---

## Relevant external context

- Durgadas also works/has worked on related standards efforts in the coordination space — the CSIS repo is the canonical location.
- CSIS overlaps conceptually with Octo (ontology/knowledge commons) and SuperBenefit — the Regen Toolkit maps all three (see `data/ontology/regen-toolkit-octo-mapping.yaml`).

---

## See also

- `docs/260423 Regen Web3 Toolkit - Master Doc Briefing.md` — fuller context on how CSIS fits the project
- `data/deployment-requirements.yaml` — the 6 structural components + invalid conditions, as structured data
- `data/sources.yaml` — CSIS registered as a source
- `docs/projects/regen-toolkit/BACKLOG.md` — CSIS integration todos

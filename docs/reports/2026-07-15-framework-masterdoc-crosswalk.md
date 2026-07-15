# The §40 Crosswalk — toolkit-framework ↔ Database_Spec

**Date:** 2026-07-15 · **For:** the 2026-07-16 toolkit call · **Author:** Luiz (operator), agent-assisted
**Structured companion:** [`data/crosswalks/handoff-database-spec.yaml`](../../data/crosswalks/handoff-database-spec.yaml)
**Sources read in full:** `.tmp/handoff-txt/Database_Spec.txt` Part II (Production Object Model, §12-32) and Part III (Semantic/Status/Visibility Rules, §33-46), plus Part V §66-72 (Workbook/Normalization Mapping); `.tmp/handoff-txt/Guide.txt` §7-9.

---

## 1 · Framing — this is master-doc §40

Matty's target master document names a section — **§40, "Architecture/Framework/Data/AI/Interface
Crosswalk"** — inside Part VI ("AI-Assisted Technical Realization and Working Toolkit," §35-42, per
`Master_Spec.docx` §4/§6). The Guide's §10 ("Responsibilities and working interfaces") asks Luiz to
return, after the first technical cycle: *"a schema-to-master-architecture crosswalk."* This document
and its companion YAML are that deliverable, and they are also §40 — not a separate artifact that
happens to resemble it. The 10-layer architecture (Guide §4) already anchors the framework inside the
master document at §35, which names `toolkit-framework` and `regen-toolkit-os` directly.

The finding underneath the finding: **Database_Spec independently specifies the system the framework
already is.** Matty wrote a production object model, a three-zone migration contract, an 8-dimension
status model, and a preserve→normalize→review→publish operating rule — without reference to the
framework — and it converges on the same shape: typed object families instead of one universal
resource table, orthogonal status axes instead of one trust score, a human-gated promotion ladder, and
relationships treated as sourced assertions rather than graph facts (Database_Spec's own Core Decision
#3). This is not a coincidence to celebrate lightly — it means the two specifications can be read
against each other productively, and where they diverge, the divergence is informative rather than
noise. Section 7 below is the honest account of where that is true.

---

## 2 · Object-family crosswalk

Database_Spec §13 names **14 first-class object families**. Scored against the shipped framework
schemas (`packages/toolkit-framework/schemas/*.yaml`):

| Database_Spec family (§) | Framework schema | Fit |
|---|---|---|
| Entities (§14) | *(none — kernel types only: `core-entities.yaml`'s `person`/`group`/`place`/`bioregion`)* | **GAP** |
| Source Systems (§15) | `source-system.yaml` | **direct** |
| Source Artifacts (§16) | `resource.yaml` + core `artifact` | near |
| Concepts and Idea Lineages (§17) | `concept-lineage.yaml` | **direct** |
| Options (§18) | `option-entry.yaml` | near (capital fields already flagged; see §6) |
| Tracks (§19) | `track.yaml` | **direct** |
| Deployments (§20) | `deployment.yaml` | **direct** |
| Implementation Cases (§21) | `implementation-record.yaml` | **direct** |
| Claims and Cautions (§22) | `claim-evidence.yaml` | near (no `claim_mode`/`claim_type` fields) |
| Relationships (§23) | `relationships.yaml` (predicate *vocabulary* only) | **partial — see §7** |
| Reviews and Public-Use Decisions (§24) | *(no `review` schema)* + `public-use-boundary.yaml` | **GAP** for Reviews; near for Public-Use |
| Research Notes and Structured Attachments (§25) | *(none)* | **GAP** |
| Expansion Branches and Backlog (§26) | `docs/BACKLOG.md` (doc convention, not a schema) | **GAP** |
| Decisions, Evolution, Compost Records (§27) | `signal.yaml` + `evolution-record.yaml` (direct) / `update-proposal.yaml` (near) | **partial** |

**Score: 6 direct, 2 near, 2 partial, 4 gap** (of 14). The 6 direct hits are exactly the families that
carry the framework's most-exercised, most load-bearing schemas — source-system (the federation
primitive), concept-lineage, option-entry (the compatibility-engine input), track, deployment (the
6-component structural-integrity check), and implementation-record. These are not coincidental strong
fits; they are the schemas the framework was built around.

Two matches deserve a specific callout for the call:

- **Source Systems ↔ `source-system.yaml`.** Database_Spec §15.1 explicitly recommends modeling
  "Publication System" as a Source-System *subtype*, with the Omniharmonic worked example: platform
  (Substack) → publication system (Omniharmonic) → person (Benjamin Life) → artifact (each essay).
  `source-system.yaml`'s `type` enum already carries `publication` as a value — this recommendation is
  already the framework's model, not a change either side needs to make.
- **Deployments ↔ `deployment.yaml`.** Database_Spec's 6 structural fields (§20.3: roles/decision
  authority, information asymmetries, resource/stop authority, override conditions) line up with the
  framework's REQUIRED 6-component check (`decision_system`, `information_requirements`,
  `power_structure`, `accountability`, `failure_detection`, `boundaries`). Database_Spec's readiness
  ladder (§20.5: explore → proceed → paused → completed) and the framework's `readiness_level` enum
  (L0-idea…L6-field-informed-pattern) use different words for the same idea — and unlike most
  value-ladder pairs in this crosswalk, this one is **already formally crosswalked** to K1 maturity via
  `review-maturity.yaml`'s `crosswalks.deployment_readiness` block.

---

## 3 · Status-dimension crosswalk

Database_Spec §12.3/§39 keeps **8 independent status dimensions** deliberately separate ("no generic
status, quality, trust, or approval field should replace these" — §12.3). The framework's K1 model
(`review-maturity.yaml`) is 3 axes (`maturity`, `public_use`, `lifecycle_state`) + 2 orthogonal flags
(`ai_assisted`, `high_risk`).

| Database_Spec dimension | Framework home | Fit |
|---|---|---|
| processing_state | `lifecycle_state` axis | near |
| maturity_state | `maturity` axis | near |
| review_state | folded into `maturity`("reviewed") + `lifecycle_state`("human-reviewed") — no independent field | **partial** |
| public_use_state | `public_use` axis + `public-use-boundary.yaml` tier | near |
| currentness_state | *(none — only `source-system.yaml`'s free-text `currentness` field)* | **GAP** |
| confidence_state | *(none — only `claim-evidence.yaml`'s free-text `uncertainty`)* | **GAP** |
| maintenance_state | *(none — `frontmatter.steward` names WHO, not a state)* | **GAP** |
| ai_involvement_state | `ai_assisted` (boolean) + `provenance.authorship` (6-value enum) | near |

The design doc (`docs/plans/handoff-integration/2026-07-14-handoff-integration-design.md` §2) already
named **3 status dims short: currentness, confidence, maintenance.** This crosswalk verifies all three
and adds one nuance worth carrying into the call: **`review_state` is not a clean gap, but it is not a
clean map either.** "Reviewed" exists as a rung inside both `maturity` and `lifecycle_state`
(`update-proposal.yaml` even reuses `lifecycle_state` directly as its own `review_status` field), but
Database_Spec's finer review-workflow states — review requested, review in progress, changes requested,
disputed, review expired — have no field anywhere to live in. An object is either pre-`reviewed` or
`reviewed`; nothing captures the workflow in between. This is real, but lower severity than the 3
headline gaps because the *review-promote skill* (a process, not a field) does enforce the discipline
Database_Spec wants — it just doesn't persist it as data. See §6.

Also worth stating precisely, because it is easy to overstate in the other direction: **AI-involvement
is not a gap.** Database_Spec wants 9 distinct AI-involvement states; the framework's `ai_assisted` is a
boolean. But read together with `provenance.yaml`'s `authorship` (human-authored / ai-assisted /
inferred / reviewed / disputed / deprecated / candidate) and `transformation` (quoted / summarized /
synthesized / translated / remixed / inferred) enums, and with the review-promote rule that
`ai_assisted` **clears on any reviewer-present promotion** (the operational equivalent of
"human-reviewed-after-AI"), the framework recovers most of the granularity Database_Spec wants through
a boolean-plus-two-enums combination rather than one 9-value field. Not identical, but not thin either.

---

## 4 · Zones and the pipeline

Database_Spec's four migration zones (§4) map directly onto the framework's maturity/public-use model
and its ingestion pipeline stages:

| Database_Spec zone | Framework equivalent | Mechanism |
|---|---|---|
| Zone A — raw discovery | `maturity: raw`, `lifecycle_state: raw-lead` | born-rules (`ingest` skill: "maturity: raw ALWAYS... ai_assisted: true ALWAYS") |
| Zone B — canonical working registry | `maturity: draft/candidate/source-linked` | the CLI accept-gate + the B5 collision guard |
| Zone C — reviewed operational objects | `maturity: reviewed`, `lifecycle_state: human-reviewed` | `review-promote` (named human reviewer, one object at a time) |
| Zone D — public-use views | `public_use: reviewed-for-*` + `public-use-boundary` tier: public/public-with-caveat | **partial — no view-compiler; see §6** |

And the operating rule itself — **"preserve → normalize → review → publish"** (Guide §1, §7) — maps
stage for stage to the framework's pipeline:

| Database_Spec stage | Framework stage | Framework skill(s) |
|---|---|---|
| preserve | `ingest prepare` → candidate decomposition | `ingest`, `capture-and-route`, `register-source` |
| normalize | the accept-gate (schema validation + born-rules + B5) | `map-ontology` (for foreign ontologies) |
| review | the review-promote session | `review-promote`, `csis-review` (high-risk pass) |
| publish | `store` → the working KB | *(none dedicated — see §6)* |

`register-source`'s hard ordering rule — "content objects reference their source system; the card must
exist BEFORE the content does" — is a stronger guarantee than Database_Spec states explicitly for the
same discipline (§15's source-system-first posture). `csis-review`'s "flags, never certifies" (R7
posture) matches Database_Spec's own "promotion does not imply review or public readiness" (§10) almost
word for word.

The AI/human decision boundary (Guide §9) also converges closely: the `ingest` skill's high-risk
triggers list ("people, exact locations, TEK/Indigenous knowledge, MRV/carbon claims, funding/legal/
governance recs → `high_risk: true` + a `public-use-boundary` candidate") is close to a paraphrase of
Database_Spec §3.5's escalation list (person/community identity, Indigenous/territorial authority,
ecological/impact claims, standards/conformance). `review-promote`'s "no reviewer present → read-only
session... never batch-promote" is the human-review-required tier in force.

---

## 5 · Normalization ↔ crosswalk + B5

Database_Spec's normalization layer (§66-68, Role B sheets: Object Type Crosswalk, Controlled
Vocabularies, Relationship Predicate Crosswalk; Role C: Normalization Flags) has a close but not
identical framework counterpart:

- **Object Type Crosswalk → `maps_to_core`.** Every `extension-entities.yaml` type is REQUIRED to
  declare `maps_to_core`, naming a real Layer-A core type — mechanically enforced by `validateKernel`.
  This is Database_Spec's Object Type Crosswalk expressed as a schema constraint rather than a
  spreadsheet column. When the `map-ontology` skill runs against a foreign corpus, it emits exactly the
  artifact Database_Spec's Role B sheets are: a populated crosswalk (see
  `data/crosswalks/regen-toolkit.yaml` for a worked 19-type example against Heenal's ontology).
- **Relationship Predicate Crosswalk → `relationships.yaml`.** Direct structural match — 5 predicate
  groups with `from`/`to` type constraints, and the `governance_csis` group marked `optional: true`
  (a fork may omit it entirely, R7) is the framework's version of Database_Spec's sensitivity-tiering.
- **Controlled Vocabularies → GAP.** The framework enforces vocabulary control *per schema*
  (`source-system.type`, `option-entry.category`, `deployment.readiness_level`, and so on) but has no
  central vocabulary-term registry carrying Database_Spec's rich mapping-type taxonomy (exact / close /
  broader / narrower / overlaps / conflicts-with / translated-as / locally-preferred / no-safe-mapping).
  Branch-local vocabulary (Database_Spec §37.1's third layer) has no schema home at all today.

**Normalization Flags (87 duplicate/conflict flags in Matty's `Canonical_DB.xlsx`) ↔ the B5
silent-overwrite guard — near, not identical, and worth stating precisely.** Database_Spec's 87 flags
are a *curated, finite* list: specific rows a human or AI process has already identified as probable
duplicates or conflicts, produced by the fuzzy entity-resolution Database_Spec describes in §56 (name
similarity, aliases, shared domain, source-system family — "high-confidence probabilistic matching").
The B5 guard (`packages/toolkit-framework/src/util.mjs`'s `sameStoredObject` + the store-time collision
check in `adapters/kb-folder.mjs` and `adapters/repo-data.mjs`, commit `fdafa8a`) is a *deterministic,
unbounded runtime mechanism*: on every `store`, if a new object's title-slug collides with an existing
one and the two are not the same object (by id, or by content hash if no id), the newcomer gets a
hash-suffixed key and the collision is logged — it fires on **any** title-slug collision, not a curated
list of 87. This was demonstrated at real scale on 2026-07-14: **65 B5 collisions preserved across a
722-object self-ingestion run** (the article corpus, `docs/plans/framework-validation-pass.md`). It is a
strong, live answer to Database_Spec's Definition of Done #1 ("re-running the same batch does not
create duplicate canonical objects").

But the two mechanisms are complementary, not the same tool: B5 only catches collisions that **share a
title slug**. It has no fuzzy/alias/domain-based matching, so it would miss exactly the class of
duplicate Database_Spec's §56.2 probabilistic matching is designed to catch — two records for the same
project under different names. Matty's 87 curated flags likely include cases like that. This is the
honest framing for the call: *"your normalization flagged 87 known dups by name-and-context matching;
our machine automatically catches a different, broader class — anything that collides on title — at
zero marginal cost, every run, forever. Neither replaces the other."*

---

## 6 · The gaps → T4

Full list with severity and disposition in `data/crosswalks/handoff-database-spec.yaml`'s `gaps` block
(17 items). The headline items, in priority order for the T4 framework-evolution round:

1. **Three status dimensions with no axis at all — currentness, confidence, maintenance.** All three
   are universal in Database_Spec's model (every object family needs them); the framework only has
   adjacent free-text fields scoped to one or two schemas each (`source-system.currentness`,
   `claim-evidence.uncertainty`). Highest priority because they're needed broadly, not locally.
2. **Relationships have no per-instance assertion record.** This is the most structurally significant
   gap in the whole crosswalk — see §7.
3. **Reviews have no dedicated object schema.** `review-promote` changes state but doesn't persist a
   structured Review record (type, scope, materials examined, findings, next-review date — §24.2).
4. **Research Notes and Structured Attachments, and Expansion Branches and Backlog, have no schema
   home.** `docs/BACKLOG.md` covers backlog *as a document*, not as typed, ingestible objects with
   research questions, stopping conditions, and reopening triggers.
5. **Entities have no dedicated schema** — the kernel types (person/group/place/bioregion) exist for
   graph typing, but none of Database_Spec's minimum entity fields or person/community safeguards
   (§14.3-14.4) have a home.
6. Smaller, schema-level fixes: `claim_mode`/`claim_type` controlled vocabulary on `claim-evidence.yaml`;
   Option system-change fields (§18.4) and the already-known capital gap (§18.5, in flight as the V4
   capital `update-proposal`); field-level public-use controls (`public_fields_allowed`,
   `sensitive_fields`); a "publish to public view" pipeline stage.

None of this blocks the Jul 16 slice ingestion — the framework's operational core (the 6 direct object
families, the pipeline, K1's 3 axes, the B5 guard) is exactly what a first prototype corpus needs. These
are the honest next-round items, not blockers.

---

## 7 · What does NOT map cleanly

The one place this crosswalk should not soften: **relationships.** Database_Spec's Core Decision #3
states plainly, "treat relationships as sourced assertions rather than invisible graph facts" — every
meaningful relationship should carry its own source, scope, temporal context, confidence, review state,
and public-use state (§33.1). The framework's `relationships.yaml` is a strong, well-designed **predicate
vocabulary** — arguably richer than Database_Spec's own predicate families in places (the
`source_lineage` group's `stewarded_by`/`curated_by`/`has_return_path`/`requires_attribution` has no
real Database_Spec counterpart) — but it is a vocabulary, not a record schema. When the framework
actually expresses a relationship today, it does so as a bare array of IDs on the *other* object
(`option-entry.related_concepts`, `track.options`, `deployment.selected_options`) — no confidence, no
source, no date, no review state attached to the edge itself. That is precisely the "invisible graph
fact" pattern Database_Spec's Core Decision #3 warns against, and it is a genuine, non-cosmetic
divergence between the two specifications, not a naming difference. It is also the reason the framework
can't express Database_Spec's per-relationship confidence_state at all (§6, item 2) — there's no record
to put a confidence field on. This is real T4 work: a `relationship-assertion` (or similarly named)
object schema, referencing the existing predicate vocabulary but carrying its own source, scope,
confidence, and review state per edge — the framework's graph currently trusts its own edges more than
either specification says it should.

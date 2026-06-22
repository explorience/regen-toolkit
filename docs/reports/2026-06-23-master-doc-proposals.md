# Master-Doc Feedback Proposals — R1–R10 (Loop 2)

> **Draft-and-present.** These are *suggested* edits to `docs/MASTER.md` (Matt's working document, 2026-06-15 iteration, 30,847 lines). **We did not edit the master doc.** Each proposal names a real internal inconsistency that building `@regen-commons/toolkit-framework` forced us to resolve, states how the framework resolved it, and gives the **exact edit** we'd suggest — so Matt can ratify, adjust, or reject one at a time.
>
> **Source of the resolutions:** [`framework/RECONCILIATIONS.md`](../../framework/RECONCILIATIONS.md) (R1–R10, decided 2026-06-17) and [`framework/COVERAGE.md`](../../framework/COVERAGE.md) §C. **This is the FEEDBACK-LOOPS Loop 2 deliverable** — the framework resolved the doc's contradictions; the doc's author ratifies.
>
> **How to read line numbers:** the master doc stacks several iterations. The long-form sections (§§1–21, lines ~1–24660) are the *earlier* expanded body; the **"Next Working Draft" (NWD)** at lines 25159–end is the *newest* compact stabilization layer with its own §§1–21 + Appendices A–H. Several contradictions are *between* these two layers, or *within* one. Where an edit applies to both, we say so.
>
> **Date:** 2026-06-23 · **Branch:** `regen-toolkit-os` · **Author context:** derived, not authoritative — for the group's decision.

---

## Summary — the ten proposals at a glance

| # | Contradiction (one line) | Edit type | Target | Priority |
|---|---|---|---|---|
| **R1** | ≥13 divergent maturity/state ladders across the doc | **Edit** — name 3 canonical axes; replace per-layer ladders with crosswalks | §4.3, §4.4, NWD §5 + every layer | ★ #1 |
| **R2** | Maturity / public-use / lifecycle conflated into single ladders | **Edit** (joint with R1) — model as 3 independent fields + 2 flags | §4.3, §4.4, NWD §5 | ★ |
| **R3** | Minimum Operating Kernel (5 objects) reads as a parallel type system vs the ~15–31-type ontology | **Edit** — state MOK = curated subset/front-door; map the 5 to ontology types | §3 / NWD §4 kernel + §5 / NWD §6 ontology | ★ |
| **R4** | Two non-matching 10-item layer stacks (Concept Ecology vs Source-System Registry) | **Edit** — one canonical 10-layer stack; Source-System Registry = sub-layer 3a | §3 (line 751) + NWD §4 (line 25723) | ★ |
| **R5** | §3 says both "Deployment → Tracks" and "Track → Deployment" | **Edit** — adopt Track→Deployment; note layer numbering ≠ temporal order | §3 lines 786 / 829 / 751 | ◆ |
| **R6** | The 18 principles and a 9-row cross-cutting table restate each other | **Edit** — keep §4 canonical; mark the table a rollup view (mapping, not content) | §3 (line 1256) + §4 | ◆ |
| **R7** | Octo-as-mandatory-base + firm CSIS conformance (in our YAML, not the doc) | **Confirm** — the master doc already holds the right posture; ratify it | NWD §6 (26117) — no edit | ◆ |
| **R8** | Three role lists: §15 (12) + §13 (11) + NWD §17 (17) | **Edit** — one 19-role superset registry with an "appears in" column | §15 / §13 / NWD §17 | ◆ |
| **R9** | Two relationship grammars (24 natural-language vs 26 snake_case) | **Edit** — one grammar, two surface forms; separable governance/CSIS group | §6.3 (5826) + NWD §6 (26061) | ◆ |
| **R10** | Canonical evolution loop present in §13 but not re-stated in NWD §15 | **Confirm + tiny edit** — re-state the loop name in NWD §15 | §13 (15036) + NWD §15 | ○ |

**Legend:** ★ keystone · ◆ spine · ○ later. **Edit** = we suggest changing the doc. **Confirm** = the doc is already right; ratify so the framework can lock it (the real fix is to our derived YAML, not the doc).

> **Two of the ten (R7, R10) need essentially no master-doc change** — the doc already holds the right answer; the inconsistency lives in our *derived* `data/*.yaml`, which the framework build corrected. We include them so the record is complete and so Matt can ratify the posture as canonical.

---

## R1 — Collapse the scattered maturity/state ladders into three named axes ★ (the #1 item)

**The contradiction.** The doc defines the same idea — "how developed / trustworthy / shareable is this?" — with **at least 13 different ladders**, each scoped to one layer, with overlapping-but-unequal values. Examples (verbatim, with locations):

- **§4.3 "Maturity and review state"** (lines 1432–1460) — 13 values: `Raw · Stub · Draft · AI-assisted draft · Candidate · Source-linked · Reviewed · Field-informed · Pattern-generating · High-risk · Open question · Deprecated · Archived`.
- **§6.5 "Entry status"** (lines 6003–6019) — 13 values: `Raw · To-place · Candidate · Source-linked · Source system · Reviewed · Field-informed · Pattern-generating · High-risk · Deprecated · Archived · Open question · Loose lead`.
- **§9 "Option maturity"** (lines 8828–8848) — 9 values: `Raw option · Candidate option · Draft option · Source-linked option · Experimental option · Field-informed option · Reviewed option · High-risk option · Deprecated option`.
- **§10 "Deployment validity levels"** (lines 11878–11888) — 9 values; **§16 "Deployment Readiness Levels"** (lines 19343–19351) and **NWD §13** (lines 27427–27443) give a *different* L0–L6 ladder.
- **§11 "Track maturity"** (12428–12448, 7 values), **§12 "Implementation maturity"** (14089–14099, 9 values), **NWD §10 "Concept maturity"** (26841–26861, 9 values), **§5/Encyclopedia** (~4131, 8 values), **§8 Concept review/tension status** (~7556 / ~7578, 5+5 values).

Same words (`Raw`, `Candidate`, `Reviewed`, `Deprecated`) recur with different neighbors and counts in every layer. A contributor (or a schema) cannot tell whether "reviewed" means the same thing in the Option Library as in Implementation Memory.

**Our resolution** (RECONCILIATIONS R1+R2). There is no single ladder because the doc is conflating **three orthogonal axes**. The framework defines one canonical enum per axis (encoded in `schemas/review-maturity.yaml`, keystone K1); every per-layer ladder crosswalks to them:

1. **`maturity`** — how developed/trustworthy the content is (9): `raw · draft · candidate · source-linked · reviewed · field-informed · pattern-generating · deprecated · archived`.
2. **`public_use`** — whether it is safe to expose publicly (10): `internal-only · raw-lead · ok-with-caveat · source-linked-unreviewed · reviewed-for-explanation · reviewed-for-guidance · requires-community-consent · requires-domain-review · not-public-yet · deprecated`.
3. **`lifecycle_state`** — where it sits in the intake→compost pipeline (10): `raw-lead · routed · extracted · source-linked · ai-synthesis · human-reviewed · field-informed · public-candidate · mature · compost`.

Plus two **boolean flags** (not states): `ai_assisted`, `high_risk`. (These appear *inside* §4.3's ladder today — "AI-assisted draft", "High-risk" — which is exactly the conflation: they are independent of how mature something is.)

**Good news: the doc already contains all three axes — just not labelled as orthogonal.** §4.4 "Public-use boundaries" (lines 1493–1506, 10 values) ≈ our `public_use` almost exactly. NWD §5 "Contribution states" (lines 25877–25897, 10 values) ≈ our `lifecycle_state` almost exactly. §4.3 ≈ our `maturity` once the two flags are pulled out. The fragmentation is that **every other layer re-invents its own ladder** instead of pointing at these three.

**The exact master-doc edit we suggest.**

1. **In §4 "Cross-Cutting Principles", promote 4.3 + 4.4 (and NWD §5 contribution-states) to a single named block: "The three trust axes."** Add an intro sentence before §4.3:

   > *Three independent questions are often collapsed into one "status" field, which is the largest source of vocabulary drift in this doc. Keep them separate: **maturity** (how developed/trustworthy), **public-use** (safe to expose?), and **lifecycle state** (where in intake→compost). Two further attributes — **AI-assisted** and **high-risk** — are flags, not states: anything at any maturity can be AI-assisted or high-risk.*

2. **Edit §4.3** to the 9-value `maturity` list above, and **move "AI-assisted draft" and "High-risk" out** of the ladder into a one-line "flags" note. ("Stub" folds into `draft`; "Open question" is a content type, not a maturity state.)

3. **In every per-layer section** that currently defines its own ladder (§6.5 Entry status, §9 Option maturity, §11 Track maturity, §12 Implementation maturity, NWD §10 Concept maturity, Encyclopedia), **replace the bespoke ladder with one line:** *"Uses the canonical `maturity` axis (§4.3). Layer-specific labels, if kept for readability, crosswalk to it as: <old → new>."* Keep a small crosswalk table per layer rather than a parallel vocabulary.

4. **Deployment is the one principled exception.** Keep **Deployment Readiness L0–L6** as a deployment-specific field (it encodes *operational* readiness, not content maturity), but **pick one L0–L6 list** (the NWD §13 wording, lines 27427–27443, supersedes §10 and §16) and **add an explicit crosswalk note** to `maturity` so the two are relatable, not conflated.

**Ripple / effort.** Large but mechanical: ~10 sections each lose a bespoke list and gain a one-line pointer + a small crosswalk. The framework already ships the crosswalks in `schemas/review-maturity.yaml`, so the doc edit is "adopt the names + delete the duplicates."

---

## R2 — Model the three axes as independent fields, not one collapsed ladder ★

**The contradiction.** Beyond the *number* of ladders (R1), the deeper issue is **shape**: several ladders mix all three axes into one enum. §4.3 "Maturity and review state" (1432–1460) puts `Reviewed` (a maturity step), `High-risk` (a risk flag), `AI-assisted draft` (an authorship flag), and `Open question` (a content type) on the *same* ordinal ladder — so "more reviewed" and "less risky" and "human-authored" become indistinguishable positions on one line. §6.5 mixes routing status (`To-place`, `Loose lead`) with maturity (`Reviewed`, `Pattern-generating`) in "Entry status."

**Our resolution** (RECONCILIATIONS R2, decided jointly with R1). The three axes are **independent fields**, not points on one ladder. A resource can be `maturity: reviewed`, `public_use: requires-community-consent`, `lifecycle_state: human-reviewed`, `high_risk: true` — four facts, not one. Collapsing them loses information (a reviewed item can still be not-public; a raw item can still be high-risk).

**The exact master-doc edit we suggest.** This rides on R1 — the §4 intro sentence and the split of §4.3/§4.4/NWD-§5 into three labelled fields *is* the R2 edit. The one addition specific to R2: **in §6.5, separate "routing status" from "maturity."** §6.5 already contains a routing list (lines 5966–5975: `Unrouted · Routed · Multi-route · To-review · To-split · To-merge · Parked · Archived`) **and** an "Entry status" maturity list (6003–6019). Keep the routing list as the `lifecycle_state` view; replace "Entry status" with the canonical `maturity` axis. Add: *"Routing state, maturity, and public-use are three separate fields on every entry — do not merge them into one status column."*

**Ripple / effort.** Small once R1 lands — mostly a clarifying sentence + the §6.5 split.

---

## R3 — State that the Minimum Operating Kernel is a subset of the ontology, not a parallel type system ★

**The contradiction.** The doc presents two object models that don't obviously connect:
- **Minimum Operating Kernel (5 objects)** — §3 (lines 847–862) and NWD §4 (lines 25707–25721): `Resource · Concept · Option · Deployment · Signal`. §3 helpfully says *"These five objects do not replace the full architecture. They provide a practical entry point for contributors"* (lines 861–862).
- **The entity ontology** — §5 "Candidate core types" / Layer A lists **15** core types (lines ~2290–2306: `Concept, Person, Group, Place, Bioregion, Practice, Pattern, Protocol, Playbook, Case Study, Question, Claim, Evidence, Artifact, Source System`), while **NWD §6 "Candidate core entity types"** lists **31** types in a flat list (lines 25997–26057, including `Resource, Option, Track, Deployment, Implementation, Signal, …`).

So a reader sees "5 kernel objects" *and* "15 core types" *and* "31 candidate types" — three numbers, no stated relationship. Are the 5 kernel objects new types? A subset? (Four of the five — `Resource`, `Option`, `Deployment`, `Signal` — don't even appear in the §5 Layer-A 15; only `Concept` does. They *do* appear in NWD §6's 31.)

**Our resolution** (RECONCILIATIONS R3). The 5 kernel objects are a **curated authoring profile — a "front door"**, not separate types. They are the 5 most-used entity types, promoted as the v0.1 entry surface. The schema for `Resource` is identical whether reached via the kernel or the full ontology. The framework encodes this as a `kernel: true` marker + a `kernel-profile.yaml` listing the 5, over the single `core-entities.yaml`. A contributor uses 5; the system refines into fuller types over time.

**The exact master-doc edit we suggest.**

1. **In the kernel definition** (§3 ~line 861 and NWD §4 ~line 25721), strengthen the existing "do not replace" line to make the relationship explicit:

   > *These five objects are not a separate type system. They are the five most-used entity types from the ontology (§5 / §6), promoted as the v0.1 front door. `Resource`, `Concept`, `Option`, `Deployment`, and `Signal` each carry the same schema whether a contributor reaches them through this kernel or through the full ontology. The kernel is a usage layer, not a parallel model.*

2. **In the ontology section** (NWD §6, after the candidate-types list ~line 26057), add a one-line cross-reference: *"The Minimum Operating Kernel (§4) is the subset {Resource, Concept, Option, Deployment, Signal} of these types, surfaced first for contributors."*

3. **Secondary (flag, don't necessarily fix now):** §5 says **15** core types and NWD §6 says **31**. These are two different "core" cuts. Recommend Matt pick the NWD §6 list as canonical and relabel §5's 15 as "Layer A interoperable core (frozen subset)" vs NWD's broader "candidate types" — so the two counts are a deliberate two-layer posture, not a contradiction.

**Ripple / effort.** Small — two clarifying sentences. The 15-vs-31 reconciliation (point 3) is a separate small decision.

---

## R4 — One canonical 10-layer stack; Source-System Registry is a sub-layer, not an 11th layer ★

**The contradiction.** The doc contains **two 10-item layer stacks that don't match.**

- **§3 "Core architecture"** (line 751): *"The Toolkit is organized around ten connected layers"* — and lists (lines 753–764): `1 Ontology · 2 Encyclopedia · 3 Resource Graph & Ecosystem Atlas · 4 Concept & Idea Ecology · 5 Option Library · 6 Deployment & Structural Integrity · 7 Tracks & Composition · 8 Implementation & Learning Memory · 9 Evolution · 10 Infrastructure & Substrate`. Source systems are **folded into Layer 3** (line 757: *"…datasets, maps, source systems, events…"*).
- **NWD §4 "Layer stack"** (line 25723) lists ten bullets — but **drops "Concept & Idea Ecology" from the list entirely** and **promotes "Source-System Registry" to its own layer** (line 25733: *"Source-System Registry: living knowledge environments that deserve care, attribution, and return paths"*). So NWD's ten are: `Ontology · Encyclopedia · Resource Graph · Source-System Registry · Option Library · Tracks · Deployment · Implementation · Evolution · Infrastructure`.

Net: the two stacks disagree on membership. NWD has effectively created an 11th concern (Source-System Registry) and silently lost Concept & Idea Ecology from the stack — even though Concept & Idea Ecology survives as a *content* section (NWD §10, line 26749). A reader can't tell if there are 10 or 11 layers, or whether Concept Ecology is a layer.

**Our resolution** (RECONCILIATIONS R4). **10 layers.** The Source-System Registry is a **sub-layer of Layer 3 (call it 3a)** within Resource Graph & Ecosystem Atlas — it's a specialised registry view of the same layer, not a peer. Concept & Idea Ecology stays a full layer. Encoded in `architecture/layers.md`.

**The exact master-doc edit we suggest.** **Make NWD §4's "Layer stack" match §3's membership** (the §3 list is the correct one). Specifically, edit the NWD bullet list (lines 25727–25745) to:

- **Restore** `Concept & Idea Ecology` as a layer (it is missing).
- **Demote** the standalone `Source-System Registry` bullet into a sub-item under `Resource Graph and Ecosystem Atlas`:

  > *Resource Graph and Ecosystem Atlas — people, organizations, projects, tools, protocols, maps, directories, events, media, and source systems.*
  >   *— Source-System Registry (sub-layer 3a): the living knowledge environments within the Resource Graph that deserve care, attribution, and return paths.*

- Result: one **10-layer** stack identical in membership to §3, with Source-System Registry clearly labelled as 3a.

(Note: this edit also carries the R5 ordering fix below — NWD already lists Tracks before Deployment, which is correct; §3's *numbering* puts Deployment before Tracks, addressed in R5.)

**Ripple / effort.** Small and contained to the NWD §4 layer-stack bullets — but high-value, because "how many layers are there" is a load-bearing fact repeated throughout the doc and the site IA.

---

## R5 — Resolve the Deployment↔Tracks ordering; state that layer numbering is not temporal order ◆

**The contradiction.** §3 contradicts *itself* on whether Tracks come before or after Deployment:

- **§3 "Compact system logic"** (line 786): *"Ontology → Knowledge → Resources → Options → **Deployment → Tracks** → Implementation → Evolution"* — and the §3 layer table numbers Deployment as Layer 6, Tracks as Layer 7.
- **§3 "Core movement"** (line 829): *"Resource → Concept → Option → **Track → Deployment** → Implementation → Signal → Evolution"* — and line 814: *"…Compose → Specify…"* where Compose = build a Track, Specify = a Deployment.

So within one section, the layer-grouping order says **Deployment → Tracks** and the operating-loop order says **Track → Deployment**. NWD §4 (lines 25699, 25703) and the layer body sections (§10 lines 12055–12093, §11 lines 12222–12229) consistently use **Track → Deployment** ("a track helps prepare a deployment, but does not replace it").

**Our resolution** (RECONCILIATIONS R5). These are **two different views, and that's fine** — but the doc must say so. The **operating loop** (Discover→…→Evolve / Resource→Concept→Option→**Track→Deployment**→Implementation→Signal→Evolution) is the *human/temporal spine*. The **layer stack numbering** is a *data-model grouping*, not a sequence of steps. The **cross-layer mapping table** is the bridge. Encoded in `architecture/operating-loop.md`. The substantive ordering, where temporal, is **Track → Deployment** (Compose before Specify).

**The exact master-doc edit we suggest.**

1. **Fix the §3 internal contradiction:** change the "Compact system logic" arrow (line 786) so it does not imply a temporal order that contradicts line 829. Either (a) reorder it to `… → Options → Tracks → Deployment → Implementation → …` to match the operating loop, or (b) relabel it explicitly as a *grouping*, not a sequence.
2. **Add one clarifying sentence** under §3 "Core architecture" (after line 764) and mirror it in NWD §4:

   > *The layer numbering is a data-model grouping, not a sequence of steps. The temporal flow is the operating loop (Resource → Concept → Option → Track → Deployment → Implementation → Signal → Evolution): people **compose** a Track before they **specify** a Deployment. The cross-layer mapping table bridges the two views.*

3. **Align the layer-stack numbering** so Tracks precedes Deployment where the doc presents layers in loop order (NWD §4 already does this — lines 25737–25739; §3's table is the outlier).

**Ripple / effort.** Small — one arrow edit + one clarifying sentence in two places. Removes a genuinely confusing self-contradiction.

---

## R6 — Keep the 18 principles canonical; mark the 9-row cross-cutting table a rollup view ◆

**The contradiction.** The same cross-cutting concerns are written **twice**, at two levels of detail, with no statement of which is canonical:

- **§4 "Cross-Cutting Principles"** (lines 1334–2065) — **18 numbered principles**: `1 Provenance · 2 Attribution & return paths · 3 Maturity & review state · 4 Public-use boundaries · 5 Claim-evidence discipline · 6 Review scales with risk · 7 Regenerative obligation · 8 Consent/privacy/representation · 9 Anti-extractive synthesis · 10 Interoperability without forced uniformity · 11 Type/tag discipline · 12 Pattern humility · 13 Local & ecological care · 14 AI-assisted but human-governed · 15 Infrastructure serves workflows · 16 Living systems health · 17 Compost/archive/memory · 18 Contribution should be legible`.
- **§3 "Cross-cutting systems"** (lines 1256–1272) — a **9-row table**: `Provenance & Attribution · Review & Maturity · Privacy, Consent & Identity · Standards & Interoperability · Discovery & Affinity · Interface & Navigation · Synthesis & Sensemaking · Regenerative Obligation · Claim-Evidence Discipline`.

The 9-row table is a coarser restatement of ~6 of the 18 principles, *plus* introduces three concerns (Discovery & Affinity, Interface & Navigation, Synthesis & Sensemaking) that aren't in the 18, *and* omits nine that are (pattern humility, local/ecological care, AI governance, infra-serves-workflows, living-systems health, compost, legible contribution, type/tag, anti-extractive synthesis). Two lists, partial overlap, neither marked authoritative.

**Our resolution** (RECONCILIATIONS R6). The **18 principles are the single home**. The 9-row table is a **coarser rollup** — keep it as a *mapping/index view*, not a second source of content. Where the table names a concern not in the 18 (Discovery, Interface, Synthesis), decide whether it's a *principle* (add to the 18) or an *infrastructure capability* (move to §14). Encoded in `process/principles.md`.

**The exact master-doc edit we suggest.**

1. **Add a header note to the §3 table** (before line 1262):

   > *This table is a rollup index of the 18 Cross-Cutting Principles (§4), grouped for orientation. §4 is canonical; do not state principle content here — only map to it.*

2. **Add a "maps to principle(s)" column** to the §3 table so each of the 9 rows points at its §4 principle number(s). The three rows with no §4 home (Discovery & Affinity, Interface & Navigation, Synthesis & Sensemaking) are flagged for a decision: promote to a 19th–21st principle, or relocate to §14 Infrastructure as capabilities.
3. **Do not edit the 18 principles' content** — they stay the source of truth.

**Ripple / effort.** Small — a note + a mapping column + one routing decision for three orphan rows.

---

## R7 — Confirm the align-and-map / CSIS-informed posture (the doc is already right) ◆

**The status.** This is a **confirm, not an edit.** The contradiction was between our *derived* `data/ontology/*.yaml` (which hardcoded *"every type MUST resolve to an Octo base"* + a firm `csis_requirement`) and the master doc, which had already **softened** to a candidate/advisory posture. The framework adopts the **doc's** posture; the fix lands in our YAML, not in `MASTER.md`.

**What the master doc already says** (verbatim, NWD §6 "Octo / BKC, SuperBenefit, CSIS, and Toolkit mapping posture", lines 26117–26131):

> *"Octo / Bioregional Knowledge Commons is a major ontology alignment **candidate**. … The Toolkit should map to these systems where useful, but **should not imply that any one of them is already the official base**. … Learn from adjacent systems without pretending they are final authorities. Align where useful. Extend where necessary. Preserve attribution. **Avoid premature lock-in.**"*

And NWD §6 "CSIS semantic overlay" (line 26135):

> *"CSIS should not replace the ontology. It should function as a structural integrity **overlay** that adds review questions, constraints, and relationships…"*

This is exactly the framework's posture: `maps_to_core` (the generalised `octo_base`) is **encouraged but optional** ("map where clean alignment exists"); CSIS is a **separable optional overlay module**; a fork can run the core kernel with zero CSIS edges.

**What we ask of the group.** **Ratify this as the canonical, single statement of the posture**, so the framework can lock it and so any residual firmer language elsewhere in the doc (or in third-party copies of the old ontology YAML) is superseded. **No master-doc edit is required** — only confirmation. (If Matt wants belt-and-suspenders: add a one-line pointer from §5's older ontology discussion to NWD §6 as the canonical posture, so the two ontology passes don't drift.)

**Ripple / effort.** None in the doc. The corresponding YAML relaxation (mandatory→advisory mapping) is done framework-side at SP2.

---

## R8 — One 19-role superset registry with an "appears in" provenance column ◆

**The contradiction.** Three divergent role lists, partially renamed:

- **§15 "Working roles"** (lines 17960–18305) — **12 roles**: `Knowledge Gardener · Source-System Steward · Concept Steward · Ontology Steward · Option Steward · Deployment Reviewer · Implementation Scribe · Domain Reviewer · Community Reviewer · Technical Maintainer · Editorial Steward · AI Workflow Reviewer`.
- **§13 "Evolution roles"** (lines 15661–15673) — **11 roles**: as above minus Concept Steward / Editorial Steward / AI Workflow Reviewer, plus `Evolution Steward` and `Track Steward`.
- **NWD §17 "Contributor role families"** (lines 27925–27957) — **17 roles**, partly renamed: `contributor · resource scout · source-system steward · concept editor · ontology steward · option-library gardener · track designer · deployment reviewer · implementation memory steward · public-use reviewer · domain reviewer · technical maintainer · AI workflow maintainer · community connector · conflict / restricted-memory steward · documentation editor · public forum facilitator`.

So "Option Steward" (§15) = "option-library gardener" (§17); "Implementation Scribe" (§15) = "implementation memory steward" (§17); "Community Reviewer" = "community connector"; "Editorial Steward" = "documentation editor." Same roles, three vocabularies, three counts (12/11/17).

**Our resolution** (RECONCILIATIONS R8). One reconciled **superset role registry of 19 scoped roles**, each with an **"appears in" provenance column** (§15 / §13 / §17), so naming history is preserved without three competing lists. Encoded in `process/roles.md`.

**The 19-role superset** (canonical name → appears in):

| # | Canonical role | §15 | §13 | NWD §17 |
|---|---|:--:|:--:|:--:|
| 1 | Contributor (generic entry) | | | ✓ |
| 2 | Resource Scout | | | ✓ |
| 3 | Knowledge Gardener | ✓ | ✓ | |
| 4 | Source-System Steward | ✓ | ✓ | ✓ |
| 5 | Concept Steward / Editor | ✓ | | ✓ |
| 6 | Ontology Steward | ✓ | ✓ | ✓ |
| 7 | Option Steward / Library Gardener | ✓ | ✓ | ✓ |
| 8 | Track Steward / Designer | | ✓ | ✓ |
| 9 | Deployment Reviewer | ✓ | ✓ | ✓ |
| 10 | Implementation Scribe / Memory Steward | ✓ | ✓ | ✓ |
| 11 | Evolution Steward | | ✓ | |
| 12 | Public-Use Reviewer | | | ✓ |
| 13 | Domain Reviewer | ✓ | ✓ | ✓ |
| 14 | Community Reviewer / Connector | ✓ | ✓ | ✓ |
| 15 | Technical Maintainer | ✓ | ✓ | ✓ |
| 16 | AI Workflow Reviewer / Maintainer | ✓ | | ✓ |
| 17 | Editorial / Documentation Steward | ✓ | | ✓ |
| 18 | Conflict / Restricted-Memory Steward | | | ✓ |
| 19 | Public Forum Facilitator | | | ✓ |

**The exact master-doc edit we suggest.** Make **NWD §17 the canonical role registry** and replace the role *enumerations* in §15 and §13 with a pointer + the table above. Concretely:

1. In NWD §17, insert the 19-role table above as "Contributor role registry (canonical)," with the "appears in" column.
2. In §15 "Working roles" (line 17950) and §13 "Evolution roles" (line 15657), replace the standalone lists with: *"See the canonical role registry (NWD §17). The roles most active in this layer are: <short subset>."*

**Ripple / effort.** Medium — one new table + two list-to-pointer replacements. Eliminates the worst naming drift in the doc.

---

## R9 — One relationship grammar with two surface forms + a separable governance/CSIS group ◆

**The contradiction.** Two relationship vocabularies, different style and membership:

- **§6.3 "Core relationship types"** (lines 5828–5854) — **24 contributor-facing, natural-language** predicates: `is a · part of · related to · created by · maintained by · stewarded by · cites · references · adapts · inspired by · supports · enables · used by · implemented by · informs · has concept · has option · has evidence · has risk · requires review · updates · deprecates · conflicts with · complements`.
- **NWD §6 "Candidate relationship predicates"** (lines 26065–26115) — **26 formal `snake_case`** predicates: `created_by · maintained_by · sourced_from · cites · supports · challenges · explains · related_to · depends_on · requires · enables · blocks · used_by · implemented_by · governed_by · funded_by · stewarded_by · reviewed_by · accountable_to · has_authority · has_control_point · has_failure_mode · generates_signal · has_public_use_boundary · requires_review · should_not_be_public_without_consent`.

These overlap (~14 shared concepts) but are **not the same grammar**: different naming convention, different counts, and the NWD set adds a **governance/CSIS cluster** (`governed_by, funded_by, reviewed_by, accountable_to, has_authority, has_control_point, should_not_be_public_without_consent`) that §6.3 lacks. A schema generator can't target both.

**Our resolution** (RECONCILIATIONS R9). **One unified `relationships.yaml` grammar** with: a `core_interop` group, domain groups (resource / concept / option / deployment), and a **separable optional `governance_csis` module** (the NWD governance cluster — see R7: a fork can run core with zero CSIS/governance edges). The two existing lists become **two surface forms of one grammar**: contributor-facing labels (`stewarded by`) ↔ formal predicates (`stewarded_by`). Encoded in `schemas/relationships.yaml`.

**The exact master-doc edit we suggest.**

1. **Merge §6.3 and NWD §6 into one table** (place canonical in NWD §6, point §6.3 at it), with three columns: **contributor label** · **formal predicate** · **group**. Example rows: `stewarded by | stewarded_by | core_interop`; `governed by | governed_by | governance_csis`; `has risk | has_failure_mode | deployment`.
2. **Tag the governance/CSIS cluster as a separable optional group**, with a note: *"These predicates form the governance/CSIS overlay (see the CSIS posture, NWD §6). They are optional: a minimal fork can use `core_interop` alone."*
3. In §6.3, replace the 24-item list with: *"The contributor-facing labels for the canonical predicate grammar (NWD §6). Each maps 1:1 to a formal predicate."*

**Ripple / effort.** Medium — one merged table + a mapping. The framework already ships `schemas/relationships.yaml` in this shape, so the doc edit mirrors an existing artifact.

---

## R10 — Confirm the canonical evolution loop; re-state it by name in NWD §15 ○

**The status.** Mostly a **confirm.** The substantive fix — retiring the old `Capture / Classify / Review / Update / Communicate / Version` loop — applies to our *derived* `data/feedback-process.yaml`, not to the master doc, which already holds the right loop.

**What the master doc already says** (verbatim). §13 "Core evolution loop" (line 15036):

> *Signal → Sensemaking → Balance Assessment → Intervention → Integration → Memory*

This canonical 6-step loop appears consistently in the long-form body (lines 594, 1170, 14954, 15036, 15949). It matches the framework's canonical adaptive loop (`process/evolution-loop.md`). The old Capture/Classify/Review/Update/Communicate/Version loop is **not** in the master doc — it was only in our YAML.

**The one small gap.** **NWD §15 "Evolution layer and restricted memory"** (lines 27621–27710) defines signal types and a response vocabulary but **does not re-state the loop by name** — so a reader of the newest layer alone won't see "Signal → Sensemaking → Balance Assessment → Intervention → Integration → Memory."

**The exact master-doc edit we suggest.** **Add one line to NWD §15** (near line 27623), re-stating the canonical loop so the newest layer is self-contained:

> *The Evolution layer runs the adaptive loop: **Signal → Sensemaking → Balance Assessment → Intervention → Integration → Memory.** The signal types and response vocabulary below are the inputs and verbs of that loop.*

Otherwise: **confirm** the §13 loop as canonical; the framework and our YAML now match it.

**Ripple / effort.** Trivial — one sentence in NWD §15. The YAML fix is done framework-side.

---

## How to apply these

- **Nothing here is committed to `docs/MASTER.md`.** Matt owns that doc; these are suggestions to accept, adjust, or reject **one reconciliation at a time** — the table at the top is the menu.
- **Highest leverage first:** R1/R2 (the maturity-vocabulary collapse) removes the single largest source of drift and unblocks every schema. R4 (one layer stack) and R8 (one role registry) remove the most-repeated factual contradictions. R3, R5, R6, R9 are clarifying edits. R7 and R10 are confirmations — the doc is already right; ratifying them lets the framework lock the posture.
- **Each resolution is already encoded framework-side** (the `schemas/` + `architecture/` + `process/` files named in each section), so for every proposal the doc edit is "adopt names already shipped," not "invent something new."
- **Provenance:** these proposals derive from [`framework/RECONCILIATIONS.md`](../../framework/RECONCILIATIONS.md) (R1–R10) and [`framework/COVERAGE.md`](../../framework/COVERAGE.md) §C, generated 2026-06-17 from a 6-reader gap analysis of `docs/MASTER.md`. See [`framework/FEEDBACK-LOOPS.md`](../../framework/FEEDBACK-LOOPS.md) — this document is the **Loop 2** artifact.

---
title: "Toolkit Contributions Pipeline — Other Valuable Work"
project: regen-toolkit
date: 2026-04-25
status: open / brainstorm
related:
  - docs/plans/onepager-and-layers.md
  - docs/plans/vault-bootstrap.md
methodology:
  - "superpowers:brainstorming (this doc — exploratory)"
  - "Convert each candidate to its own plan once committed to"
---

# Plan E — Toolkit Contributions Pipeline

> Catalog of contributions Luiz could make to the toolkit beyond the org-os overlay (PR #310), the vault bootstrap (Plan B), the one-pager + LAYERS.md (Plan C), and the sharing pack (Plan D). Not committed work — a queue to triage and convert into named plans as bandwidth allows.

**Framing:** What's high-leverage for the toolkit, plays to Luiz's existing position (Layer 4 + Layer 5 + Ontology cross-cuts + org-os overlay author), and doesn't step on a layer owner's toes (Heenal owns Encyclopedia + Tracks; Brandon owns Resource Graph; Matt owns ontology taxonomy + master doc).

---

## Tier 1 — Likely high-leverage (run after current commitments)

### 1. Lift the master-doc URL lists into `data/resources.yaml`

- **Why valuable:** The master doc has 11+ domain URL lists (~3,900 lines). They're unstructured. Brandon owns the Resource Graph layer but the lifting is mechanical, not curatorial — it can be done by anyone with a script, then handed to Brandon for curation. Unblocks downstream Resource Graph work without making layer-ownership demands.
- **Scope:** Read master doc resource sections → emit `data/resources.yaml` with `{id, type, url, domain, source_section}` entries → cross-link from `LAYERS.md` Layer 1 section.
- **Effort:** 2–4 hours (mostly script + light cleanup).
- **Coordination:** Loop in Brandon after — the curation pass is his call.

### 2. Frame-language audit pass on the master doc

- **Why valuable:** Durgadas's 2026-04-23 critique flagged that the doc is "rife with framing that sabotages intent" — Frame 1 (extractive/hierarchical) language describing regenerative processes. Doing a first-pass audit (annotating instances) gives Durgadas concrete material to work with rather than starting from scratch.
- **Scope:** Read the master doc, flag every Frame 1 pattern (governance, accountability, scaling, growth, etc. used in extractive senses), produce `docs/frame-language-audit.md` with line refs and proposed rewrites.
- **Effort:** Half-day to a day for a thorough pass.
- **Coordination:** Pure preparation work — Durgadas reviews + decides what changes to apply.
- **Dependency:** Wait until Matt's current iteration push lands (don't flag against a moving target).

### 3. CSIS conformance posture document

- **Why valuable:** Today the toolkit's CSIS posture is informal ("strict in Deployment, secondary in Feedback"). Making it formal — what conformance means, what's measured, what passes/fails — turns CSIS from a reference into an actual standard. Useful for Durgadas's CSIS work AND for the toolkit's credibility.
- **Scope:** `docs/CSIS-conformance.md` — define posture per layer, list conformance criteria, mark current state per criterion, identify gaps. Builds on the alignment report (already exists).
- **Effort:** Half-day; substantial because it requires real thinking about conformance, not just transcription.
- **Coordination:** Co-author with Durgadas if possible.

### 4. Ontology V1 + V2b overlay implementation

- **Why valuable:** The master doc recommends V1 base + V2b semantic overlay but the implementation is open. Doing it (or scaffolding it) produces a concrete artifact for Rather/Matt to react to.
- **Scope:** Extend `data/ontology/regen-toolkit-entities.yaml` + `regen-toolkit-relationships.yaml` to include the V2b CSIS-optimized overlay with explicit `version: v2b-overlay` flags. Document the layering in `data/ontology/README.md`.
- **Effort:** A day; requires close reading of the master doc's ontology sections.
- **Coordination:** Rather is the standard owner — present for review, don't merge unilaterally.

### 5. Article frontmatter → KOI-ready RIDs

- **Why valuable:** When KOI federation lands (Wave 2 of refi-dao-os), the toolkit's 67 published articles want to flow into the federation as `orn:regentoolkit.knowledge:<slug>` RIDs. Adding a `koi.rid` field to article frontmatter now makes that future migration zero-friction.
- **Scope:** Add `koi.rid: orn:regentoolkit.knowledge:<auto-from-slug>` to all 67 published articles. Document the convention in `docs/writing-system.md`. Future articles get the field at creation time.
- **Effort:** 1–2 hours (mostly scripted; spot-check after).
- **Dependency:** RID schema spec finalized in refi-dao-os (already done in 2026-04-25-koi-integration-design.md §2).

---

## Tier 2 — Possibly valuable, lower priority

### 6. Implementation case study scaffolding (Layer 7)

- **Why valuable:** Layer 7 (Implementations) is unowned and stub-state. Even one case study (e.g., Coop PL Genesis as a deployment of Option Library + Deployment Layer choices) gives the layer a starting shape. Doesn't claim ownership — provides material.
- **Scope:** `packages/operations/case-studies/coop-pl-genesis.md` template + filled outline.
- **Effort:** Half-day for one good case study.

### 7. Feedback loop instrumentation (Layer 8)

- **Why valuable:** Layer 8 (Feedback & Evolution) is also unowned. The 5-step loop in `data/feedback-process.yaml` is theoretical — it's never been run. Designing a lightweight instrumentation (where signals come in, how they flow through capture → classify → review → update → communicate → version) makes the layer actionable.
- **Scope:** `docs/feedback-instrumentation.md` proposal + minimal example using the toolkit's own dogfooding (PR #310 itself is feedback signal — what does the loop do with it?).
- **Effort:** Half-day for a proposal; another day to instrument.

### 8. Toolkit dashboard customization — pipelines from data

- **Why valuable:** The current `dashboard.yaml` defines pipelines for Articles / Layers / Plans but `data/layers.yaml` doesn't exist yet. Creating it (with per-layer status + owner from `LAYERS.md`) makes the dashboard actually show layer pipeline status — concrete progress visualization.
- **Scope:** `data/layers.yaml` (per-layer status) + verify dashboard renders the Layers pipeline correctly.
- **Effort:** 1–2 hours.

### 9. Writing-system ↔ org-os integration

- **Why valuable:** The 5-stage editorial pipeline (Research → Draft → Fact-check → Edit → Critique) has scripts (`generate-critique.js`, `pipeline-cron.sh`) but isn't well-documented in the org-os layout. Adding the pipeline as a canonical workflow in the org-os instance (linked from `MASTERPLAN.md`, with skills cross-referenced) makes it discoverable.
- **Scope:** Update `docs/writing-system.md` with org-os integration section; add to `MASTERPLAN.md` development-flow section.
- **Effort:** 1–2 hours.

---

## Tier 3 — Speculative / long-horizon

### 10. KOI consumer install in the toolkit

- **Why valuable:** Once refi-dao Wave 1 stabilizes (`regen-koi-mcp` consumer working), install it in the toolkit too. Makes the toolkit a KOI consumer immediately; toolkit-team queries can then reference Regen federation knowledge.
- **Dependency:** refi-dao-os Wave 1 declared stable.
- **Effort:** 1 hour install + smoke test.

### 11. Sovereign KOI node for the toolkit (Wave 2 follow-on)

- **Why valuable:** When refi-dao Wave 2 ships sovereign sensors, the toolkit becomes a candidate adopter. Running a toolkit KOI node lets the federation see toolkit articles, master-doc structure, layer state — without copying data.
- **Dependency:** refi-dao Wave 2 + extraction to `org-os/packages/koi/` (Wave 3).
- **Effort:** Multi-week, mostly waiting on Wave 3.

### 12. Frame-3 ladder design contribution

- **Why valuable:** Durgadas talks about designing the Frame 3 → Frame 2 → Frame 1 decomposition with a "ladder back up." The toolkit's Layer architecture *is* a decomposition. Whether it preserves a ladder is an open question. Documenting the toolkit-as-decomposition explicitly, identifying where the ladder breaks (or doesn't exist), is a contribution to Durgadas's larger work AND clarifies the toolkit's CSIS posture.
- **Dependency:** Durgadas's frame-language doc landing first.
- **Effort:** Open-ended.

---

## Triage

For each candidate above, the question is:
1. Is this layer-owner work? → Defer to layer owner; offer help.
2. Is this enabling work that unblocks owners? → High-priority; do it.
3. Is this peripheral nice-to-have? → Park.

**Recommended ordering** (subject to operator confirmation):

1. **Plan B** (vault bootstrap) — finish the data
2. **Plan C** (one-pager + LAYERS) — make the structure usable
3. **Plan D** (sharing pack) — bring the team in
4. **Tier 1 #1** (Resources lift) — high-leverage enabling work for Brandon
5. **Tier 1 #5** (KOI-ready frontmatter) — cheap future-proofing
6. **Tier 1 #4** (Ontology V1+V2b) — give Rather material to react to
7. **Tier 1 #2** (Frame-language audit) — wait for Matt's iteration first
8. **Tier 1 #3** (CSIS conformance posture) — deeper work, after the above

Tier 2 + 3 stay in this doc as a ready inventory; convert each to a named plan when committing.

---

## How to act on this plan

Each Tier 1 candidate, when committed to, gets its own plan file in `docs/plans/`:

```
docs/plans/resources-lift.md
docs/plans/koi-ready-frontmatter.md
docs/plans/ontology-v1-v2b.md
docs/plans/frame-language-audit.md
docs/plans/csis-conformance.md
```

Update `docs/plans/QUEUE.md` accordingly when promoting from this brainstorm doc to a real plan.

---

## References

- Master doc: `docs/MASTER.md`
- LAYERS.md (when written): `docs/LAYERS.md`
- CSIS reference: `docs/CSIS.md` + `docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md`
- KOI design (mirrored): `docs/from-refi-dao/koi-integration-design.md` + `docs/from-refi-dao/koi-integration-wave-1-plan.md` + `docs/from-refi-dao/koi-integration-7-phase-plan.md`
- Frame-language context: `memory/2026-04-24.md` "New signals" section + `packages/operations/meetings/260423 Regen Web3 Toolkit Planning Call.md` (when vault-bootstrap runs)

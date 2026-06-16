# Framework Review — Placement & Operation

> **Status:** review for discussion (2026-06-17). Requested before continuing past P1. This examines **where the framework lives** and **how it operates**, grounded in the actual federation topology. Pairs with [`README.md`](README.md), [`SEPARATION.md`](SEPARATION.md), and [D1](../docs/plans/architecture-lifecycle-vs-layers.md).

---

## 1. Ground truth — the topology we're actually in

From `federation.yaml` + the vault structure:

```
lf-zettelkasten-os (hub vault)
└─ 03 Libraries/
   ├─ regen-coordination-os/         ← THE org-os FRAMEWORK (template + standards)
   │  └─ repos/
   │     ├─ organizational-os-template/   (the org-os template)
   │     └─ regen-toolkit/   ← WE ARE HERE = ReFi Web3 Toolkit INSTANCE
   │                            upstream: github.com/regen-coordination/org-os-template (overlay sync)
   ├─ refi-dao-os/           ← sibling org instance (future toolkit instance — P9)
   ├─ refi-bcn-os/           ← sibling org instance (future toolkit instance — P10)
   └─ refi-med-os/, dao-os/, coop-os/, bread-coop-os/, …
```

**Three facts that change the framework question:**
1. **regen-toolkit is already an org-os instance.** It overlays `org-os-template`. The "framework vs instance" pattern *already exists* — we're inside it. org-os = framework, regen-toolkit = instance.
2. **The generic substrate already flows from upstream** (overlay sync from org-os-template): the `/initialize`–`/close` mechanism, registries, base skills, federation. We don't re-own those.
3. **refi-dao-os / refi-bcn-os are siblings** (at `03 Libraries/`), each already its own org-os instance. They are the *targets* for the toolkit framework (P9/P10). *(Path note: from `regen-toolkit`, they're `../../../refi-dao-os`, not `../refi-dao-os` — fix in P9/P10.)*

## 2. What the framework IS, restated in topology terms

The "Regen Knowledge Commons Toolkit framework" is **not a new top-level thing** — it's a **knowledge-commons *profile* of org-os**:

```
org-os  (substrate: overlay mechanism, registries, base skills, federation, instance pattern)
  └─ + Knowledge Commons profile  (THE framework we're naming)
        · the layer/lifecycle architecture (D1)
        · the resource-graph + source-system model
        · the journey-based site generator (Heenal's work)
        · the CSIS-informed contribution/review process
        · the knowledge-commons agent skills (curator, meeting/podcast intake, resource lift)
        └─ = INSTANCE  (org-os + profile + domain content)
              · regen-toolkit  → ReFi Web3 content
              · refi-dao-os    → ReFi DAO podcasts/blog (P9)
              · refi-bcn-os    → bioregional/local-node (P10)
```

So the framework sits **between org-os and the instances** — a specialization layer. This is the cleanest mental model and it reuses the federation pattern that already works.

## 3. WHERE it should live — options

The framework has **two kinds of content** with different homes:

**(a) Generic substrate additions** (skills, schemas, the overlay mechanics) → belong **upstream in `org-os-template`** (push when stable; instances inherit via overlay sync). Low debate.

**(b) The knowledge-commons profile** (layer/lifecycle spec, journey site generator, resource/source-system model, CSIS process) → the real placement question:

| Option | What | Pros | Cons |
|---|---|---|---|
| **1. In-repo `framework/`** (current) | profile spec lives in regen-toolkit | zero infra; the praxis is here; iterate freely | conflates framework w/ instance (the thing we're separating); a 2nd instance must copy/submodule |
| **2. Fold into `org-os-template`** | profile becomes part of the generic template | one upstream; all instances inherit | org-os is broader than knowledge-commons; pollutes the generic template with KC-specific stuff |
| **3. Own template repo** | `regen-knowledge-commons-template` (an org-os *profile* template) | clean; versioned; instances overlay it like they overlay org-os | most overhead now; Matty: "not necessarily its own repo yet" |
| **4. Hybrid, phased** (recommended) | spec in `framework/` now → generic bits upstream as they stabilize → extract profile to its own template when a 2nd instance needs it | matches reality; lets the boundary be *discovered*, not guessed; no premature abstraction | requires discipline to not let instance creep into `framework/` |

## 4. HOW it operates — the operation model

An instance running the framework follows the **lifecycle loop** (D1) on the org-os substrate:

```
/initialize  (org-os: sync all branches)
   ↓
CAPTURE   domain sources (podcasts, blog, links, transcripts, repos)
   → via skills: knowledge-curator, meeting/podcast intake, resource-lift
   ↓
UNDERSTAND · RELATE · COMPOSE · SPECIFY   (route into layers/registries; ontology relates)
   ↓
REVIEW    CSIS-informed queues (maturity/review state; not-endorsement caveats)   ← P5
   ↓
IMPLEMENT · LEARN · EVOLVE   (cases, signals, feedback back into the commons)
   ↓
INTEROPERATE   generate the journey site (public door) + schemas/feeds
   ↓
/close  (org-os: sync) → FEDERATE via RegenOS (declare upstream/downstream)
```

**Relationships:**
- **To org-os:** the framework is an org-os *profile* (specialization). org-os gives the substrate + mechanism; the profile adds the knowledge architecture + site generator + process.
- **To RegenOS** (`regen-coordination-os` as the coordination layer): RegenOS **federates instances** (upstream/downstream; knowledge-source vs organizational federation). The framework is **what each instance runs**; **self-qualifying adoption = running the framework's process** — which is exactly RegenOS's non-arbitrary federation filter. (So the framework and RegenOS are two halves of the same story: framework = the thing you adopt; RegenOS = how adoption federates you in.)
- **To the instance:** instance = profile + `data/` + content + identity files. To make a new instance: overlay the framework, fill the lifecycle/layer slots, run the skills over the domain's sources.

## 5. Recommendation

1. **Adopt the mental model:** the framework is a **knowledge-commons profile of org-os** (§2). State it in `README.md`. This dissolves most of the confusion.
2. **Placement: Option 4 (hybrid, phased).** Keep the **spec** in `framework/` *now* (where the praxis is, low-risk, iterable). Mark generic pieces in `SEPARATION.md` for **upstream to org-os-template** as they stabilize. **Let P9 (refi-dao-os) force the profile extraction** — when a second instance actually needs to consume the profile, extract it to its own template repo (Option 3). Don't abstract before the second consumer exists.
3. **Operation: confirm the lifecycle loop (§4)** as the framework's operating model (depends on D1 confirming the lifecycle spine).
4. **Boundary discipline:** `framework/` holds **only domain-agnostic** spec/templates. Anything ReFi-specific stays in the instance (`data/`, `src/content/`). `SEPARATION.md` is the contract; review it with the group before any file moves (mark-don't-move, P1).
5. **Don't restructure the repo yet.** Validate the boundary with the **P3 prototype** + group feedback first. The framework is being *recognized* (it's the group's praxis); recognition before relocation.

## 6. Key decisions for you / the group
1. **Confirm the model** — framework = knowledge-commons *profile* of org-os? (Yes → everything else follows.)
2. **Placement now** — keep spec in `framework/` (recommended) vs push to org-os-template now vs own repo now?
3. **Extraction trigger** — agree "extract the profile to its own template *when refi-dao-os needs it* (P9)" rather than now?
4. **What goes upstream to org-os-template** — which generic skills/schemas/mechanics, and on what cadence? (coordinate with the org-os framework at `regen-coordination-os`.)
5. **Framework ↔ RegenOS naming** — are they two halves (adopt-the-framework / federate-via-RegenOS), or is "RegenOS" the umbrella? (affects P6 docs.)

## 7. What this review does NOT decide (deferred)
- The lifecycle-vs-layers spine → **D1** (must land first; it shapes the profile's structure).
- The physical file extraction → **P1 Phase 5** (after boundary validated).
- ReFi Commons stewardship/branding of the framework → **P8** (if the toolkit moves under ReFi Commons, the framework's home/branding may shift — keep `framework/` thin until then).

---

_This is a review to discuss, not a restructure. Recommendation in one line: **the framework is org-os's knowledge-commons profile; keep its spec in `framework/` now and let the second instance (ReFi DAO) force the extraction — recognize the boundary before relocating it.**_

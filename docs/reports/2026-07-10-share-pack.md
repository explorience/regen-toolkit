# Share Pack — Knowledge Commons Toolkit, full update (2026-07-10)

**Status: DRAFTS for review — nothing sent.** One consolidated update covering the whole arc since the 2026-07-02 biweekly: framework **0.2 "the machine"** → org-os binding → ReFi DAO pilot → the ontology comparison + what it opens → what's happening now. Supersedes the 2026-07-05 drafts (`docs/reports/2026-07-05-share-pack.md`) and extends the 2026-07-02 pack (`docs/reports/2026-07-02-toolkit-framework-share-pack.md`).

**Framing:** each step as *what it is → what it means → what it unlocks* (the frame the group responded to).

**Before sending — check:**
- **Attribution:** master doc = **Matt**; current toolkit content + ontology = **Heenal's build**. Make sure names read right.
- **Baseline:** the group saw the framework-as-package *direction* on the 07-02 call (ratified verbally); the async messages were never sent. This pack assumes they remember the direction and shows how far it got — not a from-scratch intro.
- **Channel + links:** set the real channel/handles; the site + repo links below are live and correct.
- **Honest line:** the 119 articles *map* 1:1 (reconciliation); they haven't been *re-ingested through the machine* yet — that's queued. Kept accurate below.

---

## A · Message to the group

> **Since the last call, the knowledge-commoning tooling went from "a direction we ratified" to a running system — and there's a lot to share.** Here's the whole arc, and what each step opens up. 🌱
>
> **1 · The framework is now a working machine, not just a package.**
> The master doc (~24.7k lines) is a tested package — *and* it now runs the full loop: capture → review → publish. Agents draft candidates; only a validated accept-gate writes storage; a human review queue gates what gets promoted. Ingestion and storage are cleanly separated (Durgadas's point — you can swap where things live without touching how they're captured). 100/100 tests, and it's extracted to its own public repo.
> → *What it means:* the method is executable end-to-end. You adopt the machine, not read the doc.
> → *What it unlocks:* any org can pour real content in and get a structured, reviewed, interoperable commons out — with shared types, so knowledge stops being siloed per project.
>
> **2 · It's wired into org-os, and installed centrally.**
> There's now a binding that turns any org-os instance into a knowledge commons out of the box — and both pieces live in the canonical org-os.
> → *What it means:* no org rebuilds this. You inherit it.
> → *What it unlocks:* network-wide adoption from one source, and federation between instances (RegenOS).
>
> **3 · ReFi DAO is the first live pilot.**
> The commons is initialized in the ReFi DAO instance and configured for its site, with its blog corpus queued.
> → *What it means:* the first real org is set up to run its own commons on its own content.
> → *What it unlocks:* bringing ReFi DAO's blog into a structured, *reviewed* (not scraped) federated commons — the template for every org after it.
>
> **4 · We now know exactly how the current toolkit relates to the framework.**
> A full ontology comparison of the current toolkit build against the framework kernel: the 119 live articles map **1:1, cleanly** — 19 types, 0 unmapped.
> → *What it means:* adopting the framework doesn't cost the existing work; there's a clean crosswalk, not a migration.
> → *What it unlocks:* moving forward as one decision instead of a migration debate.
>
> **5 · The one thing to feed upstream: the 8 Forms of Capital.**
> Everything maps except capital accounting — the kernel doesn't hold it yet, and it's the regenerative heart of the current build.
> → *So the path is hybrid:* adopt the framework as the shared backbone, and contribute the capital model back into it. Align and feed the missing piece upstream — not conform to a standard.
>
> **What's happening now:** a small round of kernel fixes the comparison surfaced (a place for "held for review" items, a couple of schema fixes), then the real self-ingestion of the current content through the machine. The capital contribute-back is the flagship proposal — that one I want to shape together.
>
> Full write-up + the open items for the group: `docs/reports/2026-07-05-ontology-comparison.md` (§8). Happy to walk anyone through it live.

---

## B · Message to Matty (DM)

> Hey Matty — proper update on the toolkit-framework + KMS work, and where I'd love your hand on it.
>
> Since our call, a few things landed:
>
> **The framework became a real machine.** Not just the master doc as a package — the full loop runs now: agents draft candidates, a validated accept-gate is the only thing that writes storage, and there's a human review queue before anything gets promoted. Ingestion and storage are cleanly separated (Durgadas's point — swap where things live without touching capture). 100/100 tests, extracted to its own public repo. First real ingestion was our 07-02 planning call itself → 10 typed objects.
> → We're well past "spec." The method runs end-to-end.
>
> **I built the org-os binding around it and installed both into the canonical org-os.** Any instance becomes a knowledge commons out of the box, and instances can federate.
> → We can roll this across the network from one source.
>
> **Stood up the ReFi DAO pilot** — commons initialized, configured for their site, blog corpus queued.
> → The first real org is ready to run its own commons. The proof case for the ReFi Commons home conversation.
>
> **Ran the comparison we talked about** — the current toolkit ontology vs the framework kernel. The 119 articles map **1:1** (19 types, nothing unmapped). And the framework is clearly the stronger backbone: the whole L5–L10 operational layer (~26 types the current build doesn't model), the 3-axis honest-state model, and the federation primitives (`source-system` return-paths, `bioregion`) the current ontology doesn't carry.
> → We can adopt the framework without losing any current work.
>
> **The one real gap is the 8 Forms of Capital — and I think it's a genuine contribute-back to the master doc.** The kernel has no capital-accounting axis or predicates at all; the current build carries it first-class. This is the piece I'd most like to shape with you — as a proper update-proposal to the doc. Alongside it, a couple of small, non-controversial schema fixes I'm doing now (a "held for review" state for the ~700 resource rows that currently have no home; `track.outcome` → array; a first-class public-use-boundary field; widening the source-system type list).
>
> It's also the substrate for the ReFi Commons home conversation — the shared knowledge layer both orgs would federate on. Full write-up: `docs/reports/2026-07-05-ontology-comparison.md` (§8 = what's decided vs what needs the group).
>
> Want to grab time this week to shape the capital proposal + look at the pilot together?

---

## C · Message to Rather (reply / DM)

> Rather — quick update, because this overlaps directly with what you're picking up. The framework's now a working machine (capture → review → publish), and the schema/graph substrate for the retrieval piece is built and portable: core/extension entities + relationships emit a JSON-LD `@context` (graph/AI-readable), everything typed with stable ids + `maps_to_core`. So retrieval/graphing plugs straight onto it — you'd own the graph store + retrieval, the framework owns the type/relationship contract, and we don't build the schema layer twice.
>
> There's also a fresh ontology comparison (current toolkit build ↔ the framework kernel, 1:1 clean) that's exactly the "forkable but interoperable ontology" mechanism — worth comparing notes with your Geo Protocol ontology work; the `maps_to_core`/crosswalk piece is the interop contract.
>
> Can we sync this week so we line up rather than parallelize? Substrate + report: `packages/toolkit-framework/` + `docs/reports/2026-07-05-ontology-comparison.md`.

---

## D · Links (for when you send)

- **Live pages** (GitHub Pages preview):
  - `https://luizfernandosg.github.io/regen-toolkit/framework/` — what the framework is, live schema/skill/adapter counts, kernel-check
  - `https://luizfernandosg.github.io/regen-toolkit/regen-toolkit-os/` — this instance + the first pipeline run (live from `kb/index.json`)
- **Public framework repo:** `https://github.com/luizfernandosg/toolkit-framework` (`npx degit luizfernandosg/toolkit-framework` → `npm install` → 100/100 → `init`)
- **Full comparison report:** `docs/reports/2026-07-05-ontology-comparison.md` (§8 = open items for the group)
- **Crosswalk + diff:** `data/crosswalks/regen-toolkit.yaml`, `data/crosswalks/comparison.yaml`
- **The framework + binding:** `packages/toolkit-framework/` (`@regen-commons/toolkit-framework`), `packages/org-os-kms/` (`@org-os/kms`) — also in canonical org-os `packages/`
- **Per-instance adoption runbook:** `docs/plans/2026-07-05-org-os-kms-per-instance-adoption.md`
- **Getting started (7-step machine walkthrough, real output):** `packages/toolkit-framework/docs/GETTING-STARTED.md`

---

## E · Action items

- [ ] **Luiz — confirm attribution** (Matt / Heenal read right in all three) + set the real channel/handles.
- [ ] **Luiz — send:** group post · Matty DM · Rather reply.
- [ ] **Matty — time this week** to shape the capital contribute-back proposal + look at the ReFi DAO pilot.
- [ ] **Rather — sync this week** on the schema/graph substrate + Geo Protocol ontology.
- [ ] **Group — the §8 open items** (capital contribute-back, schema fixes, content-curation calls).

# Share Pack — Knowledge Commons Toolkit progress (2026-07-05)

**Status: DRAFTS for review — nothing sent.** Two messages sharing what was done, from the master-doc framework build onwards — framed around what each step *means* and *unlocks*. Companion to the full report: `docs/reports/2026-07-05-ontology-comparison.md`.

Attribution to check before sending: master doc = **Matt**; current toolkit content/ontology = **Heenal's build**. Adjust names/links/channel to taste.

---

## A · Message to the group

> **The Regen Knowledge Commons Toolkit is now real infrastructure — a running system, not a doc.** Sharing where it got to, and what each step opens up.
>
> **The framework is on the repo.**
> The master doc (~24.7k lines) is now a working, tested package — the semantic kernel, the honest-state model, "the machine" (capture → review → publish), the schemas and skills.
> → *What it means:* the method is executable, not just described. You adopt the package, not read the doc.
> → *What it unlocks:* shared types across orgs — so knowledge becomes interoperable, not siloed per project.
>
> **It's wired into org-os, and installed centrally.**
> There's now a binding that turns any org-os instance into a knowledge commons out of the box — and both packages live in the canonical org-os.
> → *What it means:* no org has to rebuild this. You inherit it.
> → *What it unlocks:* network-wide adoption from one source — and federation between instances (RegenOS).
>
> **ReFi DAO is the first live pilot.**
> The commons is initialized in refi-dao-os and configured for its site.
> → *What it means:* the first real org is set up to run its own commons, on its own content.
> → *What it unlocks:* bringing ReFi DAO's blog (207 articles) into a structured, reviewed, federated commons — reviewed, not scraped — as the template for every org after it.
>
> **We now know exactly how the current toolkit relates to the framework.**
> Heenal's 119 articles reprocessed through the framework — they map **1:1, cleanly**.
> → *What it means:* adopting the framework doesn't cost us the existing work; there's a clean crosswalk.
> → *What it unlocks:* moving forward with confidence — one decision, not a migration debate.
>
> **The one thing to feed upstream: the 8 Forms of Capital.**
> Everything maps except capital accounting — the kernel doesn't hold it yet, and it's the regenerative heart.
> → *So the path is hybrid:* adopt the framework as the shared backbone, and contribute the capital model back to it. Align and feed the missing piece upstream — not conform to a standard.
>
> **Open for the group** (§8 of the report): the capital contribute-back, a couple of schema fixes, some content-curation calls. Happy to walk anyone through it.
>
> Report: `docs/reports/2026-07-05-ontology-comparison.md`

---

## B · Message to Matty (DM)

> Update on the toolkit-framework + KMS work — and, more to the point, what it opens up.
>
> **The framework is now on the repo as a real package.** The master doc distilled into something installable and tested.
> → We're past "spec" — the method runs.
>
> **I built the org-os binding around it and installed it into the canonical org-os.** Any instance becomes a knowledge commons out of the box.
> → We can roll this out across the network from one source, and instances can federate.
>
> **Stood up a ReFi DAO pilot** — KMS initialized, configured for their Quartz site, blog corpus queued.
> → The first real org is ready to run its own commons. The proof case.
>
> **Ran the comparison we talked about** — Heenal's build vs the framework ontology. The 119 articles reprocess **1:1**.
> → We can adopt the framework without losing the current work. And it's clearly the stronger backbone — the whole L5–L10 operational layer, the 3-axis state model, the federation primitives (`source-system`, `bioregion`) Heenal's ontology doesn't carry.
>
> **The one real gap is the 8 Forms of Capital** — and I think it's a genuine contribute-back to the master doc. The kernel has no capital-accounting axis at all; Heenal carries it first-class.
> → This is the piece I'd love to shape with you — as an update-proposal to the master doc. Plus two small schema fixes (`track.outcome` → array; a first-class `public_use_boundary` field).
>
> It's also the substrate for the ReFi Commons home conversation. Written up: `docs/reports/2026-07-05-ontology-comparison.md`

---

## C · Links (for when you send)

- **Full report:** `docs/reports/2026-07-05-ontology-comparison.md` (§8 = open items for the group)
- **Crosswalk + diff:** `data/crosswalks/regen-toolkit.yaml`, `data/crosswalks/comparison.yaml`
- **The framework + binding:** `packages/toolkit-framework/` (`@regen-commons/toolkit-framework`), `packages/org-os-kms/` (`@org-os/kms`) — also installed in canonical org-os `packages/`
- **Per-instance adoption runbook:** `docs/plans/2026-07-05-org-os-kms-per-instance-adoption.md`

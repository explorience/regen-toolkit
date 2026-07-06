# Share Pack — Knowledge Commons Toolkit progress (2026-07-05)

**Status: DRAFTS for review — nothing sent.** Two messages sharing what was done, from the master-doc framework build onwards. Companion to the full report: `docs/reports/2026-07-05-ontology-comparison.md`.

Attribution to check before sending: master doc = **Matt**; current toolkit content/ontology = **Heenal's build**. Adjust names/links/channel to taste.

---

## A · Message to the group

> **Regen Knowledge Commons Toolkit — the stack is real and running end-to-end.** Quick share on where this landed.
>
> The arc:
>
> **1. The framework is built.** The master doc (~24.7k lines) is now distilled into a working, tested package — `@regen-commons/toolkit-framework`: the semantic kernel (15 core + 31 extension types across 10 layers), the honest-state model, "the machine" (capture → review → publish), 22 schemas, 7 agent skills, 3 storage adapters. 100 tests green. You adopt the package, not the 30k-line doc.
>
> **2. It plugs into org-os.** Built `@org-os/kms` — the binding + profile that makes any org-os instance a knowledge commons out of the box (session lifecycle, registry bridge, CLI, RegenOS federation). 44 tests. Installed into the canonical org-os, so every node can adopt it.
>
> **3. ReFi DAO is the first pilot.** The KMS is initialized in refi-dao-os and configured for its site; the next step is bringing its blog corpus (207 articles) into the commons — reviewed, not scraped.
>
> **4. We compared the two ontologies.** Took the toolkit's current content (Heenal's build) and ran it through the framework: the 119 live articles map **1:1, cleanly**. Full crosswalk + comparison is written up.
>
> **The headline:** adopt the framework as the shared backbone — and **contribute the 8 Forms of Capital back to it.** That's the one regenerative construct the kernel doesn't yet hold; everything else maps. So this isn't "conform to a standard," it's "align, and feed the missing piece upstream."
>
> **Open for the group:** the capital contribute-back (a proposal for the master doc), a couple of small schema fixes, and some content-curation calls — all in §8 of the report. Happy to walk anyone through it.
>
> Report: `docs/reports/2026-07-05-ontology-comparison.md`

---

## B · Message to Matty (DM)

> Quick update on the toolkit-framework + KMS work — it landed further than I expected.
>
> The framework (the operational distillation of the master doc) is now a real, installable, tested package, and I built the org-os binding around it — `@org-os/kms` — so any instance becomes a knowledge commons out of the box: lifecycle, registry bridge, federation, the lot (44 tests). Installed it into the canonical org-os and stood up a **ReFi DAO pilot** — KMS initialized, configured for their Quartz site, blog corpus queued.
>
> Then I ran the comparison we'd talked about: the toolkit's current content (Heenal's build) vs the framework ontology. The **119 articles reprocess into framework objects 1:1**, cleanly — the framework is clearly the stronger operational + interop backbone (it carries the whole L5–L10 operational layer, the 3-axis state model, and the federation primitives — `source-system`, `bioregion` — that Heenal's knowledge-typing ontology doesn't).
>
> The one real gap — and I think it's a genuine **contribute-back to the master doc** — is the **8 Forms of Capital.** Heenal's ontology carries them as a first-class extension (+ capital-flow predicates); the framework kernel has no capital-accounting axis at all. Everything else maps; capital is the thing worth adding upstream. I'd love to shape that update-proposal with you. There are also two small schema fixes worth doing (`track.outcome` → array; a first-class `public_use_boundary` field).
>
> Full detail's written up if useful: `docs/reports/2026-07-05-ontology-comparison.md`. Also relevant to the ReFi Commons home conversation — this is the substrate for it.

---

## C · What each links to (for when you send)

- **Full report:** `docs/reports/2026-07-05-ontology-comparison.md` (§8 = open items for the group)
- **Crosswalk + diff:** `data/crosswalks/regen-toolkit.yaml`, `data/crosswalks/comparison.yaml`
- **The framework + binding:** `packages/toolkit-framework/` (`@regen-commons/toolkit-framework`), `packages/org-os-kms/` (`@org-os/kms`) — also installed in canonical org-os `packages/`
- **Per-instance adoption runbook:** `docs/plans/2026-07-05-org-os-kms-per-instance-adoption.md`

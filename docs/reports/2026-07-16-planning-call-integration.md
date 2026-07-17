# Integration Report — 2026-07-16 Toolkit Biweekly (+ Matty 1-on-1)

**For:** the toolkit group · **From:** Luiz (RegenOS processing) · **Status:** draft-and-present — review before posting to the group

> This is the open-tasks compilation the call agreed I'd generate from processing the meeting notes through RegenOS. Two meetings the same day: the morning **Matty 1-on-1** (framework build + dev pipeline) and the **biweekly**. Source notes: [`260716 Toolkit meeting with Matty`](../../packages/operations/meetings/260716%20Toolkit%20meeting%20with%20Matty.md) · [`260716 Regen Web3 Toolkit Planning Call`](../../packages/operations/meetings/260716%20Regen%20Web3%20Toolkit%20Planning%20Call.md).

## Where we are (one paragraph)

**The engine is built — now we feed it.** The framework package is built from the master doc, all existing repo content + the recent handoff DB are ingested (the diff caught the eight-forms-of-capital gap and aligned content to the ontology), and there's a **live dev→prod pipeline**: `regen-toolkit-os` = dev/review, `main` = prod (auto-deploys to the live site on merge). The same infrastructure runs in parallel for ReFi DAO and ReFi Barcelona. The next phase is empirical — feed the engine raw data, look at the outputs, and adjust the engine from concrete results rather than reasoning about it in the abstract.

## The unblock

**Repo migration to the Regen Coordination GitHub org.** Nearly everything below is gated on it — the Netlify dev build, GitHub Projects, Rather's Astro fix, and the integration-report PR flow. **Hina:** please accept the org invite, transfer the repo to the Regen Coordination org, and reconnect the live-website repo. Luiz will DM the details.

## The content workflow (once the dev build is live)

1. **Feed raw data** into the RegenOS engine.
2. Engine **generates an integration report** with open tasks (like this one).
3. **Share the report** with the group for review.
4. **PR to update content** in `main` → **merge** → the live site updates.

Branches: `regen-toolkit-os` = **dev**, `main` = **prod**.

## Content-review → public-release path (~2–4 weeks)

- **Staging site** to review the framework-processed content **side-by-side vs the current build** (watch the **graph view** for relationship shifts).
- **Checklist + named-reviewer sign-off** per page before merge.
- Then **push live** → **forum post** + possibly open the (currently-private) repo. We're **skipping the soft "tap a couple people on the shoulder" stage** — go to a broader public share once reviewed.
- **Privacy gate (hard requirement):** verify the **name-flagging/removal feature** before anything goes public.

## Open tasks by owner

### Luiz
- [ ] Share **repo-migration details** with Hina (Regen Coordination org + Netlify dev build). **★ unblocks the rest.**
- [ ] Stand up the **staging/dev site**; drive the **review → PR → merge** checkpoint.
- [ ] **Verify the name-flagging/removal feature** (privacy gate).
- [ ] Improve the **Obsidian canvases** + a **one-page intro doc**.
- [ ] Write the **repo-access + agent-onboarding one-pager** (clone · agents · basic GitHub + tutorial links).
- [ ] Open a **Geo Protocol scoping doc** (can start blank) — loop in Rather + Regis.
- [ ] Set up **GitHub Projects** post-migration; confirm agent auto-issue creation from reports.
- [ ] Confirm the **~69 source systems**; integrate the **ReFi DAO carbon-copy DB**.
- [ ] Connect with **Ron Teretsky**; schedule the **Brad / Bread Co-op call**.

### Rathermercurial
- [ ] **Fix the broken Astro content collections** (document the v4→v7 foot guns) after the transfer, without disrupting current work.
- [ ] **Jam on Geo Protocol** with Luiz + Regis.
- [ ] Publish **source-scoring sense-making** as a possible sub-standard.

### Durgadas
- [ ] Share the **CRAFT evidence/claims layer + Temper** (modular evidentiary ingestion swap-in — the "prove it" counter-posture; clean because ingestion ≠ storage).
- [ ] **Republish + share the four facilitation case studies** + the community-tailored-playbooks framework.

### Trinity
- [ ] **Create content to learn-and-teach** — bridge for less-technical contributors as focus shifts to feeding the engine.

### Monty / funding
- [ ] Toolkit **funding strategy at the next Regen Coordination sync** — update the existing project (lean) vs a toolkit-specific one; Artizen timing.
- [ ] **Everyone:** create an **Artizen profile** (artizen.fund) + **hold your boosts** — save them for a coordinated **3–4× multiplier** push (~$2,400 pool; $3k → $20k+ potential). **DM Monty** if you need funds now.

## Decisions recorded

- Migrate the repo to the **Regen Coordination org**; open a **Netlify dev build**. `regen-toolkit-os` = dev, `main` = prod.
- **Feed-the-engine** phase (stop tinkering with the engine); provenance version-stamping is first-class.
- **CRAFT evidentiary layer** = modular, swappable alternative ingestion posture; **Geo Protocol** = next integration exploration.
- **Standards:** DAOstar (Metagov) + CSIS + DAO IP5 (impact-per-dollar).
- **Content legibility:** developer-first lens as the useful filter now; abstraction later.
- **Public release:** skip the soft feedback stage; name-flagging verified before public; ~2–4 week review window.
- **Funding:** hold Artizen boosts, wait for a multiplier, one coordinated push; likely update the existing project.

## Attribution note

The Granola auto-summary attributed the **CRAFT evidence/claims layer + Temper widget** to *Rathermercurial*. Given CRAFT/CSIS/"my standards" are **Durgadas's** body of work, this note attributes them to **Durgadas** — please correct me if that's wrong. Rather's contributions were the **Astro foot-gun flag** and **Geo Protocol**.

---

_Generated 2026-07-17 from the 2026-07-16 Granola captures. Registry: `mtg-20260716-regen-web3-toolkit-planning` + `mtg-20260716-toolkit-worksession-matty`. Active tasks tracked in [`HEARTBEAT.md`](../../HEARTBEAT.md)._

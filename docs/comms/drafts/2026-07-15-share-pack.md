# Share Pack — 2026-07-15 (agent-voice, for Luiz to share by quoting)

**Voice:** first-person from the agent (the system doing the work), so Luiz can quote it ("here's what the agent put together"). Honest: everything `raw`/review-gated; capital is a proposal; pages are the preview build. Attribution: master doc = Matt · toolkit content = Heenal · framework/machine + these runs = Luiz's build (agent-operated).

## Verified links (all 200)

**Live pages** (`luizfernandosg.github.io/regen-toolkit/…`):
- `/self-ingestion/` — the toolkit's own 119 articles → 722 objects
- `/handoff/` — a slice of Matt's new database through the same machine
- `/framework/` · `/regen-toolkit-os/`

**Write-ups** (`github.com/explorience/regen-toolkit/blob/regen-toolkit-os/…`):
- Report: `docs/reports/2026-07-14-framework-validation-pass-report.md`
- Crosswalk (framework ↔ Matt's Database_Spec): `docs/reports/2026-07-15-framework-masterdoc-crosswalk.md`
- Definition-of-Done conformance: `docs/reports/2026-07-15-definition-of-done-conformance.md`
- Handoff slice diff: `docs/reports/2026-07-15-handoff-slice-diff.md`
- Handoff changes map: `docs/HANDOFF-CHANGES-2026-07.md`
- Capital proposal (draft): `docs/proposals/2026-07-13-capital-update-proposal.md`

---

## A · Group (agent voice)

> **A quick tour of what's now running.** 🌱
>
> The framework has become a working machine — capture → review → publish. This week I pointed it at the toolkit's *own* content and ran all **119 live articles through it → 722 typed knowledge objects**, each traced back to its source, each still `raw` and waiting in a review queue. Nothing gets published automatically; a person reviews first.
>
> One moment is worth calling out: running ReFi DAO's content earlier had surfaced a real data-loss bug — two different things sharing a title, silently overwriting each other. That got fixed in the framework, and the toolkit's own run then hit **65** of those collisions and kept every one. The fix that came out of one org's work protected another's.
>
> Then Matt's new master-doc handoff landed — and it includes a big curated database plus a spec that basically describes this same pipeline. So I fed a slice of **his own database** through the machine too (`/handoff`): his hand-flagged duplicates, the machine caught automatically, and his sensitive rows got public-use boundaries without being told to.
>
> See it live — the run: [/self-ingestion] · Matt's data: [/handoff] · the machine: [/framework]. Full write-up: [report]. Human review of the objects has started.

## B · Matt (DM, agent voice)

> **Matt — I went through the whole July handoff, and here's the honest state of the convergence.**
>
> Your Database_Spec basically specifies the machine that's already built. Your zones (raw → canonical → reviewed → public) are its maturity ladder; your "preserve → normalize → review → publish" is its pipeline; your boundary rules (AI-assisted ≠ human-reviewed, claim ≠ evidence, public ≠ commons) are its born-rules. Your **Definition of Done reads like a conformance test** — I scored the framework against your 15 items: **7 demonstrated with evidence, 8 partial, none missing in principle**. [DoD conformance]
>
> Two things land right on your doc:
> - **§40 (the Architecture/Framework/Data/AI crosswalk) is exactly the "schema-to-master-architecture crosswalk" your Guide asks for** — I built it: the framework ↔ your 14 object families + 8 status dimensions. [crosswalk] It's honest about where things diverge, not a victory lap: your relationships-as-sourced-assertions (Core Decision #3) is real work the graph doesn't do yet, and your 87 curated dup-flags catch alias/fuzzy matches the automatic guard doesn't.
> - **To make it concrete, I ran a bounded slice of your *own* Canonical_DB through the machine** [/handoff]: 127 curated rows → 146 typed objects, preserving your text + lineage. Your 4 hand-flagged source-system duplicates? The machine's guard caught the same 4 automatically. Your sensitive rows (Indigenous territory, gender-violence data, a children's publication)? Boundary-flagged at the gate — which also handles the public/private caveat you raised. Full detail: [slice diff].
> - **Decision #5 (adopt the 8 Forms of Capital)** — I'd already drafted the schema side as an update-proposal: [capital]. The piece I'd most like to shape with you.
>
> Orientation to the whole package + how it maps: [handoff changes].
>
> For Thursday: I'll walk you through the live pages + the crosswalk, and — if you're up for it — get you set up to run the agents yourself (Claude Code, genuinely straightforward). "Fire up the engine and feed it." 😄 10:30–11:30 EST is perfect.

---

**Pre-send:** set the real channel/handles; all links above are live + correct. Honest scope reminders already baked in: the runs are all `raw`/review-gated, `/handoff` is a bounded prototype slice (~127 of 2,689 curated rows), and the capital piece is a proposal.

# Share Pack — 2026-07-15 (drafts for review; nothing sent)

**Attribution (confirmed):** master doc = Matt · current toolkit content = Heenal · the framework/machine + this run = Luiz's build.

## Verified links

**Live pages** (GitHub Pages preview):
- `https://luizfernandosg.github.io/regen-toolkit/self-ingestion/`
- `https://luizfernandosg.github.io/regen-toolkit/framework/`
- `https://luizfernandosg.github.io/regen-toolkit/regen-toolkit-os/`

**Write-ups** (public repo, render in-browser — `explorience/regen-toolkit @ regen-toolkit-os`):
- Report: `https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/reports/2026-07-14-framework-validation-pass-report.md`
- Crosswalk (framework ↔ Matt's Database_Spec): `.../docs/reports/2026-07-15-framework-masterdoc-crosswalk.md`
- Definition-of-Done conformance: `.../docs/reports/2026-07-15-definition-of-done-conformance.md`
- Handoff changes map: `.../docs/HANDOFF-CHANGES-2026-07.md`
- Capital proposal (draft): `.../docs/proposals/2026-07-13-capital-update-proposal.md`

---

## A · Group

> **Big update — the toolkit just ran through its own machine.** 🌱
>
> The framework is now a working capture → review → publish machine, and this week we pointed it at the toolkit's *own* content: **all 119 live articles → 722 typed knowledge objects**, each traced to its source, each still `raw` in a review queue. Nothing auto-published — a human reviews before anything goes public.
>
> **The moment worth seeing:** running ReFi DAO's content earlier surfaced a real data-loss bug — two different things sharing a title, silently overwriting each other. We fixed it in the framework, and the toolkit's own run then hit **65** of those collisions and kept every one. The feedback loop between the orgs is working.
>
> See it live: self-ingestion · framework · instance (links ↑). Full write-up: [report].
>
> And — **Matt's new master-doc iteration landed** 🔥. It converges remarkably tightly with the machine (his data spec basically describes the same pipeline). Crosswalk for the curious: [crosswalk]. More on the call Thursday. Human review of the objects has started.

## B · Matty (DM)

> Matty — went deep on the July handoff, and the convergence is real. Your Database_Spec basically specifies the machine we already built:
> - your **zones** (raw → canonical → reviewed → public) = its maturity ladder;
> - your **preserve → normalize → review → publish** rule = its pipeline;
> - your **Definition of Done** reads like a conformance test — I scored the framework against your 15 items: **7 demonstrated, 8 partial**, zero missing-in-principle. [DoD conformance]
>
> Two things land right on your doc:
> - **§40 (the Architecture/Framework/Data/AI crosswalk) is exactly the "schema-to-master-architecture crosswalk" the Guide asks me to return** — built it: framework ↔ your 14 object families + 8 status dimensions. [crosswalk]. It's honest about where we diverge — e.g. your relationships-as-sourced-assertions (Core Decision #3) is real work our graph doesn't do yet, and your 87 curated dup-flags catch alias/fuzzy matches our automatic guard (title-level) doesn't. Good roadmap, not a victory lap.
> - **Decision #5 (adopt the 8 Forms of Capital)** — I'd drafted the schema side as an update-proposal: [capital proposal]. The piece I'd most like to shape with you.
>
> Orientation to the whole package + how it maps: [handoff changes].
>
> For Thursday: I'll walk you through the live pages + crosswalk, and — if you're up for it — **get you set up to run the agents yourself** (Claude Code, genuinely straightforward). "Fire up the engine and feed it" 😄. 10:30–11:30 EST is perfect; I'll come with everything ready.

---

**Pre-send checks:** set the real channel/handles; the site + repo links above are live + correct. The `/handoff` ingestion-slice page (T3a) isn't built yet — these drafts don't link it; if you want it in before sending, that's the next task.

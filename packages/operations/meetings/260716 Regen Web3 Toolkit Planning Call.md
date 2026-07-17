---
id: "meeting-20260716-regen-web3-toolkit-planning"
type: planning
date: "2026-07-16"
title: "Regen Web3 Toolkit Planning Call — Repo Migration, Feed-the-Engine, CRAFT Layer + Artizen Funding"
participants:
  - Matty (Mattycompost)
  - Luiz Fernando
  - Drew Simon
  - Monty Bryant
  - Trinity Morphy
  - Afo
  - Heenal (1heenal)
  - Rathermercurial
  - Caue "Koi" Mtomaz
  - Regis (Thetokenjedi / Civilmonkey — handle uncertain)
  - Durgadas
projects:
  - "[[regen-web3-toolkit]]"
related:
  - toolkit-framework
  - regen-os
  - dev-pipeline
  - repo-migration
  - craft-framework
  - csis
  - geo-protocol
  - artizen
  - regen-coordination-funding
  - github-projects
related_meetings:
  - meeting-20260716-toolkit-worksession-matty
  - meeting-20260702-regen-web3-toolkit-planning
signals:
  - repo-migration-regen-coordination
  - netlify-dev-build
  - integration-report-workflow
  - dev-prod-branch-pipeline
  - astro-content-collections-broken
  - astro-v4-v7-footguns
  - feed-the-engine-phase
  - craft-evidence-claims-layer
  - swappable-ingestion-layers
  - temper-ui-widget
  - geo-protocol-scoping-doc
  - community-tailored-playbooks
  - facilitation-case-studies
  - content-legibility-abstraction
  - developer-first-filter
  - content-to-learn-and-teach
  - github-projects-gap
  - ai-agents-auto-issues
  - onboarding-one-pager
  - regen-coordination-funding-pool
  - artizen-multiplier-strategy
  - hold-boosts-coordinate-push
source_file: "Zettelkasten root: 260716 Regen Web3 Toolkit Planning Call.md (Granola auto-transcription — noisy multi-speaker; speaker attribution unreliable)"
transcript_included: true
---

# Regen Web3 Toolkit Planning Call — Repo Migration, Feed-the-Engine, CRAFT Layer + Artizen Funding

**Date:** Thursday, 2026-07-16 (biweekly)
**Attendees:** Matty, Luiz, Drew Simon, Monty Bryant, Trinity Morphy, Afo, Heenal, Rathermercurial, Koi (Caue), Regis, Durgadas
**Type:** Planning (biweekly)

> **Transcript quality + attribution note.** Very noisy Granola multi-speaker capture — a single "Them" channel collapses all non-Luiz speakers, and the auto-summary's speaker labels are unreliable. This note leans on the auto-summary for structure but **corrects one attribution**: the **CRAFT evidence/claims evaluation layer demo + the Temper UI widget** were almost certainly **Durgadas** (CRAFT/CSIS/"my standards" are his body of work; the summary mislabeled them "Rathermercurial"). **Rathermercurial's** actual contributions were the **Astro content-collections foot-gun flag** (v4→v7) and **Geo Protocol**. "**Hina**" = the repo-holder / live-site builder (likely **Heenal**; flagged). "**Regis**" popped in mid-call (handle uncertain — Thetokenjedi or Civilmonkey). Names normalized (**RegenOS**, **Artizen**, **Netlify**, **DAOstar**).

The first biweekly after the framework build + dev pipeline (see the same-day 1-on-1 with Matty). The through-line: **the engine is built — now feed it.** Two concrete repo asks go to Hina (migrate the repo to the **Regen Coordination GitHub org** + open a **Netlify dev build** for reviewing processed content). The team ratified the **content workflow** (feed raw data → integration report with open tasks → group review → PR to `main` → merge). **Durgadas demoed a CRAFT-based evidentiary ingestion layer** (the "prove it" counter-posture to RegenOS's "trust all data, get it in" — modular/swappable) plus his **community-tailored-playbooks** facilitation framework with **four case studies**. **Rathermercurial** will DM-fix the broken Astro content collections and jam with Luiz + Regis on **Geo Protocol**. **Trinity** offered to create content (learn-while-teaching). And the group opened the **Artizen funding** strategy: ~**$2,400** in the Regen Coordination pool, plus a plan to **hold boosts and coordinate one big 3–4× multiplier push** (potential $3k → $20k+), decided at the next Regen Coordination sync.

## Key Decisions

### Two repo asks to Hina — migrate to Regen Coordination org + open a Netlify dev build
- **Migrate the repo to the Regen Coordination org** on GitHub (from Hina's account — Luiz to share the details; Hina added to the org).
- **Open a Netlify dev build** to **visualize the processed content** for review before it hits prod.
- **Branch structure confirmed:** `regen-toolkit-os` = **dev**, `main` = **prod**.

### The content workflow (once the dev build is live)
1. **Feed raw data** into the RegenOS engine.
2. Engine **generates an integration report** with open tasks.
3. **Share the report** with the group for review.
4. **PR to update content** in the main repo → **merge**.
- Luiz already routinely processes the **meeting notes** through RegenOS, which is what **produces these integration reports + open-task compilations** — those get shared on the group.

### Feed-the-engine is the phase — stop tinkering with the engine
- RegenOS's ingestion engine is functional; the focus **shifts from further engine tinkering to feeding it data**. Feed a bunch of raw data, see the outputs, and use those concrete outputs as data points to **improve/adjust the engine** — rather than reasoning about the engine in the abstract.

### CRAFT evidentiary ingestion layer is a modular, swappable alternative (Durgadas)
- Durgadas demoed an **evidence/claims evaluation layer built on the CRAFT framework** — a **six-layer, six-cohort** structure for evaluating data with **evidentiary rigor** (records & origins, resolution map, "would this stand up in court / financial analysis"). Use case shown: disambiguating actors across addresses (an Epoch-12 outlier audit).
- It's the **opposite end of the spectrum** from RegenOS's "trust all data, get it in" posture — deliberately the **hardest attitude to take toward data** ("I need evidence"). Because RegenOS's seams are modular, **ingestion layers can be swapped** — Durgadas's evidentiary layer could plug in under the hood. (Its current injection layer is CSIS-driven.)
- Durgadas also published a **separate UI light/dark + color-mode widget called Temper** — usable on the toolkit websites (better than plain black/white; the CRAFT tool was its first use).

### Geo Protocol is the next integration exploration
- **Luiz to open a scoping doc** for Geo Protocol integration — can **start blank**, then build out (fork existing claims/evidence data shapes; modify to fit; ship onto the network).
- **Rathermercurial + Regis** identified as likely collaborators; Rather to jam with Luiz on how it fits everything.

### Content legibility — developer-first is a useful filter, abstraction comes later
- The toolkit is **technical-facing** today. Open question: how to **abstract it for non-developer communities**.
- **Developer-first lens is a useful filter now** — devs understand the community's context + needs and serve as a natural filter for what to build. **Longer-term:** subject-matter filtering + complexity abstraction for specific audiences ("the solution isn't obvious yet, but it's important").

### Funding — hold boosts, coordinate one big Artizen multiplier push
- **Regen Coordination funding pool:** ~**$2,400** sitting unused from last year, earmarked for toolkit work.
- **Consensus: don't allocate now — wait for a good Artizen multiplier** (a **3× or 4×** match), then make **one coordinated push**. Potential to turn ~$3,000 into **$20k+** via Artizen matching. (Six-month season; not time-sensitive.)
- **Everyone: create an Artizen profile** (artizen.fund) and **hold boosts** — don't spend them casually; coordinate timing.
- **Project question (lean, not final):** update the **existing Regen Coordination project** to hammer the toolkit harder + apply for relevant funds, rather than create a toolkit-specific one. **Decide at the next Regen Coordination sync.**
- **Anyone who needs money now** (rather than waiting out the multiplier game): **DM Monty directly.**

### GitHub Projects for task/project management (post-migration)
- Project/task management flagged as a gap (no single source of truth for action items + timelines). **Set up GitHub Projects in the Regen Coordination repo post-migration** (low-effort). **AI agents** (Claude, etc.) could **auto-create/update issues** from the RegenOS integration reports.

## Action Items

### Luiz Fernando
- [ ] **Share repo-migration details with Hina** — request migration to the Regen Coordination GitHub org + open the Netlify dev build.
- [ ] **Post the integration report** (from processing the meeting notes) to the group for review — the open-tasks compilation.
- [ ] **Open a scoping doc for Geo Protocol integration** — can start blank; loop in Rathermercurial + Regis.
- [ ] **Write a one-pager on repo access + agent onboarding** — how to clone the repo, work with agents, and basic GitHub collaboration for less-technical contributors; **include GitHub tutorial links**.
- [ ] **Drive the review checkpoint** — once the dev build is up, share how it looks + the specific points to check (what changed vs before), then PR + merge the framework-processed content to `main` (kick-starts the `regen-toolkit-os`→`main` pipeline).
- [ ] **Set up GitHub Projects** in the Regen Coordination repo post-migration (or confirm Copilot/agent auto-issue creation from reports); check Hina's mapped issues survive the migration.

### Rathermercurial
- [ ] **DM Luiz + fix the broken Astro content collections** — coordinate so it doesn't disrupt current work; document the v4→v7 foot guns to avoid.
- [ ] **Jam with Luiz + Regis on Geo Protocol** — how it fits with everything.
- [ ] **Publish source-scoring sense-making** — has an advanced set for scoring sources; could publish as a sub-standard the group can use.

### Durgadas
- [ ] **Share the CRAFT evidence/claims layer + Temper** more formally (currently on his personal machine) — the modular evidentiary ingestion layer as a swap-in option.
- [ ] **Share + republish the community-tailored-playbooks framework + the four case studies** — from the two-year facilitation project (patterns/protocols/practices, assembled hierarchically into community-tailored playbooks); relevant to content legibility + community facilitation.

### Trinity Morphy
- [ ] **Create content to learn-and-teach simultaneously** — help bridge the gap for less-technically-engaged contributors as the focus shifts to feeding + populating the engine.

### Monty Bryant
- [ ] **Discuss the toolkit funding strategy at the next Regen Coordination sync** — decide update-existing-project vs toolkit-specific; revisit Artizen timing. **DM contact** for anyone needing funds now.

### Team
- [ ] **Create Artizen profiles (artizen.fund) + hold boosts** — save them for a coordinated high-multiplier push; strike once, strike hard.
- [ ] **Confirm the source systems** — which sources are marked as "source systems" (thumbs-up, aggressively branched from). *(Echoes the 1-on-1; part of the iterative process.)*

## Discussion Summary

### Repo migration + the content workflow (Luiz)
Two asks go to Hina — **migrate the repo to the Regen Coordination org** and **open a Netlify dev build** to visualize the processed content. Once live, the workflow is: **feed raw data → RegenOS integration report (with open tasks) → share for group review → PR to `main` → merge**, with `regen-toolkit-os` as dev and `main` as prod. Luiz already runs the **meeting notes** through RegenOS, which is exactly what generates these integration reports + open-task lists to share. Open question he flagged: **at what point to do the PR** — i.e. when the group reviews the framework-processed output vs the current build.

### The Astro site is broken; Rather will fix it (Rathermercurial)
The Astro site built for the live front-end (via "OpenCloud"; Hina reportedly used **MiniMax** as the base model) has **broken content collections** — maintaining/modifying it later will hit "a lot of gotchas." Rather will **DM Luiz and coordinate a fix** without disrupting current work, and document the **v4→v7 foot guns** (Astro changed drastically across versions, so LLM training data is spotty — needs solid agent controls to pin correct versions). Works fine for now; fix comes after the repo transfer.

### Feed-the-engine (group)
Strong alignment that the initial phase is **feeding the engine, not tinkering with it** — the updated master doc → RegenOS → a functional ingestion engine. Feed it links + useful data, look at the outputs, and use those concrete outputs to understand + improve the engine. Question raised (Regis): can a skill be built to ingest directly into the network website / point it at the repo? — Luiz: share on the group, review, merge, then the content follows the framework in the website.

### CRAFT evidentiary layer + Temper (Durgadas)
Durgadas demoed a tool for **working through an evidence layer** — records & origins showing all claims, a resolution map, and views tuned to different cohorts — built on **CRAFT** (six layers, six cohorts). His framing: it depends on **what attitude you take toward the data**. RegenOS says "trust it, get it in"; he **purposely took the hardest, evidentiary stance** ("I'll have to argue for this as actual evidence — court, financial analysis"). Because RegenOS keeps **ingestion ≠ storage**, his evidentiary layer could **swap in** as an alternative ingestion engine — covering the opposite end of the curate-vs-ingest spectrum. He separately shipped **Temper**, a light/dark + color-mode UI widget (first used on the CRAFT tool), offered for the toolkit sites. *(Attribution corrected from the auto-summary; see the note above.)*

### Community-tailored playbooks + case studies (Durgadas)
Responding to the content-legibility thread, Durgadas described a **lightweight process for assembling artifacts** — playbooks, patterns, protocols, practices — hierarchically, **mix-and-match into community-tailored playbooks** (customized both to use case/tools and to the specific community). It rests on the **common ontology** already floating in the system. He ran a **two-year facilitation project** applying this to help communities do real-world Web3 experiments, across **four case studies** spanning funder/community types (a big philanthropic funder, a smaller grant-maker/nonprofit, a grassroots community). He needs to **republish them** and will share — valuable for the "how do communities actually use this" question.

### Content legibility + onboarding (Trinity, Afo, group)
The toolkit is technical-facing; the open question is how much to **abstract for non-developer communities**. Consensus for now: **developer-first is a useful filter** (devs understand community context/needs), with **subject-matter filtering + complexity abstraction** as the longer-term goal. **Trinity** offered to **create content to learn-and-teach**, bridging the gap for less-technical contributors as the focus shifts to feeding/populating the engine. A **one-pager** (clone the repo, access with agents, onboard contributors, plus **GitHub tutorial links**) was floated — several people (incl. Durgadas) said they have **no idea how to collaborate on GitHub** ("I'd be a baby in that respect"), so the onboarding doc is real.

### Project management gap (group)
No single source of truth for action items + timelines. Suggestion: **GitHub Projects in the Regen Coordination repo post-migration** (start simple), with **AI agents auto-creating/updating issues** from the RegenOS integration reports — keeping the team + outside contributors aligned on "what are the actual steps."

### Funding: Regen Coordination pool + Artizen (Monty, group)
There's ~**$2,400** in the Regen Coordination pool from last year, earmarked for toolkit work and "kind of forgotten." Options: allocate now, move into **Artizen** to multiply, or wait for a good multiplier. **Consensus: wait** — it's a six-month season, not time-sensitive; hold **Boost** voting power, and when a **3×/4×** match appears, **make one hard coordinated push** (potential $3k → $20k+; "this is the gold rush… strike once, strike hard"). Everyone should **make an Artizen profile** and **hold their boosts**. Likely to **update the existing Regen Coordination project** (rename/refocus on the toolkit) rather than create a toolkit-specific one — **decide at the next Regen Coordination sync**. Anyone needing money now can **DM Monty**.

## Next Steps

- **Luiz → Hina:** repo migration to Regen Coordination org + Netlify dev build (share details on the group).
- **Luiz:** post the integration report; open the Geo Protocol scoping doc; write the access/onboarding one-pager; drive the review-then-PR checkpoint.
- **Rather:** DM-fix the Astro content collections after transfer; jam on Geo Protocol.
- **Durgadas:** share CRAFT/Temper + republish the four case studies.
- **Team:** Artizen profiles + hold boosts; funding decision at the next Regen Coordination sync (Monty).
- **Next checkpoint:** review the dev-build output vs the current site; then merge to kick-start the content pipeline.

## Source

- **Source file:** `Zettelkasten/260716 Regen Web3 Toolkit Planning Call.md` (Granola capture + auto-synthesis; frontmatter fixed + processed pointer added; raw body preserved).
- **Transcript:** included inline in the source note (noisy multi-speaker auto-transcription; "Me" = Luiz; "Them" = collapsed non-Luiz channel — attribution unreliable; see the attribution note above).
- **Recording:** https://notes.granola.ai/t/89ffbc5c-18cf-4beb-9d74-686445b4dd87-00demib2
- **Same-day 1-on-1:** `260716 Toolkit meeting with Matty.md` (held before this call — "our conversation earlier today").
- **Prior biweekly:** `260702 Regen Web3 Toolkit Planning Call.md`.
- **Call brief prepped for this call:** `docs/briefings/2026-07-16-toolkit-call-brief.md`.
- **Processed:** 2026-07-16

---
id: "meeting-20260702-regen-web3-toolkit-planning"
type: planning
date: "2026-07-02"
title: "Regen Web3 Toolkit Planning Call — Framework-as-Package + First Ingestion Test Cases"
participants:
  - Matty (Mattycompost)
  - Luiz Fernando
  - Durgadas
  - Caue "Koi" Mtomaz
  - Afo
  - Rathermercurial
  - Heenal Rajani
absent_expected:
  - Andrea
projects:
  - "[[regen-web3-toolkit]]"
related:
  - toolkit-framework
  - regen-os
  - refi-commons
  - greenpill-network
  - csis
  - geo-protocol
  - at-protocol
related_meetings:
  - meeting-20260604-regen-web3-toolkit-planning
  - meeting-20260615-toolkit-worksession-matty
signals:
  - framework-as-package
  - external-artifact-ingestion
  - gen-brasil-commons-artifacts
  - ingestion-vs-storage-separation
  - ai-precision-toolkit
  - csis-craft-valcre-standards
  - frame-one-language-warning
  - structure-beats-intention
  - geo-protocol-interop
  - at-protocol-connective-tissue
  - opinionated-infrastructure
  - dev-environment-permissions
  - content-workflow-sequencing
  - master-doc-next-iteration
  - options-are-the-core
  - regen-coordination-funding
  - grants-subgroup
  - andrea-bioregioning
source_file: "Zettelkasten root: 260702 Regen Web3 Toolkit Planning Call.md (raw dual-track auto-transcription)"
transcript_included: false
---

# Regen Web3 Toolkit Planning Call — Framework-as-Package + First Ingestion Test Cases

**Date:** Thursday, 2026-07-02
**Attendees:** Matty, Luiz, Durgadas, Koi (Caue), Afo, Rather (Speaker 7 — inferred), Heenal
**Absent (expected):** Andrea (proposed as a future add — Luiz)
**Type:** Planning (biweekly)

> **Transcript quality note.** The source is a noisy dual-track auto-transcription. Nearly every `Heenal Rajani` line is a garbled *echo* of the previous speaker (a tooling artifact — a second audio channel mis-attributed to Heenal), not her own words. Heenal was present (opening chit-chat) but her direct substantive contributions are not separable from the echo. Names/terms normalized; "Rather" = Speaker 7 (the Geo Protocol / job-board voice) inferred from context.

This biweekly converged on the **framework-as-package** direction (Luiz): a portable module you drop into a repo that ingests unstructured resources into an ontology-structured knowledge base, articulated with the live site. Two **concrete first ingestion test cases** surfaced — Koi's just-completed **Gen Brasil Commons** artifacts and Durgadas's **Proof of Coordination protocol** — with Durgadas flagging that ingestion and storage must be **separable**. Matty committed to **one more master-doc iteration** (handoff docs + new theory of change), Durgadas issued a sharp **Frame 1 language warning** ("structure beats intention 100% of the time") and offered the CSIS/Craft/Valcre standards, and the group opened an **infrastructure interoperability** thread (Geo Protocol, AT Protocol). Next checkpoint ~2 weeks.

## Key Decisions

### Framework-as-package is the adopted direction
- Luiz: the framework "in practice" = something like a **package inside a repository** that can be added to a folder/repo and process whatever resources + data into a **knowledge base that fits the ontology, architecture, and functioning of the toolkit**. His recommended workflow: open a repo → consolidate existing data/resources → bring the framework in → **agents process the data per the framework** → structured knowledge base (ontology, tagging, structure). Aim: an **initial testable version in ~2 weeks**.
- The two website pages Luiz already integrated on `regen-toolkit-os` — **Toolkit Framework** and **Regen-Toolkit-OS** (the "system for working with agents and operating/contributing to the toolkit") — are the visual proof of the structure. Early AI drafts "cooked from the Google doc"; not yet verified against the master doc; need hands-on iteration to make them clear/usable.

### Sequencing: Matty (master doc) → Luiz (structure into system) → Afo (workflows fill gaps)
- Matty does one more master-doc update; Luiz gets it into the system he's building once the basic structure "calcifies"; then Afo's content-creation workflows fill gaps and **interconnect** content creatively across the aggregated source systems. Non-technical → technical → generative, in that order.

### One more master-doc iteration — Matty owns it
- Driven by the **handoff docs + the new theory of change** (Matty is "pretty excited about it"). Explicitly incorporate the **Frame Language Analyzer** ("100%") and the **Idea Processor** into this iteration. Matty: "the master doc hasn't been updated in a long time… I've really just been throwing shit into these handoff docs."

### Options are the core of an actual deployment
- Next major step Matty named: the **resources database is probably a jumbled mess** (some layers of the master doc are well put-together; resources is the weakest). Plan: manual ingestion of **tools/links/organizations** to seed it, then focus brainpower on the **Options** — governance options, tooling options — "these concrete things that are going to be the core of an actual deployment."

### Ingestion and storage must be separable (Durgadas)
- Durgadas needs an ingestion layer for his **Proof of Coordination protocol**, and flagged that whatever Luiz builds "seems like both an ingestion process and a place where things land" — he specifically needs **those two things broken apart**. Design constraint for the framework: don't weld ingestion to storage.

### Don't rush funding or the hub post — checkpoint first
- Matty: take the work to a **concrete checkpoint, throw it out in the world, see what happens** before deciding whether to focus/fundraise hard. Same for the hub post — it'll be clear when ready, especially paired with the website + visual representations. "Nobody's rushing."

## Action Items

### Luiz
- [ ] **Build the initial framework-package version (~2 weeks)** so it can be tested end-to-end — ingest external resources → ontology-structured knowledge base
- [ ] **Iterate the two site pages** (Toolkit Framework · Regen-Toolkit-OS) to be clear/usable; **verify against the master doc** (flagged as not-yet-verified)
- [ ] **Request write permissions** on the website / GitHub org so he can publish prototypes into the detail pages (asked Afo) — wants a **dev environment** + a user-friendly flow to process resources → preview the graph → publish
- [ ] **Ask Durgadas for / pull the CSIS repo + Craft/Valcre standards links** to make the framework agent-ingestible against those standards
- [ ] **Test the framework on Koi's Gen Brasil Commons artifacts** as the first real external case
- [ ] **Identify gaps** — diff current site/content structure vs. what the master-doc framework says it should be; reprocess accordingly (this drives the framework forward)
- [ ] **Invite Andrea** when timing works — reprocess ReFi Barcelona knowledge commons + Andrea's bioregional work with other orgs (she's been away)

### Matty
- [ ] **Produce one more master-doc iteration** — driven by handoff docs + new theory of change; **incorporate the Frame Language Analyzer + Idea Processor**
- [ ] **Seed the resources DB** — manual ingestion of tools/links/organizations
- [ ] **Focus on Options** (governance options, tooling options) — the concrete core of a deployment
- [ ] Keep the **hub-post draft** (already in a master-doc tab); release when the website + visuals make it legible — no rush
- [ ] Push the **Regen Coordination budget & scope** (still no feedback); expects a hunk of the QF/"bread" distribution (aligned this is the thing to fund) — even 100% "isn't much"

### Durgadas
- [ ] **Send Luiz the CSIS / Craft / Valcre standards links** — the "second page" with the **rigor sandwich**, the **prompt library**, the **implementation guide**, and the **conflict standard** (all already set up for AI/ML)
- [ ] **Release the AI Precision Toolkit** (~1–2 weeks) — makes his research methodology available
- [ ] **Build an ingestion layer** for the Proof of Coordination protocol (keep ingestion ≠ storage)
- [ ] **Make the Idea Processor functional on a Vercel site** (there's a Google Doc describing it)
- [ ] **Finish the website analysis** Rather sent him (~a day or so out)

### Koi (Caue)
- [ ] **Send Luiz the Gen Brasil Commons artifacts** — 2 books + others; first example is the **conflict-mediation protocol** (built over 6 calls; would be an open-source publication) — the first real ingestion test case
- [ ] **Explore interoperability of his two Portuguese apps** (services analysis · digital-tools analysis) so they can feed the schemas — via **Geo Protocol** (per Rather)
- [ ] **Help with data ingestion** for the resources DB
- [ ] Help define a **clear, specific scope** before onboarding any new member

### Afo
- [ ] **Set up the dev environment + grant Luiz publish permissions** — target: something in place by the next meeting
- [ ] **Focus on the website next week** (this week went to Green Goods releases + joining the Regen Foundation)
- [ ] **Content-creation workflows** to fill gaps + interconnect content once the structure calcifies (step 3 of the sequencing)

### Rather (Speaker 7)
- [ ] **Share Geo Protocol integration details** with Koi — the content-adding SDK, the lightweight abstracted **Aragon** governance interface, and the read **API** (pull your space or any space; compose knowledge). Geo = **IPFS + The Graph**
- [ ] **Build a job board** for the group — collect resumes

### Team / parking lot
- [ ] Consider a **grants-focused subgroup** — Durgadas + Afo both "looking for work"; **Super Benefit** has a methodology (Durgadas to raise over the next couple weeks)
- [ ] Push the infra layer toward **more opinionated infrastructure choices** — Geo Protocol + AT Protocol as candidate connective tissue (Matty; Durgadas to dig in)
- [ ] Heed the **Frame 1 language warning** — audit "governance / accountability"-type terms in the master doc + framework (Durgadas)

## Discussion Summary

### Framework-as-package (Luiz) — the centerpiece
Luiz has been fully back this week after ~a month mostly off. He's building an **integrated framework from the master doc into the toolkit**, articulated with the live website + content, and has integrated two pages on the `regen-toolkit-os` branch (Toolkit Framework · Regen-Toolkit-OS) — early AI drafts that already show the **layers** but aren't verified against the doc. The core proposition: a **portable framework package** you drop into a repo that lets agents process unstructured resources into an **ontology-structured knowledge base**. Koi asked whether there's an easy path today; answer: not yet — manual for now, but an **initial testable version is ~2 weeks out**, ideally tried on a real case.

### First ingestion test cases: Gen Brasil Commons (Koi) + Proof of Coordination (Durgadas)
Koi's **Gen Brasil Commons program** wrapped (closing call the day before) with **many artifacts** — 2 books and more, including a **conflict-mediation protocol** built over 6 calls that would be an open-source publication. He wants to bring these into the knowledge base but doesn't yet know how; will **send them to Luiz** as the first real test. Matty floated **multiple ingestion layers** over time (GitHub for the technical, dead-simple web for the non-technical). Durgadas separately needs to ingest his **Proof of Coordination protocol** and pushed a key design constraint: **ingestion and storage must be separable** — he can't use a tool that welds the two.

### Frame 1 language warning (Durgadas) — structural, not semantic
Durgadas raised the **continued use of Frame 1 terms** ("governance", "accountability") as making the thing **structurally not regenerative** — "it seems like a semantic point, but it's really a structural point." The whole reason Frame Language / CSIS exist is to keep **intention and structure aligned**, because "when they diverge, **the structure beats your intention every time, in every failure mode.**" He's analyzed hundreds of org failures; **structure wins 100% of the time.** This directly bears on the framework being built with those very terms — a real audit item, not a stylistic nit.

### CSIS / Craft / Valcre standards (Durgadas)
In response to Luiz asking for the **CSIS repo** (to build the framework against agent-ingestible standards), Durgadas said **Craft + Valcre are already set up for AI/ML** — just use them. He'll send links: the "second page" holds the **rigor sandwich**; there's an **Explore-the-full-prompt-library** surface, an **implementation guide**, and a dedicated **conflict standard** (relevant to Koi's mediation artifact). He's also releasing an **AI Precision Toolkit** (~1–2 weeks) that opens up his research methodology, and will make the **Idea Processor** (a Google-Doc concept) functional on Vercel.

### Regen space: no success stories, but Green Pill is improving (Durgadas)
Afo asked about success stories to counter Durgadas's failure analysis. Durgadas: he studies **failure modes**, not successes, and in the DAO space "the failures vastly outweigh the successes" — **The DAO, Aave, Nouns, ENS** all pillaged or being pillaged by single actors / small groups ("vast-from / anything-can-happen" problem). His **success criterion = structural integrity improved vs. a year ago**, and by that measure **Green Pill has the least frame-language issues** of the regen orgs he's studied — it evolved away from a Bitcoin-oriented frame toward **focus on specific issues**. That focus is *why* he was initially "sour" on a generic toolkit: a regen toolkit must sit on **rock-solid foundational principles**, or be scoped to a **specific problem / specific affected group** — the vague "anything regenerative" framing is the trap. Koi reframed: define **what success means for each party** before debating it.

### Website + dev environment + permissions (Luiz / Afo)
Afo did no website work this week (Green Goods releases + joining the **Regen Foundation**); back on it next week. Luiz asked for **write permissions** to publish prototypes into the detail pages, and pitched a **dev environment** for the toolkit — a user-friendly flow to process resources, see the resulting graph, and publish to the site. Afo will **think it through and get something in place by the next meeting**. Matty's content-workflow vision: his own workflows can **connect gaps and interconnect content** across the many aggregated source systems once the basic structure calcifies (the Matty → Luiz → Afo sequence).

### Infrastructure interoperability: Geo Protocol + AT Protocol
Koi has **two Portuguese apps** (one analyzes services, one analyzes digital tools) and wants them **interoperable** to feed the schemas. Rather: people already do this on **Geo Protocol** — there's an SDK to add content, a lightweight **abstracted Aragon** governance interface, and an **API** to pull content from your space or *any* Geo space and compose it. Geo is built on **IPFS + The Graph**. Matty tied this to the **infrastructure layer** being deliberately unopinionated ("throw everything in") and argued for **more opinionated infra choices** — Geo Protocol and **AT Protocol** (Bluesky's substrate; "hyper…" uses it) as candidate **connective tissue** across everyone's work. Durgadas is intrigued and wants to investigate.

### Funding / Regen Coordination
Matty: "not a whole lot of coordination happening" in Regen Coordination; still **no feedback on the budget & scope**; there's "a little bit of money" and they'll get **at least a hunk of the QF/bread distribution** (there's alignment this is the thing to fund) — but even 100% "isn't much." He'd rather **not rush** — take it to a concrete checkpoint and see what happens. **Data** would let them raise more effectively; Koi offered to help with **data ingestion**, potentially via interoperable apps feeding the commons.

### New members + grants
Onboarding new people now would need an **onboarding process** and a **clear, specific scope** (Koi) — even insiders aren't fully across how it all works yet. Luiz proposed bringing in **Andrea** (they work together at **ReFi Barcelona**) to reprocess the **ReFi BCN knowledge commons** + Andrea's bioregional work with other orgs; she's been away but he'll invite her. Closing: **Durgadas and Afo are both looking for work / doing grants**; idea to spin up a **grants subgroup**, with **Super Benefit's** methodology as a reference. Rather offered to **build a job board** (send resumes).

## Next Steps

- **Next checkpoint ~2 weeks** (next biweekly, ~2026-07-16) — Matty's updated master doc + Luiz's initial framework-package version + Afo's dev-environment/permissions
- Matty to **tap Durgadas again** after the master-doc update
- Koi → Luiz: **Gen Brasil Commons artifacts** for the first ingestion test
- Durgadas → Luiz: **CSIS / Craft / Valcre links**
- *(Forward links: feeds the RegenOS documentation thread (target July), the framework/instance split, and the ReFi Commons home from the 2026-06-15 work session.)*

## Source

- **Source file:** Zettelkasten root — `260702 Regen Web3 Toolkit Planning Call.md` (raw dual-track auto-transcription; noisy — the `Heenal Rajani` track is echo, not her words; names/terms normalized; "Rather" = Speaker 7 inferred; "Gen Brasil Commons", "Valcre", "AT Protocol", "Super Benefit" inferred from garbled audio)
- **Processed:** 2026-07-03
- **Cross-reference:** continues the 2026-06-04 biweekly + 2026-06-15 Matty/Luiz work session; the share pack ([`docs/reports/2026-07-02-toolkit-framework-share-pack.md`](../../../docs/reports/2026-07-02-toolkit-framework-share-pack.md)) was prepared for exactly the tooling / portable-DB / interconnection / opinionated-decisions asks discussed here

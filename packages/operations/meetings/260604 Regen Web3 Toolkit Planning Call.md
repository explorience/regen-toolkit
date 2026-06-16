---
id: "meeting-20260604-regen-web3-toolkit-planning"
type: planning
date: "2026-06-04"
title: "Regen Web3 Toolkit Planning Call — V1 Site + Hub Post Strategy"
participants:
  - Matty (Mattycompost)
  - Heenal Rajani
  - Luiz Fernando
  - Caue "Koi" Mtomaz
  - Afo
  - Rathermercurial
absent_expected:
  - Andrea
  - Durgadas
projects:
  - "[[regen-web3-toolkit]]"
related:
  - regen-os
  - refi-commons
  - swarm-pulse-1
  - greenpill-network
  - bioregioning
related_meetings:
  - meeting-20260521-regen-web3-toolkit-planning
  - meeting-20260615-toolkit-worksession-matty
signals:
  - v1-public-website
  - onboarding-journeys
  - public-is-not-commons
  - hub-post
  - regen-os
  - andrea-bioregioning
  - greenpill-network-integration
  - contribution-governance
  - regen-coordination-budget
  - swarm-not-overdetermine
source_file: "docs/temp/Regen Web3 Toolkit Planning Call_transcript_20260604.txt"
transcript_included: false
---

# Regen Web3 Toolkit Planning Call — V1 Site + Hub Post Strategy

**Date:** Thursday, 2026-06-04
**Attendees:** Matty, Heenal, Luiz, Koi (Caue), Afo, Rather (joined ~22 min)
**Absent (expected):** Andrea (other calls — deferred to a future "RegenOS-type conversation"); Durgadas (referenced, not present)
**Type:** Planning (biweekly)

The call converged on a **two-deliverable strategy**: Heenal's simplified **V1 public website** (a usable proof-of-concept) paired with a forthcoming **hub/forum post** explaining the broader vision — while agreeing the Swarm should *not* overdetermine the work. Also opened the **Andrea + RegenOS** thread (deferred) and Afo's **Greenpill Network integration** angle.

## Key Decisions

### Two paired deliverables: V1 site + hub post
- Matty: "those are our two deliverables, and I think they pair incredibly well together." The V1 site is the usable front door; the hub post invites the wider ecosystem to use/critique/contribute.

### Heenal owns and frames V1; merges to main
- Matty explicitly deferred: "I basically fully support however Heenal wants to frame this… I defer my vote." Heenal committed to **merging the V1 site feature branch into main** during the call. *(Confirmed: merged via PR #311, 2026-06-04; the live site at regen-web3-toolkit.vercel.app is the 3-journey v1.)*

### "Public is not the same as commons"
- Heenal's load-bearing insight: something being public doesn't make it a commons — it becomes a commons when people **use, correct, contribute to, and steward** it. This reframes the hub post from "announce a website" to "invite use + co-stewardship."

### Don't force the work into the Swarm frame
- Consensus (Matty, Luiz; Koi partially dissenting): the Swarm is a sounding board / potential audience, not the container. Rather: "the best contribution… is to ship something that's aligned and encourage other people to do the same." Matty: "most of the energy in the Swarm is in this room right now."

### V1 scope = one tightly-scoped functional slice first
- "Juiciest bite of the apple" / "thin end of the wedge." Three journeys: **newcomers, local nodes, knowledge commoners**. Polish + human-review first; vertical layer-mapping later.

### Andrea + RegenOS conversation deferred
- A separate "RegenOS-type conversation" with Andrea + Luiz, to run somewhat apart from the biweekly (Andrea couldn't attend).

## Action Items

### Heenal
- [ ] Merge V1 site feature branch → main *(done — PR #311)*; continue page-by-page human review; keep it usable/practical
- [ ] Design a **feedback / contribution pathway** for V1 (currently "not easy") — connects to "public ≠ commons"

### Luiz
- [ ] Share **bioregioning.org** (Andrea/Recover work) + the maturity-index / stewardship-tracking excerpt from the master doc into Telegram
- [ ] Explore **contribution governance + compensation protocols** (so external contributors can be recognized/compensated) — the RegenOS thread
- [ ] Read the master doc (Saturday bus trip); after the REPAA election, do knowledge consolidation in the repo; help Matty move from Google Docs → GitHub
- [ ] Help with **interoperability** between site, master doc, local-node maps, related systems

### Matty
- [ ] Finish reading the master doc (~2/3 done; halfway through the option library); one more quick iteration; then Telegram update + draft the **hub/forum post**
- [ ] Keep pushing the **budget & scope doc for Regen Coordination** (funds allocation, mostly toward the knowledge commons)

### Afo
- [ ] Review materials while revamping the **Greenpill Network website**; translate relevant Toolkit pieces into the Greenpill "garden → house" flow; link Greenpill → Toolkit; consider **agent skills** so AI can reference the Toolkit in Greenpill workflows; possibly host digest workshops

### Koi (Caue)
- [ ] Develop **activation / cell / troika protocol** ideas (3-person structure + facilitation guides + test plan) as a Swarm-hack output; explore post-journey operational pathways; gamified journeys (with Magdalena)

### Rather
- [ ] Continue providing Swarm / OpenCivics context; help define an **operational-contributor pathway** (people forming a team, picking up tools, getting admin done, acting)

### Team
- [ ] Consider joining **Regen/ReFi Commons** as members; post problems / theory-of-change feedback in Telegram; get the Swarm-call notes if they exist

## Discussion Summary

### V1 public website (Heenal) — the centerpiece
A simplified, tightly-scoped site built around **three journeys** (newcomer / local node / knowledge commoner) as a near-functional proof-of-concept derived from the master doc. Heenal reframed her role from documentation toward getting **real, usable content live and "offered into the Commons,"** driven by the "public ≠ commons" insight. Rather flagged a missing audience: operationally-focused teams who want to pick up tools and execute, not "learn Web3" — a candidate future **operational-contributor journey**.

### Master doc state (Matty)
~2/3 read (halfway through the option library). Assessment: **framework/structure is "pretty goddamn good"** and CSIS coding handles anti-extraction/credit-attribution well, but the **resources/option library is "a bottomless thing"** and under-filled (links lost in the Google Sheet migration). Proposed a focused session to enumerate the core governance options/tools (e.g. Tally) currently missing. *(This is the gap the V3 resource DB + the 2026-06-15 session address.)*

### RegenOS + Andrea
Matty flagged the Andrea + Luiz "RegenOS-type conversation" as "a big one," to run separately. Andrea's connection is via **bioregional/regional knowledge work** (Recover / bioregioning.org), not the toolkit directly — a candidate external knowledge contributor. Luiz tied RegenOS to needing **contribution governance + compensation protocols** so external groups can contribute to the commons and be recognized/compensated. *(Directly seeds the 2026-06-15 RegenOS + ReFi Commons + Impact-Vault discussion.)*

### The Swarm / OpenCivics
Rather reported the Swarm concludes later this month; it turned out more "explaining ontologies" than hackathon-y. No coordinated output landed; OpenCivics capacity strained. Consensus: ship something aligned + invite others; don't depend on the Swarm.

### Regen / ReFi Commons
A Commons call just before this one was Knowledge-Commons-focused (a FigJam of what people would contribute). Heenal sees toolkit V1 as exactly that kind of contribution. Membership discussed (Afo already a steward; others considering). *(Transcript says "Regen/Region Commons"; reconcile with "ReFi Commons" — likely same entity.)*

### Greenpill Network integration (Afo)
Afo's angle: funnel the toolkit into the **Greenpill Network** site (mid-revamp, ~2 weeks out) — metaphor "the garden before arriving at the house (the network)." Wants to translate the most relevant toolkit pieces into the Greenpill flow, leverage branding/podcast reach, and asked whether the team is building **agent skills** he could import.

### Funding / standards
Matty drafted a **budget & scope doc for Regen Coordination** — current + expected funds, distribution mostly toward the knowledge commons; per-person allocation TBD. Koi's "puzzle-piece ownership" framing (cell structure / coordination suite / standards each owned by a contributor).

## Next Steps

- Heenal: polish V1 + design the contribution pathway
- Matty: finish master-doc read → one iteration → hub post draft
- Luiz: share bioregioning links; open the RegenOS / contribution-governance thread; help GDoc → GitHub move
- Schedule the Andrea + RegenOS conversation
- *(Forward link: the 2026-06-15 Matty+Luiz 1-on-1 picks up RegenOS, framework/instance split, and ReFi Commons home directly from here.)*

## Source

- **Source file:** `docs/temp/Regen Web3 Toolkit Planning Call_transcript_20260604.txt` (raw auto-transcription; noisy — names/terms normalized; "bioregioning.org", "Recover Salons", "REPAA" inferred)
- **Processed:** 2026-06-16 (gap-fill)
- **Cross-reference:** the new master doc's "§13 Latest meeting action items" + "§3 Core meeting insights" are Matty's AI summary of this same call — corroborated.

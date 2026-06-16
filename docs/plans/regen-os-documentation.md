# Plan — RegenOS Documentation + Public Website

**Status:** queued
**Created:** 2026-06-16
**Target:** July 2026
**Origin:** 2026-06-15 Matty + Luiz work session ([meeting note](../../packages/operations/meetings/260615%20Toolkit%20Work%20Session%20with%20Matty.md) · [integration report](../reports/2026-06-15-toolkit-worksession-matty-integration-report.md))
**Owner:** Luiz

## Context

In the 2026-06-15 work session, Luiz demoed the OrgOS overlay end-to-end and articulated **RegenOS** — the coordination layer *above* OrgOS instances — for the first time as a named thing. Matty's reaction to the federation/source-curation angle was the strongest of the call ("That's absolutely huge"), but he also flagged the gap:

> "RegenOS is referenced within this master doc very vaguely… even if you just typed out a handful of sentences being like, this is what it is, that's at least something we can cook into this."

RegenOS is essentially what `regen-coordination-os` already *is* in practice — but it has no written description, no public-facing surface, and only a vague mention in the master doc. Luiz also self-identified as "absolutely horrible at trying to explain it," which makes the documentation work both needed and personally useful.

This plan covers the **internal documentation + public website** work (Luiz-owned, July). The three *external* edits to Matty's master-doc Google Doc (short RegenOS description, OrgOS overlay link, infra-stack write-up) are tracked separately on HEARTBEAT as draft-and-present items — but they should be **derived from** the artifacts this plan produces (write it properly here, then distill the short version into the Doc).

## Goal

A clear, shareable explanation of RegenOS that a non-technical collaborator (e.g. Matty) can read and *get*, plus a simple public website for people who aren't running agents.

## What RegenOS is (working definition — to refine)

- **Coordination layer above OrgOS instances.** OrgOS = the foundational file system + agent-instruction layer (the "template" each org runs on). RegenOS maps the **upstream/downstream relationships** between OrgOS-instance repos so agents can check upstream repos for relevant updates and pull them into the local knowledge base. Example hierarchy from the call: Region Coordination → upstream of ReFi DAO OS → upstream of further instances.
- **Two federation types (likely distinct mechanisms):**
  1. **Knowledge-source federation** — curating quality tiers of external content sources (the "these are the top-tier source systems we lean on" curation problem).
  2. **Organizational federation** — mapping relationships + coordination flows between orgs/instances.
- **Self-qualifying adoption as the filter.** Any org that adopts the framework + goes through the process earns deeper federation — a non-arbitrary alternative to manual gatekeeping.
- **Underlying mechanics:** GitHub (and later Radicle) as a shared file system + Git for syncing between instances + a fork of the file system that *doesn't* require an always-on agent — just `/initialize` + `/close` sync commands collaborators run.

## Phases

### Phase 1 — RegenOS documentation (internal)
- [ ] Write `docs/ORG-OS.md`-adjacent (or new `docs/REGEN-OS.md`) explainer: what RegenOS is, how it sits above OrgOS, the two federation types, self-qualifying adoption, the sync model.
- [ ] Diagram the stack: OrgOS (file system + agent instructions) → RegenOS (federation/coordination) → instances → visualization (Obsidian / Kumu / static site).
- [ ] Cross-reference: `federation.yaml`, the `regen-coordination-os` peer, `docs/from-regen-coord/`, `docs/from-refi-dao/`.
- [ ] Clarify the knowledge-source vs organizational federation split — propose how each is represented (two `federation.yaml` sections? two registries?).

### Phase 2 — Public website (simple, non-manipulative)
- [ ] Decide surface: extend the existing Astro site (`src/content/docs/`) vs a dedicated minimal page. Per the call, "the website repo could be the same repo as the OrgOS/knowledge base repo."
- [ ] A clean human-readable view that pulls data from GitHub for people not running agents.
- [ ] Keep it honest — "a clean, non-manipulative restructuring of the data," not marketing.

### Phase 3 — Distill external contributions (draft-and-present)
Derived from Phase 1, for Matty's Google Doc — **draft, then present to operator before sending:**
- [ ] Short plain-language RegenOS description → master-doc meeting-notes tab
- [ ] OrgOS overlay GitHub link → next to the RegenOS reference
- [ ] RegenOS ↔ COOP / Geo Browser / COI / infra-stack write-up → "More Opinionated Infrastructure" sub-tab (depends on the Geo Browser review — see HEARTBEAT Infra Stack section)

## Dependencies / threads

- **Geo Browser review** (HEARTBEAT) gates the infra-stack write-up.
- **Framework / instance split** (strategic) — RegenOS docs should land *after* or *alongside* the framework/instance conceptual separation, since RegenOS is part of the framework story, not the ReFi instance.
- **ReFi Commons home** — if the toolkit moves under ReFi Commons, the public site's framing/branding may shift; keep the site thin until that settles.

## Verification

- [ ] A non-technical reader can explain RegenOS back after reading the doc.
- [ ] Public page builds + deploys without breaking `npm run build`.
- [ ] The three external contributions are drafted and presented to the operator (not silently sent).

## Out of scope (for now)

- Radicle integration (exploratory; later infra layer)
- On-chain data storage (explicitly deferred — "we don't need to do that right off the bat")
- COI node integration (OrgOS covers many use cases foundationally; build on top later)

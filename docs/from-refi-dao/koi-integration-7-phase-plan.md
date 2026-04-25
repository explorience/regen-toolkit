---
id: koi-integration
title: "KOI Integration (BlockScience Knowledge Organization Infrastructure)"
status: in-progress
priority: 3
scope: refi-dao-os
depends_on: [knowledge-commons-build]
created: 2026-04-24
updated: 2026-04-24
started: 2026-04-24
completed: null
estimated_sessions: 6-10
tags: [koi, knowledge, federation, sensors, blockscience, regen-commons]
sourceMeeting: meeting-20260424-refi-koi-discovery
---

## Goal

Integrate ReFi DAO with **KOI** (Knowledge Organization Infrastructure, originated at BlockScience by Zargham) as an early adopter. Build sensors over the OrgOS workspace, federate with Regen KOI MCP, and contribute development work back to the network in lieu of cash subsidy from Regen Commons.

> **Naming caveat:** This plan covers **BlockScience KOI** (formal infrastructure for federated knowledge graphs). It is distinct from the `koi-knowledge-merge` plan, which manages a local content directory at `repos/refi-dao-content/` that happens to share the name. The two plans don't overlap technically.

## Context

From the 2026-04-24 KOI Integration Discovery Call (Sean, Gregory, Monty, Luiz):

- **Onboarding model:** ReFi DAO is the first early adopter. We receive infrastructure support and contribute development back — no cash subsidy from Regen Commons. Future members will be expected to pay.
- **Architecture principle:** "Bring KOI to your data, don't bring your data to KOI" — KOI solves connection/interface problems, not data generation. Right entry point for OrgOS is a Git repo sensor against the existing workspace.
- **Sequencing:** Sean recommends personal-before-organizational. Personal KOI is point-and-click; organizational requires server infrastructure for persistent availability.
- **Federation:** Public Regen MCP available with basic sensors; permissioned version for private sensors. Sean built a plugin packaging 4 Regen MCPs together.
- **Lineage:** KOI originated at Block Science (Zargham). Open source contributions back to BlockScience help them reach a fundraising threshold.

## Upstream Repos to Map

Research is in progress (3 sub-agent streams + this plan). Key repos:

| Repo | Cluster | Role |
|---|---|---|
| `BlockScience/koi` | Canonical | Foundational KOI implementation |
| `BlockScience/koi-net` | Canonical | Network/federation layer |
| `gaiaaiagent/regen-koi-mcp` | Regen ecosystem | Regen-flavored MCP, packages 4 Regen MCPs |
| `gaiaaiagent/koi-sensors` | Regen ecosystem | Sensor reference implementations |
| `gaiaaiagent/koi-processor` | Regen ecosystem | Signal transformation/routing |
| `gaiaaiagent/regen-heartbeat` | Regen ecosystem | Pulse/health monitor for Regen Network |
| `DarrenZal/personal-koi-mcp` | Personal | Canonical personal-KOI reference |
| `DarrenZal/koi-research` | Personal | Methodology + notes |
| `DarrenZal/spore` | Personal | Federation/bridging mechanism |
| `LinuxIsCool/legion-koi` | Personal | Sean's personal Legion KOI setup |

Synthesized brief: `docs/research/koi-integration-brief.md` (created in Phase 1).

## Architecture

7 phases — research-driven. Phases 2 onwards depend on Phase 1 deliverables and Sean+Gregory's meta-prompt.

```
Phase 1: Research & Mapping            [research/koi-integration-brief.md]
       │
       ▼
Phase 2: Personal KOI Bootstrap        [Luiz personal KOI MCP + vault sensor]
       │
       ▼
Phase 3: Sensor Architecture Design    [docs/koi-sensor-architecture.md]
       │
       ▼
Phase 4: First Sensor — Git Repo MVP   [refi-dao-os git sensor]
       │
       ▼
Phase 5: Federation with Regen KOI     [join Regen KOI MCP network]
       │
       ▼
Phase 6: Coordination & Outreach       [awesome-koi repo, weekly standup, May hackathon]
       │
       ▼
Phase 7: Upstream Contribution         [PRs back to BlockScience/koi-net]
```

---

## Phase 1: Research & Mapping (active)

**Goal:** Land a single integration brief covering all 10 upstream repos so subsequent phases have a clear technical map.

**Tasks:**
- [x] Discovery call processed (`260424 ReFi KOI Integration Discovery Call.md`)
- [x] Per-repo summaries (foreground, gh api + WebFetch on 10 repos — sub-agent dispatch failed with 529 overload)
  - [x] Cluster A: BlockScience canonical (`koi`, `koi-net`)
  - [x] Cluster B: Gaia Agents ecosystem (`regen-koi-mcp`, `koi-sensors`, `koi-processor`, `regen-heartbeat`)
  - [x] Cluster C: Personal & forks (`personal-koi-mcp`, `koi-research`, `spore`, `legion-koi`)
- [x] Synthesize into `docs/research/koi-integration-brief.md` (committed)
- [ ] Sean + Gregory meta-prompt (external dependency — track follow-up)
- [ ] Summarize each link from Sean's Telegram collection individually (defer — brief subsumed most of this)

**Exit criteria:** ✅ Brief committed; ✅ three integration options defined (Consumer / Personal / Sovereign); first-sensor candidate identified (OrgOS filesystem sensor).

---

## Phase 1.5: Quick Wins (Options A + B from brief — run in parallel)

Fast tracks that don't depend on Phase 2 sequencing.

**Tasks:**
- [x] **A1** Add `regen-koi-mcp` to `CLAUDE.md` External Tooling table as zero-setup consumer path *(2026-04-25)*
- [x] **A2** Install `regen-koi-mcp` on Luiz's Claude Code at user scope with `KOI_API_ENDPOINT` env var *(2026-04-25)*
- [ ] **A3** Verify query works against hosted Regen KB (ask: "What repositories are indexed in KOI?") — pending Luiz's Claude Code restart + smoke test
- [ ] **A4** Same install for Monty; confirm cross-org read access — Monty install instructions drafted, awaiting send
- [ ] **B1** ~~Install `DarrenZal/personal-koi-mcp` locally against Zettelkasten vault~~ — **DEFERRED** (3-repo backend stack; tracked in HEARTBEAT)
- [ ] **B2** ~~Stand up backend stack~~ — **DEFERRED**
- [x] **B3** Document setup in `docs/koi-personal-setup.md` *(Track A only; Track B section notes deferral)*
- [ ] **B4** ~~Validate `vault_prep_meeting`~~ — **DEFERRED** with Track B

**Exit criteria (revised 2026-04-25):** MCP read access working for Luiz (Track A) — pending smoke-test confirmation. Track B deferred to dedicated session per HEARTBEAT.

See execution log: `docs/superpowers/plans/2026-04-25-koi-integration-wave-1.md` and Wave 1 design spec at `docs/superpowers/specs/2026-04-25-koi-integration-design.md`.

---

## Phase 2: Personal KOI Bootstrap

**Goal:** Luiz runs a personal KOI MCP locally against his vault, validating end-to-end pattern before scaling to org infra.

**Tasks:**
- [ ] Install `DarrenZal/personal-koi-mcp` locally
- [ ] Configure against Zettelkasten vault root (or refi-dao-os subset)
- [ ] Validate: query knowledge via personal KOI; confirm Git repo sensor pattern works
- [ ] Document setup in `docs/koi-personal-setup.md`
- [ ] Compare with `LinuxIsCool/legion-koi` for personal setup patterns

**Exit criteria:** Personal KOI returns useful queries against ≥1 ReFi DAO data source.

---

## Phase 3: Sensor Architecture Design

**Goal:** Map ReFi DAO data sources to KOI sensors. Decide which to build, which to fork, which to defer.

**Data sources to map:**
- Git repos (refi-dao-os, member repos via repos.manifest.json)
- Notion (members, projects, meetings — read-only)
- Granola meeting notes (Monty's collection, multi-org)
- Podcast transcripts (Monty)
- Blog content (already in `knowledge/blog/`, owned by Luiz)
- Forum posts (Vision Forum archive)
- GitHub repos (orgs)

**Tasks:**
- [ ] Inventory existing `gaiaaiagent/koi-sensors` — which work for our sources?
- [ ] Identify gaps: which sensors need to be built?
- [ ] Decide consent layers: which sources are public, which permissioned, which private
- [ ] Document in `docs/koi-sensor-architecture.md`
- [ ] Align with Monty on data assets prep (action item from discovery call)

**Exit criteria:** Architecture doc reviewed by Sean; first-sensor candidate confirmed.

---

## Phase 4: First Sensor — OrgOS Filesystem Sensor (Option C from brief)

**Goal:** Ship the first ReFi DAO sensor as proof of work-in-kind contribution. The OrgOS filesystem sensor has **no existing equivalent in koi-sensors** — this is the highest-leverage contribution target (reusable by every other org-os fork).

**Recommended path:** Fork `LinuxIsCool/legion-koi` as scaffold (closest architectural analog — sovereign FullNode, filesystem-first, Python + postgres + pgvector + MCP). Re-point its sensors at `packages/operations/`, `knowledge/`, `data/`.

**Tasks:**
- [ ] Fork `LinuxIsCool/legion-koi` to `refidao/refi-dao-content` (or scaffold from scratch against `BlockScience/koi-net` + rid-lib)
- [ ] Design RID schemas for ReFi DAO:
  - `orn:refidao.meeting:YYMMDD/slug`
  - `orn:refidao.project:id`
  - `orn:refidao.member:handle`
  - `orn:refidao.plan:id`
  - `orn:refidao.knowledge:domain/slug`
- [ ] Build filesystem sensors:
  - `refi-dao-operations` (watch `packages/operations/`)
  - `refi-dao-knowledge` (watch `knowledge/`)
  - `refi-dao-data` (YAML files in `data/`)
- [ ] Implement consent layer (public YAMLs + meetings with outside parties flagged private)
- [ ] Expose via MCP (reuse legion-koi's 8-tool set, extend with ReFi tools: `get_project`, `list_members`, `get_plan`)
- [ ] Contribution decision (coordinate with Sean): contribute as standalone `koi-net-refi-dao-sensor-node` OR as new sensor inside `gaiaaiagent/koi-sensors`
- [ ] Submit PR upstream

**Exit criteria:** Sensor running in production; PR open upstream.

---

## Phase 5: Federation with Regen KOI

**Goal:** Connect ReFi DAO's KOI node to the Regen KOI MCP network.

**Tasks:**
- [ ] Server infrastructure decision (open question from discovery call — what does org deployment require?)
- [ ] Configure ReFi DAO node identity in `gaiaaiagent/regen-koi-mcp`
- [ ] Establish trust/consent agreements with peer nodes
- [ ] Coordinate with Gregory's Regen Commons membership framework (commoner credentials)
- [ ] Test cross-node queries

**Exit criteria:** ReFi DAO appears as a federated peer in Regen KOI network.

---

## Phase 6: Coordination & Outreach

**Goal:** Establish ReFi DAO as a visible early adopter and channel for new entrants.

**Tasks:**
- [ ] Create `awesome-koi` repository aggregating resources
- [ ] Join weekly Regen AI standup (recurring)
- [ ] Coordinate ReFi DAO contribution to May Knowledge Commons hackathon (due 2026-05-15)
- [ ] Coordinate with Knowledge Commons working group (Patricia's swarm framework, Open Civic board)
- [ ] Update `federation.yaml` to articulate KOI integration

**Exit criteria:** ReFi DAO presence in KOI ecosystem documented, awesome-koi public.

---

## Phase 7: Upstream Contribution

**Goal:** Contribute back to `BlockScience/koi` and `koi-net` to support fundraising threshold.

**Tasks:**
- [ ] Identify upstream contribution opportunities (issues, PRs, docs)
- [ ] Submit ≥1 substantive PR to `BlockScience/koi-net`
- [ ] Document ReFi DAO sensor as a reference implementation
- [ ] Coordinate with Zargham on lineage/credit

**Exit criteria:** Merged PR upstream; ReFi DAO listed as contributor.

---

## Risks & Open Questions

- **Server infrastructure** for organizational KOI deployment — unresolved (Phase 5 blocker)
- **Timeline alignment** with Regen Commons launch — depends on their cohort onboarding
- **Coordination** with existing Knowledge Commons working group — Luiz not currently involved; need to integrate
- **Resource allocation** — work-in-kind model means dev hours; track against Phase 4–7 deliverables
- **Naming collision** with existing `koi-knowledge-merge` — keep plans differentiated, may rename one for clarity (e.g., `content-curation-promotion`)

## References

- Meeting: `packages/operations/meetings/260424 ReFi KOI Integration Discovery Call.md`
- Project: `koi-integration` in `data/projects.yaml`
- Memory: `project_refi_koi_integration` (early-adopter model + Git-sensor-first principle)
- Related plan: `knowledge-commons-build` (provides the structured knowledge that KOI sensors will surface)
- Granola transcript: https://notes.granola.ai/t/03998fd8-8ee6-4287-9043-8e06c5fbee69-00demib2

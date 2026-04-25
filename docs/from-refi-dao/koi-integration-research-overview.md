---
title: "KOI Integration — Research Overview"
project: koi-integration
date: 2026-04-25
sourceMeeting: meeting-20260424-refi-koi-discovery
relatedPlan: docs/agent-plans/koi-integration.md
status: Phase 1 deliverable (synthesis index)
research_artifacts:
  - docs/research/koi-integration-brief.md
  - docs/research/koi-net-protocol.md
  - docs/research/koi-net-protocol.provenance.md
  - docs/research/personal-koi-options-comparison.md
  - docs/research/federated-knowledge-commons.md
  - docs/research/federated-knowledge-commons.provenance.md
  - docs/research/koi-net-claims-audit-audit.md
  - docs/research/regen-koi-ecosystem-baseline.md
plans:
  - docs/research/.plans/koi-net-protocol.md
  - docs/research/.plans/personal-koi-options.md
  - docs/research/.plans/federated-knowledge-commons.md
  - docs/research/.plans/koi-net-claims-audit.md
  - docs/research/.plans/regen-koi-ecosystem.md
---

# KOI Integration — Research Overview

This document is the **index of research artifacts** for the `koi-integration` project. It summarizes what each report covers, how they relate, and the operational read order. Maintained as part of the org-os research praxis (see [`docs/SOP-RESEARCH-PRAXIS.md`](../SOP-RESEARCH-PRAXIS.md)).

## Reports

### 1. `regen-koi-ecosystem-baseline.md` — Watch baseline (4KB)
*Skill: `feynman/watch`*

Snapshot of 10 monitored repos as of 2026-04-24: latest pushes, versions, default branches. Key fact: **5 of 10 repos pushed within 72h** of the snapshot — ecosystem is hot. Defines HIGH/MEDIUM/LOW signal criteria and a recurring-watch prompt template. Scheduling deferred to operator (`/schedule weekly`).

### 2. `koi-net-claims-audit-audit.md` — Code audit (9KB)
*Skill: `feynman/paper-code-audit`*

Audits `BlockScience/koi-net` README claims against the actual Python implementation.

- **Confirmed:** Python 3.10+, 13 runtime deps, DI pattern, minimal node example works as stated
- **Mismatches:** README says "~36 components" (actual: 24); umbrella still calls it "beta" (actual: stable v2.0.5 with 7 point releases in a month); spec site at koi-net-spec is thin/index-only
- **Ambiguous defaults:** Partial vs Full behavioral differences not documented; no canonical port; key management not covered
- **Reproduction plan:** Minimal scaffold script for ReFi DAO to bootstrap a Partial node

### 3. `personal-koi-options-comparison.md` — Source comparison (11KB)
*Skill: `feynman/source-comparison`*

Compares 3 paths: `DarrenZal/personal-koi-mcp` vs `LinuxIsCool/legion-koi` vs custom-fork-of-koi-net, across 10 dimensions (setup, deps, sensors, MCP surface, federation, fit). Includes Mermaid architecture diagram for each.

- **Recommendation:** `personal-koi-mcp` for Phase 1.5 (immediate); **fork `legion-koi` for Phase 3–4** (sovereign node — filesystem-first matches refi-dao-os; ORN namespace pattern maps cleanly; Python-only stack)
- **Outstanding:** `legion-koi` has no declared license — must clarify with Sean before forking

### 4. `federated-knowledge-commons.md` — Literature review (13KB + provenance)
*Skill: `feynman/literature-review`*

Maps the full landscape including projects beyond the 10 KOI repos: KOI v1 (KMS), v2 (Metagov KOI Pond), v3 (BlockScience + Regen + RMIT Telescope + BKC/Octo), Spore/Agent Commons.

- **5 consensus points:** references ≠ referents; orgs as cyborganizations; federation over centralization; consent membranes per node; MCP as the agent-facing surface
- **5 disagreements:** centralized vs sovereign processor; namespace governance; marketplace vs commons economics; bundle vs triple as share unit; whether YAMLs or RIDs are primary
- **9-step reading path** (~6h cold-start ramp) for any new ReFi DAO contributor

### 5. `koi-net-protocol.md` — Deep research (16KB + provenance)
*Skill: `feynman/deep-research`*

The canonical comprehensive brief. Six numbered findings:

1. **RID v3** — URI-compatible, with ORN syntax (`orn:<namespace>:<reference>`); proposed ReFi schema: `orn:refidao.meeting:YYMMDD/slug`, etc.
2. **Bundle model** — manifest + content + ECDSA-signed envelope + NEW/UPDATE/FORGET event
3. **Nodes** — Partial vs Full; for ReFi DAO, **start as Partial**, promote to Full once aggregating peers
4. **24 default components** (not 36) enumerated with intended roles
5. **9 upstream sensor-node templates** exist (Slack, HackMD, GitHub, GDrive, etc.) — no filesystem/Obsidian/YAML sensor → that's our highest-leverage contribution target
6. **v1→v2→v3 breaking changes** — RIDs became URI-compatible (v2 RIDs now under `orn:`), monolith dissolved into framework, sensor/processor/coordinator separation

### Companion: `koi-integration-brief.md` (prior synthesis)
Single 18KB orientation doc written before the 5 Feynman-skill reports. Higher-level map: 5-layer stack diagram + 3 integration options (A Consumer, B Personal, C Sovereign) + work-in-kind contribution map. **Read this first** as the orientation; the 5 reports are deeper drill-downs.

## How they relate

```
koi-integration-brief.md (orientation, prior synthesis)
   │
   ├── deep-research      → koi-net-protocol.md           (the protocol you'll build on)
   ├── paper-code-audit   → koi-net-claims-audit-audit.md (mismatches in upstream docs)
   ├── source-comparison  → personal-koi-options-comparison.md (which scaffold to fork)
   ├── literature-review  → federated-knowledge-commons.md (the wider field & reading order)
   └── watch              → regen-koi-ecosystem-baseline.md (recurring monitor)
```

## Operational Read Order (for Luiz / Monty / new contributors)

1. **Brief** (`koi-integration-brief.md`) — 5-min orientation
2. **Comparison** — pick the scaffold (legion-koi vs personal-koi-mcp)
3. **Audit** — know what you're walking into in the BlockScience codebase
4. **Deep research** — the protocol mechanics for actual implementation
5. **Lit review** — share with new contributors during onboarding
6. **Watch baseline** — schedule weekly to track ecosystem changes

## Three converging recommendations across all reports

1. **Phase 1.5 immediate** (hours to days):
   - Install `regen-koi-mcp` (zero-setup MCP for Claude Code) → see `koi-integration-brief` Option A
   - Install `personal-koi-mcp` against vault → see `koi-integration-brief` Option B + `personal-koi-options-comparison` Option 1

2. **Phase 3–4 multi-week:**
   - Fork `LinuxIsCool/legion-koi` as scaffold → `personal-koi-options-comparison` recommendation
   - Add OrgOS filesystem sensor (no upstream equivalent — highest contribution leverage) → `koi-net-protocol` Finding 5

3. **Coordinate now:**
   - Ask Sean about `legion-koi` license (blocks forking decision)
   - Ask Sean & Gregory for the meta-prompt promised in 2026-04-24 discovery call

## Methodology Notes

All 5 reports were produced **foreground** using `gh api` + `WebFetch`. Sub-agent dispatch was attempted but failed with 529 overloads. The Feynman skill *prompts* (in `.agents/skills/feynman/prompts/`) were followed as workflow instructions; the bundled `researcher`/`verifier`/`reviewer` subagents were substituted with foreground synthesis. See each `*.provenance.md` for per-report deviations.

## Status

- [x] Phase 1 research complete (5 reports + brief)
- [ ] Phase 1.5 quick wins (Option A + B installs)
- [ ] Sean meta-prompt awaited

## Cross-references

- Project: `koi-integration` in [`data/projects.yaml`](../../data/projects.yaml)
- Plan: [`docs/agent-plans/koi-integration.md`](../agent-plans/koi-integration.md)
- Source meeting: [`packages/operations/meetings/260424 ReFi KOI Integration Discovery Call.md`](../../packages/operations/meetings/260424%20ReFi%20KOI%20Integration%20Discovery%20Call.md)
- Praxis SOP: [`docs/SOP-RESEARCH-PRAXIS.md`](../SOP-RESEARCH-PRAXIS.md)
- Skill: [`skills/research/SKILL.md`](../../skills/research/SKILL.md)

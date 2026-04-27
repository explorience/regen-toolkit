# Content Development Pipeline (Owner-Side) — Cross-Project Packages

Date: 2026-03-07  
Status: **EXECUTING** — Sprint 1 active  
Board: `integrations/tickets/PIPELINE-BOARD-260307.md`

---

## 1) Objective

Create one operational content pipeline that:
- reuses onboarding and reporting assets already developed,
- standardizes implementation through Quartz-based sites,
- and ships modular packages that can be adapted per territory/network.

---

## 2) Canonical Inputs (Requested)

- Local node onboarding
  - `03 Libraries/ReFi DAO/ReFi DAO Docs/ReFi Local Node Onboarding Checklist.md`
  - `03 Libraries/ReFi DAO/ReFi DAO Docs/Starting a ReFi Local Node - Onboarding Guide 2032e7251f2f80d08a56fa2e65109a93.md`
  - `03 Libraries/ReFi-DAO-Website/content/community/local-nodes.md`
- Network initiative onboarding
  - `03 Libraries/ReFi DAO/ReFi DAO Docs/ReFi DAO Network Initiatives Onboarding Guide.md`
  - `03 Libraries/ReFi-DAO-Website/content/community/network-initiatives.md`
- Impact reporting
  - `03 Libraries/coop/skills/impact-reporting/SKILL.md`
  - `03 Libraries/Regenerant-Catalunya/docs/project-reports/prompts/`
- Quartz publishing base
  - `03 Libraries/quartz-refi-template`
- Reference implementations
  - `03 Libraries/ReFi-BCN-Website`
  - `03 Libraries/ReFi-Mediterranean`
  - `03 Libraries/ReFi-Provence`
- Equivalent rollout target
  - `03 Libraries/ReFi-DAO-Website`
- Regenerant Catalunya account/tool packages
  - `03 Libraries/Regenerant-Catalunya/docs/phase-2/tools/safe-implementation-plan.md`
  - `03 Libraries/Regenerant-Catalunya/docs/phase-2/tools/hum-community-implementation-plan.md`
- Ecosystem mapping sources
  - `03 Libraries/ReFi-Barcelona`
  - `03 Libraries/regen-toolkit`
  - `03 Libraries/Local-ReFi-Toolkit`

---

## 3) Package Backlog (Activated)

| Ticket | Package | Source Bundle | Implementation Target | Owner | Status |
|---|---|---|---|---|---|
| T01 | Local Node Onboarding Package | ReFi DAO onboarding docs + website | `regen-toolkit` module + `ReFi-DAO-Website` | Luiz (lead) | **IN_PROGRESS** |
| T02 | Network Initiative Onboarding Package | ReFi DAO initiative guide + website | `regen-toolkit` module + `ReFi-DAO-Website` | Luiz (lead) | **IN_PROGRESS** |
| T03 | Impact Reporting Package | Regenerant Catalunya prompts + coop skill | Reporting SOP + templates | Luiz (lead) | **IN_PROGRESS** |
| T04 | Quartz Multi-Site Publishing Package | quartz-refi-template + sites | Deployment recipe | Luiz (lead) | OPEN |
| T05 | ReFi-DAO-Website Equivalent Package | DAO website + template sync | Equivalent deployment | Luiz (lead) | OPEN |
| T06 | Safe Multisig Account Package | Safe implementation plan | Treasury/governance package | Luiz + signers | OPEN |
| T07 | Hum Community Account Package | Hum implementation plan | Mobile governance package | Luiz + facilitators | OPEN |
| T08 | Lending Platform Package | Colombia/Medellín scope | Lending workflow package | **ReFi Medellín / Colombia / Juan** | OPEN |
| T09 | Ecosystem Mapping Package | ReFi-Barcelona + toolkit | Map ontology + workflow | Luiz (lead) | OPEN |

**Tickets location:** `integrations/tickets/T[01-09]-*.md`  
**Workspaces location:** `integrations/sync/package-workspaces/T[01-09]-*/`

---

## 4) Flow: How Each Ticket Becomes a Full Package

Every package moves through 7 stage gates. Each stage has defined work and exit criteria.

### Stage 1 — Source Lock
- **Work:** Verify all canonical source files exist and are readable. Freeze versions.
- **Exit criteria:** `SOURCE-LOCK.md` created with all sources verified and dated.

### Stage 2 — Package Spec
- **Work:** Define audience, use cases, in-scope/out-of-scope artifacts, acceptance criteria.
- **Exit criteria:** `PACKAGE-SPEC.md` approved with measurable outputs listed.

### Stage 3 — Draft Build
- **Work:** Create package docs, templates, examples, implementation checklist.
- **Exit criteria:** `DRAFT-BUILD.md` complete; all artifacts present in workspace.

### Stage 4 — Implementation Sync
- **Work:** Apply package into target repo(s); create patch/change list.
- **Exit criteria:** `SYNC-LOG.md` lists all applied changes and pending items.

### Stage 5 — Validation
- **Work:** Run QA: clarity, links, reproducibility, metrics.
- **Exit criteria:** `VALIDATION-CHECKLIST.md` all critical checks passed or flagged with mitigations.

### Stage 6 — Publish
- **Work:** Release package; track version and release notes.
- **Exit criteria:** `RELEASE-NOTES.md` created; status set to PUBLISHED.

### Stage 7 — Feedback Loop
- **Work:** Capture lessons from first real implementations.
- **Exit criteria:** `RETRO.md` created with improvements for vNext.

**Required artifacts per package:**
- `SOURCE-LOCK.md`
- `PACKAGE-SPEC.md`
- `DRAFT-BUILD.md`
- `SYNC-LOG.md`
- `VALIDATION-CHECKLIST.md`
- `RELEASE-NOTES.md`
- `RETRO.md`

---

## 5) Sprint-1 Execution (Active)

**Currently executing:**
- T01 Local Node Onboarding Package — Source Lock + Package Spec complete, artifact set v0.1 built
- T02 Network Initiative Onboarding Package — Source Lock + Package Spec complete, artifact set v0.1 built
- T03 Impact Reporting Package — Source Lock + Package Spec complete, artifact set v0.1 built

**Sequence:**
1. T01 → T02 → T03 (P0 onboarding pair + reporting)
2. T05 (ReFi-DAO-Website equivalent)
3. T06 + T07 (Safe + Hum account packages)
4. T09 (Ecosystem Mapping)
5. T08 (Lending Platform — pending Juan co-design)
6. T04 (Quartz publishing — runs parallel as enabler)

---

## 6) Immediate Next Actions

- [x] Create package folders and ticket structure
- [x] Start T01/T02/T03 Source Lock (completed — all sources verified)
- [x] Complete T01/T02/T03 Package Spec
- [x] Draft first artifacts in T01/T02/T03 DRAFT-BUILD.md
- [x] Open implementation parity checklist: BCN / Mediterranean / Provence → DAO website (`integrations/sync/REFI-DAO-WEBSITE-PARITY-CHECKLIST-260307.md`)
- [x] Apply T01/T02 implementation sync to ReFi-DAO-Website community + resources-hub onboarding pages
- [ ] Schedule co-design session for Lending Platform package with ReFi Medellín / Colombia / Juan
- [ ] Add ecosystem-map data model alignment across ReFi-Barcelona + regen-toolkit + Local-ReFi-Toolkit
- [x] Add cross-ticket/workspace index for T01/T02/T03 (`integrations/tickets/INDEX-T01-T02-T03-260308.md`)
- [x] Run link/index integrity check (`integrations/sync/LINK-INDEX-INTEGRITY-CHECK-260308.md`)

---

## 7) Quick Reference

| Need | Go to |
|---|---|
| See all tickets | `integrations/tickets/PIPELINE-BOARD-260307.md` |
| See ticket detail | `integrations/tickets/T[01-09]-[package-name].md` |
| See package workspace | `integrations/sync/package-workspaces/T[01-09]-[package-name]/` |
| Understand stage gates | Section 4 above (Flow) |

---

## 8) Notes

- This pipeline is intentionally package-first and reusable across territories.
- Keep attribution explicit to each source repo/file.
- For reporting artifacts, use the 3-step Regenerant Catalunya prompt chain (analyze → generate → evaluate).
- All T01/T02/T03 source files verified present on 2026-03-07.

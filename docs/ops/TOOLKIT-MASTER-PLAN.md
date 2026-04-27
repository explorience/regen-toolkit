# Regen Toolkit — Master Plan

**Last updated:** 2026-02-18 (luizfernando-refidao)

This document is the canonical overview of the Regen Toolkit effort. It consolidates vision, active workstreams, integrations, and operational references so contributors can understand “what we are building” and “what is active right now” in a single place.

---

## 1. Vision & Objectives
- Deliver a practical, tools-first regenerative web3 toolkit that serves local nodes, nonprofits, and governance/education programs.
- Avoid static link lists: every article/playbook should be actionable, evidence-backed, and wired into real workflows (treasury setup, funding, onboarding, governance, etc.).
- Make the toolkit interoperable with adjacent knowledge bases (Bioregional Knowledge Commons, KOI, ReFi DAO archives, etc.) via documented integrations and taxonomy crosswalks.
- Keep AI-assisted production transparent: research notes, prompts, and evaluation steps must remain auditable inside the repo.

Reference sources: `REQUIREMENTS.md`, `SUBAGENT-PLAN.md`, `DEVELOPMENT-WORKFLOW.md`, `PROTOTYPE-DEVELOPMENT-PLAN.md`.

---

## 2. Current Workstreams (tracked in `BRANCH-DEVELOPMENT.md`)
1. **Quartz template operations** — ensure `03 Libraries/quartz-refi-template/` stays deploy-ready for website hosting. Includes package verification, operator docs, and any overrides we introduce.
2. **Regenerant Catalunya activity-report pipeline** — run the AI-assisted reporting workflow (`docs/project-reports/README.md`) for Karma deliverables and capture prompt/process updates.
3. **Toolkit integrations mapping** — keep `integrations/` (workplan, status board, crosswalks) aligned with execution under regen-coordination ownership.
4. **Active content lane (current focus)** — Track 3.2 Multisig Treasury implementation (primary file: `content/3-playbooks/3.2-implementation-patterns/setting-up-multisig-treasury.md`) plus companion articles for gnosis safe and governance bridges.

---

## 3. Operating Documents
- **Execution briefs / next actions**: `docs/ops/TOOLKIT-OPERATING-BRIEF.md`, `docs/ops/TOOLKIT-NEXT-ACTIONS.md`
- **Production status**: `docs/ops/PRODUCTION-STATUS-ACTIVE.md`
- **Integration plans**: `integrations/INTEGRATIONS-WORKPLAN-260217.md`, `integrations/INTEGRATIONS-STATUS-BOARD-260218.md`, article backlog + crosswalks
- **Skill & subagent catalog**: `SKILLS-INDEX.md`, `.cursor/skills/*`, `SUBAGENT-PLAN.md`

Older nightly logs and historical status reports now live under `docs/archive/` with a single aggregation (see §5).

---

## 4. Integrations & Cross-System Sync
Active targets (see `integrations/README.md` for details):
1. **Bioregional Knowledge Commons** — local projects + taxonomy crosswalk (source packet 01)
2. **KOI / KOI integration stack** — protocol + research assets (source packet 02)
3. **Regen Coordination docs** — governance workflows (source packet 03)
4. **ReFi DAO archives** — legacy articles + blog mapping (source packet 05)
5. **Local ReFi Toolkit** — reference-only but used for historical context
6. **Regen Toolkit Interface** — eventual publishing layer

Each integration tracks: purpose, sync cadence, owners, and content opportunities. When a new article lane spins up from an integration, add it to `integrations/ARTICLE-BACKLOG-*.md` and link the corresponding `content/*` path.

---

## 5. Production History & Archives
- Nightly/overnight reports and status snapshots are archived in `docs/archive/`.
- Aggregated summary lives in `docs/archive/PRODUCTION-HISTORY.md` (see action item below).
- Use the archive for provenance; all active planning should reference this master plan instead of legacy documents.

---

## 6. Maintenance Checklist
1. Update this master plan whenever a new workstream or lane becomes active/inactive.
2. Keep `BRANCH-DEVELOPMENT.md` in sync with the same workstreams.
3. When closing a lane, move detailed logs/notes into `docs/archive/` and capture the final status here.
4. For each integration change, update both the workplan and backlog.
5. Ensure README and SKILLS-INDEX link back to this document so newcomers land here first.

---

## 7. Quick Links
- Vision & requirements: `REQUIREMENTS.md`
- Subagent architecture: `SUBAGENT-PLAN.md`
- Execution workflow: `DEVELOPMENT-WORKFLOW.md`
- Operating brief: `docs/ops/TOOLKIT-OPERATING-BRIEF.md`
- Next actions (72h): `docs/ops/TOOLKIT-NEXT-ACTIONS.md`
- Integrations hub: `integrations/`
- Branch log: `BRANCH-DEVELOPMENT.md`

*Last editor: regen-coordination execution agent.*

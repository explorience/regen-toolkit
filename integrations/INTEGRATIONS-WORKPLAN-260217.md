# Integrations Workplan

Date: 2026-02-17  
Purpose: open an integrations folder and run a focused integration mapping sprint for toolkit interoperability and article production.

---

## 1) Objectives (next 14 days)

- Define integration architecture for external knowledge systems.
- Build a prioritized integration map (what to connect first).
- Generate article-ready topic queues from each integrated system.
- Establish repeatable workflow: source scan → integration profile → article backlog.

---

## 2) Folder structure (v1)

```text
integrations/
  README.md
  INTEGRATIONS-WORKPLAN-260217.md
  ARTICLE-BACKLOG-260217.md
  profiles/
  crosswalks/
  sync/
```

### Planned subfolders

- `profiles/` — one file per system (`<system>-integration.md`)
- `crosswalks/` — taxonomy/tag and content type mappings
- `sync/` — sync procedures and scripts (manual/semi-automated)

---

## 3) Priority integration targets

| Priority | System | Local Path | Goal |
|---|---|---|---|
| P0 | Bioregional Knowledge Commons | `03 Libraries/bioregionalknowledgecommons` | Shared ontology, commons-to-toolkit pathways |
| P0 | KOI ecosystem | `03 Libraries/koi-net`, `03 Libraries/koi-net-integration` | Technical + applied interoperability playbooks |
| P0 | Greenpill Network | `content/sources/` (B,H,I,M,P,S) + external | Co-builder content; chapters alignment; Blake ontology |
| P0 | SuperBenefit Knowledge Garden | `content/sources/` (E,O) + knowledge.superbenefit.org | DAO patterns, governance, Reimagining Power case studies |
| P0 | OpenCivics / Regen Commons | `content/sources/` (R) + OpenCivics GitHub | Bioregional mapping tool; knowledge commons interoperability |
| P0 | Regenerant Catalunya | `03 Libraries/Regenerant-Catalunya` | Phase 2 case study pipeline; crypto transfers, Humm, network safes |
| P0 | Regen Coordination docs | `03 Libraries/Regen Coordination` | Import governance/funding/toolkit references |
| P0 | ReFi DAO docs | `03 Libraries/ReFi DAO` | Operational templates and onboarding synthesis |
| P1 | Local ReFi Toolkit | `03 Libraries/Local-ReFi-Toolkit` | Canonical playbook and case study reuse |
| P1 | Regen Toolkit Interface | `03 Libraries/regen-toolkit-interface` | UI-layer integration for discoverability |
| P0 | Ecosystem Canvas | `03 Libraries/ecosystem-canvas` | Visualization layer for ecosystem mapping and fund flows; embeddable in ReFi DAO and Regen Coordination sites |
| P1 | ReFi DAO Blog (Ghost) | blog.refidao.com + `03 Libraries/ReFi-DAO-Website` | Style guide derivation; historical content extraction |
| P1 | Bloom Network | External | Grassroots climate action; web3 onboarding pathway |
| P1 | BioFi Project | `content/sources/` (Q) + biofi.earth | Bioregional finance; place-based organizing |
| P1 | Quartz Publishing Layer | `03 Libraries/quartz-refi-template` | Content-to-site pipeline; deploy validation |

---

## 4) Work phases

### Phase A — Mapping (Days 1–3)
- [x] Create profile templates in `profiles/`.
- [x] Produce 6 original system profiles (one per priority system).
- [x] Produce 8 additional profiles: Greenpill, SuperBenefit, OpenCivics, Regenerant Catalunya, ReFi DAO Blog, Bloom, BioFi, Quartz.
- [ ] Record integration type per system:
  - content reuse
  - taxonomy alignment
  - workflow/process integration
  - technical/API integration

### Phase B — Crosswalks (Days 4–7)
- [ ] Build first taxonomy crosswalk (`toolkit tags ↔ external tags`).
- [ ] Map content types: guide/playbook/case study/framework/tooling docs.
- [ ] Identify duplicate and complementary content zones.

### Phase C — Article pipeline (Days 8–10)
- [ ] Generate article candidates from each profile.
- [ ] Prioritize by impact and readiness.
- [ ] Assign draft owners and source packets.

### Phase D — Prototype sync process (Days 11–14)
- [ ] Define “minimum sync loop” (weekly updates).
- [ ] Draft changelog format for imported updates.
- [ ] Decide what remains manual vs AI-assisted.

### Phase E — Tier 2/3 integration mapping (ongoing)
- [ ] Map content from ReFi DAO Blog, Bloom, BioFi, Quartz into article backlog.
- [ ] Extend taxonomy crosswalk with Greenpill, SuperBenefit, OpenCivics, Bloom, BioFi columns.
- [ ] Add ownership matrix rows for new integration targets in canonical ownership rules.

### Phase F — Package pipeline activation (2026-03-07)
- [x] Open owner-side content development pipeline with package backlog.
- [x] Include onboarding + impact reporting + Quartz parity + account tooling + ecosystem mapping.
- [ ] Convert each package into assignable implementation tickets.
- [ ] Run Sprint-1 sequence and track status per package owner.

Reference: `integrations/CONTENT-DEVELOPMENT-PIPELINE-260307.md`

---

## 5) Deliverables

- 14 integration profiles (`profiles/*.md`)
- 1 taxonomy/content crosswalk draft (`crosswalks/`)
- 1 prioritized article backlog (`ARTICLE-BACKLOG-260217.md`)
- 1 sync SOP draft (`sync/`)

---

## 6) Quick operating rules

- Always preserve source attribution.
- Prefer synthesis over duplication.
- Keep integration notes actionable (next action + owner + status).
- Track unknowns/blockers explicitly.

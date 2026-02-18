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
| P0 | Regen Coordination docs | `03 Libraries/Regen Coordination` | Import governance/funding/toolkit references |
| P1 | ReFi DAO docs | `03 Libraries/ReFi DAO` | Operational templates and onboarding synthesis |
| P1 | Local ReFi Toolkit | `03 Libraries/Local-ReFi-Toolkit` | Canonical playbook and case study reuse |
| P2 | Regen Toolkit Interface | `03 Libraries/regen-toolkit-interface` | UI-layer integration for discoverability |

---

## 4) Work phases

### Phase A — Mapping (Days 1–3)
- [ ] Create profile templates in `profiles/`.
- [ ] Produce 6 system profiles (one per priority system).
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

---

## 5) Deliverables

- 6 integration profiles (`profiles/*.md`)
- 1 taxonomy/content crosswalk draft (`crosswalks/`)
- 1 prioritized article backlog (`ARTICLE-BACKLOG-260217.md`)
- 1 sync SOP draft (`sync/`)

---

## 6) Quick operating rules

- Always preserve source attribution.
- Prefer synthesis over duplication.
- Keep integration notes actionable (next action + owner + status).
- Track unknowns/blockers explicitly.

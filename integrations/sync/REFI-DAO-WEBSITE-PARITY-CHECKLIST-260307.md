# ReFi-DAO-Website Parity Checklist (BCN / Mediterranean / Provence) — 260307

Purpose: align `03 Libraries/ReFi-DAO-Website` with cross-site baseline patterns used in:
- `03 Libraries/ReFi-BCN-Website`
- `03 Libraries/ReFi-Mediterranean`
- `03 Libraries/ReFi-Provence`
- `03 Libraries/quartz-refi-template`

---

## 1) Structural parity

- [ ] Quartz core config files present and aligned
  - [ ] `quartz.config.ts`
  - [ ] `quartz.layout.ts`
- [ ] Standard `content/` scaffolding parity
  - [ ] `content/index.md`
  - [ ] `content/README.md`
  - [ ] key section directories
- [ ] Scripts parity vs template where relevant
  - [ ] setup/sync scripts reviewed
  - [ ] deploy/build scripts reviewed

## 2) Navigation and IA parity

- [ ] Top-level navigation structure mapped across all 4 sites
- [ ] Community section parity checked (`local-nodes`, `network-initiatives`)
- [ ] Resource hub/doc pathways consistent
- [ ] Missing pages identified with target paths

## 3) Content format parity

- [ ] Frontmatter keys normalized (title, description, tags, publish settings)
- [ ] Internal linking conventions normalized (`[[wikilinks]]` vs markdown links)
- [ ] Multi-language strategy alignment checked
- [ ] Cross-site reusable block candidates extracted

## 4) UX and style parity

- [ ] Shared visual conventions identified (hero, cards, section headers)
- [ ] Site-specific customizations documented separately
- [ ] Accessibility baseline checks queued

## 5) Operational parity

- [ ] Build commands tested per repo
- [ ] CI/CD assumptions documented
- [ ] Release checklist standardized

## 6) Deliverables for T05

- [ ] Gap matrix (`DAO vs BCN/Mediterranean/Provence`)
- [ ] Patch list (ordered by impact and risk)
- [ ] Implementation plan with sprint slices
- [ ] Validation criteria for parity completion

---

## Tracking

Status: OPEN  
Owner: Luiz (lead)  
Linked ticket: `integrations/tickets/T05-refi-dao-website-equivalent-package.md`

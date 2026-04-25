# HEARTBEAT.md — Regen Web3 Toolkit Active Tasks

_A living checklist of active coordination tasks. Agents consult this on every session. Update regularly — mark done, add new, remove stale._

---

## Active Tasks

### Master Doc & Handoff
- [ ] Matt — one more iteration push on master doc (`docs/MASTER.md`); then download/reupload cycle before handoff
- [ ] Coordinate handoff — announce to team when the download/reupload is happening (avoid concurrent edits)
- [ ] Apply frame-language critique to master doc sections (Durgadas — next iteration)
- [ ] Resources tab (weakest layer) — dedicated collaborative organization session, timing TBD
- [ ] Team — individual layer ownership declarations (open invitation; see `IDENTITY.md` for current state)

### Knowledge Site (Layer 2 — Encyclopedia)
- [ ] Apply Matt's feedback on 4 articles: scams, seed phrases, wallet comparison, key terms (Heenal)
- [ ] Phase 2 — expand 43 medium articles through the 5-stage editorial pipeline
- [ ] Human review of all 67 published drafts
- [ ] Add real-world examples from approved source maps (Restor, Hylo, P2P Foundation, ReFi Ecosystem, Weavers, Second Renaissance)

### CSIS Integration (Layer 5 — Deployment)
- [ ] Encode Dunbar-number scaling research into next CSIS standards review (Durgadas)
- [ ] Encode six-directional responsibility model into next CSIS standards review (Durgadas)
- [ ] Make compressive vs generative standards explicit in Deployment Layer
- [ ] Define conformance posture (partial adoption vs full conformance) assessment framework

### Hackathon — May (cross-layer)
- [ ] Invite Ethereum Localism folks via Telegram (Rather)
- [ ] Join Open Civics Consortium chat via website; coordinate hackathon invite (Luiz)
- [ ] Confirm Geo Protocol participation and format
- [ ] Set the hackathon date and format (knowledge-swarming hack)

### Ontology (Layer 3 — cross-cuts)
- [ ] Formalize Rather's ontology as toolkit standard (adopt and propagate through metadata)
- [ ] Resolve V1 vs V2a vs V2b — implement doc recommendation (V1 base + V2b overlay)

### Resource Graph (Layer 1)
- [ ] Lift the 11+ domain URL lists (~3,900 lines) from master doc into structured `data/resources.yaml`
- [ ] Clarify taxonomy vs ontology distinction (master doc line 181 flag)

---

## System Health

### Site
- [ ] `npm run build` passes
- [ ] Live site reachable at regen-toolkit-site.vercel.app

### Data Integrity
- [ ] `data/ontology/` YAMLs align with master doc
- [ ] `data/option-library.yaml` reflects current 9 categories
- [ ] `.well-known/` schemas match current data (run `npm run generate:schemas` after changes)

### Federation
- [ ] Last sync with upstream (see `federation.yaml`)
- [ ] Peer sync with regen-coordination-os

---

## Recently Completed

- [x] 2026-04-24 — org-os overlay landed (this instance now operates as its own org-os)
- [x] 2026-04-23 — Rather's ontology adopted as toolkit standard
- [x] 2026-03-26 — Astro site migrated into monorepo (PR #304)
- [x] Ontology extracted to `data/ontology/` (4 YAMLs)

---

_Last updated: 2026-04-24_

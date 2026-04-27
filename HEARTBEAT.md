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
- [x] Lift the 11+ domain URL lists from master doc into structured `data/resources.yaml` (mechanical pass — 2026-04-26; 738 entries, 285 URL-bearing, 50 domains)
- [ ] **Brandon — curation pass on `data/resources.yaml`** (dedupe, drop tag-as-resource bullets, fill URLs, classify)
- [ ] Clarify taxonomy vs ontology distinction (master doc line 181 flag)

### Historic carryovers (from backfilled meetings — needs team triage)

These surfaced from the meeting bootstrap (2026-04-26). Status of each is unclear; team should triage on next planning call:

- [ ] Drew Simon — share knowledge commons starter links + details in group chat (raised 260212; status unclear)
- [ ] Hub post about knowledge commons / federation collaboration (Afo — raised 260225; never confirmed sent)
- [ ] Bright community collaboration — concrete ideas + connection to toolkit (Luiz to discuss with Rather; raised 260212)
- [ ] Onboarding guides refresh: Local Node Onboarding + Network Initiative Onboarding (raised 260312; unclear status)
- [ ] Integrate Safe (smart wallet) content into the toolkit (raised 260312; unclear status)
- [ ] Style guide derived from ReFi DAO 200+ blog posts (raised 260212; partial existence — see `docs/writing-system.md`)
- [ ] Update outdated Obsidian canvases — architecture / content structure / development workflow / master overview (raised 260212; the canvases live in `docs/canvases/`)
- [ ] Web-based canvas visualization (no Obsidian required) — exploratory (raised 260212)

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

- [x] 2026-04-26 — Resources lift: 738 entries extracted from `MASTER.md` (lines 1089–2668) into `data/resources.yaml` via `scripts/lift-resources.mjs`. Layer 1 source-of-truth file now exists; Brandon-curation handoff queued.
- [x] 2026-04-26 — `docs/ORG-OS.md` (operator one-pager, <500 words) + `docs/LAYERS.md` (per-layer status for all 8 layers); README, MASTERPLAN, IDENTITY cross-linked.
- [x] 2026-04-26 — Meeting history backfilled from personal vault (5 meetings: 260115, 260129, 260212, 260225, 260312) into canonical `packages/operations/meetings/` layout; MEMORY.md "Organizational History" populated
- [x] 2026-04-25 — CSIS + KOI design specs mirrored into toolkit (`docs/from-regen-coord/`, `docs/from-refi-dao/`); toolkit-side plan queue established
- [x] 2026-04-24 — org-os overlay landed on `feature/org-os-overlay` (this instance now operates as its own org-os)
- [x] 2026-04-23 — Rather's ontology adopted as toolkit standard
- [x] 2026-03-26 — Astro site migrated into monorepo (PR #304)
- [x] Ontology extracted to `data/ontology/` (4 YAMLs)

---

_Last updated: 2026-04-26_

# BOOTSTRAP.md — First-Run Onboarding

_Run this on a fresh clone of an org-os instance. Bootstrapping has three phases: clone & install, source ingestion, and ongoing learning. After Phase 1 completes, this file can be archived._

---

## Phase 0: Clone with Submodules

External skill collections (superpowers, karpathy-skills, optionally feynman) live as git submodules under `.agents/skills/`. Clone with submodules to get them automatically:

```bash
git clone --recurse-submodules <repo-url>
# or, if already cloned:
git submodule update --init --recursive
```

To pull the latest from each submodule later:
```bash
git submodule update --remote
```

---

## Phase 1: Identity & Install

For a brand-new instance, fill in the identity files manually (or via a guided interview if your operator harness provides one):

### For New Workspaces (Empty Instance)

Run the bootstrap interview:

1. **Organization identity** — name, type, mission, values
   → Generates: `SOUL.md`, `IDENTITY.md`

2. **Team** — core members, roles, contact info
   → Generates: `data/members.yaml`

3. **Projects** — active initiatives, status, leads
   → Generates: `data/projects.yaml`

4. **Communication** — channels, platforms, purposes
   → Generates: `data/channels.yaml`

5. **Network** — federation membership, peers
   → Generates: `federation.yaml` (identity + federation sections)

6. **Data sources** — Notion, GitHub repos, websites, docs
   → Populates: `TOOLS.md`, `data/sources.yaml`

A guided interview workflow (CLI or web form) can automate this if your harness provides one. See `docs/OPERATOR-GUIDE.md`.

### For Existing Workspaces (Agent Joining)

If the workspace already has files, skip the interview and run the standard onboarding:

- [ ] Read `MASTERPLAN.md` — understand mandate and activations
- [ ] Read `SOUL.md` — internalize values and voice
- [ ] Read `IDENTITY.md` — note org identity, governance, addresses
- [ ] Read `USER.md` — understand the operator
- [ ] Read `MEMORY.md` — check key decisions
- [ ] Read `memory/` (last 3-7 days) — recent context
- [ ] Read `HEARTBEAT.md` — identify urgent tasks
- [ ] Read `TOOLS.md` — available integrations
- [ ] Read `federation.yaml` — network relationships
- [ ] Run `npm run validate:schemas` — check system health
- [ ] Create `memory/YYYY-MM-DD.md` with initialization note
- [ ] Present summary to operator

---

## Phase 2: Source Ingestion

After the workspace has basic files, point the agent at existing knowledge sources:

### GitHub Repositories
```bash
# Add repos to repos.manifest.json, then:
npm run clone:repos
npm run index:repos
```
→ Populates: `repos/`, `data/sources.yaml`

### Website / Blog
Use the `knowledge-curator` skill to process articles:
→ Populates: `knowledge/[domain]/`, `data/sources.yaml`

### Podcast Episodes
Use the `knowledge-curator` skill to process episodes:
→ Populates: `knowledge/podcast/`, `data/sources.yaml`

### Notion Databases
Configure Notion MCP (see `docs/TOOL-SETUP.md`), then:
```bash
npm run sync:notion
```
→ Syncs: `data/*.yaml` ↔ Notion databases

### Documents
Process documents into appropriate locations:
- Proposals, governance docs → `docs/`
- Knowledge content → `knowledge/`
- Meeting transcripts → `data/meetings.yaml` via `meeting-processor` skill

### Generate Schemas
After ingesting sources:
```bash
npm run generate:schemas
npm run validate:schemas
```

---

## Phase 3: Ongoing Learning

After initial setup and ingestion, the workspace enters continuous improvement:

- **Meeting processing** → Builds operational memory, extracts action items
- **Heartbeat monitoring** → Tracks priorities, surfaces blocked tasks
- **Knowledge curation** → Expands knowledge commons from new content
- **Idea scouting** → Surfaces ecosystem gaps from knowledge analysis
- **Workspace improvement** → Autonomous autoresearch loop (see `docs/AUTORESEARCH.md`)
- **Feedback loop** → Agent behavior improves based on operator corrections

The `workspace-improver` skill manages the autonomous improvement cycle. See `skills/workspace-improver/SKILL.md`.

---

## Post-Bootstrap

Once Phase 1 is complete:
- Archive this file: `mv BOOTSTRAP.md docs/bootstrap-completed-YYYY-MM-DD.md`
- Future sessions use the standard startup sequence in `AGENTS.md`
- Log "Bootstrap complete" in `memory/YYYY-MM-DD.md`
- Begin Phase 2 source ingestion when ready

---

_Bootstrap is a one-time ritual for Phase 1. Phases 2 and 3 are ongoing. The standard session startup (AGENTS.md) handles all subsequent sessions._

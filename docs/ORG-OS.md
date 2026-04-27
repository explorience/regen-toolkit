# org-os — One-Pager (Regen Web3 Toolkit)

**org-os** is a coordination operating system overlay for organizations and projects — a structured repo layout for team coordination, meeting processing, decision tracking, and agent collaboration. The toolkit uses it to coordinate development around `MASTER.md` (Matt's master doc).

## What it gives the toolkit

1. **A canonical layout** — every contributor knows where meetings, decisions, and project state live: `packages/operations/`, `MEMORY.md`, `HEARTBEAT.md`, `data/`.
2. **A session lifecycle** — `/initialize` opens a session with a pre-rendered dashboard (8 layers, projects, tasks, calendar, federation); `/close` writes memory and commits.
3. **Skills** — agent capabilities under `skills/` for processing meetings, scouting ideas, generating schemas, monitoring health. External methodology submodules under `.agents/skills/` (superpowers, karpathy-skills).
4. **Federation hooks** — peer instances (`regen-coordination-os`, `bread-co-op-os`) sync via `federation.yaml`. KOI federation planned once refi-dao-os Wave 2 lands.

## How to start (operator)

```bash
git clone --recurse-submodules -b feature/org-os-overlay \
  https://github.com/explorience/regen-toolkit.git
cd regen-toolkit
npm install
```

Then in Claude Code:

```
/initialize
```

The dashboard renders, `MASTER.md` loads as canonical, and the layer ownership state surfaces. Read `MASTERPLAN.md` for the full mandate, `IDENTITY.md` for ownership, and `LAYERS.md` for current per-layer status.

## How to start (contributor on a specific layer)

See [`LAYERS.md`](LAYERS.md) — find your layer, follow the **Working on this layer** section.

## Why org-os, not just a README

- **Multi-contributor by design.** Distributed authorship across 8 layers with no single project lead. Structure holds it together.
- **Master doc is canonical.** `MASTER.md` is the spec. Every decision traces back to it (or updates it intentionally, with rationale in `MEMORY.md`).
- **Agent-friendly.** Skills, frontmatter, and structured registries make AI assistance reliable — agents read the same files humans do.

## How it relates to the broader stack

- **Knowledge site** (Astro/Starlight at `src/`, `content/`, `public/`) — the public-facing artifact at [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app). The site is what ships.
- **org-os overlay** (root MDs, `data/`, `packages/operations/`, `skills/`) — coordination layer, co-located with the site. Operates on the working branch `feature/org-os-overlay` (PR #310 closed without merge — the team works against the branch directly, not gated on review).
- **External skill collections** (`.agents/skills/` submodules) — superpowers (agentic methodology) + karpathy-skills (LLM-coding heuristics).
- **KOI federation** (planned, gated on refi-dao-os Wave 2) — meetings and knowledge will eventually flow through KOI; the layout is sensor-friendly today. See `from-refi-dao/koi-integration-design.md`.

## Where to go deeper

- [`../MASTERPLAN.md`](../MASTERPLAN.md) — full development mandate
- [`../IDENTITY.md`](../IDENTITY.md) — leads, layer ownership, governance
- [`LAYERS.md`](LAYERS.md) — per-layer status and next steps
- [`MASTER.md`](MASTER.md) — the master doc itself
- [`../CLAUDE.md`](../CLAUDE.md) — agent operating instructions
- [`../AGENTS.md`](../AGENTS.md) — session startup sequence

## Status (2026-04-26)

- org-os overlay live on `feature/org-os-overlay` (PR #310 closed; team operates from branch)
- 8 layers documented in `IDENTITY.md`; status in [`LAYERS.md`](LAYERS.md)
- 6 toolkit meetings backfilled into `packages/operations/meetings/` (kickoff → 2026-04-23)
- Bi-weekly Thursday planning call processed via `meeting-processor` skill
- KOI federation: planned, gated on refi-dao-os Wave 2

# CLAUDE.md — Claude Code Instructions for the Regen Web3 Toolkit

This workspace is **two things co-located**: the **Regen Web3 Toolkit knowledge site** (Astro/Starlight) _and_ an **org-os coordination instance** (overlay) that wraps team work around the master doc.

## Quick Start

**Read `MASTERPLAN.md` first**, then `docs/MASTER.md` (the **2026-05-15 stabilization draft, ~24,700 lines**, by Matt — the actual development spec). `MASTERPLAN.md` is the operator-facing summary; `docs/MASTER.md` is the source of truth. For per-layer entry points (one doc + one canvas per layer), start at [`docs/layers/README.md`](docs/layers/README.md). For triaged TODO work, see [`docs/BACKLOG.md`](docs/BACKLOG.md) (mirrors master doc §16).

Then follow the startup sequence in `AGENTS.md`:

1. `SOUL.md` — values, mission, voice, boundaries
2. `IDENTITY.md` — project identity, layer ownership, leads
3. `USER.md` — operator profile
4. `MEMORY.md` — key decisions, active context
5. `memory/YYYY-MM-DD.md` — latest daily log (also `memory/work-log/` for pre-overlay entries)
6. `HEARTBEAT.md` — active tasks across layers
7. `TOOLS.md` — endpoints, addresses, channels
8. `federation.yaml` — upstream framework, peer instances

## What This Workspace Is

**Knowledge site (Astro/Starlight):**
- 67 articles live at [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app)
- 254-article inventory; 5 learning paths; Knowledge Explorer + Tag Explorer
- Content in `src/content/docs/`; site config `astro.config.mjs`; site scripts in `scripts/` (non-org-os)

**org-os instance (coordination overlay):**
- Master doc `docs/MASTER.md` — canonical development spec (by Matt; 2026-05-15 stabilization draft)
- Per-layer docs `docs/layers/` + per-layer canvases `docs/canvases/layers/` + master overview canvas `docs/canvases/regen-knowledge-commons-toolkit-master.canvas`
- Structured extractions — `data/ontology/`, `data/option-library.yaml`, `data/deployment-requirements.yaml`, `data/feedback-process.yaml`, `data/resources.yaml`
- Backlog `docs/BACKLOG.md` — **triaged TODO surface** mirroring master doc §16 (status labels + routing table; refreshed 2026-05-15 against new iteration; dashboard surfaces open count + top-priority items)
- **10-layer architecture** with named ownership in `IDENTITY.md` (refresh pending post-2026-05-21 biweekly)
- CSIS alignment reference `docs/CSIS.md` (Durgadas)
- Native agent skills in `skills/` — meeting-processor, knowledge-curator, idea-scout, schema-generator, research, workspace-improver, heartbeat-monitor, org-os-init
- External skill collections under `.agents/skills/` (git submodules) — `obra/superpowers` (agentic methodology: TDD, planning, brainstorming, debugging) and `forrestchang/andrej-karpathy-skills` (Karpathy LLM-coding heuristics)

## Key Rules

- **Source of truth:** `docs/MASTER.md` (master doc) + structured data in `data/*.yaml` + decisions in `MEMORY.md`
- **Master doc edit rights:** Matt's working document. Do not modify `docs/MASTER.md` directly unless explicitly authorized. Derive from it.
- **After data changes:** Run `npm run generate:schemas && npm run validate:schemas`
- **Memory:** Write daily logs to `memory/YYYY-MM-DD.md` (append, never overwrite). Existing `memory/work-log/` is pre-overlay history.
- **Safety:** Draft-and-present for external actions (hackathon outreach, article publishing, partner comms). Never send without approval.
- **Layer thinking:** Every change should map to one (or more) of the 10 layers (per 2026-05-15 iteration). Flag which layer in PR descriptions. Start at [`docs/layers/README.md`](docs/layers/README.md).
- **TODO routing:** When something is parked, queued, or needs triage, route it to [`docs/BACKLOG.md`](docs/BACKLOG.md) with a status label (`raw-note` / `needs-routing` / `needs-owner` / `candidate-integration` / `high-risk` / etc.). When picked up for active work, lift to `HEARTBEAT.md`. Dashboard auto-surfaces backlog count + top-priority items.
- **Frame-language discipline:** Per Durgadas's 2026-04-23 critique, watch for Frame 1 (extractive/hierarchical) language masquerading as regenerative — especially on copy and governance docs. See `docs/CSIS.md` and `memory/2026-04-24.md` for context.
- **Preserve the site build:** Never break `npm run dev` / `npm run build` / `npm run preview`. The knowledge site is live.

## Session Lifecycle

Use `/initialize` to start a session (renders dashboard, loads context) and `/close` to end it (writes memory, commits, pushes). These are defined in `.claude/commands/`.

**Optional: Notion API access.** Copy `.env.example` to `.env` and add your `NOTION_API_KEY` for script-based Notion access. Not needed if using Claude Code/Cursor (MCP handles auth automatically).

## Common Tasks

```bash
# Knowledge site
npm run dev                  # Astro dev server
npm run build                # Build static site
npm run preview              # Preview built site

# org-os coordination
npm run initialize           # Render dashboard (pass --format=markdown via the /initialize command)
npm run generate:schemas     # Regenerate EIP-4824 schemas from data/
npm run validate:schemas     # Validate schema compliance
npm run validate:structure   # Check instance against canonical spec
npm run knowledge            # Compile knowledge base + index + lint
```

## Key Docs

**Master + toolkit-specific:**
- `docs/MASTER.md` — **The master doc.** 2026-05-15 stabilization draft, 10-layer architecture (Tracks restored, Infrastructure & Substrate new), 254-article inventory, design rationale, Minimum Operating Kernel (5 objects), 18 cross-cutting principles.
- `docs/MASTER-DOC-CHANGES-2026-05-15.md` — diff vs previous iteration
- `docs/layers/` — per-layer documentation (one doc per layer, 1–10) + README.md index
- `docs/canvases/layers/` — per-layer Obsidian canvases; master overview at `docs/canvases/regen-knowledge-commons-toolkit-master.canvas`
- `docs/BACKLOG.md` — **triaged TODO backlog** (mirrors master doc §16 status labels + routing table; surfaced on dashboard)
- `docs/CSIS.md` — Comprehensive Structural Integrity Suite reference (Durgadas; posture revision pending — new iteration reframes "conformance" → "semantic overlay")
- `docs/briefings/` — Personal briefings on major master-doc iterations
- `docs/plans/` — Plans (active: `master-doc-iteration-may-15-2026.md`; queued: `swarm-contribution-pack.md`)
- `docs/reports/` — Integration reports + team-facing reports

**Framework (org-os):**
- `docs/FILE-STRUCTURE.md` — Canonical directory specification
- `docs/DATA-MODEL.md` — Data model (registries)
- `docs/AGENTIC-ARCHITECTURE.md` — Agent files, bootstrapping, skills
- `docs/SKILL-SPECIFICATION.md` — How to write and share skills
- `docs/FEDERATION.md` — Federation protocol spec

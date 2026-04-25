# CLAUDE.md — Claude Code Instructions for the Regen Web3 Toolkit

This workspace is **two things co-located**: the **Regen Web3 Toolkit knowledge site** (Astro/Starlight) _and_ an **org-os coordination instance** (overlay) that wraps team work around the master doc.

## Quick Start

**Read `MASTERPLAN.md` first**, then `docs/MASTER.md` (the 7,500-line master doc by Matt — the actual development spec). `MASTERPLAN.md` is the operator-facing summary; `docs/MASTER.md` is the source of truth.

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
- Master doc `docs/MASTER.md` — canonical development spec (by Matt)
- Structured extractions — `data/ontology/`, `data/option-library.yaml`, `data/deployment-requirements.yaml`, `data/feedback-process.yaml`
- Backlog `docs/BACKLOG.md` — 11 explicit todos from the master doc
- 8-layer architecture with named ownership in `IDENTITY.md`
- CSIS alignment reference `docs/CSIS.md` (Durgadas)
- Agent skills in `skills/` — meeting-processor, knowledge-curator, funding-scout, etc.

## Key Rules

- **Source of truth:** `docs/MASTER.md` (master doc) + structured data in `data/*.yaml` + decisions in `MEMORY.md`
- **Master doc edit rights:** Matt's working document. Do not modify `docs/MASTER.md` directly unless explicitly authorized. Derive from it.
- **After data changes:** Run `npm run generate:schemas && npm run validate:schemas`
- **Memory:** Write daily logs to `memory/YYYY-MM-DD.md` (append, never overwrite). Existing `memory/work-log/` is pre-overlay history.
- **Safety:** Draft-and-present for external actions (hackathon outreach, article publishing, partner comms). Never send without approval.
- **Layer thinking:** Every change should map to one (or more) of the 8 layers. Flag which layer in PR descriptions.
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
- `docs/MASTER.md` — **The master doc.** 8-layer architecture, 254-article inventory, design rationale.
- `docs/BACKLOG.md` — 11 todos extracted from the master doc
- `docs/CSIS.md` — Comprehensive Structural Integrity Suite reference (Durgadas)
- `docs/briefings/` — Personal briefings on major master-doc iterations

**Framework (org-os):**
- `docs/FILE-STRUCTURE.md` — Canonical directory specification
- `docs/DATA-MODEL.md` — Data model (registries)
- `docs/AGENTIC-ARCHITECTURE.md` — Agent files, bootstrapping, skills
- `docs/SKILL-SPECIFICATION.md` — How to write and share skills
- `docs/FEDERATION.md` — Federation protocol spec

# Organizational OS Workspace — Agent Guide

_Operating instructions for AI agents (OpenClaw, Cursor, or custom runtimes) working in organizational workspaces._

---

## 🎯 START HERE: Read MASTERPLAN.md

**For organization-specific agents**, the canonical source is:

### **`MASTERPLAN.md`** — Your Strategic Vision & Operating Manual

This file contains your mandate, activations, research directions, success metrics, and boundaries. It's how operators steer your autonomous behavior. Read it fully before proceeding with AGENTS.md.

---

## 1. Deterministic Session Startup Sequence

**Recommended:** Run `/initialize` (OpenCode) or `npm run initialize` to get a visual dashboard of the full workspace state — projects, tasks, calendar, funding deadlines, cheatsheets. This reads all files below automatically and renders them as an actionable overview.

At the start of every session, read these files in order:

1. **`MASTERPLAN.md`** — Your mandate, character, and operating context
2. **`SOUL.md`** — Organizational values, mission, voice (grounds your decisions)
3. **`IDENTITY.md`** — Org name, type, chain addresses, network membership
4. **`USER.md`** — Primary operator profile and preferences
5. **`MEMORY.md`** — Long-term memory index: key decisions, active context
6. **`memory/YYYY-MM-DD.md`** — Most recent daily memory log (today's if exists, else latest)
7. **`HEARTBEAT.md`** — Active tasks and monitoring items (check urgency)
8. **`TOOLS.md`** — Environment-specific configuration (endpoints, addresses, channels)
9. **`federation.yaml`** — Network articulation, peers, integrations
10. **Check parity** — Validate data integrity (`npm run validate:schemas`)

If this is the first session ever: run `BOOTSTRAP.md` instead.

---

## 2. Memory System

### Reading Memory

- **Long-term**: `MEMORY.md` (curated index of key decisions and context)
- **Recent**: `memory/YYYY-MM-DD.md` (last 3-7 days for full context)
- **Ground truth**: `data/*.yaml` (members, projects, finances, meetings, funding)

### Writing Memory

- Write daily session notes to `memory/YYYY-MM-DD.md` (append, never overwrite)
- Update `HEARTBEAT.md` when tasks change status
- Update `MEMORY.md` when key decisions are made
- Write operational content to `packages/operations/` directories
- Always preserve `source_refs` (traceability)

### Auto-Sync Behavior

Memory files are automatically committed to git when:

- Session ends (via trap)
- Every 30 minutes (via `.memory-sync.sh` cron)
- Explicit `git add memory/ && git commit`

---

## 3. Subagent Architecture

You are often part of a larger agent ecosystem. Use subagents efficiently for cost-effective work.

### Model Selection Guide

| Model             | Cost   | Use For                                                      |
| ----------------- | ------ | ------------------------------------------------------------ |
| **Kimi-2.5**      | Low    | File I/O, data extraction, parsing, normalization            |
| **Big-Pickle**    | Low    | Synthesis, pattern extraction, YAML generation               |
| **Claude-Sonnet** | Medium | Governance docs, coordination, quality review, boundaries    |
| **GPT-4**         | Higher | High-stakes validation, final approvals, sensitive decisions |

### Subagent Delegation Patterns

**Pattern 1: Data Processing Swarm**

```yaml
Spawn 3-5 agents (one per data slice):
  - Each processes: file extraction, normalization, validation
  - Aggregate results to Big-Pickle for synthesis
  - Use for: Notion sync, repo indexing, large-scale processing
```

**Pattern 2: Review Pipeline**

```yaml
Three-tier review:
  - Draft: Big-Pickle (fast synthesis)
  - Quality: Claude-Sonnet (check correctness, boundaries)
  - Final: GPT-4 (high-stakes approval)
  - Use for: Governance proposals, public communications
```

**Pattern 3: Parallel Research**

```yaml
Spawn multiple agents with different angles:
  - Each researches a domain or aspect
  - Synthesize findings
  - Use for: Ecosystem intelligence, competitive analysis
```

### Subagent Lifecycle

1. **Define** — Clear task, expected output, constraints
2. **Spawn** — Use `sessions_spawn` with appropriate model/runtime
3. **Monitor** — Check status via `subagents list` (on-demand only)
4. **Integrate** — Merge outputs, update memory
5. **Validate** — Ensure quality before marking complete

---

## 4. Autopoietic Agent Coordination

This is a **living, emergent system** — not a rigid hierarchy. You operate as part of an agent ecosystem.

### Six Principles of Coordination

**1. Alignment Without Control**

- Share patterns and discoveries; don't dictate actions
- Broadcast capabilities via `federation.yaml` and `skills/`
- Cross-reference via shared memory (`MEMORY.md`, `memory/` logs)
- Let nodes maintain autonomy

**2. Emergence Over Planning**

- Solutions emerge from operational reality, not blueprints
- Document what works; theory follows practice
- Bottom-up patterns > top-down prescriptions
- Local innovations may become network standards

**3. Autopoiesis (Self-Organization)**

- Maintain your own heartbeat and operational rhythm
- Sense conditions → respond → adapt → learn
- Seek resources (skills, funding, attention) where they flow
- Build organizational capacity from inside out

**4. Cross-Agent Communication Patterns**

```
Discovery broadcast:    "Found pattern X in operations"
Capability inquiry:     "Can you handle task Y?"
Resource sharing:       "Skill Z works well; adapt for your context"
Joint sensemaking:      "What's emerging across all of us?"
Tension signaling:      "Local vs. global priorities conflict here"
```

**5. Role Clarity with Healthy Overlap**

- Each agent has a clear primary role (local, global, hub, framework)
- Overlap zones exist for shared concerns (funding, governance, knowledge)
- Converge on shared context; diverge on local specifics
- Overlapping responsibility reveals shared constraints

**6. Conflict as Design Signal**

- Divergence reveals real tensions (speed vs. consensus, local vs. global)
- Document disagreements in MEMORY.md; don't hide them
- Parallel experiments > forced consensus
- Solutions that fit will propagate naturally

---

## 5. Active Priority Workfronts

The toolkit's workfronts are organized by the 8 layers (see `IDENTITY.md`) and the cross-cuts. As of 2026-04-24:

- **Master doc handoff** — Matt's final iteration push, then layer-by-layer ownership transfer
- **Encyclopedia (Layer 2)** — Phase 2 article pipeline (43 medium articles); apply Matt's feedback on 4 articles
- **Resource Graph (Layer 1)** — Resources tab organization session; lift URL lists into structured `data/resources.yaml`
- **Ontology (Layer 3)** — Adopt Rather's ontology as standard; resolve V1 vs V2a vs V2b
- **Deployment / CSIS (Layer 5)** — Encode Dunbar scaling + six-directional responsibility into next CSIS standards review
- **Frame-language audit** — Apply Durgadas's critique to master doc copy
- **May hackathon** — Outreach to Geo Protocol, Ethereum Localism, Open Civics Consortium

`HEARTBEAT.md` is the live, ordered list.

---

## 6. Safety Policy

### Autonomous Actions (no approval needed)

- Read any workspace file
- Write to `memory/`, `MEMORY.md`, `HEARTBEAT.md`
- Write meeting notes to `packages/operations/meetings/`
- Update project pages in `packages/operations/projects/`
- Generate EIP-4824 schemas (`npm run generate:schemas`)
- Respond in active session channels
- Maintain federation.yaml peer references

### Requires Operator Approval

- Sending messages to external parties (outside active session)
- Executing or proposing on-chain transactions
- Publishing to external platforms (newsletters, social, governance)
- Modifying core identity files (`IDENTITY.md`, `SOUL.md`, `AGENTS.md`)
- Any financial action (treasury moves, grant applications, payouts)
- Adding/removing federation peers or network relationships
- Changes to governance boundaries or safety policies

### Two-Tier Pattern (From Deployments)

Many organizations add a second approval layer:

- **Operator approval**: Standard boundary above
- **Council/Team approval**: For major decisions (treasury, partnerships, governance)

Document your specific approval categories in `IDENTITY.md` or coordination docs.

**When in doubt: draft and present, don't execute.**

---

## 7. Communication Style

Apply the voice from `SOUL.md`:

- **Plain and direct** — No jargon without definition; no hype
- **No performative helpfulness** — "Great question!" is filler; just help
- **Concise when simple; thorough when needed** — Match complexity to task
- **Match the operator** — Language, pace, formality from `USER.md`
- **Transparent about uncertainty** — Separate facts from assumptions

In group channels:

- Be conservative about unsolicited messages
- Never send half-baked replies
- Confirm scope before acting on behalf of the organization
- React appropriately (use emoji for lightweight acknowledgment)

---

## 8. Skills & Workflows

Skills are in `skills/` directory. Each has a `SKILL.md` with instructions.

### Native Skills (`skills/`)

- `regen-toolkit-article` — Multi-agent pipeline for writing/revising toolkit articles (existing skill)
- `org-os-init` — Session lifecycle (`/initialize`, `/close`)
- `meeting-processor` — Process transcripts into structured meeting notes
- `knowledge-curator` — Aggregate and organize knowledge from channels and activity
- `idea-scout` — Surface ideas from knowledge gaps in the toolkit
- `research` — Deep research workflows powered by Feynman
- `schema-generator` — Regenerate EIP-4824 schemas from `data/`
- `heartbeat-monitor` — Proactive task and health monitoring
- `workspace-improver` — Autonomous improvement loop (autoresearch pattern)

### External Skill Collections (`.agents/skills/`, git submodules)

- `superpowers` (obra/superpowers) — agentic methodology: TDD, planning, brainstorming, systematic-debugging, requesting-code-review, using-git-worktrees, etc.
- `karpathy-skills` (forrestchang/andrej-karpathy-skills) — Karpathy LLM-coding heuristics

Skills can be added at any time.

---

## 9. Operational Packages

Human-structured content lives in:

- `packages/operations/meetings/` — Meeting notes, transcripts, action items
- `packages/operations/projects/` — Project documentation (IDEA framework)
- `packages/operations/finances/` — Financial records, budgets, tracking
- `packages/coordination/` — Multi-org coordination, partnership docs
- `knowledge/` — Knowledge commons, reference materials

EIP-4824 schemas in `.well-known/` are generated from `data/*.yaml` and package content.

---

## 10. Knowledge Layer

The toolkit IS a knowledge garden. The published Encyclopedia (Layer 2) lives at:

- **Articles:** `src/content/docs/` (Astro/Starlight; deploys to regen-toolkit-site.vercel.app)
- **Knowledge graph:** D3.js visualization at `/explorer/`
- **Tags:** `/tags/` for filtering by function, domain, systems concepts, audience, maturity

Editorial pipeline (5-stage): Research → Draft → Fact-check → Edit → Critique. See `skills/SKILL.md` (regen-toolkit-article) and `docs/writing-system.md`.

Structured extractions from the master doc live in `data/`:

- `data/ontology/` — entities, relationships, classification, octo-mapping
- `data/option-library.yaml` — design components (governance, coordination, funding, incentives, measurement)
- `data/deployment-requirements.yaml` — structural components for the Deployment Layer (CSIS-aligned)
- `data/feedback-process.yaml` — 5-step feedback loop + governance

Cross-references between the published site and the structured registries are the toolkit's distinctive feature.

## 11. Federation & Network

This instance is part of the regen-coordination network (see `federation.yaml`).

- **Upstream framework:** `regen-coordination/org-os-template` (`main`) — pulled in via `npm run sync:upstream` when needed
- **Peer instance:** `regen-coordination-os` (network hub, canonical trust)
- **Knowledge commons:** enabled via git protocol; the toolkit contributes back

The toolkit is a project node, not a hub — coordination flows through `regen-coordination-os` for cross-network signals.

---

## 12. Integration Points

- **Hosting:** Vercel (live site auto-deploys from `main`)
- **Repository:** github.com/regen-coordination/regen-toolkit
- **Site stack:** Astro 6 + Starlight + Pagefind
- **Agent runtimes:** Claude Code (primary)
- **External skill collections:** superpowers, karpathy-skills (git submodules; see `.agents/skills/`)
- **Optional:** Notion (per-contributor; configure via `TOOLS.md` if used)

---

## 13. Quick Commands

```bash
# Knowledge site
npm run dev                # Astro dev server
npm run build              # Build static site
npm run preview            # Preview built site

# org-os coordination
node scripts/initialize.mjs --format=markdown   # Render dashboard (called by /initialize)
npm run generate:schemas   # Regenerate EIP-4824 schemas from data/
npm run validate:schemas   # Validate schema compliance
npm run validate:structure # Check instance against canonical spec
npm run knowledge          # Compile + lint knowledge base
```

---

## 14. Success Indicators

The agent layer is working well when:

- **Memory is continuous** — Daily logs in `memory/`, decisions in `MEMORY.md`, no context loss between sessions
- **Layers move** — Backlog items become drafts, drafts become published articles, deployments become case studies
- **Master doc stays canonical** — All structural decisions trace back to `docs/MASTER.md` (or update it intentionally)
- **Layer ownership stays current** — `IDENTITY.md` reflects who actually owns each layer
- **Site keeps shipping** — `npm run build` is green, articles deploy, no regressions
- **Frame-language discipline holds** — Copy is checked for Frame 1 patterns before publishing

---

_This file is the agent's operating manual for the Regen Web3 Toolkit. Update it when the project's coordination patterns evolve._

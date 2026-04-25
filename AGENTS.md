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

<!-- CUSTOMIZE: Replace with your organization's workfronts or use this template -->

Your organization likely has active workfronts. Keep `HEARTBEAT.md` current with:

- What you're working on (with status)
- Who owns each workfront
- What success looks like
- Current blockers

Example structure:

```markdown
### Workfront A: [Name]

**Status:** [In Progress / Blocked / Planning]
**Your Role:** What you specifically do
**Deliverables:** Clear outputs with deadlines
```

See `HEARTBEAT.md` for your specific priorities.

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

### Commonly Available Skills

- `meeting-processor` — Process transcripts into structured meeting notes
- `funding-scout` — Identify and track funding opportunities
- `knowledge-curator` — Aggregate and organize channel knowledge
- `capital-flow` — Treasury monitoring and transaction queuing
- `schema-generator` — Regenerate EIP-4824 schemas from data
- `heartbeat-monitor` — Proactive task and health monitoring

Skills can be added at any time. Check `federation.yaml` for skills shared from hub or upstream.

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

## 10. Knowledge Commons

This workspace implements the **Regen Agency Knowledge Commons** framework as the **upstream reference** for organizational OS implementations.

### Knowledge Structure

- **knowledge/INDEX.md** — Framework knowledge commons navigation
- **knowledge/<domain>/** — Domain-specific framework patterns
- **Template guidance** — How to implement knowledge commons in forks

### Framework Domains

| Domain                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| framework-standards      | Organizational OS standards, schemas, specs |
| template-usage           | How to use and customize the template       |
| knowledge-infrastructure | Agent systems, knowledge graphs, federation |
| agent-coordination       | Multi-agent patterns, Agent Dojo concepts   |

### Framework Distribution

As the **upstream framework**:

- **Downstream sync**: Template changes flow to forked repositories
- **Pattern extraction**: Working patterns from nodes become standards
- **Version alignment**: Nodes sync with framework versions monthly
- **Reference implementation**: Other nodes compare against this standard

### Template Setup

When creating a new organizational OS from this template:

1. Fork or use as template
2. Populate `federation.yaml` with your organization's details
3. Create `knowledge/` directory and INDEX.md
4. Connect to hub via federation.yaml peers/upstream

See `knowledge/INDEX.md` for detailed framework documentation.

## 11. Agent Dojo

The **Agent Dojo** is the knowledge commons for AI agents learning to coordinate regenerative systems. This framework defines the structural patterns.

### Agent Dojo Concept

A distributed network where:

- **Agents are first-class participants** — Knowledge structured for human AND agent consumption
- **Knowledge flows to where it's needed** — Semantic routing, not hierarchical
- **Local autonomy, global coherence** — Independence with shared patterns
- **Learning is continuous** — Agents improve through operational experience

### Framework Role

As the **framework layer**, org-os defines:

- **Structural patterns** — How knowledge commons are organized
- **Sync protocols** — How knowledge flows between nodes
- **Agent interfaces** — How agents interact with knowledge
- **Semantic standards** — Shared vocabularies and schemas

### Downstream Implementation

Agent Dojo is implemented by operational nodes:

- **Regen Coordination OS** — Hub knowledge aggregation and distribution
- **ReFi DAO** — Articulation org knowledge and network coordination
- **ReFi BCN** — Local node expertise and cooperative-Web3 bridging
- **All network nodes** — Local context + network contribution

### Participation

Agents in organizational OS workspaces:

- Use `skills/knowledge-curator/` for knowledge management
- Follow patterns in `AGENTS.md` for coordination
- Reference `federation.yaml` for network context
- Contribute learnings back to framework evolution

## 12. Federation & Network

This workspace is part of a federation network (see `federation.yaml`).

### Key Implications

- Peer nodes share skills — pull updates when available
- Meeting summaries may be published to knowledge commons
- Hub syncs may be automated via GitHub Actions
- Shared domains enable cross-org learning

### Network Coordination

- Contribute knowledge to shared domains
- Use `federation.yaml` to declare network relationships
- Maintain boundary policies (what's public vs. private)
- Respect node autonomy while maintaining alignment

---

## 11. Integration Points

**Upstream**: [org-os-framework](https://github.com/regen-coordination/org-os-framework) — Standards, schemas, and patterns

**Common Integrations** (see `federation.yaml`):

- **Agent runtimes**: openclaw-source (primary), regen_eliza, cursor (alternative)
- **Knowledge infrastructure**: koi-net (real-time sync), koi-net-integration
- **Publishing**: quartz-refi-template (documentation sites)
- **Governance**: Gardens DAO, Snapshot, Hats Protocol
- **Treasury**: Gnosis Safe, Treasury operations tooling

**Related ecosystems**: Check `federation.yaml` for your specific integration map.

---

## 12. For First-Time Setup

1. Run `npm run setup` — Interactive configuration wizard
2. Fill in core identity files:
   - `SOUL.md` — Your organization's values and mission
   - `IDENTITY.md` — Organization details, chain info, treasury
   - `USER.md` — Operator preferences and context
3. Configure `federation.yaml` with your network
4. Run `BOOTSTRAP.md` for agent initialization
5. Run `npm run generate:schemas` to create EIP-4824 outputs

---

## 13. Quick Commands

```bash
npm run initialize         # Visual dashboard of workspace state (or /initialize in OpenCode)
npm run setup              # Interactive setup wizard
npm run sync               # Git sync (status/push/pull)
npm run generate:schemas   # Regenerate EIP-4824 schemas
npm run validate:schemas   # Validate schema compliance
npm run clone:repos        # Clone linked ecosystem repositories
```

---

## 14. Success Indicators

Your agent layer is working well when:

- **Memory is continuous** — No context loss between sessions
- **Operations flow** — Tasks move from HEARTBEAT to completion
- **Federation syncs** — Skills and knowledge flow with peers
- **Safety holds** — Boundaries are respected and documented
- **Agents coordinate** — No conflicting actions, shared context grows
- **Organization adapts** — Patterns improve, processes evolve

---

_This file is the agent's operating manual for your organization. Customize the sections marked `<!-- CUSTOMIZE: -->` and keep it current as your organization evolves._

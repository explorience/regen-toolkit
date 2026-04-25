---
title: "KOI Integration — Design Spec (Phases 1.5 + 4, joint)"
project: koi-integration
date: 2026-04-25
status: design-approved
relatedPlan: docs/agent-plans/koi-integration.md
relatedResearch: docs/research/koi-integration-overview.md
sourceMeeting: meeting-20260424-refi-koi-discovery
spec_scope:
  - "Phase 1.5 — Quick Wins (Tracks A + B)"
  - "Phase 4 — Sovereign OrgOS Filesystem Sensor MVP"
strategic_framings:
  - "Application: Blog + Podcast processing into /knowledge runs on KOI substrate"
  - "Framework: KOI graduates from refi-dao-os feature → org-os package (extractable)"
methodology:
  - "superpowers:brainstorming (process)"
  - "superpowers:writing-plans (next step)"
  - "karpathy-guidelines (think before coding, simplicity, surgical changes, goal-driven execution)"
---

# KOI Integration — Design Spec

Joint design covering Phase 1.5 (Quick Wins, immediate execution) and Phase 4 (Sovereign Sensor MVP, gated on external dependencies). Designed once, executed in two waves, with a clear extraction path to `org-os/packages/koi/`.

## 0. Stated Assumptions (operator-approved)

1. **Naming resolution.** Existing `repos/refi-dao-koi/` (blog/podcast curation) renames to `repos/refi-dao-content/`. New sovereign node lives at `repos/koi-node/` (instance-agnostic).
2. **Two distinct layers.** *Content pipeline* (existing — markdown curation → `knowledge/`) stays as-is and continues to be owned by Luiz (blog) and Monty (podcast). *KOI sensor pipeline* (new) reads filesystem outputs and emits bundles into the federated graph. KOI **federates** the content pipeline, it does not replace it.
3. **Blog/podcast processing-via-KOI** is a *KOI processor* downstream of the sensor: receives raw bundles → enriches with embeddings/tags via personal-koi-mcp tooling → writes back to `knowledge/`. Reuses existing `enrich-from-koi.mjs` scaffolding.
4. **Sequencing.** A and B are designed jointly but executed sequentially: A ships immediately (no blockers); B's spec is complete but execution starts when Sean's meta-prompt and `legion-koi` license question land.
5. **Org-os extraction trigger.** When B is validated in refi-dao-os AND a second instance (refi-bcn-os most likely) signals readiness to adopt. Until then, code lives in refi-dao-os with explicit `instance.config.mjs` boundary.
6. **Success criteria.** A working dev loop where (i) Luiz can query ReFi DAO knowledge through Claude Code via MCP, (ii) the sovereign node ingests at least one filesystem source and exposes it via MCP, (iii) at least one blog/podcast item is enriched via KOI processor and lands in `/knowledge`.

## 1. Architecture & Components

```
┌──────────────────────── refi-dao-os (instance) ────────────────────────┐
│                                                                        │
│  packages/operations/  ┐                                               │
│  knowledge/            ├──► [sensors/*.ts] ──► HTTP ──► KOI Node       │
│  data/*.yaml           ┘     (Node, watch+pull)         (Python)       │
│                                                          │             │
│                              ┌───────────────────────────┤             │
│                              ▼                           ▼             │
│                       [processors/*.mjs]          [MCP server]         │
│                       (Node, enrich/promote)      (exposed locally     │
│                              │                     + to federation)    │
│                              ▼                                         │
│                       knowledge/blog/                                  │
│                       knowledge/podcast/                               │
│                                                                        │
│  instance.config.mjs ◄──── parameterizes namespace, paths, sensors      │
└────────────────────────────────────────────────────────────────────────┘
                                          │
                          (federates with)│
                                          ▼
                          gaiaaiagent/regen-koi-mcp network
                          (peers: Regen, ReFi BCN later, etc.)
```

### Components

1. **KOI Node** (`repos/koi-node/`) — Python service. Forks `LinuxIsCool/legion-koi` *if license clears*; otherwise fresh build on `BlockScience/koi-net`. Owns: graph state (postgres), event bus (NEW/UPDATE/FORGET), federation handshake, MCP server. **Swap-out point** behind the HTTP boundary — fork-vs-fresh decision does not affect the rest of the system.

2. **Sensors** (`packages/koi-sensors/`, Node/MJS — matches existing repo stack) — One module per data source. Each sensor: scans/watches a path, computes RIDs, emits bundles via HTTP `POST /bundles` to the KOI node. Initial set: `operations`, `knowledge`, `data-yaml`, `content`. Each sensor reads its config from `instance.config.mjs`.

3. **Processors** (`scripts/koi-processors/`, Node/MJS) — Reuses existing `enrich-from-koi.mjs` pattern. One processor per workflow: `enrich-blog.mjs`, `enrich-podcast.mjs`, `promote-to-knowledge.mjs`. Each pulls bundles from KOI, transforms, writes back to `knowledge/`.

4. **MCP Surface** — Exposed by the KOI Node natively. Tools: `query_rid`, `search_bundles`, `list_sources`, plus ReFi-specific: `get_project`, `list_members`, `get_meeting`. Available to Claude Code via local socket; permissioned subset shared with federation peers.

5. **Instance Config** (`instance.config.mjs`) — Single source of truth for: namespace prefix (`refidao` for refi-dao-os, `refibcn` for refi-bcn-os, etc.), watched paths, sensor enable/disable, federation peers. **The extraction boundary** — when this file's interface stays generic, sensors and processors are extractable to `org-os/packages/koi/` unchanged.

### Phase 1.5 (Track A + B) lives outside this stack

A1–A4 are MCP installs into Claude Code config (no code), B1–B4 are `personal-koi-mcp` install + smoke tests. They validate the *consumer* side; the architecture above is the *producer* side.

## 2. Data Flow & RID Schemas

### RID schemas (parameterized by `instanceId`)

Generic shape: `orn:<instanceId>.<type>:<reference>`

| Type | RID pattern | Source |
|---|---|---|
| `meeting` | `orn:refidao.meeting:260424/refi-koi-discovery` | `packages/operations/meetings/*.md` |
| `project` | `orn:refidao.project:koi-integration` | `data/projects.yaml` entries |
| `plan` | `orn:refidao.plan:koi-integration` | `docs/agent-plans/*.md` |
| `member` | `orn:refidao.member:luizfernando` | `data/members.yaml` |
| `knowledge` | `orn:refidao.knowledge:web3-infrastructure/koi-protocol` | `knowledge/<domain>/<slug>.md` |
| `blog` | `orn:refidao.blog:slug` | `repos/refi-dao-content/blogs/*.md` |
| `podcast` | `orn:refidao.podcast:s1e03-vocab-review` | `repos/refi-dao-content/podcast/**/*.md` |
| `funding` | `orn:refidao.funding:opportunity-id` | `data/funding-opportunities.yaml` |

For refi-bcn-os: `orn:refibcn.meeting:...` etc. The `instanceId` prefix is read from `instance.config.mjs` — sensors do not hardcode it.

### Four canonical flows

**Flow 1 — Ingest (sensor → graph)**

```
file change in watched path
  → sensor computes RID + content hash
  → if hash unchanged: emit nothing (idempotent)
  → if new: POST /bundles {rid, manifest, content, event:NEW}
  → if changed: POST /bundles {..., event:UPDATE}
  → if deleted: POST /bundles {rid, event:FORGET}
KOI Node validates → ECDSA signs → writes to graph → notifies federation peers
```

**Flow 2 — Federation (peer → peer)**

```
peer (e.g., Regen KOI MCP) subscribes to instance feed
  → respects consent layer: public RIDs auto-shared, permissioned require credential, private never leave node
  → peer pulls bundle by RID or queries by predicate
  → updates flow both ways (we also subscribe to peers)
```

**Flow 3 — Processor (graph → /knowledge)**

```
processor (e.g., enrich-blog.mjs) wakes on schedule or sensor signal
  → query KOI: bundles WHERE type=blog AND status=draft
  → for each: fetch content + existing tags + embeddings
  → enrich (NER, retag, summarize via existing scripts)
  → write enriched markdown to knowledge/blog/<slug>.md with promoted_from frontmatter
  → emit UPDATE bundle so the graph reflects the enriched state
```

**Flow 4 — MCP query (Claude Code → answer)**

```
Claude Code tool call: get_project("koi-integration")
  → MCP server resolves to RID orn:refidao.project:koi-integration
  → fetches bundle from local graph (or peer if not local)
  → returns content + linked RIDs (members, related plans, source meeting)
Claude Code uses linked RIDs to follow-up: get_meeting(...) etc.
```

### Consent layer (per-source default in `instance.config.mjs`)

| Source | Default visibility | Override |
|---|---|---|
| `data/*.yaml` | public | per-record `private:true` |
| `knowledge/` | public | per-file frontmatter `koi.private:true` |
| `packages/operations/meetings/` | **private by default** | per-meeting frontmatter `koi.public:true` (e.g., the KOI Discovery Call itself) |
| `repos/refi-dao-content/` | public (curated) | per-file `status:draft` → permissioned |

## 3. Instance Config — The Extraction Boundary

`instance.config.mjs` is the **only file that needs to change** when porting to another org-os instance.

```js
// instance.config.mjs
export const koiConfig = {
  instanceId: "refidao",                    // → refibcn for refi-bcn-os
  node: {
    apiUrl: "http://localhost:8351",
    storage: "postgres",                    // | "sqlite" for personal mode
  },
  sensors: {
    operations: { enabled: true,  path: "packages/operations/" },
    knowledge:  { enabled: true,  path: "knowledge/" },
    dataYaml:   { enabled: true,  paths: ["data/projects.yaml", "data/members.yaml"] },
    content:    { enabled: true,  path: "repos/refi-dao-content/" },
  },
  consent: { /* defaults from §2 table; overridable per-record */ },
  federation: {
    peers: ["regen-koi-mcp"],
    publishedRids: ["project", "knowledge", "blog", "podcast"],  // never leak meetings/members
  },
};
```

When extracted to `org-os/packages/koi/`, the package imports nothing from `refi-dao-os/`. Refi-dao-os ships its own `instance.config.mjs` and the package consumes it.

## 4. Error Handling (Karpathy #2 — boundaries only)

Internal trust, validate at edges:

- **Sensor → KOI HTTP boundary:** retry with exponential backoff (3 attempts), then log + skip; don't crash the watcher. Failed bundles go to a local dead-letter file (`.koi-dead-letter.jsonl`) for re-emission.
- **KOI Node → federation peer:** peer unreachable = local-only operation continues. No fallback to alternate peers (YAGNI).
- **MCP query miss:** return structured `{error: "rid_not_found", rid}` — let the caller decide.
- **Processor write to `knowledge/`:** dry-run flag default for first run; only writes after operator approves the diff (matches existing org-os "draft-and-present" pattern).
- **No error handling for:** malformed YAML in `data/` (let it throw — already validated by `npm run validate:schemas`), missing files (sensor handles via FORGET event), embedding service down (processor skips, retries next cycle).

## 5. Testing Strategy (Karpathy #4 — verifiable success criteria)

Three layers, each with a concrete success bar:

**1. Unit (sensors + processors)** — TDD per `superpowers:test-driven-development`. Each sensor: "given fixture file at path X, emits bundle Y." Each processor: "given KOI bundle Y, writes file Z with frontmatter F."

**2. Integration (round-trip)** — One end-to-end test per data type: file → sensor → KOI node → MCP query → identical content recovered. Run against a disposable sqlite KOI node so CI doesn't need postgres.

**3. Acceptance (the spec's exit criteria)**

- (a) `claude mcp list` shows `regen-koi` connected; query "list ReFi DAO projects" returns Notion data
- (b) `personal-koi-mcp` answers a vault query against ≥1 ReFi DAO meeting note
- (c) Local KOI node serves `get_project("koi-integration")` returning current YAML data
- (d) `enrich-blog.mjs` enriches one blog post end-to-end and lands it in `knowledge/blog/`
- (e) The one-pager (`docs/koi-one-pager.md`) exists and an operator with no KOI background can stand up the personal mode in <30 min following it

## 6. Deliverables

1. `repos/koi-node/` — Python KOI node (fork or fresh build)
2. `packages/koi-sensors/` — Node/MJS sensors (operations, knowledge, dataYaml, content)
3. `scripts/koi-processors/` — `enrich-blog.mjs`, `enrich-podcast.mjs`, `promote-to-knowledge.mjs`
4. `instance.config.mjs` — instance config + interface contract
5. `docs/koi-personal-setup.md` — Phase 1.5 install/setup (Track A + B)
6. `docs/koi-sensor-architecture.md` — internal architecture reference
7. **`docs/koi-one-pager.md`** — operator-facing single page: what KOI is, why ReFi DAO uses it, how to install both consumer (`regen-koi-mcp`) and personal (`personal-koi-mcp`) modes, how to query it from Claude Code, how the sovereign node fits in, where to go deeper. Written for someone with no prior KOI exposure. *Entry point* — links to #5 for the deeper technical setup, to #6 for architecture, to research index for deeper reading.
8. Updated `data/sources.yaml` — KOI listed as a source/processor
9. Updated `federation.yaml` — KOI peer entries
10. PR upstream to BlockScience or gaiaaiagent (work-in-kind, Phase 7)
11. Tests for #2 and #3 (unit + integration + acceptance)

## 7. Naming Migration (one-time)

- `repos/refi-dao-koi/` → `repos/refi-dao-content/` (existing curation environment renamed)
- New sovereign node: `repos/koi-node/` (instance-agnostic)
- Update `docs/agent-plans/koi-knowledge-merge.md` references
- Update existing `scripts/enrich-from-koi.mjs` path references

## 8. Sequencing & Execution Order

| Wave | Tracks | Blocked by | Estimated effort |
|---|---|---|---|
| **Wave 1 (immediate)** | Phase 1.5 A1–A4 (regen-koi-mcp installs) | nothing | hours |
| **Wave 1 (immediate)** | Phase 1.5 B1–B4 (personal-koi-mcp local setup) | postgres + BGE setup | half-day to one day |
| **Wave 1 deliverable** | `docs/koi-one-pager.md` (drafted from Wave 1 experience) | Wave 1 done | hours |
| **Wave 2 (gated)** | Naming migration (refi-dao-koi → refi-dao-content) | nothing — can run anytime | <1 hour |
| **Wave 2 (gated)** | Phase 4 — sovereign node + sensors + processors | Sean meta-prompt + `legion-koi` license clarity | multi-week |
| **Wave 3 (later)** | Extraction to `org-os/packages/koi/` | Wave 2 validated + 2nd instance ready | days |

## 9. Open Questions / External Dependencies

- **`legion-koi` license** — must clarify with Sean before Wave 2 starts. If unresolved by Wave 2 trigger, fall back to fresh build on `BlockScience/koi-net` (Approach 3 from brainstorm). Architecture identical; ~2 weeks more implementation.
- **Sean + Gregory meta-prompt** — onboarding context promised in 2026-04-24 discovery call.
- **Server infrastructure for org KOI deployment** — Phase 5 question, not in scope of this spec.
- **Personal-koi-mcp dependencies** — postgres (`personal_koi` DB) and BGE embedding service (port 8091). Confirm Luiz's local setup can run both before Wave 1 B-track start.

## 10. References

- Plan: [`docs/agent-plans/koi-integration.md`](../../agent-plans/koi-integration.md)
- Research index: [`docs/research/koi-integration-overview.md`](../../research/koi-integration-overview.md)
- Brief: [`docs/research/koi-integration-brief.md`](../../research/koi-integration-brief.md)
- Deep research: [`docs/research/koi-net-protocol.md`](../../research/koi-net-protocol.md)
- Source comparison: [`docs/research/personal-koi-options-comparison.md`](../../research/personal-koi-options-comparison.md)
- Source meeting: [`packages/operations/meetings/260424 ReFi KOI Integration Discovery Call.md`](../../../packages/operations/meetings/260424%20ReFi%20KOI%20Integration%20Discovery%20Call.md)
- Project: `koi-integration` in [`data/projects.yaml`](../../../data/projects.yaml)
- Memory: `project_refi_koi_integration`
- Karpathy guidelines: `skills/karpathy-guidelines/SKILL.md` (applied throughout)

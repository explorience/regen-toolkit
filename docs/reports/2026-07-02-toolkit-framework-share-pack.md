# Toolkit Framework — Share Pack (for Matty + the group)

> **Purpose:** a concrete first cut to share ahead of the end-of-next-week call. It answers the exact questions Matty + Rather raised (29 Jun): how to *implement the structure in tooling*, *extract the Resource Graph into a portable structured DB that feeds website/search/agents*, and *interconnect Heenal's website with the knowledge-commoning artifact* — with more opinionated design decisions.
> **Prepared 2026-07-02.** Branch: `regen-toolkit-os`. Everything below is real + tested; nothing is overclaimed — what's beta/scaffold is marked as such.

---

## TL;DR

The knowledge-commoning artifact now exists as **working tooling**, not just a doc: a small, portable, org-os-agnostic **framework package** (`@regen-commons/toolkit-framework`) that turns the master doc's structure into schemas + a semantic kernel + agentic skills — plus the **Resource Graph already extracted into a structured, portable DB** (1,616 resources + 89 source systems + 119 encyclopedia entries + the 3 journeys as tracks), plus **Heenal's website forked with two pages** (`/framework`, `/regen-toolkit-os`) that read *live* from that data. The two artifacts (website + knowledge commons) **interconnect through this data layer.** And the master doc's structural contradictions are **resolved with opinionated decisions** (10 of them), surfaced as a short ratification list.

This is the "something concrete" I said I'd bring. It's a first cut — the point is it's *try-able and buildable-on now*, and it gives us opinionated ground to iterate from on the call.

---

## What you asked → what now exists

| The ask (29 Jun) | What's built |
|---|---|
| Matty/Rather: "implement the structure in tooling, store the data, feed websites/agents" | `packages/toolkit-framework` — 21 schemas (the master doc's types as YAML), a semantic kernel with a **JSON-LD `@context` generator** (graph/AI-readable), a validator + CLI, and 3 agentic skills. Zero-build, portable. |
| Matty (GPT rec): "extract the Resource Graph inventory into a structured table/DB… start simple/portable (CSV/JSON/Markdown/DB) before a graph DB" | Done: the V3 spreadsheet was lifted through the framework → `data/resources.yaml` (1,616) + `data/source-systems.yaml` (89), portable YAML, every entry carrying source lineage + review state (raw is never auto-promoted). Exactly the v0.1 Resource Graph fields. |
| Matty: "the Source System Registry distinction (attribution, stewardship, currentness, reuse conditions, return paths)" | It's the K2 keystone: `schemas/source-system.yaml` has `return_path`, `reuse_conditions`, `how_to_credit`, `currentness` — 89 candidates lifted. |
| Rather: "1) knowledge graphing + retrieval layer" | The schemas + `maps_to_core` kernel + `node src/cli.mjs context` (JSON-LD) are the graph substrate to plug retrieval into. **See "For Rather" below — build on this, don't rebuild the schema layer.** |
| Rather: "2) refine the website UI + make the content layer pluggable" | The site now reads from `data/` (the `/framework` page renders the live schema list + kernel-check; the instance page renders live counts). The content layer *is* pluggable via the framework data. Rather's UI work plugs straight in. |
| Matty: "how do Heenal's website + the knowledge-commoning artifact interconnect? (separate right now)" | **Answered below.** The framework/instance split + the shared `data/` layer is the interconnection; the site is the visual front door of the same data. |
| Matty: "lean into more opinionated design decisions" | The framework made 10 (R1–R10) — the master doc's contradictions resolved. **The top-5 for you to ratify are below.** |
| Matty's 3 named sections (Infrastructure & Substrate · Ontology & Semantic Kernel · Resource Graph & Atlas) | All three are the concrete core of what's built (portable substrate · the kernel · the lifted Resource Graph). |

---

## Try it in 5 minutes

**Everyone (visual):** the two new pages — `/framework` (what the framework is + a *live* list of the 21 schemas and a green kernel-check) and `/regen-toolkit-os` (what this instance is), linked from Heenal's homepage. *(Action: deploy the `regen-toolkit-os` branch to a Vercel preview so it's a clickable URL — see Action Items. Locally: `npm run dev`.)*

**Technical (Rather / anyone with the repo):**
```bash
git checkout regen-toolkit-os
cd packages/toolkit-framework
node src/cli.mjs list-schemas          # the 21 schemas (the master doc's types)
node src/cli.mjs kernel-check          # ✓ every extension maps to a core type (fork-compatible)
node src/cli.mjs context               # the generated JSON-LD @context (graph/AI-readable)
npm test                               # 38/38
# and the Resource Graph, already extracted + portable:
head -40 ../../data/resources.yaml  ../../data/source-systems.yaml
```
Read `packages/toolkit-framework/README.md` → `docs/README.md` (KB index) → `docs/WORKED-EXAMPLE.md` (one link → typed objects → a track).

---

## The interconnection (Matty's main uncertainty)

The two artifacts aren't separate — they're **two views of one data layer**:

```
  Heenal's website  ─┐                         ┌─ AI content workflow / agents
  (visual front door)│                         │  (skills: capture-and-route, …)
                     ▼                          ▼
            ┌───────────────────────────────────────────┐
            │  data/  (the shared, portable knowledge layer)  │
            │  resources · source-systems · encyclopedia · tracks │
            └───────────────────────────────────────────┘
                     ▲
        the framework  (schemas + kernel + skills that define & validate the data)
```

- The **framework** defines the structure (schemas, the semantic kernel, the state model).
- The **instance** (regen-toolkit-os) holds the ReFi content *as that structure* — the `data/` files.
- **Heenal's site** renders that data (the `/framework` + instance pages already do; the journeys already map to the framework's `track` schema). As the data grows, the site "seamlessly represents things" — exactly what you hoped.
- The **AI content workflow** and **agents** read/write the same `data/` via the skills.

So "expanded knowledge commoning" and "the website" converge on the shared data layer. That's the concrete interconnection.

---

## For Rather (so we build together, not in parallel)

You named two pieces. Here's how they line up so you build *on* the framework rather than re-deriving the schema layer:

1. **Knowledge graphing + retrieval** — the schema/graph substrate is done: `packages/toolkit-framework/schemas/{core-entities,extension-entities,relationships}.yaml` + `node src/cli.mjs context` emits a JSON-LD `@context`; entities carry stable ids + `maps_to_core`. **Plug retrieval/graphing onto this** (it's already graph/AI-readable). Let's sync so you're not rebuilding types — you'd own the graph store + retrieval, the framework owns the type/relationship contract.
2. **Website UI + pluggable content layer** — the content layer is already pluggable via `data/` (the site reads it; the journeys ↔ `track` schema mapping is in `data/tracks.yaml`). Your UI work slots straight in. This is yours to tackle autonomously as you said — the framework just gives you a typed, validated content source.

*(This also touches your Geo Protocol ontology work — the kernel's `maps_to_core` + crosswalks are exactly the "forkable, interoperable ontology" mechanism; worth comparing notes.)*

---

## The opinionated decisions (for the call / async ratification)

The master doc is purposely optioned; the framework had to pick to be buildable. Full register: **`framework/GAPS.md`** + the draft-and-present master-doc edits in **`docs/reports/2026-06-23-master-doc-proposals.md`**. The **top 5 to ratify:**

1. **R1 — the maturity model:** collapse the ~7 scattered maturity ladders into **three orthogonal axes** (`maturity` · `public_use` · `lifecycle_state`) + flags. *(Matt + Durgadas)*
2. **R7 — CSIS posture:** **CSIS-informed, not conformant**; CSIS as a separable optional overlay. *(Durgadas)*
3. **R8 — roles:** one reconciled **19-role registry** over the 3 divergent lists. *(Matt)*
4. **R3 — the kernel:** the 5-object Minimum Operating Kernel is a **curated front-door subset** of the ontology, not a parallel type system. *(Matt)*
5. **D1 — the spine:** **Knowledge Lifecycle as the spine, the 10 layers as the data-model view** (both, bridged). *(Matt + Heenal)*

None of these are edits to your doc yet — they're proposals. Ratify → I fold them into the next iteration.

---

## Sync notes (so we're aligned)

- **Your v3 ToC / problems / outputs / outcomes update (26 Jun)** + handoff doc 4 + the OpenCivics harmonica notes — I've clocked them but the framework is built against the 06-15 doc. The framework's `architecture/problems-and-theory-of-change.md` should sync to your v3; I'll do that in the full iteration next week.
- **On the "GPT project soul" worry:** this is the artifact-driven counter to it — the structure here is grounded in testable schemas + explicit, reviewable decisions, derived from the doc rather than from any one GPT thread's memory. That's a feature.
- **The full iteration + the call:** I'll do the deeper pass next week (sync to your v3, deepen the skills, the V3 review pass). The call end of next week is perfect to ratify the top-5 + decide the structure together.

## Action items

- [ ] **Luiz — deploy the `regen-toolkit-os` branch to a Vercel preview** so Matty/Heenal can click the two pages. *(The one thing that makes this visually shareable.)*
- [ ] **Luiz — send the messages below** (Matty DM + group + a note to Rather).
- [ ] **Group — ratify the top-5** (async or on the call).
- [ ] **Luiz — full iteration next week** (sync to Matty's v3, deepen, V3 review pass) → then the hub post.

---

## Paste-ready messages

**→ Matty (DM):**

> Hey Matty! Back and properly on this now :) Got to a concrete first cut I'm happy to hand over.
>
> Short version: the knowledge-commoning side now exists as actual tooling, not just the doc — a small portable framework (schemas + a semantic kernel + agent skills) that turns the master-doc structure into something websites/agents can read. And I ran the resource DB through it, so the Resource Graph is already extracted into a clean portable data layer (1.6k resources + ~90 source systems with the attribution/return-path stuff). Heenal's site now has two pages that read live from it (/framework + /regen-toolkit-os), which is basically the answer to how the two artifacts interconnect — they're two views of the same data layer.
>
> I also had to make opinionated calls where the doc leaves options open — I wrote them up as a short "here are the 10 decisions + top 5 we need to ratify" register, framed as proposals for your doc (never editing it directly). That's the meat for our call.
>
> I saw your v3 ToC/problems update — nice, I'll sync the framework's problem-of-change doc to it in the full iteration next week. Let's do the call end of next week to ratify the structure + decide the opinionated bits together? I'll send a clickable preview link shortly. (and re: the gpt "soul" — I think this is the antidote: it's grounded in testable schemas + explicit decisions, not one thread's memory.)

**→ Group (Telegram/hub):**

> Concrete first cut of the knowledge-commoning tooling is up on the `regen-toolkit-os` branch 🌱
> — a portable framework (the master-doc structure as schemas + a semantic kernel + agent skills)
> — the Resource Graph extracted into a clean portable data layer (1.6k resources + ~90 source systems, with source lineage + review state)
> — Heenal's site forked with two pages (/framework + /regen-toolkit-os) reading live from that data → the two artifacts interconnect through the shared data layer
> — the master doc's open structural choices resolved as 10 opinionated decisions (top-5 to ratify)
> Preview link + a short "try it / decisions to ratify" pack coming. Would love eyes before the call.

**→ Rather (reply):**

> Rather — this overlaps directly with what you're picking up, in a good way. The schema/graph substrate for piece (1) is already built: the framework's core/extension entities + relationships emit a JSON-LD @context (graph/AI-readable), everything's typed with maps_to_core. So retrieval/graphing can plug straight onto it — you'd own the graph store + retrieval, the framework owns the type/relationship contract (no need to re-derive types). For piece (2), the site's content layer is already pluggable from `data/` (journeys map to a `track` schema) — your UI work slots right in. Can we sync this week so we're not building the same schema layer twice? Also curious how it lines up with your Geo Protocol ontology — the maps_to_core/crosswalk mechanism is the forkable-interoperable-ontology piece.

# Operate the Toolkit Agents — a first-run guide

**For:** Matt (and any operator new to coding agents) · **From:** Luiz · **Date:** 2026-07-15
**Status:** draft — Luiz walks through this live on the Thu Jul 16 call; you don't need to do it solo first.

> **The idea in one line:** "fire up the engine and feed it." You open the toolkit as a project in an
> AI coding agent, and the agent already knows how to run the capture → review → publish machine —
> because the instructions live in the files, not in your head. You point it at a source; it does the
> reversible work; you stay the human gate on the consequential calls.

## What you need (once)

1. **An AI coding agent.** Any of these work — they all read the same files:
   - **Claude Code** (recommended to start — simplest): a terminal app + a desktop/web app. Install from `claude.com/code`. Sign in.
   - Or **Cursor** (a VS-Code-style editor with an agent panel), or OpenCode — same idea.
2. **The repo on your machine.** Two options:
   - Clone the toolkit: `git clone https://github.com/regen-coordination/regen-toolkit` then `cd regen-toolkit && git checkout regen-toolkit-os`. **`regen-toolkit-os` is the dev branch — always work on it, not `main`.**
   - Or start from the portable framework only: `npx degit luizfernandosg/toolkit-framework && cd toolkit-framework && npm install`.
3. **Node ≥ 22** (Claude Code will tell you if it's missing; `node -v` to check).
4. **Install dependencies** (once, from the repo root): `npm install` — then `npm install` again inside `packages/toolkit-framework`. The first makes the site + `/initialize` run; the second makes the machine (the `ingest`/`review` CLI + its tests) run.

That's the whole setup. No accounts, keys, or servers beyond the agent itself. *(Verified 2026-07-15 on a clean clone: both installs, `npm test` in the framework → 125/125, `/initialize`, and `npm run build` all succeed out of the box.)*

## First run (5 minutes, on the call)

1. **Open the folder as your project** in the agent (in Claude Code: run `claude` from inside the repo folder).
2. **Type `/initialize`.** The agent loads the project's context — what this instance is, what's active, where things live. You'll get a dashboard.
3. **Ask it to show you the machine:** *"walk me through the ingestion pipeline and the review queue."* It reads the `ingest` and `review-promote` skills and explains the loop.

## The core loop (what "feeding the engine" means)

```
  a source (a doc, a spreadsheet, a URL, a transcript)
        │  you: "ingest this"
        ▼
  ingest prepare  →  work orders            (the machine slices the source)
        ▼
  the agent decomposes each into typed objects  (draft candidates — reversible)
        ▼
  the accept gate  →  validates + stores as `raw`   (born-rules: nothing skips review)
        ▼
  review-promote   →  YOU, the human gate           (promote honestly, never in bulk)
        ▼
  a structured, provenance-tracked, reviewed commons
```

In practice you mostly say things like: *"ingest the articles in this folder,"* or *"run the review
queue with me — show me the source-systems one at a time."* The agent drives the CLI; you make the calls.

## The safety rails (already built in — good to know)

- **Nothing publishes itself.** Every object is born `raw` and sits in a review queue. Promotion to
  anything public needs you, named, as reviewer.
- **AI-assisted ≠ human-reviewed.** The moment you review an object, its AI-assisted flag clears — it
  now says "a named human answers for this."
- **Public is not commons.** Sensitive material gets a public-use boundary at the gate; it can't reach
  a public view without a reviewed decision.
- **Draft-and-present for anything outward.** The agent drafts comms, proposals, deploys — you send.
- **It's all inspectable + reversible.** Every object keeps its source; merges and promotions can be
  undone. Re-running the same batch doesn't duplicate anything (the idempotency guard).

## See it before you run it

- **The whole picture on one page:** [`docs/CONVERGENCE.md`](../CONVERGENCE.md) — how your Database_Spec,
  the machine, and the site are the same system, and where the review pipeline plugs in.
- **On the running site:** `/convergence` (the pipeline + a live schema map of the commons, by type),
  `/self-ingestion` (the toolkit's own articles through the machine), `/handoff` (your Canonical_DB slice).
- **In Obsidian:** open `docs/canvases/the-machine.canvas` for the pipeline as a canvas, and the vault
  graph view filtered to `path:kb-graph` to see the commons clustered by object type.

## Where to look

- The 7-step, real-output walkthrough: `packages/toolkit-framework/docs/GETTING-STARTED.md`.
- What each agent skill does: `packages/toolkit-framework/skills/` (`ingest`, `review-promote`,
  `register-source`, `map-ontology`, `capture-and-route`, `csis-review`, `compose-journey`).
- The instance you'd be running: this repo — see `/initialize`.

## Good first things to feed it

- A folder of your own notes or a Google-Doc export → watch it come out as typed objects.
- A slice of the Canonical_DB (we just did this — see `/handoff`) → your curated rows, typed + deduped.
- A blog or publication URL → a source-system card + its artifacts.

You won't break anything: raw is never auto-promoted, and everything's in git. Start small, review a
handful, and get a feel for the loop. We'll do the first one together Thursday.

---

## For the next contributor (generalizing beyond this call)

The same three steps onboard anyone — Heenal, a reviewer, a new steward. Nothing here is specific to one person:

1. **Get the repo on the dev branch.** `git clone https://github.com/regen-coordination/regen-toolkit && cd regen-toolkit && git checkout regen-toolkit-os`, then the two `npm install`s above. (If you were handed access to a different org's copy after the repo migrates, the branch name is the same.)
2. **Open it in any coding agent and type `/initialize`.** The instructions live in the files (`CLAUDE.md`, `AGENTS.md`, `.claude/commands/`, the `skills/`), so the agent — Claude Code, Cursor, OpenCode — already knows how to run the machine. No per-person setup.
3. **Pick a lane and work it through the same gate.** Whatever you contribute — new sources to ingest, review-queue judgments, content edits — is born `raw`, keeps its provenance, and needs a *named human* (you) to promote it. Editorial and curation work is exactly "run the review queue with me."

**Roles plug into the same machine, not into bespoke tooling:**

| If you're doing… | You mostly… | Start with |
|---|---|---|
| Curation (feeding sources) | `"ingest this folder / URL / doc"` | the `ingest` skill · `/handoff` for a worked example |
| Review / editorial | `"run the review queue with me, one at a time"` | the `review-promote` skill · `/convergence` for what's queued |
| Framework iteration | edit `packages/toolkit-framework`, keep `npm test` green | `GETTING-STARTED.md` · the crosswalk gaps (T4) |

**Two house rules for everyone:** work on `regen-toolkit-os` (the dev branch), and nothing goes to a
public view or an external channel without a named human's review — the agent drafts, you send.

> **Operator note (Luiz, before onboarding anyone):** the dev branch must be pushed to `origin`
> first — a fresh clone only sees what's on the remote. As of 2026-07-15 local `regen-toolkit-os` is
> ~20 commits ahead of `origin` (this session's viz pack + the parallel framework work). Push before
> the call, or Matty clones a stale machine.

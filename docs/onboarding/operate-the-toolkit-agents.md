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
   - Clone the toolkit: `git clone https://github.com/explorience/regen-toolkit` then `cd regen-toolkit && git checkout regen-toolkit-os`.
   - Or start from the portable framework only: `npx degit luizfernandosg/toolkit-framework && cd toolkit-framework && npm install`.
3. **Node ≥ 22** (Claude Code will tell you if it's missing; `node -v` to check).

That's the whole setup. No accounts, keys, or servers beyond the agent itself.

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

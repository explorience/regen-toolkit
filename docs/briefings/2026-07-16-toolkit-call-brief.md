# Toolkit Call Brief — Thu Jul 16, 2026

**For:** Luiz (operator prep) · **With:** Matt (10:30–11:30 EST) · **Status:** draft-and-present — nothing sent

> **The one-sentence frame:** *Matt spec'd the system; it's already built — here's the crosswalk, the
> conformance, and his own data running through it.*

## Agenda (60 min)

1. **The convergence (10 min)** — his Database_Spec = the framework machine. Show, don't tell:
   - Live: [`/self-ingestion`](https://luizfernandosg.github.io/regen-toolkit/self-ingestion/) (the toolkit's 119 articles → 722 objects) and [`/handoff`](https://luizfernandosg.github.io/regen-toolkit/handoff/) (his Canonical_DB slice → 146 objects).
   - The moment: his 4 hand-flagged duplicates → the machine's guard caught the same 4 automatically. His sensitive rows → boundary-flagged at the gate (handles his public/private caveat).
2. **The crosswalk + Definition of Done (15 min)** — [crosswalk](https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/reports/2026-07-15-framework-masterdoc-crosswalk.md) (§40, the return his Guide asks for) + [DoD conformance](https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/reports/2026-07-15-definition-of-done-conformance.md) (7✅/8🟡). Be honest about the gaps — they're the roadmap:
   - **Relationships** need a first-class sourced-assertion record (his Core Decision #3) — real T4 work.
   - **Person/Organization entity** — no schema yet; 8/30 rows fell back to `resource`.
   - `implementation-record` assumes a case happened; his rows are prospective candidates. Semantic-fit note.
3. **The capital proposal (10 min)** — [capital update-proposal](https://github.com/explorience/regen-toolkit/blob/regen-toolkit-os/docs/proposals/2026-07-13-capital-update-proposal.md) — the schema side of his decision #5. Shape it together. (It formalizes what his own doc already says: capital as classification, not root types.)
4. **Set him up to run the agents (15 min)** — walk [`operate-the-toolkit-agents`](../onboarding/operate-the-toolkit-agents.md) live; get Claude Code installed + a first `ingest` going on something of his. "Fire up the engine and feed it."
5. **Open decisions to record (10 min)** — see below; record defaults, don't block.

## Division of labor (confirm)

- **Matt / editorial:** the 6-Part / §0–43 master transform + raw-notes routing (his next review cycle → then he hands off the final master).
- **Luiz / technical:** ingestion, crosswalk, migration manifest, public-safe views, AI metrics, implementation memory — mostly done.

## Open decisions to surface (Guide §11 / Master_Spec §34) — record, don't block

- Final root/subtype vocabulary (incl. person/org entity, publication-system vs artifact).
- Auto-promotion scope: which low-risk AI outputs may eventually auto-promote.
- Review labels + approval authority; correction/withdrawal process.
- Named governance roles (functions-first for now).
- CSIS/CROPS intake scope (review lens, never conformance claim).
- Public interface exposure (which views, people discovery, graph).

## What comes after (so Matt sees the runway)

- **T3b** — full Canonical_DB ingestion (2,689 rows) + Discovery_Pool promotion, once he's iterated the DB.
- **T4** — framework evolution from the crosswalk gaps (relationship records, person/org entity, currentness/confidence/maintenance status dims).
- **Master narrative** — the 6-Part refactor, after his final handoff.
- **Human review pass** — the 722 + 146 objects are `raw`; review-promote continues (source-systems done).

## Asks of Matt

- Time to shape the capital proposal.
- Go-ahead on which of his data to ingest next (Canonical_DB families in priority order).
- Green light to keep the `/handoff` + `/self-ingestion` preview pages up (they're on the preview domain, not production).

## Do NOT (per the guard rails)

- Don't restructure `docs/MASTER.md` — his lane, awaiting his final.
- Don't push anything from the handoff to a public view without the review gate.
- Don't send comms without his/the group's read (the share pack is drafted, not sent).

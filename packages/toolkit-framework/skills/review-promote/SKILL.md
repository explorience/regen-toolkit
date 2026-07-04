---
name: review-promote
version: 0.2.0
description: Run a guided human review session over the KB's review queue — inspect raw/AI-assisted objects with the reviewer, promote K1 maturity honestly, never in bulk, never without a named human. The operator of "raw is never auto-promoted".
framework: toolkit-framework
agnostic: true
---

# review-promote

The human gate. You facilitate; the human decides. You NEVER promote without a
named reviewer in the room.

## Session loop

1. `… review list --adapter <a> --target <t>` — show the queue, grouped by schema.
2. For each object (or the slice the reviewer picks): present it whole — title,
   fields, provenance chain (origin → work_order → source_lineage). Flag anything
   the accept gate can't judge: unverified claims, thin provenance, Frame-1
   language (see csis-review), high-risk triggers missed at ingest.
3. Ask the reviewer for the verdict. The honest menu (real K1 maturity rungs —
   there is no "plausible"):
   - stays `raw` (not ready) · `draft` (shaped but unchecked) · `candidate`
     (sane, awaiting verification) · `source-linked` (claims traced to sources)
     · `reviewed` (human checked it) · or **edit first** (fix fields, then promote).
4. `… review promote <ref> --maturity <value> --reviewer <name>` — one object
   at a time. The CLI validates the merged object BEFORE writing (a refused
   promotion writes nothing), clears `ai_assisted` on any reviewer-present
   promotion (provenance.authorship keeps the AI history), and re-derives the index.
5. **Demotion** (`--maturity raw`, no reviewer needed): the CLI leaves old
   `reviewed_by`/`last_reviewed` stamps in place as history — record WHY in the
   object's `notes` field (edit before demoting) so the trail is honest.
6. End of session: report — N reviewed, M promoted, K sent back with notes.

## Hard rules

- No reviewer present → read-only session. Summarize the queue; promote nothing.
- Never batch-promote. Each object is a decision.
- Promotion to `reviewed` of MRV/carbon/funding/governance claims additionally
  needs the csis-review skill's high-risk pass — point the reviewer there.
- `ai_assisted` clears on ANY reviewer-present promotion (even to `draft`) —
  if the reviewer only skimmed, promote to `draft`/`candidate` honestly rather
  than `reviewed`; the flag-clear means "a named human now answers for this".

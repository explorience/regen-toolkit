---
name: ingest
version: 0.2.0
description: Operate the framework's ingestion pipeline end-to-end — claim work orders, read sources, produce candidate typed objects, and hand them to the CLI accept gate. The batch big sibling of capture-and-route. Agents NEVER write to storage; only the CLI does.
framework: toolkit-framework
agnostic: true
---

# ingest

You are the semantic half of the pipeline (seam 1). The CLI did the deterministic
half (`ingest prepare` → work orders in `.workorders/`). Your job: turn each
work order's source into **candidate typed objects**. You do not validate, you
do not store — the CLI's accept gate does.

## The loop

1. **Pick an open order:** `node <framework>/src/cli.mjs ingest list --status open --dir .workorders`
2. **Claim it:** `… ingest claim <wo-id> --by <your-name> --dir .workorders`
3. **Read the order** (`.workorders/<wo-id>.yaml`): `source_path`, `source_type`,
   `target_schemas` (suggestions, not a cage), `instructions`.
4. **Read the source. Decompose (deep intake):** one shared thing becomes many
   entries — a transcript can yield source-systems + resources + concepts +
   claims + signals. Consult `skills/capture-and-route/SKILL.md` steps 1–7 for
   the decomposition discipline (source-system check, high-risk triggers,
   routing, provenance).
5. **If the source's shape is foreign** (its own type system / vocabulary),
   run `skills/map-ontology` first and propose extensions rather than
   shoehorning.
6. **If the origin is a living knowledge environment**, run
   `skills/register-source` so the source-system card + return path exist
   BEFORE content objects reference them.
7. **Write candidates** to `.workorders/<wo-id>/candidates/<nn>-<schema>.yaml`,
   one per object:

   ```yaml
   schema: source-system        # any schema from `list-schemas` (structural/meta schemas are rejected)
   object:
     title: …
     type: …                    # the schema's discriminator
     maturity: raw              # ALWAYS raw — promotion is review-promote's job
     ai_assisted: true          # ALWAYS true for agent-produced objects
     provenance:
       origin: "<where this came from — file, URL>"
       transformation: synthesized   # quoted|summarized|synthesized|translated|remixed|inferred
       authorship: ai-assisted
     # …schema fields; run `validate <schema> <file>` locally if unsure
   ```

8. **Mark fulfilled:** `… ingest fulfill <wo-id> --dir .workorders`
9. **Hand to the gate:** `… ingest accept <wo-id> --dir .workorders`
   - Rejected? The order's `error_notes` are your retry instructions. Fix the
     candidates, `fulfill` is already set — run `accept` again.
10. **Never run `store` yourself unless the operator asked** — storing is an
    operator/CI decision (`store --adapter <kb-folder|repo-data> --target <dir>`).

## Hard rules

- `maturity: raw`, `ai_assisted: true`, `provenance.origin` — on every object. The gate enforces these; save yourself the round-trip.
- High-risk triggers (people, exact locations, TEK/Indigenous knowledge, MRV/carbon claims, funding/legal/governance recs) → `high_risk: true` + a `public-use-boundary` candidate.
- Retweets/mentions are signals, not endorsements. Do not create public person-nodes.
- One candidate file per object. Small objects over mega-objects — they compose.

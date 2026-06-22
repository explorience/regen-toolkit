# Worked Example — from one shared link to a track

A contributor drops one link into the commons: **the Gitcoin Grants page**
(`https://www.gitcoin.co/grants`). Here's the whole journey through the framework.

## 1. Capture & route (the `capture-and-route` skill)
One input decomposes into several **typed objects** — not one blob. The deep-intake
questions (Appendix C / `templates/instance/deep-intake.md`) produce:

- a **resource** — the Gitcoin Grants page → [`examples/resource.example.yaml`](../examples/resource.example.yaml)
- a **source-system** — the Gitcoin Governance Forum behind it (a peer, with a `return_path`) → [`examples/source-system.example.yaml`](../examples/source-system.example.yaml)
- a **concept** — Quadratic Funding, with its lineage → [`examples/concept-lineage.example.yaml`](../examples/concept-lineage.example.yaml)
- an **option** — Quadratic Funding as a reusable funding component → [`examples/option-entry.example.yaml`](../examples/option-entry.example.yaml)
- a **provenance** block + **public-use boundary** on anything sensitive.

Each carries state (K1): the resource is `source-linked`, the option is `field-informed`.
Nothing is auto-promoted; raw stays raw until reviewed.

Validate any of them:
```bash
node src/cli.mjs validate option-entry examples/option-entry.example.yaml   # ✓ valid (option-entry)
```

## 2. Explain it (Encyclopedia)
The concept gets an explanatory page → [`examples/encyclopedia-entry.example.yaml`](../examples/encyclopedia-entry.example.yaml),
with known tensions (sybil-resistance cost, plutocracy vs breadth) made visible.

## 3. Compose a track (the `compose-journey` skill)
For a real audience — *"a local node treasurer with a small matching pool"* — we compose a
**track** that selects the concept + option and surfaces the deployment checks →
[`examples/track.example.yaml`](../examples/track.example.yaml). A track **prepares**; it does
not specify. The compatibility engine checks the option pairings.

## 4. Specify a deployment
When the node actually runs it, the track becomes a **deployment** — valid *only if* the six
minimum structures are explicit → [`examples/deployment.example.yaml`](../examples/deployment.example.yaml)
(decision system, information requirements, power structure, accountability, failure detection,
boundaries). Readiness `L3-community-pilot`.

## 5. Learn from it (Implementation + Signal + Evolution)
After the round, an **implementation-record** captures what actually happened →
[`examples/implementation-record.example.yaml`](../examples/implementation-record.example.yaml)
(two collusion clusters; a clawback). That surfaces a **signal** →
[`examples/signal.example.yaml`](../examples/signal.example.yaml), interpreted into an
**evolution-record** → [`examples/evolution-record.example.yaml`](../examples/evolution-record.example.yaml)
that adds a dispute-window variant to the option. The loop closes:
Signal→Sensemaking→Balance→Intervention→Integration→Memory.

## 6. Contribute back (federation)
A **contribution-record** → [`examples/contribution-record.example.yaml`](../examples/contribution-record.example.yaml)
attests the work and names the `source_system_reciprocity` — the dispute-window heuristic flows
back to the Gitcoin forum via its `return_path`. Peers, not extraction.

---
**The shape:** one link → Resource + Source-System + Concept + Option → Encyclopedia → Track →
Deployment → Implementation → Signal → Evolution → Contribution. Five kernel objects carry the
spine; everything validates; nothing is overclaimed.

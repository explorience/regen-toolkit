# Getting started — 10 minutes to a working knowledge base

Zero-build. You need Node ≥18 and one dependency (`js-yaml`). This walkthrough
runs the **machine** — `init` → `ingest` → `store` → `review` → `federate` —
end to end, with real output at every step. Everything below actually ran;
nothing is faked.

## 1. Get the framework

**Today the framework lives inside the regen-toolkit monorepo** (branch
`regen-toolkit-os`), at `packages/toolkit-framework` — the branch is not yet on
the public repo's `main`. A standalone public repo with an `npx degit`
one-liner arrives with the 0.2.0 extraction; *this section gets replaced then.*
Until it does, use your existing checkout (or ask on the team channel):

```bash
cd <regen-toolkit>/packages/toolkit-framework
npm install            # installs js-yaml only
```

```
added 2 packages, and audited 3 packages in 980ms

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```bash
export FW=$PWD          # remember where the framework lives; used from every other dir below
mkdir -p /tmp/tf-demo   # scratch space for the rest of this walkthrough
```

## 2. Replicate: init

`init` turns an empty (or existing) directory into a working, ingestable,
federation-ready KB instance — one command.

```bash
mkdir -p /tmp/tf-demo/my-kb && cd /tmp/tf-demo/my-kb
node "$FW/src/cli.mjs" init .
```

```
✓ instance "my-kb" initialized at .
next: complete the self source-system card (register-source skill), then run the ingest skill
```

Three things got stamped: `kms.yaml` (the instance's identity + defaults),
an empty `.workorders/` inbox, and a `kb/` target holding the instance's own
**self source-system card — already stored through the storage adapter**, not
a loose file. That distinction matters: a loose file would be invisible to
`kb index`/`review`; storing it through the adapter makes the instance a
federation citizen from birth (real inventory, `kb index` → `total: 1`).

`kms.yaml`:

```yaml
instance: my-kb
adapter: kb-folder
target: kb
self_ref: kb/objects/source-system/my-kb.yaml
peers: {}
framework: '@regen-commons/toolkit-framework'
```

The self card (`kb/objects/source-system/my-kb.yaml`):

```yaml
title: my-kb
type: repo
steward: my-kb
return_path: unset — complete via the register-source skill
maturity: raw
lifecycle_state: raw-lead
ai_assisted: true
notes: >-
  Self card created by init. Complete steward, return_path, reuse_conditions,
  how_to_credit before federating.
```

It's deliberately a draft — `return_path` literally says "unset." Complete
`steward`/`return_path`/`reuse_conditions`/`how_to_credit` via the
`register-source` skill before you federate for real (§6).

**Wrapping existing content** does the same stamping, then scans a path and
queues one work order per file. `/tmp/tf-demo/legacy-notes` here is just two
short markdown files (a team's raw notes) — substitute your own directory:

```bash
mkdir -p /tmp/tf-demo/my-kb-existing && cd /tmp/tf-demo/my-kb-existing
node "$FW/src/cli.mjs" init . --existing /tmp/tf-demo/legacy-notes
```

```
✓ instance "my-kb-existing" initialized at . — 2 work order(s) queued from existing content
next: complete the self source-system card (register-source skill), then run the ingest skill
```

```bash
node "$FW/src/cli.mjs" ingest list --dir .workorders
```

```
wo-2fb398f32380  open  deployment-checklist.md
wo-49b7e2e2557d  open  quadratic-funding-notes.md
```

> **Run the CLI from the instance dir.** `store`/`kb`/`review` all read
> `kms.yaml` first (adapter, target, self_ref, peers) and only fall back to
> hardcoded defaults if it's missing — refs it stores are meaningful relative
> to that directory, not absolute.

We'll carry `my-kb-existing` through the rest of this walkthrough.

## 3. Ingest: the work-order loop

Claim an order (claim races are real — if `claim` fails with an illegal-transition
error, someone else got there first; go back to `list`):

```bash
node "$FW/src/cli.mjs" ingest claim wo-49b7e2e2557d --by demo-agent --dir .workorders
```

```
wo-49b7e2e2557d → claimed
```

The agent (`skills/ingest`) reads the order's `source_path`/`source_type`/
`target_schemas` (suggestions, not a cage), decomposes the source (deep
intake — one shared thing becomes many entries), and writes one candidate
file per object to `.workorders/<wo-id>/candidates/<nn>-<schema>.yaml`:

```yaml
schema: concept-lineage
object:
  title: Quadratic Funding
  type: concept
  maturity: raw
  ai_assisted: true
  short_description: >-
    A mechanism where the matching-pool share scales with the number of
    contributors, not just the amount contributed — broad small-dollar
    support outweighs a single large donor.
  toolkit_usage: referenced as the canonical funding-option pattern
  risks_of_flattening: >-
    collusion rings (a small group splits contributions across many wallets
    to inflate the match) are a known failure mode, not a footnote
```

That's a common first-draft mistake — no `provenance`. Mark it fulfilled and
hand it to the gate:

```bash
node "$FW/src/cli.mjs" ingest fulfill wo-49b7e2e2557d --dir .workorders
node "$FW/src/cli.mjs" ingest accept wo-49b7e2e2557d --dir .workorders
```

```
wo-49b7e2e2557d → fulfilled
✗ wo-49b7e2e2557d not accepted:
  - 01-concept-lineage.yaml: provenance.origin is required (Principle 1)
```

The gate is atomic: nothing moved, the order stays `fulfilled`, and that
exact message is now the order's `error_notes` — the retry instructions. Fix
the candidate (add `provenance`) and accept again; `fulfill` doesn't need to
be repeated:

```yaml
schema: concept-lineage
object:
  title: Quadratic Funding
  type: concept
  maturity: raw
  ai_assisted: true
  provenance:
    origin: quadratic-funding-notes.md
    transformation: summarized
    authorship: ai-assisted
  short_description: >-
    A mechanism where the matching-pool share scales with the number of
    contributors, not just the amount contributed — broad small-dollar
    support outweighs a single large donor.
  toolkit_usage: referenced as the canonical funding-option pattern
  risks_of_flattening: >-
    collusion rings (a small group splits contributions across many wallets
    to inflate the match) are a known failure mode, not a footnote
```

```bash
node "$FW/src/cli.mjs" ingest accept wo-49b7e2e2557d --dir .workorders
```

```
✓ wo-49b7e2e2557d accepted (1 object(s))
```

The other order is still `open` — nothing forces a whole batch through at once:

```bash
node "$FW/src/cli.mjs" ingest list --dir .workorders
```

```
wo-2fb398f32380  open  deployment-checklist.md
wo-49b7e2e2557d  accepted  quadratic-funding-notes.md
```

## 4. Store: pick your seam

Ingestion and storage are deliberately separate (seam 2) — one interface,
three adapters, honestly different maturity:

**`kb-folder`** — a self-contained folder (`objects/<schema>/*.yaml` + derived
`index.json` + `context.jsonld`). No host system required; syncs over
git/Syncthing/anything. This is what `kms.yaml` defaults to. Choose it for a
bare instance, a new project, or any standalone garden.

**`repo-data`** — per-schema registry files (`data/kb/<schema>.yaml`, an
`entries:` map per file) under wherever `target` points. Built for an org-os
coordination instance that already has its own `data/*.yaml` conventions —
and it deliberately does **not** touch your existing `data/*.yaml` files
(different shapes; `@org-os/kms` is the bridge). `init` has no `--target`
flag yet, only `--adapter` — pre-write `kms.yaml` with the `target` you want
before running `init` if you don't want the default `kb/` nesting:

```bash
mkdir -p /tmp/tf-demo/my-org-instance && cd /tmp/tf-demo/my-org-instance
cat > kms.yaml <<'YAML'
instance: my-org-instance
adapter: repo-data
target: .
peers: {}
framework: '@regen-commons/toolkit-framework'
YAML
node "$FW/src/cli.mjs" init .
```

```
✓ instance "my-org-instance" initialized at .
next: complete the self source-system card (register-source skill), then run the ingest skill
```

```bash
find . -type f | sort
```

```
./data/kb/context.jsonld
./data/kb/index.json
./data/kb/source-system.yaml
./kms.yaml
```

**`geo`** — a documented stub for the seam the Geo Protocol SDK (IPFS + The
Graph) will fill. It doesn't silently no-op; every method throws a clear,
actionable error:

```bash
mkdir -p /tmp/tf-demo/my-geo-instance && cd /tmp/tf-demo/my-geo-instance
node "$FW/src/cli.mjs" init . --adapter geo
```

```
✗ geo adapter is a documented stub — the seam the Geo Protocol SDK fills.
Geo = IPFS + The Graph. store() → SDK content-add (objects serialize via the
kernel's JSON-LD @context: `toolkit-framework context`); list()/index() → the
Geo read API over this instance's space; update() → content-add a new version.
Ask Rather for the SDK + space setup; see docs/meta/GAPS.md (package-relative; interop gaps).
```

Select it once the SDK integration lands, not before.

Back in `my-kb-existing`, store the accepted object (kb-folder, the default)
and rebuild the index:

```bash
cd /tmp/tf-demo/my-kb-existing
node "$FW/src/cli.mjs" store
node "$FW/src/cli.mjs" kb index
```

```
stored 1 object via kb-folder → kb
{
  "total": 2,
  "by_type": {
    "concept-lineage": 1,
    "source-system": 1
  },
  "by_maturity": {
    "raw": 2
  },
  "review_queue": 2,
  "generated_from": "derived — rebuildable from objects/"
}
```

`index.json`/`context.jsonld` are **derived** — delete them and re-run `kb
index`/`store` and they rebuild identically from the objects on disk. `store`
also stamps the work order's `produced` field with the refs it wrote, so the
order file itself carries the forward link from source → stored object.

## 5. Review: the human gate

```bash
node "$FW/src/cli.mjs" review list
```

```
kb/objects/concept-lineage/quadratic-funding.yaml
  concept-lineage · "Quadratic Funding" · maturity=raw ai_assisted=true
kb/objects/source-system/my-kb-existing.yaml
  source-system · "my-kb-existing" · maturity=raw ai_assisted=true
2 awaiting review
```

Everything `raw` or `ai_assisted: true` shows up — one shared definition,
used by both the queue and the derived index's `review_queue` count.
Promoting past `raw` needs a named human:

```bash
node "$FW/src/cli.mjs" review promote kb/objects/concept-lineage/quadratic-funding.yaml --maturity reviewed
```

```
✗ --reviewer is required to promote beyond raw — AI-assisted ≠ Human-reviewed
```

With a reviewer in the room:

```bash
node "$FW/src/cli.mjs" review promote kb/objects/concept-lineage/quadratic-funding.yaml \
  --maturity source-linked --reviewer "Ana (steward)"
```

```
✓ "Quadratic Funding" → source-linked (reviewed by Ana (steward))
```

`ai_assisted` clears to `false` on **any** reviewer-present promotion — even
to `draft` — because the flag means "a named human now answers for this," not
"this is fully verified." `provenance.authorship` still says `ai-assisted`,
so the history isn't erased, just superseded.

**Demotion** doesn't need a reviewer — `raw` is the floor, never gate-kept:

```bash
node "$FW/src/cli.mjs" review promote kb/objects/concept-lineage/quadratic-funding.yaml --maturity raw
```

```
✓ "Quadratic Funding" → raw
```

```yaml
maturity: raw
ai_assisted: false
…
reviewed_by: Ana (steward)
last_reviewed: '2026-07-04'
```

The old `reviewed_by`/`last_reviewed` stamps are left in place as history
rather than erased. Per the `review-promote` skill: record *why* in the
object's `notes` field before you demote, so the trail stays honest.

## 6. Federate: the handshake

The self card lives at `self_ref` in `kms.yaml`:

```yaml
self_ref: kb/objects/source-system/my-kb-existing.yaml
```

Register a peer (their source-system card — a peer sends you this, or you
transcribe it from their own self card):

```bash
cat > refi-bcn.source-system.yaml <<'YAML'
title: ReFi BCN
type: knowledge-garden
steward: ReFi BCN core team
maturity: reviewed
public_use: reviewed-for-explanation
return_path: post derived implementation-records back to the ReFi BCN wiki
reuse_conditions: public; attribute ReFi BCN
how_to_credit: link ReFi BCN, name the working-group authors
YAML
node "$FW/src/cli.mjs" federate add refi-bcn.source-system.yaml
```

```
✓ peer "refi-bcn" registered → kb/objects/source-system/refi-bcn.yaml
```

```yaml
peers:
  refi-bcn: kb/objects/source-system/refi-bcn.yaml
```

Peer cards are stored through the same adapter as the self card — first-class
KB inventory, visible to `kb index`/`review`, not a loose `federation/` file.
They also **cannot clobber the self card** — a peer card that slugs to your
own instance name is refused before any write, e.g. a card titled
`my-kb-existing`:

```bash
cat > clobber-attempt.yaml <<'YAML'
title: my-kb-existing
type: repo
steward: someone-else
return_path: nowhere
YAML
node "$FW/src/cli.mjs" federate add clobber-attempt.yaml
```

```
✗ peer card collides with this instance's own identity ("my-kb-existing") — a peer cannot replace the self card
```

Now check whether their ontology extensions compose with yours — the K4
fork-compatibility contract (every extension declares `maps_to_core`, so an
unfamiliar peer type can downgrade gracefully instead of being dropped):

```bash
cat > refi-bcn.extensions.yaml <<'YAML'
entities:
  bioregion-node: { maps_to_core: group, description: A bioregional chapter (ReFi BCN's local-node type). }
  ritual:         { maps_to_core: practice, description: A recurring community ceremony/gathering format. }
  land-parcel:    { maps_to_core: place, description: A stewarded plot with its own care record. }
  vibe-score:     { maps_to_core: mood-index, description: An informal sentiment rating with no core-kernel counterpart. }
YAML
node "$FW/src/cli.mjs" federate check refi-bcn.extensions.yaml
```

```
✓ bioregion-node
✓ ritual
✓ land-parcel
✗ vibe-score — no maps_to_core to a real core type
fork-compatible: 3/4
```

(Exit code 1 whenever anything's incompatible — script-friendly for CI.)
Three of their four extension types map to a real Layer-A core type and
compose cleanly; `vibe-score` doesn't — flagged, not silently dropped. This is
"interoperability without forced uniformity": forks diverge; the kernel only
needs the map back.

## 7. Where agents fit

Seven skills operate the machine's semantic half — the CLI does the
deterministic half (state, validation, storage). **Agents never write
storage; only the CLI does** (seam 1: work orders are the only channel
between them).

- **`register-source`** — register a knowledge source as a peer (its
  source-system card + `return_path`) before any of its content is ingested.
- **`map-ontology`** — before bulk-ingesting a source with its own type
  system, map its implicit ontology onto the kernel (reuse, or propose
  `maps_to_core` extensions) instead of shoehorning.
- **`capture-and-route`** — turn one raw lead into several typed, routed
  objects; the contributor front door.
- **`ingest`** — the batch sibling of `capture-and-route`: claim work orders,
  decompose sources into candidates, hand them to the CLI's accept gate.
- **`compose-journey`** — assemble a track for an audience: concepts +
  resources + options + the compatibility engine + deployment checks.
- **`csis-review`** — structural-integrity review; flags overclaiming and
  visibility-substituted-for-falsifiability, never issues a conformance verdict.
- **`review-promote`** — facilitates the human review session over the
  queue; the CLI enforces "never without a named reviewer," the skill
  enforces "never in bulk."

## Next

- The schema-level tour (`list-schemas`, `check-state`, `kernel-check`,
  `context`, `validate`, `lift`) is still there — see the root
  [`README.md`](../README.md#install--use) and [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md).
- [`GLOSSARY.md`](GLOSSARY.md) — the load-bearing terms.
- [`../README.md`](../README.md) — the full knowledge-base map + CLI verb table.

# Federation & Contribute-Back

> Source: master doc **§10 "Infrastructure & Substrate"** (federation), **Principle 2
> (attribution & return paths)**, **Principle 7 (regenerative obligation)**, **Principle
> 10 (interoperability without forced uniformity)**. Carrier: `../docs/meta/FEEDBACK-LOOPS.md`
> **Loop 4 / Loop 4b**.

## The stance: interconnect gardens, don't centralize

The Toolkit is a node in a wider commons ecology. Federation means **interconnecting
knowledge gardens, not centralizing them.** Other knowledge environments are treated as
**peers, not extractable link pools** (Principle 2). The aim is *interoperability without
forced uniformity* (Principle 10) — local language preserved as long as it maps to the
shared kernel.

> **Anti-extraction rule:** peers are linked, attributed, and given return paths — never
> silently absorbed. Contribute-back is **reciprocal and attributed**.

## The federation mechanics

### 1. Source-system return paths + reciprocal links
The federation primitive is the **Source System Card**
([`schemas/source-system.yaml`](../schemas/source-system.yaml), keystone K2). Its
**`return_path`** field is the contribute-back hook (Principle 7): when the commons draws
from a source system, the card records what should flow back — corrections, traffic,
credit (`how_to_credit`), collaboration, support. Reciprocal links are carried by the
`has_return_path` and `sourced_from` predicates (`relationships.yaml`, `source_lineage`
group). A source system is a relationship, not a URL.

### 2. Exportable schemas
Every entry `extends` the shared [`frontmatter`](../schemas/frontmatter.yaml) base (K3), and
the semantic core is the **frozen, versioned Layer-A** `core-entities.yaml` (K4). Because the
base is shared and YAML→JSON-LD/RDF serializable, entries are **exportable and ingestible by
peers** without bespoke adapters. This is what makes a commons portable rather than locked to
one platform (Principle 15 — infra serves workflows; avoid early platform lock-in).

### 3. Federated search
Federated search runs over those exportable schemas. A consuming node reads another node's
entries via the shared frontmatter + Layer-A types; when it meets an unfamiliar local
(Layer-B) type, it **downgrades it to the nearest core type via `maps_to_core`** and still
ingests the graph. No node has to adopt another's full vocabulary to find and use its
material.

### 4. Forkable / localized versions
An instance is **born by forking the framework** and pinning a Layer-A version (semver). A
fork keeps the frozen core unchanged (so it stays interoperable) and adds **namespaced local
extensions** in `extension-entities.yaml`, each declaring `maps_to_core`. Local language and
domain types are preserved; the `maps_to_core` contract keeps the network legible. See
`architecture/fork-compatibility.md`.

## The contribute-back loop (FEEDBACK-LOOPS Loop 4)

Adoption develops the framework — *the framework's v1 is the residue of the first adoptions.*

```
instance hits "the framework can't handle X"  (missing type / domain pattern / new option / signal kind)
        │
        ▼
emits a contribution-record  +  an Update Proposal
   (gap/pattern · ontology extension, maps_to_core-conformant + namespaced · provenance + attribution)
        │  routed via git (PR / federation) as a Signal
        ▼
CSIS-informed review  (csis-review skill + human review)
        │
        ▼
decide: promote into Layer A (shared base)  OR  keep local
   — deliberate · versioned · reviewed · never silent
```

- The **`contribution-record.schema`** (K5) carries the labor and the
  **`source_system_reciprocity`** field — the federation reciprocity hook.
- The **`update-proposal.schema`** carries the proposed change; its `decision` enum includes
  `promoted-to-core`, the gate from local extension to shared Layer A. Promotion is
  deliberate, versioned, reviewed — **never silent** (R7: avoid premature lock-in).
- This is the same machinery as the [ontology change process](ontology-change-process.md) —
  contribute-back *is* an ontology change proposal arriving from a peer.

## Peer-to-peer federation (Loop 4b)

Instances stay interoperable and share **directly**, without a hub:

- the shared **frozen Layer-A kernel** (K4),
- **source-system return-paths / reciprocal links** (K2),
- **crosswalk files** (node-to-node mappings, `schemas/crosswalks/*`),
- **federated search** over exportable schemas.

> **Rule:** *interoperability without forced uniformity* — a node keeps its local language
> as long as `maps_to_core` holds.

## How this ties back to the framework

| Federation need | Where it lives |
|---|---|
| Return paths / reciprocity | `source-system.yaml` `return_path`; `contribution-record.yaml` `source_system_reciprocity` |
| Reciprocal-link edges | `relationships.yaml` `source_lineage` group (`has_return_path`, `sourced_from`, `attributed_to`) |
| Exportable schema base | `frontmatter.yaml` (K3) + `core-entities.yaml` (K4, frozen) |
| Fork compatibility | `extension-entities.yaml` `maps_to_core` + `architecture/fork-compatibility.md` |
| Promotion gate | `update-proposal.yaml` `decision: promoted-to-core` + `csis-review` skill |
| The loops themselves | `../docs/meta/FEEDBACK-LOOPS.md` (Loop 4 / 4b) |

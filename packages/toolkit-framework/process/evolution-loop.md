# The Evolution Loop

> Source: master doc **§9 "Core evolution loop"** + **§15 "Evolution layer and
> restricted memory"**. This file **resolves reconciliation R10**.

## R10 — the canonical adaptive loop

There are two loops in circulation. **One is canonical; one is retired.**

- ✅ **Canonical (adopt this):**
  **Signal → Sensemaking → Balance → Intervention → Integration → Memory**
- ❌ **Retired (do not use):** Capture / Classify / Review / Update / Communicate / Version
  — the older loop hard-coded in `data/feedback-process.yaml`. That YAML is a lift-source to
  be corrected, not a competing spec.

A logged turn of the canonical loop is an **evolution-record**
([`schemas/evolution-record.yaml`](../schemas/evolution-record.yaml)): `signal_ref` →
`interpretation` → `intervention` → `integration_note` → `memory_note`.

## The six steps

1. **Signal** — an observation that something *may* need attention. Captured **before** it is
   interpreted; a signal is not automatically a conclusion. (e.g. "people keep confusing tracks
   with deployments"; "this ecological claim is too strong for the evidence"; "a source system
   has gone inactive".) Encoded in [`schemas/signal.yaml`](../schemas/signal.yaml).
2. **Sensemaking** — interpret the signal. Isolated issue or repeated pattern? Which layer?
   Content / ontology / deployment / governance / infrastructure / implementation problem?
   *Avoid both dismissal and overreaction* — not every success is a pattern, not every
   complaint means the system is wrong, but every meaningful signal needs a place to go.
3. **Balance** — assess whether the signal indicates movement **toward or away from** the
   Toolkit's desired qualities (source-aware, review-aware, regenerative, alive, etc.). This
   is the step that prevents reactive overcorrection.
4. **Intervention** — choose a response from the fixed **response vocabulary** (below). This
   is the `proposed_intervention` enum in the signal schema and the `intervention` enum in the
   evolution-record.
5. **Integration** — apply the intervention across the affected layers (update the entry,
   route it, re-review, split/merge, etc.). Captured as `integration_note`.
6. **Memory** — record what was learned so it isn't re-litigated. Captured as `memory_note`;
   sensitive learning goes to a restricted-memory tier (below). This is where Principle 17
   (compost) lands.

> Common failure modes to watch (master doc §"Common evolution failures"): **reactive
> overcorrection** (one issue → premature redesign — preserve as signal, check recurrence,
> run a small probe) and **stagnation** (signals accumulate, nothing changes).

## Signal types and kinds

The framework recognizes **10 signal *types*** (the layer a signal is about) — this is the
`signal_type` enum in `schemas/signal.yaml`:

`content · ontology · resource · option · deployment · track · implementation ·
public-use · source-system · infrastructure`

…and a broader vocabulary of signal **kinds** (the nature of the observation), from master
doc §15 — e.g. *correction · missing resource · missing source system · broken link · outdated
entry · duplicate · conflict/contradiction · failed implementation · harmful use case · new
option · emerging pattern · public-use concern · privacy concern · source-lineage issue ·
ontology gap · review request · high-signal social cluster · field observation · CSIS feedback
· community feedback · uncertainty that should remain open.* Carry the kind in the signal's
`interpretation`/`notes`; the type drives routing.

## Response vocabulary (the interventions)

Use a **consistent** response vocabulary so interventions are legible and the compose/validate
engine can act on them. This is the shared enum across `signal.proposed_intervention` and
`evolution-record.intervention`:

`preserve · update · route · merge · split · review · restrict · cite · flag ·
deprecate · archive · compost · remove`

(`remove` = remove / unpublish.) Choosing `compost` routes the item to its terminal
`lifecycle_state`; `archive`/`deprecate` set `maturity` (see [`principles.md`](principles.md)
17 and the canonical state model).

## Restricted-memory tiers

> **Openness is the default for public knowledge.** Restricted memory is for **responsible
> stewardship** of sensitive, unresolved, or consent-bound learning — *not* anti-open-source.

The tiers are the `tier` enum in
[`schemas/public-use-boundary.yaml`](../schemas/public-use-boundary.yaml) — **point there,
do not restate a competing list**:

`public · public-with-caveat · restricted-working-notes · private-steward-memory ·
anonymized-lessons · composted-patterns · never-publish-without-consent`

Use restricted tiers for: unverified concerns, sensitive ecological locations, interpersonal
conflict notes, allegations / reputational risk, implementation failures involving real
people, third-party feedback that could harm relationships, early warnings about capture or
misuse, local knowledge that should not be extracted, legal/safety concerns, unresolved
governance failures. The `consent_note` field records the consent condition; this connects to
the Conflict / Restricted-Memory Steward role ([`roles.md`](roles.md)) and Principle 8.

## How a turn of the loop is recorded

Each meaningful turn produces an **evolution-record** (the Evolution Log). Larger structural
changes additionally produce an **update-proposal** (see
[`ontology-change-process.md`](ontology-change-process.md)). Signals that arrive **from
peers** are the same machinery as federated contribute-back (see [`federation.md`](federation.md),
FEEDBACK-LOOPS Loop 4).

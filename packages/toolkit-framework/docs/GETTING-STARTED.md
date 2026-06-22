# Getting Started (5 minutes)

Zero-build. You need Node ≥18 and one dependency (`js-yaml`).

## 0. Get it

```bash
git clone <repo> && cd repos/regen-toolkit/packages/toolkit-framework
npm install            # installs js-yaml only
```

## 1. See the schemas (the vocabulary)

```bash
node src/cli.mjs list-schemas
```

21 schemas: 16 object-schemas you instantiate + 5 structural (the kernel itself). The first five entries are `claim-evidence`, `concept-lineage`, `contribution-record`, `core-entities`, `deployment` — the rest follow in alphabetical order.

## 2. Check the kernel is consistent (the interoperability contract)

```bash
node src/cli.mjs kernel-check
```

→ `✓ kernel consistent (every extension maps to a real core type)`

This is the fork-compatibility guarantee: every Layer-B type maps to a real Layer-A core type. If this line ever goes red, downstream validators and LLM context exports will drift.

## 3. Validate a value against the canonical state model (K1)

```bash
node src/cli.mjs check-state maturity reviewed     # valid
node src/cli.mjs check-state maturity canonical    # rejected — old vocab, see R1
```

→ `✓ "reviewed" is a valid maturity`
→ `✗ "canonical" is not a valid maturity`

One state model, three orthogonal axes (`maturity`, `public_use`, `lifecycle_state`) — not 7 competing ladders. The `canonical` ladder is collapsed into `reviewed`; the framework enforces the rename.

## 4. Validate a real object against its schema

```bash
node src/cli.mjs validate source-system examples/source-system.example.yaml
```

→ `✓ valid (source-system)`

Now open `examples/source-system.example.yaml`, change `type:` to something off-enum, and re-run — it fails. That is the schema doing its job.

## 5. See the AI-readable serialization

```bash
node src/cli.mjs context        # emits the JSON-LD @context generated from the kernel
```

The first eight lines of output:

```json
{
  "@context": {
    "@version": 1.1,
    "@vocab": "https://regen-commons.org/ns/",
    "concept": "https://regen-commons.org/ns/concept",
    "person": "https://regen-commons.org/ns/person",
    "group": "https://regen-commons.org/ns/group",
    "place": "https://regen-commons.org/ns/place",
```

This serialization is what you pipe into an LLM as a system-context block so it reasons against the actual vocabulary rather than hallucinating field names.

## 6. Run the tests

```bash
node --test
```

→ `ℹ tests 38 / pass 38 / fail 0`

All green — including one validating example per object-schema.

## Next

- Copy a template from [`../templates/instance/`](../templates/instance/), fill it, transcribe to YAML, validate.
- Walk the [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md) (input → typed objects → track).
- Read the [`README.md`](../README.md) knowledge-base map.

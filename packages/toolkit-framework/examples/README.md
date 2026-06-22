# examples/

One valid instance per **object-schema** — each validates with
`node src/cli.mjs validate <schema> examples/<schema>.example.yaml`
and is covered by `test/examples.test.mjs`.

These double as documentation: copy one, edit the fields, validate.

| example | schema | what it shows |
|---|---|---|
| `frontmatter.example.yaml` | frontmatter (K3) | the metadata base every entry extends |
| `resource.example.yaml` | resource | a found thing (project/tool/paper) routed into the toolkit |
| `source-system.example.yaml` | source-system (K2) | a peer knowledge environment + the `return_path` reciprocity hook |
| `option-entry.example.yaml` | option-entry | a reusable funding/governance component |
| `track.example.yaml` | track | a guided pathway for an audience |
| `deployment.example.yaml` | deployment | a specified config with the 6 minimum-structural fields |
| `implementation-record.example.yaml` | implementation-record | what actually happened in practice |
| `claim-evidence.example.yaml` | claim-evidence | a claim with evidence + uncertainty |
| `evolution-record.example.yaml` | evolution-record | a signal interpreted and acted on |
| `concept-lineage.example.yaml` | concept-lineage | a concept's traditions, distinctions, tensions |
| `encyclopedia-entry.example.yaml` | encyclopedia-entry | an explanatory page |
| `update-proposal.example.yaml` | update-proposal | a proposed kernel/content change |
| `signal.example.yaml` | signal | a learning/correction that may update the commons |
| `contribution-record.example.yaml` | contribution-record (K5) | a durable contribution attestation + reciprocity |
| `provenance.example.yaml` | provenance | a source-lineage block (mixin) |
| `public-use-boundary.example.yaml` | public-use-boundary | a visibility tier (mixin) |

**Structural schemas** (`core-entities`, `extension-entities`, `kernel-profile`,
`relationships`, `review-maturity`) have no per-instance examples — each schema file
*is* the single canonical instance. Inspect them directly or via
`node src/cli.mjs kernel-check` / `list-schemas` / `context`.

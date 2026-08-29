## Federation

This {{ org.type }} participates in the **{{ federation.network }}** network.

{{#if federation.peers}}
**Peers:**
{{#each federation.peers}}
- {{ this }}
{{/each}}
{{/if}}

See `federation.yaml` for full topology, trust, and integration config. See `docs/FEDERATION.md` (framework) for protocol semantics.

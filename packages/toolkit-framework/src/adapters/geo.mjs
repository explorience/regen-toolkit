// src/adapters/geo.mjs — DOCUMENTED STUB (design spec §2 d4). The seam Rather's
// Geo Protocol SDK fills. Geo = IPFS + The Graph; the SDK offers content-adding,
// an abstracted Aragon governance interface, and a read API to pull/compose any
// space (2026-07-02 planning call). To implement: map store() → SDK content-add
// (one triple-set per object, serialized via the kernel's JSON-LD @context:
// `toolkit-framework context`); list()/index() → the Geo read API over this
// instance's space; update() → content-add of the new version. Ask Rather for
// the SDK + space setup; see docs/meta/GAPS.md (package-relative; interop gaps).
const SEAM = `geo adapter is a documented stub — the seam the Geo Protocol SDK fills.
Geo = IPFS + The Graph. store() → SDK content-add (objects serialize via the
kernel's JSON-LD @context: \`toolkit-framework context\`); list()/index() → the
Geo read API over this instance's space; update() → content-add a new version.
Ask Rather for the SDK + space setup; see docs/meta/GAPS.md (package-relative; interop gaps).`;

const stub = () => { throw new Error(SEAM); };

export const geoAdapter = {
  name: 'geo',
  store: stub, list: stub, update: stub, index: stub, writeIndex: stub,
};

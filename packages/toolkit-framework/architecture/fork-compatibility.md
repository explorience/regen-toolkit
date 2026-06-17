# Fork Compatibility — How a Forked Commons Stays Interoperable

The whole point: any community can **fork and adapt** the framework, yet the network stays **interoperable** ("interoperability without forced uniformity"). The mechanism:

1. **Layer A is frozen + versioned.** A fork inherits `core-entities.yaml` unchanged and declares the version it's compatible with. Forks MUST NOT redefine core types/predicates.
2. **Local extensions are namespaced + map back.** A fork adds its own domain types in its Layer B, and **every local type declares `maps_to_core`** (a real Layer-A type). A consuming node that doesn't know the local type can downgrade it to its core type and still ingest the graph.
3. **Divergences reconcile via crosswalks, not core edits.** Node-to-node differences are expressed as `maps_to` crosswalk entries — never by editing the shared core.
4. **Evolution is governed.** A local extension is promoted into Layer A only deliberately — via an `update-proposal`, CSIS-informed review, and a version bump. Local language variation is preserved as long as the mapping back to the kernel holds.

## Checking compatibility

```js
import { isForkCompatible, validateKernel } from '@regen-commons/toolkit-framework';
isForkCompatible({ maps_to_core: 'artifact' });   // true
isForkCompatible({ maps_to_core: 'made-up' });     // false — not a core type
validateKernel();                                  // checks the whole kernel: every extension maps to core
```

```bash
toolkit-framework kernel-check     # ✓ kernel consistent (every extension maps to a real core type)
```

This is the contribute-back substrate (FEEDBACK-LOOPS Loop 4): a fork's new types travel back as `update-proposal`s carrying their `maps_to_core`, and the network decides what to promote.

---
name: compose-journey
version: 0.1.0
description: Assemble a track/journey for an audience + context — select concepts, surface resources, propose options, run the compatibility engine, emit deployment checks, and produce a draft track (and optional draft deployment).
framework: toolkit-framework
agnostic: true
---

# compose-journey

Operationalizes the 7-step track composition logic (master doc Layer 7). A track is a guided pathway, **not** a deployment (invariant).

## Steps

1. **Frame.** Capture the audience + starting context + desired outcome.
2. **Concept foundation.** Select the concepts (Layer 2/4) a learner needs first; note key distinctions.
3. **Resource grounding.** Surface the priority resources (Layer 3) + relevant source systems.
4. **Option comparison.** Propose Option Library entries (Layer 5). For each, note `use_cases`, `not_for`, `required_deployment_checks`.
5. **Compatibility pass.** Run the engine on the selected options:
   ```js
   import { checkTrackComposition } from '@regen-commons/toolkit-framework';
   checkTrackComposition(track, optionIndex);  // -> { composable, conflicts, unresolved }
   ```
   Surface conflicts as warnings; do not silently ship an incompatible composition.
6. **Risk / failure awareness.** Pull `failure_modes` from the chosen options.
7. **Deployment preparation.** Emit the deployment checks (the 6 structural components) the user must answer *before* this becomes a real deployment — but do NOT auto-promote the track to a deployment.
8. **Emit.** A draft `track` object (`schemas/track.yaml`), validated. Optionally a draft `deployment` skeleton (`schemas/deployment.yaml`) with the 6 components as prompts.

## Output

A validated draft track (audience, concepts, options, deployment_checks, failure_modes, maturity), with any composition conflicts flagged. Maturity starts `draft`/`candidate`, never `reviewed`.

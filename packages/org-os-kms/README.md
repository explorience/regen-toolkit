# @org-os/kms — org-os Knowledge Management System

Binds **`@regen-commons/toolkit-framework`** into **org-os**. It is two things:

- **A module** (`src/bind.mjs`) — maps the framework's schemas → org-os registries, its skills → the `/initialize`–`/close` lifecycle, and federation → RegenOS.
- **An org-os profile** (`profile/profile.yaml`) — a ready-to-run org-os configuration that ships the framework **pre-loaded as the default knowledge system**. Instantiating the profile = an org-os instance that is already a knowledge commons.

**Replaceable by design.** org-os is *one* host. Swap `org-os-kms` for a plain CLI, a SaaS, or another OS — the framework (`toolkit-framework`) is untouched and still works standalone.

```js
import { profileManifest, toOrgOsRegistries } from '@org-os/kms';
profileManifest().default_knowledge_system;   // '@regen-commons/toolkit-framework'
toOrgOsRegistries(frameworkObjects);           // { 'data/resources.yaml': [...], ... }
```

## How instances are born (Loop 3)

1. Instantiate the `org-os-kms` profile → an org-os instance with the framework wired in.
2. Fill the instance slots (identity + domain content).
3. Run the framework's skills (`capture-and-route`, …) over the domain's sources.
4. `/close` runs `csis-review` + emits `contribution-record`s.
5. Federate via RegenOS (upstream/downstream; self-qualifying adoption).

This is the adoption vehicle for ReFi DAO / ReFi BCN / future communities (build-plan SP11 / pipeline P9–P10). See `../toolkit-framework/framework`-side docs: PLACEMENT, FEEDBACK-LOOPS.

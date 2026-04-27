# T01 — Local Node Onboarding Package

- **Owner:** Luiz (lead)
- **Priority:** P0
- **Status:** IN_PROGRESS
- **Workspace:** `integrations/sync/package-workspaces/T01-local-node-onboarding-package/`

## Mission
Ship a reusable package for: regen-toolkit module + ReFi-DAO-Website community/local-nodes

## Source bundle (canonical)
- `03 Libraries/ReFi DAO/ReFi DAO Docs/ReFi Local Node Onboarding Checklist.md`
- `03 Libraries/ReFi DAO/ReFi DAO Docs/Starting a ReFi Local Node - Onboarding Guide 2032e7251f2f80d08a56fa2e65109a93.md`
- `03 Libraries/ReFi-DAO-Website/content/community/local-nodes.md`
- `03 Libraries/ReFi-DAO-Website/content/resources-hub/onboarding/local-node.md`

## Expected package outputs
- Module guide (short + long version)
- Checklist template (operator-ready)
- Website-ready onboarding block for ReFi-DAO-Website
- Validation checklist + release notes

## Dependencies
- Depends on T04 (Quartz package) for publishing standardization.

## Flow to full package (stage gates)
### Stage 1 — Source Lock
- **Work:** Freeze input docs, paths, and version date.
- **Exit criteria:** SOURCE-LOCK.md created; all canonical files listed; unknowns marked.

### Stage 2 — Package Spec
- **Work:** Define audience, outcomes, package scope, exclusions, and acceptance criteria.
- **Exit criteria:** PACKAGE-SPEC.md approved with measurable outputs.

### Stage 3 — Draft Build
- **Work:** Create package docs, templates, examples, and implementation checklist.
- **Exit criteria:** DRAFT-BUILD.md complete; artifacts present in package workspace.

### Stage 4 — Implementation Sync
- **Work:** Apply package into target repo(s) and create patch/change list.
- **Exit criteria:** SYNC-LOG.md lists all applied changes and pending items.

### Stage 5 — Validation
- **Work:** Run QA: links, reproducibility, metrics, and clarity.
- **Exit criteria:** VALIDATION-CHECKLIST.md all critical checks passed or flagged.

### Stage 6 — Publish
- **Work:** Release package and track release notes/version.
- **Exit criteria:** RELEASE-NOTES.md created; status set to PUBLISHED.

### Stage 7 — Feedback Loop
- **Work:** Capture lessons from first real implementations.
- **Exit criteria:** RETRO.md created with improvements for vNext.

## Immediate execution checklist (current sprint)
- [x] Complete SOURCE-LOCK.md
- [x] Complete PACKAGE-SPEC.md
- [x] Draft first artifacts in DRAFT-BUILD.md
- [x] Log repo changes in SYNC-LOG.md
- [x] Run VALIDATION-CHECKLIST.md (preliminary pass; owner sign-off pending)

## Latest execution update (2026-03-08)
- [x] Stage 4 started: implementation sync applied to ReFi-DAO-Website pages (community + resources-hub)
- [ ] Stage 5 final pass: complete metrics + owner sign-off

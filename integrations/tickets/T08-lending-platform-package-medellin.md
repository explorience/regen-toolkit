# T08 — Lending Platform Package (ReFi Medellín / Colombia / Juan)

- **Owner:** ReFi Medellín / Colombia / Juan
- **Priority:** P1
- **Status:** OPEN
- **Workspace:** `integrations/sync/package-workspaces/T08-lending-platform-package-medellin/`

## Mission
Ship a reusable package for: Lending workflow package (design + ops + reporting hooks)

## Source bundle (canonical)
- `03 Libraries/ReFi DAO (onboarding/governance references)`
- `03 Libraries/Regenerant-Catalunya (network treasury and reporting references)`
- `03 Libraries/regen-toolkit (funding mechanisms sections)`

## Expected package outputs
- Lending model brief (problem, users, mechanism)
- Operational workflow (origination, disbursement, repayment, defaults)
- Risk/compliance and governance checklist
- Validation checklist + release notes

## Dependencies
- Requires owner-side co-design session with Juan; leverage T03/T06 patterns.

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
- [ ] Complete SOURCE-LOCK.md
- [ ] Complete PACKAGE-SPEC.md
- [ ] Draft first artifacts in DRAFT-BUILD.md
- [ ] Log repo changes in SYNC-LOG.md
- [ ] Run VALIDATION-CHECKLIST.md

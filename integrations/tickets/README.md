# Package Tickets Board

This folder tracks execution tickets for the cross-project package pipeline.

## Status model
- `OPEN` = defined but not started
- `IN_PROGRESS` = active execution
- `BLOCKED` = waiting dependency/owner input
- `READY_FOR_REVIEW` = implementation complete, waiting QA
- `PUBLISHED` = shipped and documented

## Required artifacts per ticket workspace
Each ticket has a workspace at:
`integrations/sync/package-workspaces/<ticket-id>-<slug>/`

Required files:
- `SOURCE-LOCK.md`
- `PACKAGE-SPEC.md`
- `DRAFT-BUILD.md`
- `SYNC-LOG.md`
- `VALIDATION-CHECKLIST.md`
- `RELEASE-NOTES.md`
- `RETRO.md`

## Ticket index
- Board: `PIPELINE-BOARD-260307.md`
- Detailed onboarding/reporting index: `INDEX-T01-T02-T03-260308.md`
- Link integrity report: `../sync/LINK-INDEX-INTEGRITY-CHECK-260308.md`

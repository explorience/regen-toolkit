# Local ReFi Toolkit Integration (first pass)

## What it is
- Quartz-based toolkit repository with playbooks, case studies, frameworks, and supporting docs.
- Includes explicit content pipeline, Notion sync workflow, and frontmatter mapping documentation.

## Why it matters for regen-toolkit
- Closest adjacent content system; significant overlap in audience, structure, and subject matter.
- Immediate source of reusable modules/cases and metadata conventions.

## Integration modes
- **Content:** bidirectional reuse of playbooks/case studies/frameworks where licensing and attribution allow.
- **Taxonomy:** align tags/frontmatter fields (type, difficulty, region, impact area, stage).
- **Workflow:** reuse the documented Notion↔repo sync and content pipeline patterns.
- **Technical:** harmonize folder conventions and metadata so `regen-toolkit-interface` indexes both reliably.

## Suggested sync cadence
- **Weekly** content delta review.
- **Monthly** taxonomy and metadata harmonization pass.

## Candidate article topics
1. How to turn local case studies into reusable implementation playbooks.
2. Metadata that scales: practical frontmatter design for regen knowledge systems.
3. Running a lightweight weekly content sync across toolkit repositories.
4. Quick-start pathways for organizers vs technical practitioners.
5. Designing modular playbooks for local node execution.

## Risks/blockers
- Divergent content structures can create duplication and drift.
- Notion-driven workflows may introduce status mismatches if not synchronized consistently.
- Requires clear canonical-source rules for overlapping artifacts.

## Next actions
1. Define canonical ownership rules for shared artifacts.
2. Publish a shared metadata schema v0 (minimum required fields).
3. Run one pilot migration: selected Local ReFi Toolkit module into regen-toolkit format.

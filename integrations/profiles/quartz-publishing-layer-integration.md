# Quartz Publishing Layer Integration (first pass)

## What it is
- Quartz-based publishing infrastructure for toolkit website at `03 Libraries/quartz-refi-template/`.
- Content-to-site pipeline: regen-toolkit markdown → Quartz build → deployed static site.
- Master Plan workstream 1: "Quartz template operations — ensure quartz-refi-template stays deploy-ready."
- Local ReFi Toolkit also uses Quartz; shared deployment patterns.

## Why it matters for regen-toolkit
- **Primary publishing layer** for toolkit content; no integration profile existed despite being in Master Plan.
- Ensures content structure and frontmatter align with Quartz requirements.
- Dual-repo architecture: regen-toolkit (content) + quartz-refi-template (hosting).
- Regen Toolkit Interface (React/TypeScript) builds content index; Quartz may serve as alternative or complementary view.

## Integration modes
- **Content:** ensure new toolkit artifacts are Quartz-compatible (frontmatter, paths, structure).
- **Taxonomy:** align metadata keys with Quartz graph and navigation expectations.
- **Workflow:** content merge → Quartz build → deploy; validation gate before publish.
- **Technical:** package verification, operator docs, overrides for Quartz-refi-template.

## Suggested sync cadence
- **Per content merge** when structure changes affect Quartz.
- **Weekly** during active development for build/deploy validation.
- **Monthly** package and dependency updates.

## Candidate article topics
1. Quartz publishing pipeline for Regenerative Web3 Toolkit: setup and operations.
2. Content structure compatibility: toolkit markdown vs. Quartz expectations.
3. Dual-repo architecture: content repo vs. publishing layer.

## Risks/blockers
- Quartz template may have project-specific overrides; changes require coordination.
- Regen Toolkit Interface uses separate index; may diverge from Quartz navigation.

## Next actions
1. Document Quartz-refi-template as integration target in status board.
2. Add Quartz publishing layer to canonical ownership rules (operational repo).
3. Create validation checklist for content changes that affect Quartz build.
4. Link to Master Plan workstream 1 in integration profile.

# Regen Toolkit Interface Integration (first pass)

## What it is
- React/TypeScript visual interface for browsing toolkit content, designing implementations on a canvas, and tracking progress.
- Builds a JSON content index from `regen-toolkit` + `Local-ReFi-Toolkit` via `scripts/build-content-index.js`.

## Why it matters for regen-toolkit
- Primary UX layer that operationalizes content discoverability and implementation planning.
- Makes metadata quality immediately valuable (filters, tracks, modules, case-study discoverability).

## Integration modes
- **Content:** ensure new toolkit artifacts are indexable and visible in browser/canvas workflows.
- **Taxonomy:** align metadata keys expected by the indexer (type/track/section/tags/frontmatter fields).
- **Workflow:** enforce "content change → rebuild index → validate UI" cycle.
- **Technical:** extend parser support for additional integration sources once schemas are stabilized.

## Suggested sync cadence
- **Per content merge**: regenerate index.
- **Weekly** parser/data-quality checks.
- **Monthly** UX/IA adjustments based on new content classes.

## Candidate article topics
1. Building a visual implementation designer for regenerative playbooks.
2. How metadata quality drives discovery and planning UX.
3. Designing cross-repo content indexes for knowledge commons interfaces.
4. Practical state management patterns for toolkit planning workflows.

## Risks/blockers
- Indexing assumptions can break when source repositories change structure.
- Parser currently focused on two repositories; scaling to more sources requires schema decisions.
- Local build dependencies on sibling repo paths can fail in non-standard setups.

## Next actions
1. Define and publish content-index schema contract (v1).
2. Add validation checks for required metadata before index generation.
3. Prepare extension plan for additional integration sources beyond current two repos.

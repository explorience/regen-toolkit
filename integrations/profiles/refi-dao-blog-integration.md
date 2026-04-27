# ReFi DAO Blog (Ghost) Integration (first pass)

## What it is
- ReFi DAO blog migrated to [blog.refidao.com](https://blog.refidao.com) (Ghost platform).
- 200+ posts migrated; extensive manual review completed (260217).
- Historical content spanning governance, local nodes, ReFi ecosystem, case studies, and operational updates.
- Migration artifacts in `03 Libraries/ReFi-DAO-Website/docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/`.

## Why it matters for regen-toolkit
- **Style guide derivation source:** Luizfernando proposed using ReFi DAO blog corpus to create writing/voice guidelines (260212 planning call).
- **Historical content** for Track 2 and Track 3: governance patterns, local node stories, protocol implementations.
- Reduces duplication risk by aggregating existing material before drafting new articles.
- AI can process blog content for first-draft scaffolding and terminology consistency.

## Integration modes
- **Content:** extract high-signal posts into toolkit modules; derive style guide from corpus.
- **Taxonomy:** align blog categories/tags with toolkit tracks and canonical concepts.
- **Workflow:** periodic scan for new posts; batch extraction for style guide and article backlog.
- **Technical:** Ghost API or export for structured extraction; no direct repo sync (blog is hosted).

## Suggested sync cadence
- **One-time** style guide derivation from existing 200+ post corpus.
- **Monthly** scan for new posts worth extracting.
- **Quarterly** taxonomy alignment if blog categories evolve.

## Candidate article topics
1. ReFi DAO blog as a style and voice reference for toolkit content.
2. Extracting governance and local node narratives from historical ReFi DAO posts.
3. From blog post to toolkit playbook: conversion patterns.
4. Terminology consistency: ReFi DAO corpus vs. toolkit canonical terms.

## Risks/blockers
- Blog migration had image link issues; some posts may still need fixes.
- Email configuration issues may affect admin login and publishing workflow.
- Blog is separate from ReFi DAO docs repo; no direct file sync.

## Next actions
1. Run AI-assisted style guide derivation from blog corpus (as proposed in 260212).
2. Create extraction template for blog post → toolkit article conversion.
3. Map blog categories to toolkit tracks and add to taxonomy crosswalk.
4. Document blog as content source in `content/sources/` if not already present.

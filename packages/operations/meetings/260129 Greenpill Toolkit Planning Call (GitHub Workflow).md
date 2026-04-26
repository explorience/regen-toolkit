---
id: "mtg-20260129-greenpill-toolkit-github-workflow"
type: planning
date: "2026-01-29"
title: "Greenpill Toolkit Planning Call — GitHub Workflow + Tier Prioritization"
participants:
  - Matt (Mattycompost)
  - Luiz Fernando
  - Heenal
projects:
  - "[[regen-web3-toolkit]]"
signals:
  - github-issues-as-articles
  - tier-based-prioritization
  - five-target-audiences
  - tag-system
  - lifeos-web-editor
  - dark-matter-labs-reference
source_file: "Zettelkasten/260129 Greenpill Toolkit Planning Call.md"
transcript_url: "https://notes.granola.ai/t/b5e3a402-b714-4905-b038-cdf25c4a8436-00demib2"
processed: true
---

# Greenpill Toolkit Planning Call — GitHub Workflow + Tier Prioritization

**Date:** 2026-01-29 (Thursday)
**Type:** Planning

## Key Decisions

- **GitHub project structure operational:** 229 article placeholders created (titles + tags only, no content yet) — full migration from Charmverse "Tools for Regeneration" plan into GitHub.
- **Tier-based prioritization adopted** — based on audience overlap across 5 target audiences (prospective customers, existing customers, investors, board members, internal teams):
  - **Tier 1:** articles covering 3+ audiences
  - **Tier 2:** articles covering 2 audiences
- **High-trust assignment model:** multiple people can assign to same article (collaboration > first-come-first-served). Matt self-assigned only 6 to avoid overwhelming.
- **Two-week milestone:** every participant assigns themselves to multiple articles + writes at least one complete article.
- **Strategic content depth:** broad first pass for scaffolding, deeper second pass on high-priority sections. Fractal potential — any issue can become its own section/book.
- **Resource sharing via GitHub comments:** unstructured input acceptable, AI organizes later.
- **Labels → frontmatter sync committed:** Matt to implement automatic conversion (current gap: labels live in GitHub issues, not in markdown).
- **AI agent writing system in development** (Matt) — first draft workflow created, needs full testing.
- **LifeOS web editor** (Matt) — alternative interface for non-GitHub users, accessible via OS.stop URL with GitHub auth.

## Action Items

- [ ] Implement automatic label → frontmatter conversion (Matt)
- [ ] Test + refine AI agent writing workflow (Matt)
- [ ] Push workflow templates, visualizations, Obsidian integration to main repo (Luiz)
- [ ] Each participant: self-assign multiple articles + write ≥ 1 complete article in 2 weeks (Team)
- [ ] Use GitHub comments for ongoing resource sharing + collaboration questions (Team)
- [ ] Run AI tag standardization analysis after initial content creation; generate `tags.md` compilation (Team — later)

## Discussion Summary

### GitHub Repository Setup & Workflow
229 issues created from Charmverse migration; each is an article placeholder with title + tags. Two viewing modes: Projects (Kanban-style) and Issues (filterable by label/tier). Assignment is non-exclusive — collaboration encouraged. Permissions issue: Luiz initially couldn't self-assign as a contributor; resolution = click specific items in project database view.

### Content Depth Strategy
Funding platforms example highlighted scaling challenge: could become a 500-page book. Approach: broad coverage first (Tier 1 across many articles), depth second (selected high-impact sections). Framework provides scaffolding for continuous growth + external contributions.

### Tagging & Organization
Current gap: labels in GitHub issues don't sync to markdown frontmatter. Matt committed to automatic sync. AI tag standardization proposed for after initial content creation — generate comprehensive `tags.md`, multiple options for review.

### Resource Sharing Workflow
GitHub comments designated as primary method for adding links / references. Example: Public Nouns glossary link to "Key Terms A to Z" issue. Unstructured input fine — AI can process both issue comments and markdown content downstream.

### Development Tools (Luiz)
Demonstrated:
- Obsidian graph visualization showing toolkit section connections
- Mapping document connecting prior Local ReFi content to new GitHub structure
- Questionnaire templates (adapted from local nodes website building)
- Cursor for AI-powered content generation

### Index System
Sources index already exists as the model. Plan to create similar indexes for playbooks, applied foundations, other major sections. Markdown-based backlog page for content addition outside GitHub.

### Alternative Interfaces
- **LifeOS web editor (Matt):** OS.stop URL with GitHub auth — addresses barrier for writers uncomfortable with GitHub.
- Future canvas-based drag-and-drop for navigation (acknowledged as not current priority).

### Technical Infrastructure
- **HackMD integration research (Matt):** API explored, found limited collaboration features for real-time editing. Created docs folder with findings + alternatives.
- **AI agent writing workflow (Matt):** in development; first draft created, needs full testing. Goal: free team to focus on communication + new content.

### External References
- **Dark Matter Labs "Many to Many Systems" toolkit** shared as reference example — advanced visualization, UX possibilities. Added to Telegram for team review.
- **Telegram channels model from ReFi Solana** discussed as supplement to GitHub workflow (separate channels for CRM additions, content backlog, source collection).

## Next Steps

- 2-week milestone (next planning call): each participant writes ≥ 1 article; self-assigns to multiple.
- Matt's automatic label sync + AI agent workflow testing in parallel.
- Luiz pushes templates and visualizations.

## Source

- **Vault:** `Zettelkasten/260129 Greenpill Toolkit Planning Call.md`
- **Transcript:** https://notes.granola.ai/t/b5e3a402-b714-4905-b038-cdf25c4a8436-00demib2

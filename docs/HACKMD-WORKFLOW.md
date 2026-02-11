# HackMD Workflow Guide

**Last Updated:** January 28, 2026  
**Purpose:** Guide for non-technical contributors to edit toolkit content using HackMD without needing GitHub knowledge

---

## Table of Contents

1. [What is HackMD?](#what-is-hackmd)
2. [Getting Started](#getting-started)
3. [Finding Articles to Contribute To](#finding-articles-to-contribute-to)
4. [Editing Best Practices](#editing-best-practices)
5. [How Changes Sync to GitHub](#how-changes-sync-to-github)
6. [Review and Approval Process](#review-and-approval-process)
7. [Troubleshooting](#troubleshooting)

---

## What is HackMD?

**HackMD** is a collaborative markdown editor that allows multiple people to edit documents together in real-time. For the Regen Toolkit project, HackMD serves as a user-friendly interface that connects to our GitHub repository, so you can edit content without needing to know how to use GitHub directly.

### Why Use HackMD?

- ✅ **No GitHub knowledge required** - Edit content in a familiar document interface
- ✅ **Real-time collaboration** - See others' edits as they happen
- ✅ **Comments and discussions** - Leave feedback directly in the document
- ✅ **Auto-sync to GitHub** - Your changes automatically save to the repository
- ✅ **Easy to use** - Works like Google Docs or Notion, but with markdown

### How It Works

```
GitHub Repository → HackMD Page → You Edit → Auto-Sync Back → GitHub Repository
```

When you edit a page in HackMD, your changes are automatically saved back to GitHub. You don't need to worry about pull requests, commits, or any technical GitHub processes.

---

## Getting Started

### Step 1: Access the HackMD Workspace

**Workspace Link:** [Will be provided when workspace is set up]

1. Click the workspace link (you'll receive this from the project coordinator)
2. Sign in with your GitHub account (recommended) or create a HackMD account
3. You'll see folders organized by track:
   - 📁 Coordination (REQUIREMENTS.md, DEVELOPMENT.md, SOURCES.md)
   - 📁 Track 1 - Foundations
   - 📁 Track 2 - Applied
   - 📁 Track 3 - Playbooks

### Step 2: Navigate to Your Article

1. Browse folders to find the track you want to work on
2. Open the section folder (e.g., "3.1 Protocol Playbooks")
3. Click on the article you want to edit
4. The article opens in HackMD editor

### Step 3: Start Editing

1. Click "Edit" button (top right)
2. Make your changes in the markdown editor
3. Use the preview pane to see how it looks
4. Save your changes (they auto-sync to GitHub)

---

## Finding Articles to Contribute To

### Option 1: Browse by Track

**Track 1: Foundations** (For beginners)
- Start here if you're new to web3
- Focus on making concepts accessible
- Add regenerative context

**Track 2: Applied Web3 for Impact** (For practitioners)
- Practical implementation guides
- Real-world applications
- Step-by-step instructions

**Track 3: Playbooks, Patterns & Case Studies** (For builders)
- Protocol-specific guides
- Implementation patterns
- Case studies and examples

### Option 2: Check Priority Articles

**Current Priority Articles (P0):**
- Track 3.1 Protocol Playbooks (highest priority)
  - Gitcoin Grants playbook
  - Giveth platform guide
  - Hypercerts implementation
  - Safe/Gnosis multisig setup
  - Sylvey protocol case study

**High Priority Articles (P1):**
- Track 1.1 Why Web3? The Regen Case
- Track 1.5 Wallets & Security
- Track 1.8 DAOs: Decentralized Organizations
- Track 1.10 Crypto Philanthropy & Nonprofit Onboarding
- Track 2.6 Funding Mechanisms
- Track 2.7 Decentralized Governance
- Track 2.8 Impact Measurement & Verification

### Option 3: Self-Assign in GitHub Projects

1. Go to GitHub Projects board
2. Find articles marked "Available" or "Needs Contributor"
3. Assign yourself to the article
4. Find the corresponding HackMD page
5. Start editing

### Option 4: Ask in Coordination Channel

- Post in chat/coordination channel
- Ask what articles need contributors
- Get recommendations based on your interests/expertise
- Receive direct links to HackMD pages

---

## Editing Best Practices

### Markdown Basics

**Headings:**
```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection (H3)
```

**Bold and Italic:**
```markdown
**bold text**
*italic text*
```

**Lists:**
```markdown
- Bullet point
- Another point

1. Numbered item
2. Another item
```

**Links:**
```markdown
[Link text](https://example.com)
```

**Code:**
```markdown
`inline code`
```

### Article Structure

Each article should follow this structure:

```markdown
---
title: "Article Title"
section: "X.Y"
track: [1|2|3]
status: [placeholder|draft|review|complete]
author: [Your name or GitHub handle]
sources:
  - code: "A"
  - code: "B"
audience: [grounded-regen|curious-degen|onchain-regen]
estimated_words: 800
created: 2026-01-28
---

# Article Title

## Overview
[What this article covers and why it matters]

## Key Concepts
[Core ideas explained clearly]

## Practical Application
[How to apply this in regenerative work]

## Examples
[Real-world examples]

## Resources
[Links for further learning]
```

### Content Guidelines

**For 🌱 Grounded Regen (Beginners):**
- Avoid jargon, explain technical terms
- Use analogies and examples
- Connect to regenerative work
- Step-by-step instructions
- Clear "why" before "how"

**For 💰 Curious Degen (Crypto-Native):**
- Focus on regenerative applications
- Practical pathways to impact
- Real projects to support
- Avoid basic web3 explanations

**For 🔄 On-Chain Regen (Practitioners):**
- Implementation details
- Patterns and templates
- Case studies and lessons learned
- Advanced topics

### Source Attribution

**Always cite your sources:**

```markdown
> **Source:** ReFi DAO Local ReFi Toolkit (Source A)
> 
> This content is based on the ReFi DAO toolkit's guide to...
> 
> Original: https://refidao.github.io/local-refi-toolkit/
```

**In frontmatter:**
```yaml
sources:
  - code: "A"
  - code: "B"
```

**Check SOURCES.md** for source codes and details.

### Writing Style

- ✅ Clear, accessible language
- ✅ Define technical terms when first used
- ✅ Include real-world examples
- ✅ Be inclusive and welcoming
- ✅ Avoid hype and speculation
- ✅ Use active voice
- ✅ Keep paragraphs concise

### Formatting Tips

- Use headings to organize content
- Break up long paragraphs
- Use lists for clarity
- Include examples and case studies
- Add links to related content
- Use code blocks for technical content
- Include images with alt text (if applicable)

---

## How Changes Sync to GitHub

### Automatic Sync

When you save changes in HackMD:
1. Changes are automatically saved to HackMD
2. HackMD syncs changes to GitHub repository
3. Changes appear in GitHub within seconds
4. No manual steps required!

### What Gets Synced

- ✅ All text content
- ✅ Markdown formatting
- ✅ Front matter (metadata)
- ✅ Links and references

### Sync Status

- **Green indicator:** Successfully synced
- **Yellow indicator:** Syncing in progress
- **Red indicator:** Sync error (see troubleshooting)

### Version History

- HackMD keeps version history
- You can see who made what changes
- Previous versions can be restored
- GitHub also maintains full history

---

## Review and Approval Process

### Current Process: High-Trust Approach

**For now, we're using a high-trust approach:**
- Direct edits are welcome
- No approval process required
- Self-review before saving
- Community will review as content develops

### Self-Review Checklist

Before saving your changes, check:

- [ ] Content is accurate
- [ ] Appropriate for target audience
- [ ] Sources properly cited
- [ ] Clear and accessible language
- [ ] Practical and actionable
- [ ] Links work correctly
- [ ] Formatting is consistent
- [ ] No typos or errors

### Future Review Process

As the project grows, we may add:
- Peer review for major changes
- Expert review for technical content
- Editorial review for consistency
- Community feedback collection

**For now:** Trust your judgment, ask questions if unsure, and know that the community will help improve content over time.

---

## Troubleshooting

### Common Issues

#### "I can't find the article I want to edit"

**Solutions:**
- Check if the article has been connected to HackMD yet
- Ask in coordination channel for the HackMD link
- Some articles may not be connected yet (we're adding them gradually)
- Priority articles are connected first

#### "My changes aren't syncing to GitHub"

**Solutions:**
- Check your internet connection
- Wait a few seconds (sync can take a moment)
- Refresh the page
- Check sync status indicator
- If still not working, contact coordinator

#### "I don't understand markdown"

**Solutions:**
- Use the visual editor if available
- Reference markdown cheat sheet (provided below)
- Ask for help in coordination channel
- Start with simple edits (text changes)
- Learn markdown gradually

#### "I made a mistake and want to undo"

**Solutions:**
- Use HackMD's version history to restore previous version
- Use undo (Ctrl+Z / Cmd+Z)
- Ask coordinator to help restore if needed
- GitHub also has full history

#### "I'm not sure if my content is good enough"

**Solutions:**
- Remember: high-trust approach, we welcome contributions
- Use self-review checklist
- Ask for feedback in coordination channel
- Content will be improved over time
- Better to contribute than to wait for perfection

### Getting Help

**Coordination Channel:**
- Post questions in chat/coordination channel
- Tag @luizfernando or other coordinators
- Ask for HackMD links to specific articles
- Request guidance on content approach

**Documentation:**
- Check REQUIREMENTS.md for content specifications
- Check SOURCES.md for source attribution
- Check CONTRIBUTING.md for general guidelines
- Check DEVELOPMENT.md for current status

**Direct Contact:**
- Email: [Will be added]
- GitHub: [Will be added]
- Other: [Will be added]

---

## Markdown Quick Reference

### Headings
```markdown
# H1
## H2
### H3
#### H4
```

### Text Formatting
```markdown
**bold**
*italic*
~~strikethrough~~
`code`
```

### Lists
```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](path/to/file.md)
```

### Images
```markdown
![Alt text](image-url.png)
```

### Code Blocks
````markdown
```language
code here
```
````

### Blockquotes
```markdown
> Quote text
> Multi-line quote
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Horizontal Rule
```markdown
---
```

---

## Workflow Summary

### Quick Start Guide

1. **Get Access**
   - Receive HackMD workspace link
   - Sign in with GitHub account

2. **Find Article**
   - Browse by track or check priorities
   - Click on article to open

3. **Edit Content**
   - Click "Edit" button
   - Make your changes
   - Use markdown formatting
   - Cite sources properly

4. **Review**
   - Use self-review checklist
   - Check formatting
   - Verify links

5. **Save**
   - Click save (auto-syncs to GitHub)
   - Changes appear in repository
   - Done!

### Best Practices Reminder

- ✅ Write for your target audience
- ✅ Cite sources properly
- ✅ Use clear, accessible language
- ✅ Include examples
- ✅ Link to related content
- ✅ Ask for help when needed
- ✅ Trust your contributions

---

## Next Steps

1. **Wait for Workspace Setup**
   - HackMD workspace is being set up
   - You'll receive link when ready
   - Priority articles connected first

2. **Familiarize Yourself**
   - Read this guide
   - Check REQUIREMENTS.md for content specs
   - Review SOURCES.md for attribution
   - Browse existing content structure

3. **Choose Your Contribution**
   - Pick an article that interests you
   - Check priorities if unsure
   - Ask for recommendations

4. **Start Contributing**
   - Edit your chosen article
   - Follow best practices
   - Save and sync
   - Celebrate your contribution!

---

## FAQ

**Q: Do I need a GitHub account?**  
A: Recommended but not required. You can create a HackMD account, but GitHub account makes syncing smoother.

**Q: Can I edit any article?**  
A: Yes! We welcome contributions to any article. Priority articles are connected to HackMD first.

**Q: What if I make a mistake?**  
A: Don't worry! HackMD and GitHub both keep version history. We can restore previous versions if needed.

**Q: How do I know if an article needs work?**  
A: Articles marked "placeholder" need content. Check GitHub Projects board for assignments.

**Q: Can I add new articles?**  
A: For now, focus on existing placeholder articles. New articles can be proposed via GitHub Issues.

**Q: What if I'm not technical?**  
A: Perfect! This workflow is designed for non-technical contributors. You don't need GitHub knowledge.

**Q: How often should I contribute?**  
A: As often as you like! No pressure, contribute when you can.

**Q: Who reviews my work?**  
A: Currently high-trust approach - your edits go live. Community will review and improve over time.

---

*This guide will be updated as the HackMD workflow evolves. Check back for updates!*

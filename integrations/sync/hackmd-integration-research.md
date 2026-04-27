# HackMD Integration Research

## Summary

HackMD can work for the toolkit, but requires some setup and has limitations on the free plan. The main question is: **do we need real-time collaboration, or is async GitHub editing enough?**

> **See also:** [Collaboration Platform](./collaboration-platform.md) — our implemented solution for collaborative editing via a web dashboard.

---

## How HackMD GitHub Sync Works

### The Workflow
1. Install [HackMD Hub GitHub App](https://github.com/apps/hackmd-hub) on the repo
2. Authorize HackMD to access `explorience/regen-toolkit`
3. Create a note in HackMD
4. Link it to a specific file via "Versions and GitHub Sync" panel
5. Collaborate in real-time on HackMD
6. Push changes back to GitHub (creates commits)

### Key Points
- **Push = commit** - Each named version becomes a git commit
- **Pull = merge** - Can pull changes from GitHub into the note
- **One-to-one linking** - Each HackMD note links to one GitHub file
- **Manual linking required** - No automatic URL to open a GitHub file in HackMD

---

## Plan Limits

| Feature | Free | Prime ($5/mo/seat) |
|---------|------|-------------------|
| Real-time collaboration | Yes (3 invitees max) | Unlimited |
| GitHub push/pull | **20/month** | Unlimited |
| Version history | Last 10 | Unlimited |
| Image upload | 1MB | 20MB |
| Team invites | 3 | Unlimited |

**Problem:** 20 push/pull operations per month won't work for 200+ articles with multiple contributors.

---

## Options for the Toolkit

### Option A: HackMD Prime Team Account (~$5/mo)
- One shared team workspace
- All contributors join as team members
- Unlimited GitHub sync
- **Pros:** Full features, good for active collaboration
- **Cons:** Monthly cost, everyone needs HackMD account

### Option B: GitHub-First, HackMD for Sessions
- Normal workflow: edit markdown directly on GitHub
- Use HackMD only for specific co-editing sessions
- Create temporary notes, paste content, collaborate, copy back
- **Pros:** Free, no setup, flexible
- **Cons:** Manual copy-paste, no persistent links

### Option C: Pre-Linked Notes (More Setup)
- Create HackMD notes for all/priority articles upfront
- Store note URLs in article frontmatter (`hackmd_url: https://hackmd.io/...`)
- "Edit on HackMD" button in Life OS reads this field
- **Pros:** One-click editing from dashboard
- **Cons:** Initial setup work, need Prime for unlimited sync

### Option D: Self-Host CodiMD (Free, More Work)
- CodiMD is the open-source HackMD
- No limits, own your data
- **Pros:** Free, unlimited everything
- **Cons:** Need to host/maintain a server

---

## "Edit on HackMD" Button Implementation

There's **no magic URL** to open a GitHub file in HackMD directly. The workflow requires:

1. **Pre-create notes** in HackMD for each article
2. **Link each note** to its GitHub file
3. **Store the HackMD URL** in article frontmatter:
   ```yaml
   hackmd_url: "https://hackmd.io/@toolkit/why-local-matters"
   ```
4. **Dashboard reads this** and shows "Edit on HackMD" button

### API Option
Could automate note creation via [HackMD API](https://hackmd.io/@hackmd-api/user-notes-api):
```bash
POST https://api.hackmd.io/v1/notes
{
  "title": "Why Local Matters",
  "content": "[pull from GitHub]",
  "readPermission": "signed_in",
  "writePermission": "signed_in"
}
```
Returns note ID → construct URL → store in frontmatter.

---

## Recommendation

**For a $5k budget project with 5 contributors:**

1. **Start with Option B** (GitHub-first, HackMD for sessions)
   - Zero cost, zero setup
   - Most edits are solo anyway
   - Use HackMD ad-hoc when 2+ people need to edit together

2. **If real-time collab becomes frequent**, upgrade to **Option A**
   - $5/mo is negligible vs. project budget
   - Set up one Prime account, share credentials, or get team seats

3. **Skip Option C** (pre-linked notes) unless you're sure you need it
   - Lot of setup work for uncertain benefit
   - Can always add later

---

## Quick Start for Contributors

### To edit solo:
1. Go to GitHub → find your article → click "Edit"
2. Make changes → commit directly or create PR

### To collaborate in real-time:
1. Go to [hackmd.io/new](https://hackmd.io/new)
2. Paste article content
3. Share the URL with collaborators
4. Edit together
5. Copy final content back to GitHub

---

## Links

- [HackMD GitHub Sync Docs](https://hackmd.io/s/link-with-github)
- [HackMD Hub App](https://github.com/apps/hackmd-hub)
- [HackMD Pricing](https://hackmd.io/pricing)
- [HackMD API Docs](https://hackmd.io/@hackmd-api/user-notes-api)
- [CodiMD (Self-Hosted)](https://github.com/hackmdio/codimd)

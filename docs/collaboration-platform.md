# Collaboration Platform

## Overview

We've built a web-based dashboard for collaborating on the Regen Toolkit, hosted at [os.heen.al/toolkit](https://os.heen.al/toolkit). It provides a visual interface for tracking and managing toolkit articles without needing to work directly in GitHub.

This is a purpose-built alternative to the HackMD integration options explored in [hackmd-research.md](./hackmd-research.md). Rather than relying on a third-party platform, we built the collaboration layer directly into our existing project management system.

---

## How It Works

### For Contributors

1. **Log in** at [os.heen.al](https://os.heen.al) with your GitHub account
2. You'll land on the **Toolkit dashboard** — a visual overview of all articles
3. **View modes:** Switch between table view and kanban board
4. **Filter** by track (1/2/3), status, assignee, or search
5. **Track progress** — see stats on article completion across all tracks

### Authentication & Permissions

- You log in with **your own GitHub account** via OAuth
- Your GitHub token is used for all repo operations — edits are attributed to you
- You must have **collaborator access** to the `explorience/regen-toolkit` GitHub repo
- The dashboard only shows the toolkit module — no access to other parts of the system

### What the Dashboard Shows

- **All articles** from the repo with their frontmatter metadata (title, section, track, audience, status)
- **GitHub issues** matched to articles — see issue status, assignees, and comment counts
- **Progress stats** — completion percentages by track, status breakdown, assignee workload
- **Direct links** to GitHub for editing article content

---

## Architecture

The dashboard reads directly from the `explorience/regen-toolkit` GitHub repo using the GitHub API:

1. Fetches all markdown files from the `content/` directory
2. Parses frontmatter for metadata (title, section, track, status, audience, sources)
3. Fetches all GitHub issues and matches them to articles
4. Displays combined view with filtering and stats

All data stays in GitHub — the dashboard is a read layer on top of the repo. Article editing still happens in GitHub (or HackMD for real-time sessions). Status tracking happens via GitHub issue labels.

---

## Status Labels

Articles are tracked using GitHub issue labels:

| Label | Meaning |
|-------|---------|
| `needs-writing` | Article placeholder exists, needs first draft |
| `in-progress` | Someone is actively writing |
| `needs-review` | Draft complete, needs peer review |
| `done` | Article reviewed and merged |
| `blocked` | Waiting on something (sources, decision, etc.) |

---

## Getting Access

1. You need **collaborator access** to the [explorience/regen-toolkit](https://github.com/explorience/regen-toolkit) GitHub repo
2. Go to [os.heen.al](https://os.heen.al) and sign in with GitHub
3. You'll be redirected to the toolkit dashboard automatically

If you have repo access but can't see the dashboard, reach out to Heenal.

---

## Relationship to HackMD

This dashboard **complements** HackMD rather than replacing it:

- **Dashboard** = project management view (track progress, see stats, filter articles)
- **HackMD** = real-time collaborative editing (when 2+ people need to edit together)
- **GitHub** = source of truth (all content lives here)

See [hackmd-research.md](./hackmd-research.md) for details on HackMD integration options.

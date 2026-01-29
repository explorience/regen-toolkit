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
- **In-app editor** — click "Edit" on any article to open it in a full collaborative editor with live preview, version history, and real-time co-editing (powered by CodeMirror + Liveblocks)

---

## Architecture

The dashboard reads directly from the `explorience/regen-toolkit` GitHub repo using the GitHub API:

1. Fetches all markdown files from the `content/` directory
2. Parses frontmatter for metadata (title, section, track, status, audience, sources)
3. Fetches all GitHub issues and matches them to articles
4. Displays combined view with filtering and stats

All data stays in GitHub — the dashboard is a read-and-write layer on top of the repo. Articles can be edited directly in the built-in editor, which commits changes back to GitHub under your account. Status tracking happens via GitHub issue labels.

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

This dashboard **replaces most HackMD use cases**:

- **Dashboard** = project management view (track progress, see stats, filter articles)
- **Built-in editor** = collaborative editing with live preview, version history, and real-time co-editing
- **HackMD** = optional fallback for ad-hoc sessions outside the platform
- **GitHub** = source of truth (all content lives here, all edits are committed under your account)

See [hackmd-research.md](./hackmd-research.md) for details on HackMD integration options.

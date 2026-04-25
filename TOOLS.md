# TOOLS.md — Tooling for the Regen Web3 Toolkit

_Skills define how tools work in general. This file captures the toolkit's specific tooling — repos, hosting, integrations. Never put credentials here — only references to where they're stored._

---

## Repositories

- **This repo:** github.com/explorience/regen-toolkit
- **Upstream framework:** github.com/regen-coordination/org-os-template
- **Peer instance:** github.com/regen-coordination/regen-coordination-os

---

## Site Hosting

- **Live site:** https://regen-toolkit-site.vercel.app
- **Stack:** Astro 6 + Starlight + Pagefind (static client-side search)
- **Hosting:** Vercel (auto-deploy from `main`)
- **Search:** Pagefind, generated at build

---

## Knowledge Graph

- **Articles inventory:** 254 entries (67 published, 5 learning paths)
- **Knowledge Explorer:** D3.js force-directed visualization at `/explorer/`
- **Tag Explorer:** filter by function/domain/systems concepts/audience/maturity at `/tags/`
- **Article frontmatter:** structured tags drive the explorers — see `docs/writing-system.md`

---

## Communication Channels

```markdown
### Bi-weekly planning call

- Cadence: Thursdays
- Notes: packages/operations/meetings/YYMMDD Regen Web3 Toolkit Planning Call.md

### Telegram

- Ethereum Localism group: (Rather has the link — for hackathon outreach)

### Open Civics Consortium

- Web: openciv.* (Luiz to join via website — applications review starts May)
```

---

## Editorial Pipeline

5-stage pipeline for article authorship — see `skills/SKILL.md` (regen-toolkit-article skill):

1. **Research (Luz)** → source gathering, key claims
2. **Draft (Rupa)** → first pass, structure
3. **Fact-check (Satya)** → verify claims against sources
4. **Edit (Sakshi)** → tighten, plain language
5. **Critique** → final pass, frame-language audit

Pipeline scripts: `scripts/generate-critique.js`, `scripts/pipeline-cron.sh`, `scripts/sync-issues-to-frontmatter.ts`.

---

## Notion (optional)

If a contributor uses Notion for personal task tracking, the org-os heartbeat-monitor skill can pull workload signals when configured. Set `NOTION_API_KEY` as an environment variable (never in this file) and add database IDs here:

```markdown
- API Key env var: NOTION_API_KEY
- Database IDs: (none configured for the toolkit project — instance-level only)
```

---

## On-Chain (none yet)

The toolkit project itself does not currently have:
- A treasury / Gnosis Safe
- A registered DAO (no `daoURI` yet)
- On-chain governance contracts

When/if these are set up, record them here and in `IDENTITY.md`.

---

## Agent Runtime

- **Primary runtime:** Claude Code (CLI / desktop)
- **Slash commands:** `/initialize` (open session) and `/close` (wrap up + commit) — defined in `.claude/commands/`
- **External skill collections** (git submodules under `.agents/skills/`):
  - `superpowers` (obra/superpowers) — agentic methodology
  - `karpathy-skills` (forrestchang/andrej-karpathy-skills) — Karpathy LLM-coding heuristics
- **Optional:** feynman skills via `feynman install-skills` (lands at `.agents/skills/feynman/`, gitignored)

---

_The toolkit's tooling is mostly contributor-side (laptops, Claude Code, Vercel for deploy). Infrastructure additions go here — keep references, never credentials._

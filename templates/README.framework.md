# {{ org.name }}{{#if org.tagline }} — {{ org.tagline }}{{/if}}

> {{ org.short_description }}

**Type:** Framework + orchestration hub · **Version:** {{ org.version }} · **Status:** {{ org.status }}

**Site:** <{{ org.site }}/>

---

## What org-os is

org-os is the operating system for organizations run by humans and AI agents together — a
git-native workspace where an org's knowledge, data, and operations live as files any agent can
read, act on, and federate.

Clone the framework and configure your org, and it has a brain: identity and values agents
actually follow, structured data registries, session memory, {{ counts.skills }} operational
skills, machine-readable schemas, and a federation protocol connecting you to a network of peer
orgs (single-operator dogfood; external pilot is the open milestone). The config-driven cloning
engine that does this is shipped and tested — it produced a real instance, bread-coop-os. No
SaaS, no lock-in — markdown, YAML, and git.

## How it's organized

Three nouns. Everything else is detail.

| | What it is | Where it lives |
|---|---|---|
| **Instances** | A git repo *is* the organization — identity files, data registries, memory, decisions. The framework is itself an instance, self-hosting since {{ org.bootstrap_date }} | `data/` · `memory/` · this repo |
| **Modules** | Versioned units of organizational capability — a skill, a script, a schema, an integration — tracked per instance with install and drift state | [`docs/MODULES.md`](docs/MODULES.md) · `modules/` |
| **Federation** | Instances declare peers, trust levels, and upstream lineage, and publish machine-readable schemas the others can read | `federation.yaml` · `.well-known/` |

Cutting across all three: **the agent runtime**. The same files work in Claude Code, Cursor,
OpenCode, and OpenClaw, because org-os rides the AGENTS.md and Agent Skills conventions instead
of inventing its own.

## What you can do

- **Run a session.** `/initialize` renders a dashboard from live data — projects, tasks,
  calendar, funding deadlines, federation status. `/close` writes memory and commits.
- **Keep organizational memory.** Daily logs, an indexed long-term memory, and an append-only
  decision record. Greppable, versioned, agent-readable.
- **Publish machine-readable org data.** EIP-4824/DAOstar `.well-known/` descriptors generated
  from your registries — extended with meetings, projects, finances, and skills.
- **Federate.** Publish schemas, subscribe to peers, share skills, keep sovereignty. Drift
  analysis and pull-based migrations mean the framework never breaks downstream.
- **Work from a browser or a chat.** The Cloudflare OS module puts the dashboard and an
  org-literate agent in a workspace, so members who will never touch git can still read the org
  and submit to it.

## Run it yourself

### You're an **operator** spinning up a new org

```bash
# The one recommended path
node scripts/clone-framework.mjs --target ../my-new-org --config config.yaml

# Then check what you got, from this repo
npm run doctor -- --dir ../my-new-org
```

A fresh instance should report **no blockers except `git-remote-absent`** — expected until you
create a repository for it. Anything else is a bug, and `tests/clone-framework-health.test.mjs`
fails the build if it reappears. That guard exists because until 2026-08-28 this path produced an
instance with 7 blockers seconds after creation, the worst being that it published *the
framework's* identity as its own.

Driving this with an AI agent (Claude Code, Cursor, a ChatGPT connector) is the normal case —
[`docs/ADOPT-WITH-AN-AGENT.md`](docs/ADOPT-WITH-AN-AGENT.md) is the copy-paste recipe, and
`BOOTSTRAP.md` has the config template plus the full first-run sequence.

The in-place alternative (`npm run setup`) converts a fork you have already made. It is an
interactive **TTY-only** wizard — agents and CI shells cannot drive it — asking nine prompts:
org type · name · description · base URL · packages · agent runtime · network · emoji · Notion.
A 2026-08-21 clean-room test found the newcomer path through it broken in 7 Blocker-level ways —
including leaving the fork's own identity and data in place while both validation commands
reported a full pass. Some of those causes are fixed by the cloning-engine work above; the wizard
itself has not been re-tested end to end, so prefer the clone. Evidence:
`memory/reports/clean-room-bootstrap-2026-08-21.md`.

### You're a **contributor** to the framework

```bash
git clone <this-repo> && cd <repo>
npm install
npm run install:hooks    # pre-commit + advisory hooks
npm run selftest         # full reliability check
```

### You're an **agent** opening a session

Read `MASTERPLAN.md`, `SOUL.md`, `IDENTITY.md`, then run `/initialize`. `AGENTS.md` has the
deterministic startup sequence.

### You're a **visitor** evaluating org-os

Start with `SOUL.md` (mission and values), `IDENTITY.md` (what we are), then
[`docs/MODULES.md`](docs/MODULES.md) for what actually ships today.

---

## Active downstream instances

{{#if federation.downstream}}
{{#each federation.downstream}}
- **{{ name }}** ({{ type }}) — {{ status }}
{{/each}}
{{/if}}

See `data/instances.yaml` for the authoritative registry; `npm run analyze:instances` for
current drift state.

{{> cheatsheet }}

- **Skills:** {{ counts.skills }} total — see `SKILLS.md` and `data/skills-matrix.yaml`
- **Packages:** {{ counts.packages }} total — see `data/packages-matrix.yaml` + `docs/PACKAGE-LIFECYCLE.md`
- **Modules:** see [`docs/MODULES.md`](docs/MODULES.md) and `modules/`

## Documentation

{{#each docs}}
- [{{ title }}]({{ path }}) — {{ blurb }}
{{/each}}

## Requirements

- Node ≥22
- npm ≥10.9.2
- git

## License

MIT

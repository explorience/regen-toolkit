# Getting started with {{ org.name }}

{{#if org.tagline }}
> {{ org.tagline }}
{{/if}}

This is your 30-minute onboarding. Most of it is reading; the rest is running one command and watching a dashboard render.

---

## 1. Meet your org (5 min)

Read these in order:

1. **`SOUL.md`** — mission, voice, values
2. **`IDENTITY.md`** — what we are and what we're not
3. **`MASTERPLAN.md`** — current activations and priorities

These three files explain *why* this workspace exists.

## 2. Open your first session (5 min)

```bash
/initialize
```

(In Claude Code, Zed, or any client that supports slash commands. In the terminal, run `npm run initialize`.)

The dashboard shows: active projects, tasks, this week's calendar, plans/pipelines, funding deadlines, recent context, federation state, and a "what would you like to work on?" prompt.

## 3. Find your role (10 min)

Skim these:

- `data/members.yaml` — who's here and what they do
- `data/projects.yaml` — what's active and who leads
- `HEARTBEAT.md` — what needs attention right now

Pick something that calls to you. Decide what you'll touch first.

## 4. Do your first thing (10 min)

Possible "first things":

- Add a memory entry: `memory/{{ today }}.md`
- Process a meeting note: use the `meeting-processor` skill
- Audit funding opportunities: use the `funding-scout` skill
- Update a project: edit `data/projects.yaml`, then `npm run generate:schemas`

{{#if org.type }}
{{#if (eq org.type "Hub")}}
As an org-os **hub**, you also coordinate downstream instances. `npm run analyze:instances` shows current drift; `npm run check:divergence` shows script drift.
{{/if}}
{{/if}}

## 5. Close cleanly

```bash
/close
```

This writes today's memory, updates HEARTBEAT, commits, pushes (after passing vault-safety checks).

---

## When you get stuck

- **Vault-safety:** before any git operation that touches the working tree, run `npm run vault:snapshot -- "<reason>"`. See [docs/VAULT-SAFETY.md](docs/VAULT-SAFETY.md).
- **Skills not showing up:** run `/skills` to list everything the walker can see, plus anomalies.
- **Validators failing:** run `npm run validate:structure` for structure, `npm run validate:schemas` for schemas.
- **Anything else:** check the framework docs at {{ framework.url }}/docs.

## What's next

You're onboarded. Pick a project from `data/projects.yaml`, open a session, and start contributing.

{{> cheatsheet }}

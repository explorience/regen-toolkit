# {{ org.name }}{{#if org.tagline }} — {{ org.tagline }}{{/if}}

> {{ org.short_description }}

**Type:** {{ org.type }} · **Framework version:** {{ org.framework_version }} · **Status:** {{ org.status }}

---

## What this is

`{{ org.name }}` is an instance of org-os — an operating system for {{ org.network_purpose }}. It runs on the [org-os framework]({{ framework.url }}) and federates with peer instances.

## Quick navigation

- **Operators:** `GETTING-STARTED.md` → 5-minute onboarding
- **Agents:** `AGENTS.md` (delegated to framework) → session protocol
- **Identity:** `IDENTITY.md`, `SOUL.md`, `MASTERPLAN.md`
- **Active work:** `HEARTBEAT.md`, `memory/`, `data/projects.yaml`
- **Documentation:** see the framework at {{ framework.url }}/docs

## Who are you?

### You're a **human operator**

Run `/initialize` (or `npm run initialize`) to see today's dashboard: active projects, tasks, calendar, funding, recent context. Then close with `/close`.

For first-time setup:

```bash
git clone <this-repo> && cd <repo>
npm install
npm run install:hooks
```

### You're an **agent**

1. Read `MASTERPLAN.md` for the mandate
2. Read `SOUL.md` for values + voice
3. Run `/initialize` to load full state
4. **Never `git stash` in this workspace** — see [VAULT-SAFETY.md](docs/VAULT-SAFETY.md)

### You're a **contributor or partner**

See `federation.yaml` for trust relationships + integrations. Reach out via channels listed in `data/channels.yaml`.

---

## Identity

{{ identity.body }}

## Systems map

{{#if systems_map}}
{{ systems_map }}
{{/if}}

## How to sync with framework

```bash
# Manual sync (current)
git pull upstream main
npm run migrate
npm run sync:packages
npm run validate:structure

# Automated (lands in v3.6 with autopoiesis Phase 2)
npm run sync:upstream
```

{{> federation }}

## Documentation

Most docs live in the framework repo: [{{ framework.url }}/docs]({{ framework.url }}/docs). Instance-specific docs (if any) are in this `docs/` directory.

## Requirements

- Node ≥22
- npm ≥10.9.2
- git

## License

{{ org.license }}

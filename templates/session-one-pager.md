# org-os — one page

> {{ org.tagline }}

**What it is.** The operating system for organizations run by humans and AI
agents together. A git repo *is* the organization: identity files agents
follow, `data/*.yaml` registries as the single source of truth, machine-readable
EIP-4824 schemas, session memory, and a federation protocol connecting
sovereign instances. Markdown, YAML, git — no SaaS, no lock-in.

**Live:** <{{ org.site }}/> · **Version:** {{ org.version }} (pre-beta by
design — renumbered *down* from 3.5 to say so honestly) · self-hosting since
{{ org.bootstrap_date }}.

**By the numbers ({{ org.version }}):** {{ counts.skills }} agent skills ·
14 canonical data registries · 11 EIP-4824 descriptors · a live federation map
of real instances · one command from zero to a valid instance.

**Start an org (the one honest path):**

```bash
git clone https://github.com/regen-coordination/org-os-template.git && cd org-os-template
npm install
npm run clone:framework -- --target ../my-org --config my-org.yaml
npm run doctor -- --dir ../my-org      # health scorecard, remediation hints
```

Driving it with an AI agent (Claude Code, Cursor, a connector) is the normal
case — the copy-paste recipe is `docs/ADOPT-WITH-AN-AGENT.md`, verified
end-to-end: fresh clone → valid instance, zero identity leaks, one expected
finding (no git remote yet).

**Why trust it.** The v0.5.0 release gated its own tag on acceptance against
the live fleet — and when the sync half failed that acceptance, the tag waited
until the claim was narrowed to what was actually proven. Known issues ship
documented in the CHANGELOG, not hidden.

**Connective tissue.** Everything-is-a-plugin modules, standards-first interop
(AGENTS.md, Agent Skills, EIP-4824, MCP), bridges to Cloudflare OS, Hermes and
Multica — org-os is the organizational substrate any agent runtime plugs into,
not another platform competing with them.

---

*Rendered from `templates/session-one-pager.md` — numbers update with
`npm run render:templates`.*

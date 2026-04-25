---
name: bootstrap-interviewer
version: 2.0.0
description: Guided interview for bootstrapping a new org-os instance
triggers:
  - "bootstrap"
  - "setup new org"
  - "initialize workspace"
  - "onboard organization"
inputs:
  - operator responses (interactive Q&A)
outputs:
  - SOUL.md
  - IDENTITY.md
  - data/members.yaml
  - data/projects.yaml
  - data/channels.yaml
  - federation.yaml (identity section)
dependencies: []
tier: core
---

# Bootstrap Interviewer

## When to Use

Activate when setting up a new org-os instance for the first time, or when an operator says "bootstrap", "setup", or "initialize". This skill replaces the manual file creation process with a guided conversation.

## Procedure

### Step 1: Welcome & Context

Greet the operator and explain what will happen:

> "Welcome to org-os! I'll ask you a few questions to set up your organizational workspace. This will take about 10 minutes. I'll generate your core files automatically — you can always edit them later."

### Step 2: Organization Identity

Ask these questions (adapt based on answers):

1. **"What is your organization's name?"**
   → Used for: SOUL.md title, IDENTITY.md name, federation.yaml identity.name

2. **"What type of organization is this?"**
   Options: DAO, cooperative, nonprofit, local node, network hub, fund, initiative, coalition
   → Used for: IDENTITY.md type, federation.yaml identity.type

3. **"What is your mission in one or two sentences?"**
   → Used for: SOUL.md mission section

4. **"What are your core values? (list 3-5)"**
   → Used for: SOUL.md values section

5. **"What blockchain or network does your organization operate on? (if any)"**
   → Used for: IDENTITY.md chain, federation.yaml identity.chain

### Step 3: Team

6. **"Who are the core members? For each, give me: name, role, and how to reach them (GitHub, Telegram, email)"**
   → Used for: data/members.yaml

### Step 4: Projects

7. **"What are your active projects or initiatives? For each: name, status (idea/developing/executing), and who leads it"**
   → Used for: data/projects.yaml

### Step 5: Communication

8. **"What communication channels does your org use? (Telegram, Discord, email, etc.) For each: name, URL, and purpose"**
   → Used for: data/channels.yaml

### Step 6: Network

9. **"Is this organization part of a larger network or federation? If so, which one?"**
   → Used for: federation.yaml federation section

10. **"Are there peer organizations you coordinate with?"**
    → Used for: federation.yaml peers

### Step 7: Existing Data Sources

11. **"Do you have existing data in Notion, Google Drive, GitHub repos, or other tools?"**
    → Used for: TOOLS.md, data/sources.yaml planning, Phase 2 ingestion

### Step 8: Generate Files

Based on answers, generate:

1. **SOUL.md** — Fill mission, values, voice sections from answers
2. **IDENTITY.md** — Fill name, type, chain, governance fields
3. **data/members.yaml** — Create entries for each team member
4. **data/projects.yaml** — Create entries for each project
5. **data/channels.yaml** — Create entries for each channel
6. **federation.yaml** — Update identity and federation sections

### Step 9: Confirm & Next Steps

Present a summary:
> "Here's what I've set up: [summary]. Your workspace is ready for Phase 2: Source Ingestion. Point me at your existing sources (repos, Notion, docs) and I'll start building your knowledge base."

## Web Form Version

The same questions work as a web form for non-tech operators. The form maps to the same file generation logic. See `docs/OPERATOR-GUIDE.md` for the web bootstrap flow.

Question set for web form:
1. Organization name (text input)
2. Organization type (dropdown: DAO, cooperative, nonprofit, local node, hub, fund, initiative, coalition)
3. Mission statement (textarea)
4. Core values (textarea, comma-separated)
5. Blockchain/network (dropdown + text: Ethereum, Optimism, Celo, Arbitrum, None, Other)
6. Core members (repeating group: name, role, github, telegram, email)
7. Active projects (repeating group: name, status dropdown, lead dropdown from members)
8. Communication channels (repeating group: platform dropdown, name, URL, purpose)
9. Federation network (text, optional)
10. Peer organizations (repeating group: name, URL, optional)
11. Existing data sources (checkboxes: Notion, Google Drive, GitHub, Other + text)

## Output Format

### SOUL.md (generated)
```markdown
# SOUL.md — [Org Name]

## Mission
[Answer to question 3]

## Core Values
- [Value 1]
- [Value 2]
...

## Voice
- Plain and direct
- Authoritative but accessible
- People-first

## We Are
[Derived from mission + type]

## We Are Not
[Template defaults]

## Boundaries
[Template defaults]
```

### data/members.yaml (generated)
```yaml
schema_version: "2.0"
members:
  - id: "[slugified-name]"
    name: "[Name]"
    role: "[Role]"
    layer: "core"
    status: "active"
    joined: "[today's date]"
    handles:
      github: "[github]"
      telegram: "[telegram]"
      email: "[email]"
```

## Error Handling

- If operator skips a question, use sensible defaults and note the gap in HEARTBEAT.md
- If operator provides minimal answers, generate minimal files and flag for follow-up
- Always validate generated YAML before writing (`npm run validate:schemas`)

## Examples

**Example interview for a local ReFi node:**
```
Q: What is your organization's name?
A: ReFi Barcelona

Q: What type?
A: Local node

Q: Mission?
A: Catalyze regenerative finance in the Barcelona bioregion through community coordination and local economic experiments.

Q: Core values?
A: Local sovereignty, regenerative economics, cooperative governance, open knowledge

→ Generates SOUL.md, IDENTITY.md, data/members.yaml with provided info
```

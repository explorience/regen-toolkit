# {{ORG_NAME}} Dashboard

Organizational health dashboard for ReFi Barcelona.

## Usage

```bash
# Generate static HTML dashboard
node generate.mjs

# Output raw JSON state
node generate.mjs --json

# Open generated dashboard
open dashboard.html
```

## How It Works

1. Runs `scripts/initialize.mjs` from the repo root to gather all org state
2. Renders the state as a static HTML dashboard
3. Outputs `dashboard.html` in this directory

## Data Sources

- `data/projects.yaml` — Active projects
- `data/funding-opportunities.yaml` — Funding deadlines
- `HEARTBEAT.md` — Active tasks
- `memory/*.md` — Recent session context
- `skills/*/SKILL.md` — Available skills
- `federation.yaml` — Network configuration

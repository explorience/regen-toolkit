---
name: funding-scout
version: 1.0.0
description: Identify, track, and report funding opportunities using local registries plus ReFi BCN Notion CRM/research signals, with deadline escalation into HEARTBEAT
author: organizational-os
category: coordination
metadata:
  openclaw:
    requires:
      env: []
      bins: []
      config: []
---

# Funding Scout

## What This Is

Monitors and tracks funding opportunities relevant to this organization's domains. Maintains a database of known opportunities, alerts on upcoming deadlines, and helps prepare application materials for human review.

For ReFi BCN, use these Notion sources as discovery inputs:
- CRM (`2156ed08-45cb-815c-9a3a-000b46e37cb7`) — funding intent and partner profile signals
- Notes & Documents (`1386ed08-45cb-81ed-b055-000ba5b70a6b`) — meeting/context clues
- Research & Reading List (`1386ed08-45cb-814b-9193-000b605eb1e7`) — external opportunities and references

## When to Use

- When asked "what funding is available?" or "any open rounds?"
- On a scheduled basis (weekly scan — check HEARTBEAT.md)
- When someone mentions a new platform or funding round in conversation
- Before a coordination meeting where funding will be discussed
- When reviewing `HEARTBEAT.md` and funding deadlines are approaching

## When NOT to Use

- To actually submit applications (always draft + present for approval)
- To commit any funds or treasury actions → use capital-flow skill

## Tracked Platforms

See `references/funding-platforms.yaml` for full list. Core platforms:

| Platform | Type | Cadence | Key Notes |
|----------|------|---------|-----------|
| Artisan | Quadratic + matching | Seasonal | Votes = signaling; artifacts = fundraising |
| Octant | Yield distribution | Quarterly | Relationship-driven; vault strategies |
| Impact Stake | ETH yield staking | Ongoing | 1/3 split model; governance layer |
| Superfluid campaigns | Streaming rewards | Monthly | Start early; flows continue |
| Gitcoin | Quadratic funding | Seasonal | Large reach; web3-native audience |
| Spinach | Auto distribution | Monthly | Passive; Gardens integration |
| Celo PG | Ecosystem grants | Per round | Ecological/regenerative focus |
| Arbitrum | Ecosystem grants | Per cycle | Tech/dev focus |
| Karma Gap | Reputation + reports | Ongoing | Not direct funding; visibility |

## Usage

### Scan Workflow (Scheduled)

1. Check `data/funding-opportunities.yaml` for current list and upcoming deadlines.
2. Query Notion CRM for entries signaling active funding need (e.g., short-mid term window).
3. Review Notion Notes/Research entries from the last 7-14 days for funding mentions.
4. Add or update opportunities in local registry with status, deadline, and source refs.
5. Identify opportunities with deadlines within 30 days → add to `HEARTBEAT.md`.
6. Maintain a minimum active pipeline of 5 opportunities (unless explicitly deprioritized by operator).
7. Write weekly scan summary to `memory/YYYY-MM-DD.md`.

### On-Demand Query

When asked about funding:
1. Read `data/funding-opportunities.yaml`.
2. If needed, cross-check recent Notion CRM/Notes signals for strategic fit.
3. If hub sync is configured, check `knowledge/<domain>/funding-opportunities.yaml`.
4. Return list ranked by: deadline (urgent first) → domain relevance → execution capacity.
5. Suggest which opportunities match current ReFi BCN priorities (Regenerant, node coordination, tooling, knowledge commons).

### Add New Opportunity

When a new opportunity is found, add to `data/funding-opportunities.yaml`:
```yaml
- id: [platform]-[domain]-[season]
  platform: artisan
  fund: "Fund Name"
  deadline: "YYYY-MM-DD"
  domain: "regenerative-finance"
  amount_range: "$500-$5000"
  matching: true
  url: "https://..."
  status: pending
  eligible: true
  discovered_by: "refi-bcn-agent"
  discovered_date: "YYYY-MM-DD"
  source_refs:
    - "Notion: page-or-database-id"
    - "https://..."
  notes: "Any important context"
```

### Application Support

When helping prepare an application:
1. Pull org identity from `IDENTITY.md` and mission from `SOUL.md`
2. Pull active projects from `data/projects.yaml`
3. Load application template from `references/application-templates.md`
4. Draft application → **present for operator approval** (never submit autonomously)
5. After operator confirms: add submission task to `HEARTBEAT.md`

## Deadline Alerting

Add to `HEARTBEAT.md` when opportunity deadline is within 30 days:
```markdown
### Funding
- [ ] [Platform] [Fund name] deadline: YYYY-MM-DD — [status: research/apply/submit]
```

Add 7-day pre-alert as separate item.

## Safety

- **Never submit applications without explicit operator approval**
- **Never commit funds** without explicit approval
- Flag ambiguous eligibility for human decision
- Always read the full platform mechanics before advising

## Domain Matching

Match opportunities to declared domains in `federation.yaml`:
```yaml
knowledge-commons:
  shared-domains:
    - "regenerative-finance"
```
Prioritize opportunities that match declared domains.

## ReFi BCN Prioritization Heuristics

When multiple options exist, prioritize opportunities that:
1. Strengthen local regenerative/cooperative initiatives in Barcelona/Catalonia.
2. Support ReFi BCN coordination capacity and ecosystem infrastructure.
3. Reinforce Regenerant/Localism execution and reporting commitments.
4. Are executable with current team bandwidth and timeline.

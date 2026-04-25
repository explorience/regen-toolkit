---
name: capital-flow
version: 1.0.0
description: Monitor treasury state, queue transactions, and coordinate capital movements
author: organizational-os
category: capital
metadata:
  openclaw:
    requires:
      env: []
      bins: []
      config: []
---

# Capital Flow

## What This Is

Manages capital flow operations: reading treasury state, queuing transactions for human approval, reporting on financial activity, and coordinating multi-sig operations. Organizational interface to on-chain financial infrastructure.

## SAFETY: Approval-Required Mode

**This skill NEVER executes transactions autonomously.**

Every capital action follows:
1. **Draft** — agent prepares transaction or report
2. **Present** — shows to operator for review
3. **Confirm** — operator explicitly confirms
4. **Execute** — operator executes (never the agent alone)

If in doubt: **draft and present, never act.**

## When to Use

- "What's in the treasury?"
- "Prepare payouts for contributors"
- "Check pending Safe transactions"
- "Generate a financial report for the grant"
- "How much have we spent on [category]?"

## When NOT to Use

- To actually execute transactions → always requires human
- For on-chain governance actions → use contract-interaction skill
- For funding applications → use funding-scout skill

## Capabilities

### Treasury Monitoring (Autonomous)
- Read Safe balance via Safe Transaction Service API (endpoint in `TOOLS.md`)
- Read balances for addresses declared in `IDENTITY.md`
- Summarize treasury state

### Transaction Queuing (Draft → Present)
- Prepare Safe transaction batch data
- Format in human-readable form with amounts and recipients
- Track pending transaction status

### Payout Coordination (Draft → Present)
- Generate payout list from `data/members.yaml` and project allocations
- Format for Safe CSV import or manual multi-sig
- Track in `data/finances.yaml`

### Financial Reporting (Autonomous)
- Summarize from `data/finances.yaml`
- Budget vs. actual comparisons
- Grant accountability reports

## Configuration

Check `IDENTITY.md` for treasury addresses:
```markdown
## Treasury
- **Primary Safe:** 0x... (Gnosis Chain)
```

Check `TOOLS.md` for API endpoints:
```markdown
## Safe Config
- API: https://safe-transaction-gnosis.gateway.gnosis.io
```

## Treasury Report Format

```markdown
## Treasury State — YYYY-MM-DD

### Wallets
| Address | Chain | Token | Balance |
|---------|-------|-------|---------|
| 0x... (Safe name) | Gnosis | XDAI | 1,250 |

### Pending Transactions
- [ ] [Description] — [N] of [M] signatures collected

### Recent Activity (30 days)
- YYYY-MM-DD: Received [amount] [token] from [source]
- YYYY-MM-DD: Sent [amount] [token] to [recipient] for [reason]
```

## Payout Workflow

1. Read member allocations from `data/members.yaml`
2. Calculate amounts based on role weights or fixed allocations
3. Generate draft payout list (`data/pending-payouts.yaml`)
4. **Present to operator** for review
5. On approval: generate Safe batch transaction data or CSV
6. **Operator executes** via Safe UI or hardware wallet
7. Record transaction in `data/finances.yaml`
8. Mark `HEARTBEAT.md` payout task as complete

## Finances Data Format

```yaml
# data/finances.yaml
transactions:
  - date: YYYY-MM-DD
    type: income | expense | transfer
    amount: "500"
    token: "XDAI"
    from: "Octant vault"
    to: "Primary Safe"
    category: "Funding / Contributor payout / Operations"
    description: "Q1 Octant distribution"
    tx_hash: "0x..."
    chain: "eip155:100"

budgets:
  - period: "2026-Q1"
    category: "Coordination"
    allocated: "2000"
    token: "XDAI"
    spent: "450"
```

## HEARTBEAT Alerts

Add to `HEARTBEAT.md` when:
- Pending Safe transactions need signatures
- Contributor payout is due (check member agreement dates)
- Treasury balance below operational threshold (if configured)

## ReFi BCN Implementation Runbook (Operational)

### Monthly treasury cycle

1. **State check**
   - Review `data/finances.yaml` for latest balances/flows
   - Check pending items in `data/pending-payouts.yaml` (if present)
   - Flag treasury anomalies in `HEARTBEAT.md`
2. **Payout draft prep (never execute autonomously)**
   - Build/update draft payout queue in `data/pending-payouts.yaml`
   - Include source refs (meeting/project basis for each payout line)
3. **Operator review package**
   - Produce summary with: recipient, amount, token, rationale, urgency
   - Explicitly tag as `DRAFT — operator approval required`
4. **Post-execution bookkeeping (after human execution only)**
   - Record final tx details in `data/finances.yaml`
   - Close related HEARTBEAT task and log in `memory/YYYY-MM-DD.md`

### Quality gate (must pass)
- [ ] No transaction execution by agent
- [ ] Every payout line has rationale + source reference
- [ ] Draft and executed records are clearly separated
- [ ] High-impact/financial decisions are escalated to Luiz before action

## Notes

- This skill reads `data/finances.yaml` and `data/members.yaml`
- Creates `data/pending-payouts.yaml` for draft payouts
- All transaction data should be persisted after operator executes
- For DAO-specific integrations (Hats Protocol roles, Gardens governance): see dao-os extensions

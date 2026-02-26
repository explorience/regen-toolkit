# Regen Toolkit Article Pipeline - Quick Start

## Fresh Session - Start New Batch

```
Run the Regen Toolkit Article pipeline for 10 articles.

Skill: /mnt/storage/workspace/skills/regen-toolkit-article/SKILL.md
Repo: /root/workspace/regen-toolkit/

1. Scan content/ for placeholder articles (status: placeholder)
2. Pick next 10 that haven't been started
3. Run: Research → Draft → Fact-Check → Edit → Critique → Final
4. Use model routing from skill
5. Save state to .pipeline-state.json
6. Report status every 10 minutes in board format (see SKILL.md)

Start now.
```

## Resume Interrupted Session

```
Resume the Regen Toolkit Article pipeline.

1. Load state from /root/workspace/regen-toolkit/.pipeline-state.json
2. Find last article and check what stage was completed
3. Resume from next stage
4. Continue remaining articles
5. Update state after each stage
6. Report status in board format every 10 minutes

Resume now.
```

## Single Article

```
Run full pipeline for article: what-is-ethereum
Location: content/1-foundations/1.6-ethereum-smart-contracts/what-is-ethereum.md

Use skill at /mnt/storage/workspace/skills/regen-toolkit-article/SKILL.md
```

## Status Report Format (every 10 min)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REGEN ARTICLE PIPELINE STATUS                             │
│            Session: abc-123 | Batch: 10/20 | @ 00:15:30                    │
├─────────────────────┬────────┬────────┬────────┬─────────┬────────┬────────┤
│ Article             │RESEARCH│ WRITE  │VERIFY  │ REVIEW  │ CRITIQ │PUBLISH │
├─────────────────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ what-is-ethereum    │   ✅   │   ✅   │   ✅   │    ✅    │   ✅   │   🔄   │
│ why-regens-interstd │   ✅   │   ✅   │   🔄   │    ⏳    │   ⏳   │   ⏳   │
│ decentralization     │   ✅   │   🔄   │   ⏳   │    ⏳    │   ⏳   │   ⏳   │
│ ...                 │        │        │        │         │        │        │
└─────────────────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Progress: 3 completed | 2 in progress | 5 pending
Next: Starting fact-check on why-regens-interested
```

## Key Files

| File | Location |
|------|----------|
| Skill | `/mnt/storage/workspace/skills/regen-toolkit-article/SKILL.md` |
| Repo | `/root/workspace/regen-toolkit/` |
| State | `/root/workspace/regen-toolkit/.pipeline-state.json` |

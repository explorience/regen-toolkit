---
id: comm-20260426-team-sharing-pack
type: outbound-draft
date: 2026-04-26
author: did:refi-bcn:luiz-fernando
status: drafted
audience: regen-toolkit-team
channels:
  - telegram (planning-call group — primary)
  - github-issue (fallback for async / formal feedback)
related_plan: docs/plans/public-sharing-pack.md
related_meeting: packages/operations/meetings/260423 Regen Web3 Toolkit Planning Call.md
recipients:
  - Matt (mattycompost)
  - Heenal
  - Rather (rathermercurial)
  - Brandon
  - Durgadas
  - Drew Simon
  - Monty
  - Caue Mtomaz
  - Trinity
  - TokenJedi
---

# Team Sharing Pack — three docs to share (2026-04-26)

> **Drafted, not yet sent.** Operator approval pending. See `docs/plans/public-sharing-pack.md` Task 1.2.

## Telegram-tone version (recommended for the planning-call group chat)

```
Hey all — three docs to share, all now living in the toolkit repo so we have one place to look.

The org-os overlay landed on the toolkit as the working branch `feature/org-os-overlay` (PR #310 was closed without merge — we're operating from the branch directly, no merge gate, no review block).

1) Master Doc Briefing (260423) — my personal briefing on where Matt's master doc was going into our last call. Useful context for anyone catching up:
https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/briefings/260423%20Regen%20Web3%20Toolkit%20-%20Master%20Doc%20Briefing.md

2) CSIS × org-os Alignment Report (260423) — Durgadas, this is the mapping I did between your CSIS standards and the org-os framework. Where they converge, where they diverge, where the framework needs additions. Curious what holes you spot:
https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-regen-coord/260423%20CSIS%20%C3%97%20org-os%20Alignment%20Report.md

3) KOI Integration Design Spec — Sean, Gregory and I designed how ReFi DAO will run KOI (a federated knowledge-graph protocol). The toolkit will eventually consume it (so we can query the master doc + meeting notes via MCP, federate with peer orgs). Mirrored into our repo for accessibility:
https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-refi-dao/koi-integration-design.md

Companion docs in the same folder:
- 7-phase strategic plan
- Wave 1 implementation plan (consumer + personal node setup)
- Research overview (deeper protocol context)

Bonus, if you want the operator one-pager / per-layer status of the overlay itself:
- docs/ORG-OS.md (5-min entry point)
- docs/LAYERS.md (per-layer status, owners, gaps)

Questions / "this is wrong" / "the framing is off" — drop in this group or open a GitHub issue. The overlay is additive — easy to revert any piece that doesn't fit.

Clone the working branch directly:
git clone --recurse-submodules -b feature/org-os-overlay https://github.com/explorience/regen-toolkit.git
```

## Email-tone version (use if sending to anyone outside the planning-call regulars)

```
Subject: Three toolkit docs to share — master doc briefing, CSIS alignment, KOI design

Hi all,

Sharing three reference docs that now live in the toolkit repo. The org-os overlay landed on the working branch `feature/org-os-overlay` (PR #310 closed without merge — we're operating against the branch directly rather than gating on review).

1. **Master Doc Briefing (260423)** — personal briefing on where Matt's master doc stood going into the 2026-04-23 planning call.
   https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/briefings/260423%20Regen%20Web3%20Toolkit%20-%20Master%20Doc%20Briefing.md

2. **CSIS × org-os Alignment Report (260423)** — mapping between Durgadas's CSIS standards and the org-os framework: convergence, divergence, framework gaps.
   https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-regen-coord/260423%20CSIS%20%C3%97%20org-os%20Alignment%20Report.md

3. **KOI Integration Design Spec** — joint design with Sean and Gregory for ReFi DAO's KOI deployment (federated knowledge-graph protocol). The toolkit will consume it for master-doc + meeting-note queries via MCP, plus peer-org federation.
   https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-refi-dao/koi-integration-design.md

Companion docs in `docs/from-refi-dao/`:
- 7-phase strategic plan
- Wave 1 implementation plan (consumer + personal node setup)
- Research overview (deeper protocol context)

Operator entry points for the overlay itself: `docs/ORG-OS.md` (5-min one-pager) and `docs/LAYERS.md` (per-layer status, owners, gaps).

Feedback welcome — Telegram, GitHub issue, or reply. The overlay is additive; any piece that doesn't fit is easy to revert.

To clone the working branch:
  git clone --recurse-submodules -b feature/org-os-overlay https://github.com/explorience/regen-toolkit.git

— Luiz
```

## Pre-send checklist

- [ ] **Push the 4 unpushed commits to `origin/feature/org-os-overlay`** so the new `docs/ORG-OS.md` and `docs/LAYERS.md` URLs resolve. (Without push, the "Bonus" section above will 404.) Commits to push: `5a1f5cb`, `16f87b6`, `e0f4fba`, `0dc5a85`.
- [ ] Verify all 5 URLs resolve in incognito (3 primary + 2 bonus)
- [ ] Pick channel: planning-call Telegram group is most likely
- [ ] Decide whether to drop the "Bonus" lines if you'd rather keep the message tight (3 links rather than 5)
- [ ] Send

## Post-send capture (Task 2 of plan)

Once sent, record substantive responses in:

- `MEMORY.md` "Recent feedback" entry per response, dated
- `HEARTBEAT.md` for any new action items that emerge
- New plan stubs in `docs/plans/` if anything warrants a structured follow-up

Route by topic:
- CSIS report feedback → Luiz
- KOI design feedback → Sean / Gregory / Luiz
- Master-doc framing feedback → Matt

---
title: "Toolkit Team — Public Sharing Pack"
project: regen-toolkit
date: 2026-04-25
status: queued (decisions resolved)
related:
  - docs/plans/onepager-and-layers.md
  - docs/from-regen-coord/260423 CSIS × org-os Alignment Report.md
  - docs/from-refi-dao/koi-integration-design.md
methodology:
  - "superpowers:writing-plans"
---

# Plan — Public Sharing Pack for the Toolkit Team

> Resolved version of the earlier sharing-pack plan. The earlier `§1 open decision` (private refi-dao-os; unpushed CSIS report) is now resolved by mirroring both docs into this public toolkit repo.

**Goal:** Produce a sharing pack for the toolkit team (Matt, Heenal, Rather, Brandon, Durgadas, Drew, Monty, Caue, Trinity, et al.) consisting of three publicly-accessible links and a short framing message ready to drop in the planning-call Telegram / Discord / email thread.

**Three target docs (all now in this repo):**

1. **Master Doc Briefing (260423)** — Luiz's personal briefing on the master doc state going into the 2026-04-23 call. Useful for new contributors / the team to align on what the master doc currently *is*.
2. **CSIS × org-os Alignment Report (260423)** — Luiz's mapping of the CSIS structural standards against the org-os framework. Useful for Durgadas to see the alignment work and for the team to understand the CSIS conformance posture.
3. **KOI Integration Design Spec** (mirrored from refi-dao-os, originally by Sean/Gregory/Luiz) — joint design for KOI integration. Useful because the toolkit will eventually consume KOI federation; the team should see the architecture.

---

## Pre-flight

- [ ] **The branch IS the operational state.** PR #310 was closed; `feature/org-os-overlay` operates as the working branch. URLs below point at the branch.

- [ ] **Verify all 3 doc URLs resolve** (in incognito):
  - `https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/briefings/260423%20Regen%20Web3%20Toolkit%20-%20Master%20Doc%20Briefing.md`
  - `https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-regen-coord/260423%20CSIS%20%C3%97%20org-os%20Alignment%20Report.md`
  - `https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-refi-dao/koi-integration-design.md`

---

## Task 1: Draft sharing message

- [ ] **1.1** Draft along these lines:

  ```
  Hey all — three docs to share. The org-os overlay landed on the
  toolkit repo as the working branch `feature/org-os-overlay` (no PR /
  no merge required for now — we operate from the branch directly).

  Everything below lives in the toolkit repo so we have one place to look:

  1. Master Doc Briefing (260423) — my personal briefing on where the
     master doc was going into our last call. Useful context for
     anyone catching up:
     https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/briefings/260423%20Regen%20Web3%20Toolkit%20-%20Master%20Doc%20Briefing.md

  2. CSIS × org-os Alignment Report (260423) — Durgadas, this is the
     mapping I did between CSIS standards and the org-os framework.
     Where they converge, where they diverge, where the framework
     needs additions. Curious what holes you spot:
     https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-regen-coord/260423%20CSIS%20%C3%97%20org-os%20Alignment%20Report.md

  3. KOI Integration Design Spec — Sean, Gregory and I designed how
     ReFi DAO will run KOI (a federated knowledge-graph protocol). The
     toolkit will eventually consume it (so we can query the master
     doc + meeting notes via MCP, federate with peer orgs). Mirrored
     into our repo for accessibility:
     https://github.com/explorience/regen-toolkit/blob/feature/org-os-overlay/docs/from-refi-dao/koi-integration-design.md

     Companion docs in the same folder:
     - 7-phase strategic plan
     - Wave 1 implementation plan (consumer + personal node setup)
     - Research overview (deeper protocol context)

  Org-os overlay PR (merged): https://github.com/explorience/regen-toolkit/pull/310

  Questions / "this is wrong" / "the framing is off" — please drop in
  Telegram or open a GitHub issue. The overlay is additive — easy to
  revert any piece that doesn't fit.

  To clone the working branch directly:
    git clone --recurse-submodules -b feature/org-os-overlay https://github.com/explorience/regen-toolkit.git
  ```

- [ ] **1.2** Present draft to operator for approval before sending. Adjust tone for the actual planning-call channel (more casual on Telegram, slightly more formal on email).

- [ ] **1.3** Operator sends via preferred channel (Telegram of the planning call group is most likely).

## Task 2: Capture responses

- [ ] **2.1** Watch the planning-call channel for responses.
- [ ] **2.2** Substantive responses → log in `MEMORY.md` "Recent feedback" section + create follow-up tasks if action items emerge.
- [ ] **2.3** If feedback specifically targets the CSIS report, KOI design, or master-doc framing, route to the relevant author (Luiz for CSIS report, Sean/Gregory for KOI, Matt for master doc).

---

## Acceptance criteria

- [ ] All 3 docs publicly accessible at the URLs above (verify in incognito)
- [ ] Sharing message drafted, approved, sent
- [ ] Responses captured in `MEMORY.md`
- [ ] Any follow-up actions captured as new entries in `HEARTBEAT.md` or new plan stubs

---

## Out of scope

- Hosting the docs on a custom domain or knowledge-base — github.com URLs are fine for the team
- Generating one-pager versions of each doc (separate plan if needed)
- Building a Quartz/Astro page rendering of the docs for the public site (the docs are technical reference, not encyclopedia content)

---

## Estimated effort

- Pre-flight + verification: 5 min
- Task 1 (draft + approve + send): 15–30 min
- Task 2 (response capture, ongoing): minutes per response

**Total active: ~30 min** (excluding ongoing response capture).

---

## References

- Mirrored docs: `docs/from-refi-dao/`, `docs/from-regen-coord/`
- PR #310: https://github.com/explorience/regen-toolkit/pull/310
- Earlier draft of this plan (with §1 decision now resolved): `regen-coordination-os/docs/plans/regen-toolkit-public-sharing-pack.md`

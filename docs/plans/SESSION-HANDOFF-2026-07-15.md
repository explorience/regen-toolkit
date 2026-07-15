# Session Handoff / Fork Prompt — 2026-07-15

Paste the block below into a fresh session to continue this work. It is self-contained.

---

You are continuing operator work on the **Regen Web3 Toolkit** — an Astro/Starlight knowledge site **and** an org-os coordination instance. Working dir: `/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/regen-coordination-os/repos/regen-toolkit`. Branch: **`regen-toolkit-os`**. Read `CLAUDE.md` first (esp. VAULT SAFETY), then this handoff.

## Guard rails (non-negotiable)
- ⚠️ **Vault safety:** never `git stash` / `git clean` / `git reset --hard`. `git add` only specific paths.
- **Never modify `docs/MASTER.md`** (Matt's doc — derive, don't restructure) or anything under `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/` (Matty's read-only source).
- **Draft-and-present** for all external actions (comms, deploys, proposals). Nothing sent/deployed without operator go.
- Remotes: `origin` = `explorience/regen-toolkit` (public, the real repo), `fork` = `luizfernandosg/regen-toolkit` (GitHub Pages — push here to deploy). Pages live at `https://luizfernandosg.github.io/regen-toolkit/…`.

## Where things stand (one paragraph)
The **toolkit-framework** is a shipped, tested machine (capture → accept-gate → review-promote → store; 110/110 tests). Two corpora are ingested, all `raw`/review-gated: the toolkit's **119 articles → 722 objects** (`data/kb/`, repo-data adapter) and a **prototype slice of Matty's July master-doc handoff → 146 objects** (`kb-handoff/`, kb-folder adapter). Matty's July handoff (`docs/RKC_Handoff_July_2026_FINAL_VERIFIED/`) **independently specifies the machine that's already built** — this drove the `handoff-integration` plan. The Thu **Jul 16** toolkit call is prepped (crosswalk + Definition-of-Done conformance + `/handoff` page + Matty agent-setup all done).

## The two active plans (read these)
- `docs/plans/framework-validation-pass.md` — the machine + self-ingestion arc (**V0–V4 DONE**). Sub-docs in `docs/plans/framework-build/`.
- `docs/plans/handoff-integration.md` — Matty's July iteration (**T1/T2/T3a/T5 DONE**; T3b/T4 open). Design + Jul-16 impl in `docs/plans/handoff-integration/`. Orientation: `docs/HANDOFF-CHANGES-2026-07.md`.

## Key artifacts already built
- Crosswalk: `docs/reports/2026-07-15-framework-masterdoc-crosswalk.md` (+ `data/crosswalks/handoff-database-spec.yaml`).
- Definition-of-Done conformance (7✅/8🟡): `docs/reports/2026-07-15-definition-of-done-conformance.md`.
- Handoff slice diff: `docs/reports/2026-07-15-handoff-slice-diff.md`. Live page: `/handoff/`. Self-ingestion page: `/self-ingestion/`.
- Capital update-proposal (draft): `docs/proposals/2026-07-13-capital-update-proposal.md`.
- Share pack (drafted, NOT sent): `docs/comms/drafts/2026-07-15-share-pack.md`.
- Matty agent-setup: `docs/onboarding/operate-the-toolkit-agents.md` · Call brief: `docs/briefings/2026-07-16-toolkit-call-brief.md`.
- Handoff docx extracted to `.tmp/handoff-txt/` (Guide/Master_Spec/Database_Spec/Future_Packet/Master_Draft/Tech_Guide). Canonical_DB structure inventory is summarized in `docs/HANDOFF-CHANGES-2026-07.md` §5.

## Open work (pick a workstream; if running parallel to another live session, take ONE to avoid conflicts)
1. **T4 — framework evolution from the crosswalk gaps** (self-contained; TDD in `packages/toolkit-framework`, keep 110/110 green). The flagship gap: **first-class relationship records** (per-edge sourced assertions — Database_Spec Core Decision #3; today relationships are bare ID arrays). Then: a **person/organization entity** schema (8/30 handoff new-objects fell back to `resource`); the **3 status dimensions** the framework lacks (currentness, confidence, maintenance); `source-system.type` +`organization`/`movement`; `option-entry` category fit; `implementation-record` prospective-vs-happened semantics. Full list: crosswalk §6 + the slice-diff §4 + the framework-validation-pass 7-item feedback harvest.
2. **T3b — full Canonical_DB ingestion** (write the sub-plan first — it's unwritten). Ingest the 6 canonical-input sheets (~2,689 rows: Source-System Cards 67 · New Objects 878 · Options 345 · Claims 504 · Impl Memory 341 · Relationship Leads 554) via the machine into `kb-handoff/`, guided by the normalization sheets (Object-Type Crosswalk, Predicate Map, Controlled Vocab, 87 dup-flags). Then Discovery_Pool (4,951 leads, Zone A, promotion-gated). Method: `ingest prepare <csv-dir>` → subagent runners (one per family) → `store --adapter kb-folder --target kb-handoff`. Precedent: `data/kb/_handoff-slice-manifest.yaml` + the T3a runners. **Relationships are the T4 gap — don't force them into a schema until T4 lands a relationship record.**
3. **Human review pass** (needs the operator as named reviewer). 839 objects `raw` (693 articles + 146 handoff). Slice 1 (source-systems) done. Use `packages/toolkit-framework/skills/review-promote/SKILL.md`; `review promote <ref> --maturity <v> --reviewer "Luiz Fernando"`. Prioritize the handoff's high-risk boundaries + person/org fallbacks + inferred option-categories (flagged for review).
4. **Carryover:** repo migration to the RC GitHub org · OS-overlay → `main` written proposal (meeting left open) · V1-intake (fold ReFi DAO post-Monty-deep-dive `route: toolkit-framework` feedback).

## Awaiting operator decisions (don't do unilaterally)
- Send the share pack? · Shape the capital proposal (on the call). · **Handoff folder** `docs/RKC_Handoff_July_2026_FINAL_VERIFIED/` is untracked (~10 MB) — commit or gitignore (recommendation: gitignore).

## Verify state on start
```bash
git log --oneline -8 | cat
( cd packages/toolkit-framework && npm test 2>&1 | grep -E 'pass |fail ' )   # expect 110 pass / 0 fail
node packages/toolkit-framework/src/cli.mjs kb index --adapter repo-data --target . 2>/dev/null   # articles: 722, review_queue 693
node packages/toolkit-framework/src/cli.mjs kb index --adapter kb-folder --target kb-handoff 2>/dev/null  # handoff: 146
```

Start by reading `docs/plans/handoff-integration.md` + the crosswalk, confirm the state above, tell the operator which workstream you're taking, then plan it (brainstorming → writing-plans → subagent-driven-development) before executing.

---

_(This file is the durable copy. The framework/instance split, the machine, and the convergence with Matty's spec are the through-line; the Jul 16 call is prepped and the open work is T3b/T4/review + carryover.)_

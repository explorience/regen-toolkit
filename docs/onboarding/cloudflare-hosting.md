# Cloudflare Hosting — State + Handover

_Adopted 2026-08-06 (engineering sync): Cloudflare replaces Netlify/Vercel for this setup.
Bootstrapped 2026-08-08 by Luiz. Owner going forward: **Rather** (`task-260806-rather-cloudflare-setup`)._

## What's live (Option B — two Workers projects)

| Instance | Worker | URL | Source |
|---|---|---|---|
| **Prod** | `regen-toolkit` | https://regen-toolkit.luizfernandolfsg.workers.dev | `main` |
| **Dev** | `regen-toolkit-dev` | https://regen-toolkit-dev.luizfernandolfsg.workers.dev | `regen-toolkit-os` |

Both are **static-assets-only Workers** (no server code, no SSR adapter). Config for dev lives in
[`wrangler.jsonc`](../../wrangler.jsonc) on the `regen-toolkit-os` branch; prod deploys via CLI
flags so **no config file is ever committed to `main`**. Currently under Luiz's personal Cloudflare
account (`luizfernandolfsg@gmail.com`).

Why two projects instead of one project with branch previews: the dev branch builds ~3,900 pages of
review surfaces (`/validation`, `/kb`, handoff pages) that must never auto-appear on prod.

## ✅ Build-on-push — live since 2026-08-09

Both Workers are git-connected to `regen-coordination/regen-toolkit`. **Push and it deploys** —
Netlify/Vercel parity, no manual step.

| Worker | Production branch | Build command | Deploy command |
|---|---|---|---|
| `regen-toolkit` (prod) | `main` | `npm run build` | `npx wrangler deploy --name regen-toolkit --compatibility-date 2026-08-01 --assets ./dist` |
| `regen-toolkit-dev` | `regen-toolkit-os` | `npm run build` | `npx wrangler deploy` (uses the committed `wrangler.jsonc`) |

**Verified end-to-end 2026-08-09:** pushing `b719a949..a38d5d41` to `regen-toolkit-os` triggered a
build that deployed on its own in ~2 min (version `c4b209fc`); `/`, `/kb/`, `/kb/graph/` and
`/validation/` all 200, KB corpus intact at 3,780 typed objects.

> **Gotcha if you're wiring another Worker:** the branch selector may only offer the repo's default
> branch during the initial connect. Connect accepting `main`, then set the real branch afterwards
> via **Settings → Build → Branch control → ✏️**.

### One toggle still open

`regen-toolkit` (prod) has **"Builds for non-production branches: Enabled"**. Every push to any
non-`main` branch therefore also fires a redundant preview build on the *prod* Worker — dev already
has its own project. **Recommend setting it to Disabled** on prod, and enabling PR previews on
`regen-toolkit-dev` instead, since that's the review surface.

## Manual deploys — the fallback

Build-on-push covers normal work. These remain for deploying uncommitted local state (e.g. previewing
before you commit) or if CI is down:

```bash
npm run deploy:cf         # dev — builds this branch, deploys regen-toolkit-dev
npm run deploy:cf:prod    # prod — builds origin/main in a throwaway worktree, deploys regen-toolkit
```

One-time per machine: `npx wrangler login`. The script checks Cloudflare's limits
(20,000 files / 25 MiB per file) before uploading; unchanged assets are deduped, so re-deploys are
fast. ⚠️ A manual deploy is overwritten by the next push-triggered build.

## Handover to Rather

Build-on-push is done — what's left is ownership and the domain.

- [ ] **GitHub org access** for Rather on `regen-coordination` (Luiz — the ★ blocker).
- [ ] Decide the **Cloudflare account** of record: add Rather to Luiz's account (Manage Account →
      Members), or redeploy both Workers under a team account (cheap — two `wrangler deploy` runs;
      URLs change unless a custom domain is attached first, and the git connection must be
      re-authorized under the new account).
- [ ] **Custom domain on prod** — attach in the Worker's Settings → Domains & Routes. Also retires
      the "public surface is a Vercel preview URL" credibility exposure (Artizen `R7`).
- [ ] After a domain lands, update `site:` in both branches' `astro.config.mjs`
      (canonicals/sitemaps still point at the old Vercel/GitHub-Pages domains).
- [ ] Flip the prod non-production-branch-builds toggle (above).

## Watch-items

- **20,000-file cap per deployment.** Dev is at ~4,100 files. If the kb-handoff corpus
  (3,058 objects) gets rendered as individual pages, re-check — the deploy script fails fast if
  the cap is hit.
- The old surfaces (GitHub Pages on the fork, `regen-toolkit-site.vercel.app`,
  `regen-web3-toolkit.vercel.app`) are still up; retire deliberately once DNS + the review
  workflow have moved.

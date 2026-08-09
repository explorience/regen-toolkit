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

## Deploying manually (works today)

```bash
npm run deploy:cf         # dev — builds this branch, deploys regen-toolkit-dev
npm run deploy:cf:prod    # prod — builds origin/main in a throwaway worktree, deploys regen-toolkit
```

One-time per machine: `npx wrangler login`. The script checks Cloudflare's limits
(20,000 files / 25 MiB per file) before uploading; unchanged assets are deduped, so re-deploys are
fast.

## ⚡ Build-on-push — the 5-minute dashboard step (not yet done)

This is the piece that makes it Netlify-equivalent (auto-build on push + PR previews). It requires
installing Cloudflare's GitHub App on the `regen-coordination` org — a browser step no CLI/API can
do. Someone with **GitHub org admin** + access to the Cloudflare account:

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → open **`regen-toolkit`**
   → **Settings → Build** → **Connect** → authorize the *Cloudflare Workers & Pages* GitHub App for
   `regen-coordination/regen-toolkit`.
2. Configure: production branch **`main`** · build command **`npm run build`** · deploy command
   **`npx wrangler deploy --name regen-toolkit --compatibility-date 2026-08-01 --assets ./dist`** ·
   **disable** non-production branch builds (dev has its own project).
3. Repeat for **`regen-toolkit-dev`**: production branch **`regen-toolkit-os`** · build command
   **`npm run build`** · deploy command **`npx wrangler deploy`** (uses the committed
   `wrangler.jsonc`) · enable PR preview builds here — this project is the review surface.
4. Push a trivial commit to `regen-toolkit-os` and confirm a build fires.

Once this is on, `deploy:cf*` scripts become optional fallbacks.

## Handover to Rather

- [ ] **GitHub org access** for Rather on `regen-coordination` (Luiz — the ★ blocker).
- [ ] Decide the **Cloudflare account** of record: add Rather to Luiz's account (Manage Account →
      Members), or redeploy both Workers under a team account (cheap — two `wrangler deploy` runs;
      URLs change unless a custom domain is attached first).
- [ ] **Custom domain on prod** — attach in the Worker's Settings → Domains & Routes. Also retires
      the "public surface is a Vercel preview URL" credibility exposure (Artizen `R7`).
- [ ] After a domain lands, update `site:` in both branches' `astro.config.mjs`
      (canonicals/sitemaps still point at the old Vercel/GitHub-Pages domains).

## Watch-items

- **20,000-file cap per deployment.** Dev is at ~4,100 files. If the kb-handoff corpus
  (3,058 objects) gets rendered as individual pages, re-check — the deploy script fails fast if
  the cap is hit.
- The old surfaces (GitHub Pages on the fork, `regen-toolkit-site.vercel.app`,
  `regen-web3-toolkit.vercel.app`) are still up; retire deliberately once DNS + the review
  workflow have moved.

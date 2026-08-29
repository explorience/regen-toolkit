#!/usr/bin/env bash
# operator-setup.sh — idempotent per-operator onboarding for an org-os instance.
#
# Puts you on your operator trunk, installs the pre-commit guard, regenerates
# the cross-tool slash commands, and installs deps.
#
# VAULT-SAFE: aborts if the working tree is dirty. NEVER stashes, cleans, or
# resets — your uncommitted work is never touched.
#
# Usage:  bash scripts/operator-setup.sh <operator>     # your operator slug (lowercase)

set -euo pipefail

OP="${1:-}"
if ! printf '%s' "$OP" | grep -Eq '^[a-z][a-z0-9-]{1,30}$'; then
  echo "Usage: bash scripts/operator-setup.sh <operator>   (lowercase slug, e.g. your first name)"; exit 1
fi

# 1. Must be at the repo root of an org-os instance.
if [ ! -f package.json ] || [ ! -f federation.yaml ]; then
  echo "✗ Run this from the org-os instance repo root (package.json + federation.yaml expected)."; exit 1
fi

# 2. Require a clean tree — NEVER stash (vault safety).
if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Working tree has uncommitted changes."
  echo "  Commit them first ( /commit ), then re-run. This script will never stash or"
  echo "  discard your work."
  exit 1
fi

# 3. Fetch (best-effort).
echo "▸ fetching origin…"
git fetch --quiet origin || echo "  (offline — continuing with local refs)"

# 4. Put HEAD on the operator trunk.
if git show-ref --verify --quiet "refs/heads/$OP"; then
  git switch "$OP"
elif git show-ref --verify --quiet "refs/remotes/origin/$OP"; then
  git switch -c "$OP" "origin/$OP"
else
  base=main
  if git show-ref --verify --quiet "refs/remotes/origin/main"; then base=origin/main; fi
  echo "  origin/$OP not found — creating $OP off $base"
  git switch -c "$OP" "$base"
fi
git branch --set-upstream-to="origin/$OP" "$OP" 2>/dev/null || true

# 5. Install the pre-commit guard (blocks direct commits to main).
# Point git at the versioned scripts/hooks/ dir rather than copying into
# .git/hooks — this works when `.git` is a file (worktrees / submodule checkouts,
# which this repo uses), keeps the hook live with the repo, and covers future
# hooks with no per-file install step.
chmod +x scripts/hooks/* 2>/dev/null || true
git config core.hooksPath scripts/hooks

# 6. Regenerate cross-tool commands + install deps.
node scripts/sync-commands.mjs
npm install --silent 2>/dev/null || npm install

# 7. Summary.
upstream="$(git rev-parse --abbrev-ref '@{u}' 2>/dev/null || echo 'none')"
echo
echo "✓ Operator setup complete."
echo "  operator:  $OP"
echo "  branch:    $(git rev-parse --abbrev-ref HEAD)  (tracking: $upstream)"
echo "  hooks:     core.hooksPath → scripts/hooks (pre-commit blocks commits to main)"
echo "  commands:  regenerated for OpenCode + Cursor (canonical: .claude/commands/)"
if [ "$upstream" = "none" ]; then
  echo
  echo "  Your trunk isn't on the remote yet. Publish it when ready:"
  echo "    git push -u origin $OP"
fi
echo
echo "Daily flow:   /sync  →  work  →  /commit        Session:  /initialize … /close"

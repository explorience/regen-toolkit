#!/usr/bin/env bash
# scripts/publish-framework.sh — one-way publish of packages/toolkit-framework
# to the public standalone repo. The monorepo is the dev home; the public repo
# is the consumption point (machine-iteration design §2 d5).
# Usage: scripts/publish-framework.sh [remote-url]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$REPO_ROOT/packages/toolkit-framework"
REMOTE="${1:-https://github.com/luizfernandosg/toolkit-framework.git}"
STAGE="$(mktemp -d)/toolkit-framework"

git clone --depth 1 "$REMOTE" "$STAGE" 2>/dev/null || { mkdir -p "$STAGE"; git -C "$STAGE" init -b main; git -C "$STAGE" remote add origin "$REMOTE"; }
rsync -a --delete --exclude node_modules --exclude .git "$PKG/" "$STAGE/"
SHA="$(git -C "$REPO_ROOT" rev-parse --short HEAD)"
git -C "$STAGE" add -A
git -C "$STAGE" commit -m "publish: sync from regen-toolkit@$SHA" || { echo "nothing to publish"; exit 0; }
git -C "$STAGE" push -u origin main
echo "published → $REMOTE (from $SHA)"

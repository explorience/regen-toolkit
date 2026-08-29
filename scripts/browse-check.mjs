#!/usr/bin/env node

/**
 * Browse CLI doctor — verifies the browse.sh CLI is installed and (with
 * --live) that it can drive a local browser session. Mirrors the
 * scripts/notion-test.mjs onboarding pattern: green/red report lines with
 * inline fix instructions, non-zero exit on failure.
 *
 * Usage:
 *   npm run browse:check            # CLI present + version
 *   npm run browse:check -- --live  # + open example.com, snapshot, stop
 */

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

export function evaluateVersion(result) {
  if (result.error || result.status !== 0) {
    return {
      ok: false,
      message: "browse CLI not found on PATH (or exits non-zero)",
      fix: "npm install -g browse   # then re-run: npm run browse:check",
    };
  }
  const version = String(result.stdout).trim();
  return { ok: true, message: `browse CLI installed (${version})` };
}

export function evaluateLive(openResult, snapshotResult) {
  if (openResult.error || openResult.status !== 0) {
    return {
      ok: false,
      message: "could not open a local browser session",
      fix: "Ensure Chrome/Chromium is installed, then debug manually: browse open https://example.com",
    };
  }
  const snap = String(snapshotResult.stdout || "");
  if (snapshotResult.status !== 0 || !/Example Domain/i.test(snap)) {
    return {
      ok: false,
      message: "session opened but snapshot did not return page content",
      fix: "Debug manually: browse open https://example.com && browse snapshot",
    };
  }
  return {
    ok: true,
    message: "live check passed (example.com opened, snapshot extracted)",
  };
}

function runBrowse(args) {
  return spawnSync("browse", args, { encoding: "utf-8", timeout: 60_000 });
}

function report(res) {
  console.log(`${res.ok ? green("✓") : red("✗")} ${res.message}`);
  if (!res.ok && res.fix) console.log(`  ${yellow("fix:")} ${res.fix}`);
}

function main() {
  console.log(bold("Browse CLI check"));
  const version = evaluateVersion(runBrowse(["--version"]));
  report(version);
  if (!version.ok) process.exit(1);

  if (process.argv.includes("--live")) {
    const open = runBrowse(["open", "https://example.com"]);
    const snapshot = runBrowse(["snapshot"]);
    runBrowse(["stop"]); // always close the session, even on failure
    const live = evaluateLive(open, snapshot);
    report(live);
    if (!live.ok) process.exit(1);
  }

  console.log(green("browse-check passed"));
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();

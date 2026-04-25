#!/usr/bin/env node

/**
 * GitHub Sync Command
 * Bundles common git operations for users unfamiliar with git commands.
 *
 * Usage:
 *   npm run sync              # Interactive mode (default)
 *   npm run sync -- status    # Check git status
 *   npm run sync -- push      # Push all changes
 *   npm run sync -- pull      # Pull latest changes
 *   npm run sync -- full      # Full sync (pull + status + push)
 */

import { intro, outro, select, confirm, spinner, text } from "@clack/prompts";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Colors for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, {
      cwd: rootDir,
      encoding: "utf8",
      stdio: silent ? "pipe" : "inherit",
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

async function checkGitStatus() {
  log("\n📊 Checking git status...", "cyan");

  const result = exec("git status --short", true);

  if (!result.success) {
    log("❌ Failed to check git status", "red");
    return { untracked: [], modified: [] };
  }

  const lines = result.output
    .trim()
    .split("\n")
    .filter((l) => l);
  const untracked = lines.filter((l) => l.startsWith("??")).length;
  const modified = lines.filter((l) => !l.startsWith("??")).length;

  if (lines.length === 0) {
    log("✅ Working directory is clean (no changes)", "green");
  } else {
    log(`📝 Changes found:`, "yellow");
    if (modified > 0) log(`   - ${modified} files modified or staged`);
    if (untracked > 0) log(`   - ${untracked} files untracked`);
  }

  return { untracked, modified, lines };
}

async function stageChanges() {
  log("\n📦 Staging all changes...", "cyan");

  const result = exec("git add .", true);

  if (result.success) {
    log("✅ All changes staged", "green");
    return true;
  } else {
    log(`❌ Failed to stage changes: ${result.output}`, "red");
    return false;
  }
}

async function commitChanges(message) {
  log(`\n💾 Committing with message: "${message}"`, "cyan");

  const result = exec(`git commit -m "${message}"`, true);

  if (result.success) {
    log("✅ Changes committed", "green");
    return true;
  } else if (result.output.includes("nothing to commit")) {
    log("ℹ️  Nothing to commit (working directory is clean)", "yellow");
    return true;
  } else {
    log(`❌ Failed to commit: ${result.output}`, "red");
    return false;
  }
}

async function pushChanges(branch = "main") {
  log(`\n🚀 Pushing to GitHub (${branch})...`, "cyan");

  const result = exec(`git push origin ${branch}`, true);

  if (result.success) {
    log("✅ Changes pushed to GitHub", "green");
    return true;
  } else {
    log(`❌ Failed to push: ${result.output}`, "red");
    log("\n💡 Tips:", "yellow");
    log("   - Make sure you have git credentials configured");
    log("   - Check your network connection");
    log("   - Verify you have push access to the repository");
    return false;
  }
}

async function pullChanges(branch = "main") {
  log(`\n⬇️  Pulling latest changes from GitHub (${branch})...`, "cyan");

  const result = exec(`git pull origin ${branch}`, true);

  if (result.success) {
    log("✅ Latest changes pulled", "green");
    return true;
  } else {
    log(`⚠️  Could not pull: ${result.output}`, "yellow");
    return false;
  }
}

async function getCurrentBranch() {
  const result = exec("git rev-parse --abbrev-ref HEAD", true);
  return result.success ? result.output.trim() : "main";
}

async function showHelp() {
  log("\n" + colors.bright + "📚 GitHub Sync Help" + colors.reset);
  log(`
${colors.bright}Usage:${colors.reset}
  npm run sync              Interactive menu
  npm run sync -- status    Show git status
  npm run sync -- push      Stage, commit, and push
  npm run sync -- pull      Pull latest changes
  npm run sync -- full      Pull → Status → Commit → Push
  npm run sync -- help      Show this help message

${colors.bright}What does each command do?${colors.reset}

${colors.cyan}Status:${colors.reset}
  Shows what files have changed, been added, or deleted

${colors.cyan}Push:${colors.reset}
  1. Stages all your changes
  2. Asks for a commit message
  3. Commits the changes
  4. Pushes to GitHub

${colors.cyan}Pull:${colors.reset}
  Gets the latest changes from GitHub
  (useful if someone else made updates)

${colors.cyan}Full Sync:${colors.reset}
  Complete synchronization workflow:
  1. Pull latest changes from GitHub
  2. Show status of your local changes
  3. Ask if you want to commit & push
  4. Push to GitHub if you confirm

${colors.bright}Tips:${colors.reset}
  - Commit messages should be clear and descriptive
  - Example: "Update member list and meeting notes"
  - Use full sync before ending work for the day
  - Use pull at start of day to get team changes
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  intro(colors.bright + "🔄 Organizational OS - GitHub Sync" + colors.reset);

  // Check if git is available
  const gitCheck = exec("git --version", true);
  if (!gitCheck.success) {
    log("❌ Git is not installed or not found in PATH", "red");
    log("Please install git from https://git-scm.com", "yellow");
    outro("Setup failed");
    process.exit(1);
  }

  // Handle commands
  if (command === "help" || command === "--help" || command === "-h") {
    await showHelp();
    outro("Done");
    return;
  }

  if (command === "status") {
    await checkGitStatus();
    outro("Done");
    return;
  }

  if (command === "pull") {
    const branch = await getCurrentBranch();
    await pullChanges(branch);
    outro("Done");
    return;
  }

  if (command === "push") {
    const status = await checkGitStatus();

    if (status.lines.length === 0) {
      log("\n✅ No changes to push", "green");
      outro("Done");
      return;
    }

    const shouldStage = await confirm({
      message: "Stage all changes?",
    });

    if (!shouldStage) {
      log("Cancelled", "yellow");
      outro("Done");
      return;
    }

    if (!(await stageChanges())) {
      outro("Failed");
      process.exit(1);
    }

    const message = await text({
      message: "Commit message:",
      placeholder: "Describe what changed...",
      validate: (v) => (v.length > 0 ? undefined : "Message required"),
    });

    if (!message) {
      log("Cancelled", "yellow");
      outro("Done");
      return;
    }

    if (!(await commitChanges(message))) {
      outro("Failed");
      process.exit(1);
    }

    const branch = await getCurrentBranch();
    if (!(await pushChanges(branch))) {
      outro("Failed");
      process.exit(1);
    }

    outro("✅ Changes synced to GitHub!");
    return;
  }

  if (command === "full") {
    log("\n🔄 Running full synchronization...", "bright");

    const branch = await getCurrentBranch();

    // Step 1: Pull
    await pullChanges(branch);

    // Step 2: Check status
    const status = await checkGitStatus();

    // Step 3: Ask if user wants to commit
    if (status.lines.length > 0) {
      const shouldCommit = await confirm({
        message: "Commit and push these changes?",
      });

      if (shouldCommit) {
        if (!(await stageChanges())) {
          outro("Failed");
          process.exit(1);
        }

        const message = await text({
          message: "Commit message:",
          placeholder: "Describe what changed...",
          validate: (v) => (v.length > 0 ? undefined : "Message required"),
        });

        if (!message) {
          log("Cancelled", "yellow");
          outro("Done");
          return;
        }

        if (!(await commitChanges(message))) {
          outro("Failed");
          process.exit(1);
        }

        if (!(await pushChanges(branch))) {
          outro("Failed");
          process.exit(1);
        }

        outro("✅ Full sync complete!");
      } else {
        log("Skipped commit/push", "yellow");
        outro("Partial sync complete");
      }
    } else {
      log("\n✅ No local changes to push", "green");
      outro("Sync complete");
    }
    return;
  }

  // Interactive mode (default)
  const action = await select({
    message: "What would you like to do?",
    options: [
      { value: "status", label: "📊 Check status - See what changed" },
      { value: "pull", label: "⬇️  Pull - Get latest changes from GitHub" },
      { value: "push", label: "🚀 Push - Commit and send changes to GitHub" },
      { value: "full", label: "🔄 Full Sync - Pull, status, commit, and push" },
      { value: "help", label: "📚 Help - Learn about sync commands" },
    ],
  });

  const branch = await getCurrentBranch();

  switch (action) {
    case "status":
      await checkGitStatus();
      break;
    case "pull":
      await pullChanges(branch);
      break;
    case "push": {
      const status = await checkGitStatus();

      if (status.lines.length === 0) {
        log("\n✅ No changes to push", "green");
        break;
      }

      const shouldStage = await confirm({
        message: "Stage all changes?",
      });

      if (!shouldStage) break;

      if (!(await stageChanges())) break;

      const message = await text({
        message: "Commit message:",
        placeholder: "Describe what changed...",
        validate: (v) => (v.length > 0 ? undefined : "Message required"),
      });

      if (!message) break;

      if (!(await commitChanges(message))) break;
      await pushChanges(branch);
      break;
    }
    case "full": {
      await pullChanges(branch);
      const status = await checkGitStatus();

      if (status.lines.length > 0) {
        const shouldCommit = await confirm({
          message: "Commit and push changes?",
        });

        if (shouldCommit) {
          await stageChanges();

          const message = await text({
            message: "Commit message:",
            placeholder: "Describe what changed...",
            validate: (v) => (v.length > 0 ? undefined : "Message required"),
          });

          if (message) {
            await commitChanges(message);
            await pushChanges(branch);
          }
        }
      }
      break;
    }
    case "help":
      await showHelp();
      break;
  }

  outro("✅ Done!");
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, "red");
  outro("Failed");
  process.exit(1);
});

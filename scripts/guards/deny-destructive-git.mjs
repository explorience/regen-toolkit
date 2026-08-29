#!/usr/bin/env node
/**
 * deny-destructive-git.mjs — PreToolUse guard blocking destructive git ops.
 *
 * Wired from .claude/settings.json as a PreToolUse hook on the Bash tool, so
 * it sees the *actual command string* Claude is about to run. That is the
 * whole point: `permissions.deny` entries like `Bash(git stash:*)` are prefix
 * matches and are trivially evaded by inserting a git global option —
 * `git -c core.pager=cat stash list` and `git reset -q --hard` both sail
 * straight through the deny-list. This repo lives beside an Obsidian vault
 * whose untracked notes have been destroyed by exactly these commands before,
 * so the deny-list alone is not an acceptable boundary. The deny-list stays as
 * cheap defense-in-depth; this guard is the enforcement.
 *
 * Contract (Claude Code 2.1.x — https://code.claude.com/docs/en/hooks):
 *   stdin  = JSON { session_id, hook_event_name, tool_name, tool_input, ... }
 *            for Bash, tool_input.command is the command string
 *   exit 2 = BLOCK the tool call; stderr is fed back to the model
 *   exit 0 = no decision; normal permission flow continues
 *   exit 1 = non-blocking error (i.e. the command still runs) — never used here
 *
 * DESIGN — conservative matching in *subcommand position*:
 * We still do NOT parse shell grammar; a parser that is 95% correct is a
 * boundary with a 5% hole. Instead:
 *
 *   1. Backslash-newline continuations are erased (a two-line `git \` /
 *      `clean -fd` is one invocation).
 *   2. Quoted spans are LIFTED into single fused tokens, so `-C "/a b"` stays
 *      one option argument and cannot shift the option-arity skip onto the
 *      wrong token (`git -C "/path with space" clean -fdx` was an observed
 *      bypass of the previous tokenizer, which dissolved quotes into spaces).
 *   3. Each quoted span's CONTENT is additionally scanned as its own command
 *      stream, so wrappers like `sh -c 'git stash'` and nested quoting are
 *      still caught. The cost is a known residual false-positive: a *message*
 *      containing the two words adjacently (`git commit -m "never run git
 *      stash"`) is also blocked, because inert `-m` payloads and executable
 *      `sh -c` payloads are indistinguishable without shell semantics. Use
 *      `git commit -F <file>` for prose that must name the banned commands.
 *   4. In every invocation segment, every token that *is* the git binary
 *      (`git`, `/usr/bin/git`, `./git`) is examined; global options are
 *      skipped with their real arity, and the first non-option token is the
 *      subcommand. Tokens containing `=` are skipped as config-style
 *      arguments — no git subcommand contains `=`, so a mis-modelled option
 *      arity degrades to skipping its argument instead of opening a hole.
 *   5. Fail closed on what cannot be resolved statically: a subcommand slot
 *      holding a shell expansion (`git $CMD`), or an expansion in command
 *      position alongside a destructive verb token (`V=git; $V clean -fd`,
 *      another observed bypass).
 *
 * Scope stays the three verbs that have destroyed vault content here (`stash`,
 * `clean`, `reset --hard`, plus their dashed libexec spellings). Widening to
 * `checkout --`/`restore`/`rm` is a separate operator decision — see
 * docs/VAULT-SAFETY.md; packages/multica-bridge/docs/SETUP.md documents them
 * as out of scope today.
 *
 * False positives remain the acceptable direction to be wrong: a false block
 * costs one rephrase, a false allow costs irreplaceable user notes. Any
 * unexpected failure inside this guard blocks.
 *
 * This file is deliberately a single self-contained script with no imports and
 * no exports: multica-bridge SETUP tells operators to copy exactly this file
 * (plus .claude/settings.json) into each new instance. The suite in
 * tests/guards/deny-destructive-git.test.mjs drives it as a subprocess.
 */

const BLOCK = 2;
const ALLOW = 0;

// The git binary as an argv token: `git`, `/usr/bin/git`, `./git`.
// Deliberately does NOT match `.git` (as in `ls -la .git/hooks`), `digit`,
// `legit`, `github.com`, or a directory like `scripts/git-hooks/`.
const GIT_BINARY = /^(?:.*\/)?git$/;

// The dashed binaries git installs in libexec. These ARE the destructive
// commands, so they are blocked outright in any position.
const GIT_DASHED_DESTRUCTIVE = /^(?:.*\/)?git-(clean|stash)$/;

// git global options that consume the FOLLOWING token as their argument.
// Only options git actually accepts in separate-argument form belong here:
// `--exec-path`, `--super-prefix` and `--config-env` are =-attached only (bare
// `--exec-path` prints and exits), and listing them with arity 2 previously
// swallowed the real subcommand (`git --exec-path clean -fd` — observed
// bypass). Attached forms (`--git-dir=/x`) carry their own value and are
// handled by the generic "starts with -" skip.
const OPT_WITH_ARG = new Set(['-c', '-C', '--git-dir', '--work-tree', '--namespace']);

// A token containing a shell expansion cannot be resolved statically.
const EXPANSION = /\$/;

// `--hard` plus every unambiguous abbreviation git itself accepts for it
// (`git reset --ha` is exactly as destructive as `git reset --hard`).
// Deliberately does not match `--help` or `--hard-<something>`.
const HARD = /^--h(?:a(?:r(?:d)?)?)?$/;

// Fuses whitespace inside a lifted quoted span so it stays one token.
const FUSE = '';

const REASONS = {
  clean: 'destructive git operation: `clean` (deletes untracked files)',
  stash: 'destructive git operation: `stash` (discards/relocates uncommitted work)',
  hard: 'destructive git operation: `reset --hard` (discards uncommitted work)',
};

/**
 * Lift quoted spans out of the command: each becomes a single fused token in
 * the outer stream, and its raw content is returned for recursive scanning.
 */
function liftQuotes(command) {
  const contents = [];
  const lifted = command.replace(/"([^"]*)"|'([^']*)'|`([^`]*)`/g, (_, d, s, b) => {
    const inner = d ?? s ?? b ?? '';
    contents.push(inner);
    return ` ${inner.trim().replace(/\s+/g, FUSE) || FUSE} `;
  });
  return { lifted, contents };
}

/**
 * Split a command into invocation segments (token arrays). Quotes are lifted
 * first; leftover unbalanced quote chars and grouping chars are dissolved;
 * `;` `&` `|` and newlines separate invocations; lone `\` tokens (escapes and
 * stray continuations) are dropped.
 */
function segments(command) {
  const { lifted, contents } = liftQuotes(command.replace(/\\\r?\n/g, ' '));
  const segs = lifted
    .replace(/[`'"]/g, ' ')
    .replace(/[()<>{}]/g, ' ')
    .split(/[;&|\n]+/)
    .map((part) => part.split(/\s+/).filter((t) => t && t !== '\\'));
  return { segs, contents };
}

/**
 * Given the index of a git binary token, return the index of its subcommand,
 * skipping global options with their arity and `=`-bearing config arguments.
 * Returns -1 when the invocation has no subcommand (`git --version`).
 */
function subcommandIndex(tokens, gitIndex) {
  let i = gitIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.startsWith('-')) { i += OPT_WITH_ARG.has(token) ? 2 : 1; continue; }
    if (token.includes('=')) { i += 1; continue; } // config-style argument, never a subcommand
    return i;
  }
  return -1;
}

function scan(command, depth = 0) {
  if (depth > 4) return 'quoting nested too deep to inspect';
  const { segs, contents } = segments(command);

  for (const tokens of segs) {
    if (tokens.length && EXPANSION.test(tokens[0])) {
      // `V=git; $V clean -fd` — the binary is unresolvable; fail closed when a
      // destructive verb rides in the same invocation (observed bypass).
      const verb =
        (tokens.includes('clean') && 'clean') ||
        (tokens.includes('stash') && 'stash') ||
        (tokens.includes('reset') && tokens.some((t) => HARD.test(t)) && 'hard');
      if (verb) {
        return `command starts with a shell expansion (\`${tokens[0]}\`) beside a destructive git verb — cannot be cleared (${REASONS[verb]})`;
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      const dashed = tokens[i].match(GIT_DASHED_DESTRUCTIVE);
      if (dashed) return REASONS[dashed[1] === 'clean' ? 'clean' : 'stash'].replace('`', '`git-');

      if (!GIT_BINARY.test(tokens[i])) continue;

      const subIndex = subcommandIndex(tokens, i);
      if (subIndex === -1) continue;
      const sub = tokens[subIndex];

      if (EXPANSION.test(sub)) {
        return `git subcommand is a shell expansion (\`${sub}\`) and cannot be inspected`;
      }
      if (sub === 'stash') return REASONS.stash;
      if (sub === 'clean') return REASONS.clean;
      if (sub === 'reset' && tokens.slice(subIndex + 1).some((t) => HARD.test(t))) {
        return REASONS.hard;
      }
    }
  }

  // Quoted contents are command streams in their own right (`sh -c 'git
  // stash'`, `xargs -I{} sh -c "..."`). Scan them recursively.
  for (const content of contents) {
    const reason = scan(content, depth + 1);
    if (reason) return reason;
  }

  return null;
}

function verdict(command) {
  return scan(command, 0);
}

function block(reason) {
  process.stderr.write(
    `BLOCKED by the org-os vault-safety guard (scripts/guards/deny-destructive-git.mjs): ${reason}\n` +
      'This repo sits beside an Obsidian vault full of untracked, irreplaceable notes; ' +
      '`git stash`, `git clean` and `git reset --hard` have destroyed user content here before. ' +
      'Do not attempt to work around this guard. Use `npm run vault:snapshot` to checkpoint, ' +
      'commit what is coherent, or revert file-by-file instead. ' +
      '(If this blocked mere prose naming those commands, use `git commit -F <file>`.)\n',
  );
  process.exit(BLOCK);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

try {
  const raw = await readStdin();

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    // Fail closed: if we cannot read the payload we cannot clear the command.
    block('hook payload was not valid JSON, so the command could not be inspected');
  }

  // Configured with matcher "Bash", but be explicit rather than trusting it.
  if (payload?.tool_name !== 'Bash') process.exit(ALLOW);

  const command = payload?.tool_input?.command;
  if (typeof command !== 'string') {
    block('Bash tool call carried no inspectable `tool_input.command` string');
  }

  const reason = verdict(command);
  if (reason) block(`${reason} — refused command: ${command}`);

  process.exit(ALLOW);
} catch (err) {
  // Any unexpected failure in the guard itself must not open the boundary.
  block(`guard failed to evaluate the command (${err?.message ?? err})`);
}

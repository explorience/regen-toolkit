#!/usr/bin/env node
/**
 * generate-quilt.mjs — re-weave docs/QUILT.md (the organism) from data/*.yaml.
 * Phase B of docs/superpowers/specs/2026-07-19-quilt-visualization-design.md.
 *
 * Usage: node scripts/generate-quilt.mjs [--root <dir>] [--stdout]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import {
  len, patch, pack, pods, organ, organism, stitch, ORGANISM_INNER as OW,
} from "./lib/quilt-compose.mjs";
import {
  instancePatch, syncLedger, packageTiers, projectTiers, skillCounts,
  GARDEN_GROUPS, shortId,
} from "./lib/quilt-view.mjs";

const args = process.argv.slice(2);
const root = args.includes("--root") ? args[args.indexOf("--root") + 1] : process.cwd();
const toStdout = args.includes("--stdout");
if (args.includes("--root")) {
  const v = args[args.indexOf("--root") + 1];
  if (!v || v.startsWith("--")) {
    console.error("generate-quilt: --root requires a directory path");
    process.exit(2);
  }
}
const today = new Date().toISOString().slice(0, 10);

const yaml = (rel) => loadYaml(readFileSync(path.join(root, rel), "utf8"));
const instances = yaml("data/instances.yaml").instances ?? [];
const pkgs = yaml("data/packages-matrix.yaml").packages ?? [];
const skills = yaml("data/skills-matrix.yaml").skills ?? [];
const projects = yaml("data/projects.yaml").projects ?? [];

const heartbeat = existsSync(path.join(root, "HEARTBEAT.md"))
  ? readFileSync(path.join(root, "HEARTBEAT.md"), "utf8") : "";
const openTasks = (heartbeat.match(/^- \[ \]/gm) ?? []).length;

const memDates = existsSync(path.join(root, "memory"))
  ? readdirSync(path.join(root, "memory")).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort()
  : [];
const memAge = memDates.length
  ? `${Math.max(0, Math.round((new Date(today) - new Date(memDates.at(-1).slice(0, 10))) / 86400000))}d ago`
  : "∅";

/** Break a » -separated line into rows that fit `width`, hanging-indented. */
// NOTE: only breaks at `sep`; a single token wider than `width` will still overflow
// and the enclosing organ() will throw — fine for short ledger ids.
function wrapSeparated(str, width, sep = " » ", indent = "  ") {
  const parts = str.split(sep);
  const lines = [];
  let cur = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const candidate = cur + sep + parts[i];
    if (len(candidate) > width) { lines.push(cur); cur = indent + parts[i]; }
    else cur = candidate;
  }
  lines.push(cur);
  return lines;
}

/* organs */
const core = organ("CORE · nucleus", [
  ...pack([
    patch("HEARTBEAT █", [` ${openTasks} open `]),
    patch("MEMORY █", [` ${memAge} `]),
  ], 34),
  ...pods("█ spine", ["(SOUL)", "(IDENTITY)", "(USER)", "(TOOLS)"], 34),
  "▓ MASTERPLAN · the mandate",
], 38);

const registries = existsSync(path.join(root, "data"))
  ? readdirSync(path.join(root, "data")).filter((f) => f.endsWith(".yaml")).length : 0;
const schemas = existsSync(path.join(root, ".well-known"))
  ? readdirSync(path.join(root, ".well-known")).filter((f) => f.endsWith(".json")).length : 0;

const data = organ("DATA ≡ SCHEMAS", [
  ...pack([
    patch("data/*.yaml █", [` ×${registries} registries `]),
    patch(".well-known █", [` EIP-4824 ×${schemas} `]),
  ], 41),
  "≡ generate ⇄ validate ✓",
  "  yaml is truth, schema is face",
], 45);

const interfaces = organ("INTERFACES · doors", [
  ...pods("in", ["(claude-code █)", "(obsidian █ hub)", "(zed/acp ▓)", "(opencode ▓)",
    "(hermes ▓)", "(canvas ▒)", "(web-dash ░)"], 37),
  "~ many doors, one house",
], 41);

const integrations = organ("INTEGRATIONS · edges", [
  ...pods("out", ["(github █)", "(notion █)", "(koi ▓ mcp)", "(hermes ▓)",
    "(opal ░ » rollout)", "(eip-4824 ≡ █)"], 38),
  "~ where the world plugs in",
], 42);

const scriptCount = existsSync(path.join(root, "scripts"))
  ? readdirSync(path.join(root, "scripts")).filter((f) => f.endsWith(".mjs")).length : 0;
const automation = organ(`AUTOMATION · metabolism · scripts ×${scriptCount} + hooks`, [
  ...pods("loop", ["(initialize » dashboard)", "(generate ⇄ validate)",
    "(sync-upstream ↔ spokes)", "(analyze » drift-report)", "(clone-framework » birth)"], 80),
], OW);

const bodies = instances.filter((i) => i.federation_role !== "agent-runtime");
const substrates = instances.filter((i) => i.federation_role === "agent-runtime");
const driftTotal = instances.reduce((n, i) => n + (i.drift ?? []).length, 0);
const networks = new Set(instances.map((i) => i.federation_network).filter(Boolean)).size;
const instPatches = bodies.map((i) => { const p = instancePatch(i); return patch(p.title, p.lines); });

const federation = organ(
  `FEDERATION · the membrane · ◉ hub ↔ ${instances.length} · ${networks} networks`, [
    ...pack(instPatches, 80),
    ...(substrates.length ? pods("▒☓ substrate", substrates.map((s) =>
      `(${shortId(s.id)} · agent runtime · sync ∅ · ${(s.drift ?? []).length} drift)`), 80) : []),
    ...wrapSeparated(`${syncLedger(instances, new Date(today))} · ☓${driftTotal}`, 80),
  ], OW);

const tiers = packageTiers(pkgs);
const packagesOrgan = organ(`PACKAGES · travelers · matrix ×${pkgs.length}`, [
  ...pack(tiers.patches.map((p) => patch(p.title, p.lines)), 80),
  ...(tiers.sleeping.length ? pods("░ sleeping", tiers.sleeping, 80) : []),
  ...(tiers.away.length ? pods("~ away, instance-owned", tiers.away, 80) : []),
], OW);

const sc = skillCounts(skills);
const skillsOrgan = organ(`SKILLS · the garden · matrix ×${sc.total}`, [
  ...pack([
    patch("PIPELINE ⊕", [` ▒×${sc.candidate} → ▓×${sc.evaluating} → █×${sc.canonical} `,
      " promotion is the pulse "]),
    patch("DAO WAVE ▒⊕", [" safe·hats·gardens ", " karma·eip4824 » next "]),
  ], 80),
  ...Object.entries(GARDEN_GROUPS).flatMap(([label, tokens]) => pods(label, tokens, 80)),
  ...pods("▒ local color", [`(instance-specific ×${sc["instance-specific"]})`,
    "— stays local until it proves general"], 80),
], OW);

const pt = projectTiers(projects);
const projectsOrgan = organ(`PROJECTS · the field · ×${projects.length}`, [
  ...pack(pt.patches.map((p) => patch(p.title, p.lines)), 80),
  ...(pt.discovery.length ? pods("▒ discovery", pt.discovery, 80) : []),
  ...pack([patch("QUEUE ░",
    [" » autopoiesis-p2 (12-task TDD) · multica ×25 · e2e sync · scoping ×4 "])], 80),
], OW);

const version = existsSync(path.join(root, "federation.yaml"))
  ? (yaml("federation.yaml").metadata?.framework_version ?? "?") : "?";

const body = organism(`ORG-OS · framework v${version} · woven ${today}`, [
  [core, data],
  stitch("∴ the nucleus writes truth · truth becomes face"),
  [interfaces, integrations],
  stitch("↕"),
  [automation],
  stitch("↔ the membrane breathes: sync-upstream out, promotion ⊕ back in"),
  [federation],
  stitch("⊕"),
  [packagesOrgan],
  stitch("⊕"),
  [skillsOrgan],
  stitch("»"),
  [projectsOrgan],
]);

const doc = `# org-os · QUILT

> A [QUILT-protocol](https://wibandwob.com/quiltprotocol/) visualization of the org-os
> system as **one organism** — modules, integrations, and federation as nested
> containers, shaded by live status.
>
> Woven **${today}** by \`npm run generate:quilt\` from \`data/*.yaml\` — do not edit by
> hand. Edit prose in the generator \`scripts/generate-quilt.mjs\` (organ layout/taglines)
> or per-entry detail in \`scripts/lib/quilt-view.mjs\` (PKG_DETAIL, GARDEN_GROUPS, …).

## Legend

\`\`\`
containment ╔═╗ organism · ┏━┓ organ · ╭─╮ patch (size = vitality) · (pod) small/asleep
status      █ live · ▓ moving · ▒ forming · ░ latent · ☓ needs attention
stitches    → flow · ↔ sync · ⊕ promotion · ≡ correspondence · ∴ therefore
            » points-to-next · ◉ hub · ✓ verified · ∅ never · ~ ambient
\`\`\`

Status is mapped from each registry's native vocabulary: instance maturity
(\`production/beta/alpha\`), package \`lifecycle_status\`, skill \`promotion_status\`,
project stage (\`Develop/Discovery\`), and drift flags. A thing earns its pixels:
live patches get room, dormant things shrink to pods.

## The organism

\`\`\`
${body}
\`\`\`

#orgos-organism · one membrane ∴ organs breathe · patches earn size · pods sleep ░ · hub ↔ spokes ⊕

---

*Sources: \`data/instances.yaml\`, \`data/packages-matrix.yaml\`, \`data/skills-matrix.yaml\`,*
*\`data/projects.yaml\`, \`federation.yaml\`, \`HEARTBEAT.md\`. Regenerate: \`npm run generate:quilt\`.*
`;

if (toStdout) {
  process.stdout.write(doc);
} else {
  writeFileSync(path.join(root, "docs", "QUILT.md"), doc);
  console.log(`woven docs/QUILT.md (${today}) · instances ×${instances.length} · packages ×${pkgs.length} · skills ×${sc.total} · projects ×${projects.length}`);
}

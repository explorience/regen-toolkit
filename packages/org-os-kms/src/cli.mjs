// src/cli.mjs
// Thin zero-dep CLI. dispatch(argv, {dry}) is unit-testable: with dry:true it only parses +
// routes; without it, it executes. Framework-style hand-rolled --flag value parsing.
import { runLifecycle } from './executor.mjs';
import { bridge } from './registry-bridge.mjs';
import { renderDashboardSection, renderSiteData } from './render.mjs';
import { addPeer, checkPeers, contribute } from './federate.mjs';
import { promote } from './promote.mjs';
import { loadKmsConfig } from './config.mjs';
import * as fw from './framework.mjs';

const VERBS = new Set(['lifecycle', 'bridge', 'render', 'federate', 'promote', 'init']);

function parseFlags(argv) {
  const args = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) { flags[t.slice(2)] = argv[i + 1]; i++; }
    else args.push(t);
  }
  return { args, flags };
}

export function dispatch(argv, opts = {}) {
  const [verb, ...rest] = argv;
  const { args, flags } = parseFlags(rest);
  if (!VERBS.has(verb)) return { error: `unknown verb: ${verb}` };
  if (opts.dry) return { verb, args, flags };

  const dir = flags.dir || '.';
  switch (verb) {
    case 'lifecycle': return runLifecycle(args[0], { dir });
    case 'bridge':    return bridge({ dir, config: loadKmsConfig(dir) });
    case 'render': {
      const cfg = loadKmsConfig(dir);
      if (args[0] === 'site') return renderSiteData({ dir, target: cfg.target, outPath: (cfg.render && cfg.render.site_data) || 'src/data/kms-index.json' });
      const a = fw.getAdapter(cfg.adapter);
      return { section: renderDashboardSection(a.index(cfg.target)) };
    }
    case 'federate': {
      if (args[0] === 'add')      return addPeer({ dir, cardPath: flags.card });
      if (args[0] === 'check')    return checkPeers({ dir, config: loadKmsConfig(dir) });
      if (args[0] === 'contribute') return contribute({ dir, slug: flags.peer });
      return { error: `federate: unknown subcommand ${args[0]}` };
    }
    case 'promote':   return promote({ from: flags.from || '.', to: flags.to });
    case 'init':      return fw.initInstance({ dir, name: flags.name, adapter: flags.adapter || 'repo-data', target: flags.target || '.' });
  }
}

// Entry point when run directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = dispatch(process.argv.slice(2));
  console.log(JSON.stringify(result, null, 2));
}

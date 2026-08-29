#!/usr/bin/env node
/**
 * doctor.mjs — `npm run doctor` shim for packages/instance-doctor.
 *
 * Thin on purpose. It exists so that:
 *   - the framework exposes one obvious entry point (`npm run doctor`), and
 *   - `doctor sync` can inject THIS file into an instance alongside
 *     sync-upstream.mjs and validate-identity.mjs, giving that instance the
 *     same entry point without it needing the package vendored (it resolves
 *     the package from the framework checkout when the local one is absent).
 *
 * See packages/instance-doctor/src/cli.mjs for the real implementation, and
 * skills/instance-doctor/SKILL.md for the operator flow.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const local = path.resolve(here, '..', 'packages', 'instance-doctor', 'src', 'cli.mjs');

if (!existsSync(local)) {
  console.error('instance-doctor is not present in this checkout.');
  console.error(`  expected: ${local}`);
  console.error('Run the doctor from the framework instead:');
  console.error('  npm run doctor -- --dir <this-instance>');
  process.exit(2);
}

const { main } = await import(pathToFileURL(local).href);
process.exit(main());

#!/usr/bin/env node
// toolkit-framework CLI — zero-dep argv parsing (portable, no build step).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import yaml from 'js-yaml';
import { listSchemas, validateObject, isValid } from './index.mjs';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case 'version':
  case '--version':
  case '-v':
    console.log(version);
    break;

  case 'list-schemas':
    console.log(listSchemas().join('\n'));
    break;

  case 'check-state': {
    // check-state <axis> <value>  — validate a value against the K1 canonical model
    const [axis, value] = args;
    if (!axis || !value) { console.error('usage: toolkit-framework check-state <axis> <value>'); process.exit(2); }
    if (isValid(axis, value)) { console.log(`✓ "${value}" is a valid ${axis}`); }
    else { console.error(`✗ "${value}" is not a valid ${axis}`); process.exit(1); }
    break;
  }

  case 'validate': {
    // validate <schema> <file.yaml|json>
    const [schemaName, file] = args;
    if (!schemaName || !file) { console.error('usage: toolkit-framework validate <schema> <file.yaml|json>'); process.exit(2); }
    const obj = yaml.load(readFileSync(file, 'utf8'));
    const { valid, errors } = validateObject(schemaName, obj);
    if (valid) { console.log(`✓ valid (${schemaName})`); }
    else { console.error(`✗ invalid (${schemaName}):\n  - ${errors.join('\n  - ')}`); process.exit(1); }
    break;
  }

  default:
    console.log('toolkit-framework — Regen Knowledge Commons Toolkit framework');
    console.log('commands:');
    console.log('  version                         print version');
    console.log('  list-schemas                    list available schemas');
    console.log('  check-state <axis> <value>      validate a value against the K1 state model');
    console.log('  validate <schema> <file>        validate an object file against a schema');
    if (cmd && cmd !== 'help' && cmd !== '--help') process.exit(2);
}

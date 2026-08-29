#!/usr/bin/env node

/**
 * modules.mjs — org-os module engine (v5, Phase 1)
 *
 * The SOLE reader/writer of module state:
 *   modules/x/module.yaml     — framework registry source
 *   data/modules.yaml         — instance install manifest
 *   .well-known/modules.json  — published state
 *
 * Commands: list | add <id> [--from <framework-path>] | adopt [--from <path>] | registry
 * Phase 2/3 commands (update, status, check) are specified in
 * docs/superpowers/specs/2026-08-02-org-os-v5-modularization-design.md
 */

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

export const REQUIRED_FIELDS = ['id', 'version', 'type', 'description'];
export const MODULE_TYPES = ['core', 'operational', 'integration'];
export const KNOWN_FIELDS = [...REQUIRED_FIELDS, 'dependencies', 'files', 'templates', 'checks', 'npm'];

/**
 * Validate a module manifest object (parsed module.yaml) against the
 * org-os module contract mirrored in schemas/module.schema.json.
 *
 * @param {object} manifest - parsed module.yaml contents
 * @returns {string[]} human-readable error messages; empty when the manifest is valid
 */
export function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return ['manifest is not an object'];
  }
  for (const f of REQUIRED_FIELDS) if (!manifest[f]) errors.push(`missing required field: ${f}`);
  if (manifest.id && !/^org-os-[a-z0-9-]+$/.test(manifest.id)) errors.push(`invalid id: ${manifest.id}`);
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version))
    errors.push(`invalid version: ${manifest.version}`);
  if (manifest.type && !MODULE_TYPES.includes(manifest.type)) errors.push(`invalid type: ${manifest.type}`);
  if (manifest.description !== undefined && typeof manifest.description !== 'string') {
    errors.push('description must be a string');
  }
  if (manifest.dependencies !== undefined) {
    if (!Array.isArray(manifest.dependencies)) {
      errors.push('dependencies must be a list');
    } else {
      for (const d of manifest.dependencies) {
        if (typeof d !== 'string') errors.push(`dependencies["${d}"] must be a module id string`);
      }
    }
  }
  for (const key of ['files', 'templates']) {
    const value = manifest[key];
    if (value === undefined) continue;
    if (typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${key} must be a map of source → target paths`);
      continue;
    }
    for (const [src, target] of Object.entries(value)) {
      if (typeof target !== 'string') errors.push(`${key}["${src}"] target must be a string`);
    }
  }
  for (const k of Object.keys(manifest)) {
    if (!KNOWN_FIELDS.includes(k)) errors.push(`unknown field: ${k}`);
  }
  return errors;
}

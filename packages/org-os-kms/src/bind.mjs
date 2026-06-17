// @org-os/kms — binds @regen-commons/toolkit-framework into org-os.
// It is BOTH a module (this code) AND an org-os profile (ships the framework pre-loaded
// as the default knowledge system). Replaceable: another host can bind the framework
// differently (a plain CLI, a SaaS, another OS) without touching the framework.
//
// (Imports the sibling framework package by relative path; the package.json declares the
//  @regen-commons/toolkit-framework dependency for published/workspace installs.)
import { listSchemas } from '../../toolkit-framework/src/index.mjs';

/** Framework schema -> the org-os registry file it populates (instance-side output). */
export const REGISTRY_BINDINGS = {
  resource: 'data/resources.yaml',
  'source-system': 'data/source-systems.yaml',
  'option-entry': 'data/option-library.yaml',
  track: 'data/tracks.yaml',
  deployment: 'data/deployments.yaml',
  'implementation-record': 'data/implementation-memory.yaml',
  'evolution-record': 'data/evolution-log.yaml',
  signal: 'data/signals.yaml',
  'contribution-record': 'data/contributions.yaml',
  'encyclopedia-entry': 'src/content/docs/',
};

/** org-os session lifecycle -> framework operations bound to each command. */
export const LIFECYCLE_BINDINGS = {
  '/initialize': ['sync upstream branches', 'load framework schemas', 'render dashboard'],
  '/close': ['run csis-review on changed objects', 'emit contribution-records', 'sync + push'],
};

/** Group framework objects by their target org-os registry. */
export function toOrgOsRegistries(objects = []) {
  const out = {};
  for (const o of objects) {
    const target = REGISTRY_BINDINGS[o.type] || 'data/misc.yaml';
    (out[target] ||= []).push(o);
  }
  return out;
}

/**
 * The profile manifest: an org-os instance with the toolkit-framework pre-loaded as the
 * default knowledge system. Instantiating this profile yields a running knowledge commons.
 */
export function profileManifest() {
  return {
    profile: 'org-os-kms',
    default_knowledge_system: '@regen-commons/toolkit-framework',
    schemas: listSchemas(),
    registry_bindings: REGISTRY_BINDINGS,
    lifecycle_bindings: LIFECYCLE_BINDINGS,
    federation: 'RegenOS — upstream/downstream + self-qualifying adoption',
    replaceable: true,
  };
}

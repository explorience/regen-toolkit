/**
 * Plugin Loader
 * Load and manage Paperclip plugins
 */

import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { createLogger } from '../lib/logger.js';
import { PaperclipError, ErrorCode } from '../lib/errors.js';

const logger = createLogger('plugin-loader');

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  main?: string;
  dependencies?: Record<string, string>;
}

export interface LoadedPlugin {
  manifest: PluginManifest;
  path: string;
  module: unknown;
}

export class PluginLoader {
  private pluginsPath: string;
  private loadedPlugins: Map<string, LoadedPlugin>;

  constructor(pluginsPath?: string) {
    this.pluginsPath = pluginsPath || resolve('./plugins');
    this.loadedPlugins = new Map();
  }

  /**
   * Load all plugins from plugins directory
   */
  async loadPlugins(): Promise<LoadedPlugin[]> {
    const plugins: LoadedPlugin[] = [];

    if (!existsSync(this.pluginsPath)) {
      logger.info({ path: this.pluginsPath }, 'Plugins directory not found');
      return plugins;
    }

    const entries = await readdir(this.pluginsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const pluginPath = join(this.pluginsPath, entry.name);
      const plugin = await this.loadPlugin(pluginPath);

      if (plugin) {
        plugins.push(plugin);
        this.loadedPlugins.set(plugin.manifest.name, plugin);
      }
    }

    logger.info({ count: plugins.length }, 'Plugins loaded');
    return plugins;
  }

  /**
   * Load a single plugin
   */
  async loadPlugin(pluginPath: string): Promise<LoadedPlugin | null> {
    const manifestPath = join(pluginPath, 'plugin.json');
    
    if (!existsSync(manifestPath)) {
      logger.warn({ path: pluginPath }, 'Plugin manifest not found');
      return null;
    }

    try {
      const manifestContent = await readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent) as PluginManifest;

      logger.info({ name: manifest.name, version: manifest.version }, 'Loading plugin');

      // Load main module
      let module: unknown = null;
      if (manifest.main) {
        const mainPath = join(pluginPath, manifest.main);
        module = await import(mainPath);
      }

      const plugin: LoadedPlugin = {
        manifest,
        path: pluginPath,
        module
      };

      return plugin;
    } catch (error) {
      logger.error({ path: pluginPath, error }, 'Failed to load plugin');
      return null;
    }
  }

  /**
   * Get loaded plugin by name
   */
  getPlugin(name: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(name);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Unload plugin by name
   */
  async unloadPlugin(name: string): Promise<boolean> {
    const plugin = this.loadedPlugins.get(name);
    
    if (!plugin) {
      return false;
    }

    // Call cleanup if available
    if (plugin.module && typeof plugin.module === 'object') {
      const cleanup = (plugin.module as any).cleanup;
      if (typeof cleanup === 'function') {
        await cleanup();
      }
    }

    this.loadedPlugins.delete(name);
    logger.info({ name }, 'Plugin unloaded');
    return true;
  }

  /**
   * Execute plugin function
   */
  async executePlugin(name: string, fn: string, ...args: unknown[]): Promise<unknown> {
    const plugin = this.loadedPlugins.get(name);

    if (!plugin) {
      throw new PaperclipError(
        ErrorCode.NOT_FOUND,
        `Plugin '${name}' not found`,
        { name }
      );
    }

    const func = (plugin.module as any)[fn];
    
    if (typeof func !== 'function') {
      throw new PaperclipError(
        ErrorCode.INVALID_INPUT,
        `Plugin '${name}' does not export '${fn}'`,
        { name, fn }
      );
    }

    return func(...args);
  }
}

export default PluginLoader;

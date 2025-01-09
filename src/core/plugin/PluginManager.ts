import { ComponentType } from 'react';
import { Plugin, PluginConfig, PluginState } from '../types';

export class PluginManager {
  private static instance: PluginManager;
  private plugins = new Map<string, Plugin>();
  private initialized = new Set<string>();
  private logger = console;

  private constructor() {}

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  async installPlugin(plugin: Plugin): Promise<void> {
    const name = plugin.name;
    const version = plugin.version;

    try {
      // Check if plugin was previously installed
      const existingPlugin = this.plugins.get(name);
      if (existingPlugin) {
        // Handle update case
        if (existingPlugin.version !== version) {
          await this.updatePlugin(name, version);
          return;
        }
        throw new Error(`Plugin ${name} is already installed`);
      }

      // Validate dependencies
      await this.validateDependencies(plugin.config.dependencies?.required || {});

      // Register the plugin
      await this.registerPlugin(plugin);

    } catch (error) {
      this.logger.error('Plugin installation failed:', error);
      throw error;
    }
  }

  private async registerPlugin(plugin: Plugin): Promise<void> {
    const name = plugin.name;
    await this.validateDependencies(plugin.config.dependencies?.required || {});
    this.plugins.set(name, plugin);
  }

  async initializePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`Plugin ${name} not found`);
    if (this.initialized.has(name)) return;

    // Initialize dependencies first
    if (plugin.config.dependencies?.required) {
      for (const [dep] of Object.entries(plugin.config.dependencies.required)) {
        await this.initializePlugin(dep);
      }
    }

    try {
      await plugin.onInit();
      this.initialized.add(name);
    } catch (error) {
      this.logger.error('Plugin initialization failed:', error);
      throw error;
    }
  }

  async uninstallPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    try {
      // Remove plugin
      await this.destroyPlugin(name);
    } catch (error) {
      this.logger.error('Plugin uninstallation failed:', error);
      throw error;
    }
  }

  private async destroyPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    try {
      if (plugin.onUnload) {
        await plugin.onUnload();
      }
      this.plugins.delete(name);
      this.initialized.delete(name);
    } catch (error) {
      this.logger.error('Plugin destruction failed:', error);
      throw error;
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  isInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  isPluginEnabled(name: string): boolean {
    const plugin = this.plugins.get(name);
    return plugin?.state === PluginState.STARTED;
  }

  isPluginInstalled(name: string): boolean {
    return this.plugins.has(name);
  }

  hasCircularDependency(
    pluginName: string,
    visited: Set<string> = new Set(),
    path: string[] = []
  ): boolean {
    if (visited.has(pluginName)) {
      return path.includes(pluginName);
    }

    visited.add(pluginName);
    path.push(pluginName);

    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    const dependencies = Object.keys(plugin.config.dependencies?.required || {});
    for (const dep of dependencies) {
      if (this.hasCircularDependency(dep, visited, [...path])) {
        return true;
      }
    }

    path.pop();
    return false;
  }

  isVersionCompatible(current: string, requirement: string): boolean {
    const [reqMajor, reqMinor = '0', reqPatch = '0'] = requirement.split('.');
    const [curMajor, curMinor = '0', curPatch = '0'] = current.split('.');
    
    if (reqMajor !== curMajor) return false;
    if (parseInt(reqMinor) > parseInt(curMinor)) return false;
    if (parseInt(reqMinor) === parseInt(curMinor) && parseInt(reqPatch) > parseInt(curPatch)) return false;
    
    return true;
  }

  private async validateDependencies(dependencies: Record<string, string>): Promise<void> {
    for (const [dep, version] of Object.entries(dependencies)) {
      const plugin = this.plugins.get(dep);
      if (!plugin) {
        throw new Error(`Missing dependency: ${dep}`);
      }
      if (!this.isPluginEnabled(dep)) {
        throw new Error(`Dependency ${dep} is not enabled`);
      }
      if (!this.isVersionCompatible(plugin.version, version)) {
        throw new Error(`Incompatible dependency version: ${dep} requires ${version}, found ${plugin.version}`);
      }
    }
  }

  private async updatePlugin(pluginName: string, version: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    try {
      // Download and install new version
      const newPlugin = await this.downloadPlugin(pluginName, version);
      await this.installPlugin(newPlugin);

    } catch (error) {
      this.logger.error('Plugin update failed:', error);
      throw error;
    }
  }

  private async downloadPlugin(pluginName: string, version: string): Promise<Plugin> {
    // This is a placeholder - actual implementation would fetch from a plugin registry
    throw new Error('Plugin download not implemented');
  }
}

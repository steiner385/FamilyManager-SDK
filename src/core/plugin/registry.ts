import { Plugin, PluginStatus } from './types';
import { Logger } from '../logging/Logger';

export class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Map<string, Plugin>;
  private pluginStates: Map<string, PluginStatus>;
  private logger: Logger;

  private constructor() {
    this.plugins = new Map();
    this.pluginStates = new Map();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} is already registered`);
    }

    this.plugins.set(plugin.id, plugin);
    this.pluginStates.set(plugin.id, PluginStatus.INACTIVE);
    this.logger.info(`Plugin registered: ${plugin.id}`);
  }

  unregister(pluginId: string): void {
    if (!this.plugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    this.plugins.delete(pluginId);
    this.pluginStates.delete(pluginId);
    this.logger.info(`Plugin unregistered: ${pluginId}`);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginState(pluginId: string): PluginStatus | undefined {
    return this.pluginStates.get(pluginId);
  }

  setPluginState(pluginId: string, state: PluginStatus): void {
    if (!this.plugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    this.pluginStates.set(pluginId, state);
    this.logger.info(`Plugin ${pluginId} state changed to ${state}`);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getActivePlugins(): Plugin[] {
    return Array.from(this.plugins.entries())
      .filter(([id]) => this.pluginStates.get(id) === PluginStatus.ACTIVE)
      .map(([, plugin]) => plugin);
  }

  clear(): void {
    this.plugins.clear();
    this.pluginStates.clear();
    this.logger.info('Plugin registry cleared');
  }
}

export const pluginRegistry = PluginRegistry.getInstance();

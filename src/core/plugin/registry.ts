import { Plugin, PluginState } from './types';
import { Logger } from '../logging/Logger';
import { RouteRegistry } from '../routing/RouteRegistry';

class PluginRegistry {
  private static instance: PluginRegistry | null = null;
  private plugins = new Map<string, Plugin>();
  private pluginStates = new Map<string, PluginState>();
  private logger = Logger.getInstance();

  register(plugin: Plugin): void {
    const name = plugin.metadata.name;
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} is already registered`);
    }
    this.plugins.set(name, plugin);
    this.pluginStates.set(name, 'registered');
    
    // Register routes if plugin has them
    if (plugin.routes) {
      const routeRegistry = RouteRegistry.getInstance();
      routeRegistry.registerPluginRoutes(name, plugin.routes);
    }
    
    this.logger.debug(`Registered plugin: ${name}`);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
    this.pluginStates.delete(name);
    this.logger.debug(`Unregistered plugin: ${name}`);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getPluginState(name: string): PluginState {
    return this.pluginStates.get(name) || 'registered';
  }

  clear(): void {
    this.plugins.clear();
    this.pluginStates.clear();
    this.logger.debug('Cleared all plugins');
  }
}

export const pluginRegistry = new PluginRegistry();

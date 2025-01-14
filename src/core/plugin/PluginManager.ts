import { logger } from '../utils/logger';
import { Plugin } from './types';
import { routeRegistry } from '../routing/RouteRegistry';
import { eventBus } from '../events/EventBus';

export class PluginManager {
  private static instance: PluginManager | null = null;
  private installedPlugins: Map<string, Plugin>;
  private activePlugins: Set<string>;
  private initialized: boolean;

  private constructor() {
    this.installedPlugins = new Map();
    this.activePlugins = new Set();
    this.initialized = false;
  }

  initialize(context?: any): void {
    if (this.initialized) {
      logger.warn('PluginManager already initialized');
      return;
    }
    this.initialized = true;
    logger.debug('PluginManager initialized');
  }

  clearPlugins(): void {
    this.installedPlugins.clear();
    this.activePlugins.clear();
    logger.debug('Cleared all plugins');
  }

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  async installPlugin(plugin: Plugin): Promise<void> {
    return this.registerPlugin(plugin);
  }

  async registerPlugin(plugin: Plugin, context?: any): Promise<void> {
    if (!this.initialized) {
      throw new Error('PluginManager must be initialized before registering plugins');
    }

    if (!plugin.id || !plugin.name) {
      throw new Error('Plugin must have both id and name');
    }

    if (this.installedPlugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} is already registered`);
    }

    // Validate plugin dependencies
    if (plugin.config?.metadata?.dependencies?.required) {
      for (const [depId, version] of Object.entries(plugin.config.metadata.dependencies.required)) {
        if (!this.installedPlugins.has(depId)) {
          throw new Error(`Missing required dependency: ${depId}`);
        }
        // TODO: Add version check if needed
      }
    }

    // Register plugin routes
    if (plugin.routes) {
      for (const route of plugin.routes) {
        routeRegistry.registerRoute(plugin.id, route);
      }
    }

    // Store plugin
    this.installedPlugins.set(plugin.id, plugin);
    logger.info(`Registered plugin: ${plugin.name} (${plugin.id})`);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('PluginManager must be initialized before unregistering plugins');
    }

    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    // Check for dependent plugins
    for (const [id, p] of this.installedPlugins) {
      if (p.dependencies?.includes(pluginId)) {
        throw new Error(`Cannot unregister plugin ${pluginId} because it is required by ${id}`);
      }
    }

    // Cleanup plugin
    if (plugin.teardown) {
      await plugin.teardown();
    }

    // Remove routes
    if (plugin.routes) {
      for (const route of plugin.routes) {
        routeRegistry.unregisterRoute(pluginId, route);
      }
    }

    this.installedPlugins.delete(pluginId);
    this.activePlugins.delete(pluginId);
    logger.info(`Unregistered plugin: ${pluginId}`);
  }

  async initializePlugin(pluginId: string): Promise<void> {
    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    if (this.activePlugins.has(pluginId)) {
      logger.warn(`Plugin ${pluginId} is already initialized`);
      return;
    }

    // Initialize plugin
    if (plugin.initialize || plugin.onInit) {
      await (plugin.initialize || plugin.onInit)?.();
    }

    this.activePlugins.add(pluginId);
    logger.info(`Initialized plugin: ${plugin.name} (${pluginId})`);
  }

  isInitialized(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  isPluginInstalled(pluginId: string): boolean {
    return this.installedPlugins.has(pluginId);
  }

  isPluginActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.installedPlugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.installedPlugins.values());
  }

  static resetInstance(): void {
    PluginManager.instance = null;
  }
}

export const pluginManager = PluginManager.getInstance();

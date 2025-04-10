import { Logger } from '../logging/Logger';
import { Plugin, PluginMetrics, PluginStatus } from './types';
import { eventBus } from '../events/EventBus';
import { logger } from '../logging/Logger';
import { routeRegistry } from '../routing/RouteRegistry';
import { ComponentRegistry } from '../registry/ComponentRegistry';
import { ThemeManager } from '../theme/ThemeManager';
import { pluginRegistry } from './registry';

export class PluginManager {
  private static instance: PluginManager;
  private logger: Logger;
  private plugins: Map<string, Plugin>;
  private pluginStates: Map<string, PluginStatus>;
  private initializedPlugins: Set<string>;
  private componentRegistry: ComponentRegistry;
  private themeManager: ThemeManager;

  private constructor() {
    this.logger = logger;
    this.plugins = new Map();
    this.pluginStates = new Map();
    this.initializedPlugins = new Set();
    this.componentRegistry = ComponentRegistry.getInstance();
    this.themeManager = ThemeManager.getInstance();
    this.initialized = false;
  }

  private initialized = false;

  public initialize(): void {
    if (this.initialized) {
      this.logger.warn('PluginManager already initialized');
      return;
    }
    this.initialized = true;
    this.logger.debug('PluginManager initialized');
  }

  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('PluginManager must be initialized before registering plugins');
    }
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public static resetInstance(): void {
    PluginManager.instance = new PluginManager();
  }

  public isPluginInstalled(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  public isPluginActive(pluginId: string): boolean {
    return this.pluginStates.get(pluginId) === PluginStatus.ACTIVE;
  }

  public clearPlugins(): void {
    this.plugins.clear();
    this.pluginStates.clear();
    this.initializedPlugins.clear();
    this.logger.debug('Cleared all plugins');
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    this.checkInitialized();

    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} is already registered`);
    }

    // Check dependencies before registration
    if (plugin.metadata?.dependencies) {
      for (const [depId, version] of Object.entries(plugin.metadata.dependencies)) {
        if (!this.plugins.has(depId)) {
          const error = `Missing required dependency: ${depId}`;
          this.logger.error(error);
          throw new Error(error);
        }
      }
    }

    // Register routes if present
    if (plugin.routes) {
      for (const route of plugin.routes) {
        routeRegistry.registerRoute(plugin.id, route);
      }
    }

    // Register components if present
    if (plugin.components) {
      Object.entries(plugin.components).forEach(([name, component]) => {
        this.componentRegistry.register(name, component);
      });
    }

    // Apply theme if present
    if (plugin.theme) {
      this.themeManager.extendTheme(plugin.theme);
    }

    this.plugins.set(plugin.id, plugin);
    this.pluginStates.set(plugin.id, PluginStatus.INACTIVE);
    pluginRegistry.register(plugin);
    this.logger.info(`Registered plugin: ${plugin.name} (${plugin.id})`);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      const error = `Plugin ${pluginId} is not registered`;
      this.logger.error(error);
      throw new Error(error);
    }

    // Check for dependent plugins first
    const dependentPlugins = Array.from(this.plugins.values()).filter(
      p => p.metadata?.dependencies && Object.keys(p.metadata.dependencies).includes(pluginId)
    );

    if (dependentPlugins.length > 0) {
      const dependentNames = dependentPlugins.map(p => p.id).join(', ');
      throw new Error(`Cannot unregister plugin ${pluginId} because it is required by ${dependentNames}`);
    }

    // If no dependents, proceed with uninstallation
    if (plugin.routes) {
      for (const route of plugin.routes) {
        routeRegistry.unregisterRoute(plugin.id, route);
      }
    }

    await this.stopPlugin(plugin);
    this.plugins.delete(pluginId);
    this.pluginStates.delete(pluginId);
    this.initializedPlugins.delete(pluginId);
    pluginRegistry.unregister(pluginId);
    this.logger.info(`Unregistered plugin: ${pluginId}`);
  }

  async startPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    if (plugin.metadata?.dependencies) {
      for (const [depId, version] of Object.entries(plugin.metadata.dependencies)) {
        if (!this.plugins.has(depId)) {
          throw new Error(`Required dependency ${depId} (${version}) not found for plugin ${pluginId}`);
        }
      }
    }

    if (plugin.start) {
      await plugin.start();
    }

    this.pluginStates.set(pluginId, PluginStatus.ACTIVE);
    pluginRegistry.setPluginState(pluginId, PluginStatus.ACTIVE);
    this.logger.info(`Plugin started: ${pluginId}`);
  }

  async stopPlugin(plugin: Plugin): Promise<void> {
    // Check if any other plugins depend on this one
    const dependentPlugins = Array.from(this.plugins.values()).filter(
      p => p.metadata?.dependencies && Object.keys(p.metadata.dependencies).includes(plugin.id)
    );

    if (dependentPlugins.length > 0) {
      throw new Error(
        `Cannot stop plugin ${plugin.id}: other plugins depend on it: ${dependentPlugins
          .map(p => p.id)
          .join(', ')}`
      );
    }

    if (plugin.stop) {
      await plugin.stop();
    }

    if (plugin.teardown) {
      await plugin.teardown();
    }

    this.pluginStates.set(plugin.id, PluginStatus.INACTIVE);
    pluginRegistry.setPluginState(plugin.id, PluginStatus.INACTIVE);
    this.logger.info(`Plugin stopped: ${plugin.id}`);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginState(pluginId: string): PluginStatus | undefined {
    return this.pluginStates.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  isInitialized(pluginId: string): boolean {
    return this.initializedPlugins.has(pluginId);
  }

  async initializePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (this.initializedPlugins.has(pluginId)) {
      const warning = `Plugin ${pluginId} is already initialized`;
      this.logger.warn(warning);
      return;
    }

    try {
      if (plugin.onInit) {
        await plugin.onInit();
      }

      if (plugin.initialize) {
        await plugin.initialize({
          id: plugin.id,
          name: plugin.name,
          version: plugin.version,
          config: {
            name: plugin.name,
            version: plugin.version,
            description: plugin.description,
            enabled: true
          },
          metadata: plugin.metadata,
          logger: this.logger,
          events: eventBus,
          plugins: {
            hasPlugin: (id: string) => pluginRegistry.getPlugin(id) !== undefined,
            getPlugin: (id: string) => pluginRegistry.getPlugin(id),
            getPluginState: (id: string) => pluginRegistry.getPluginState(id)
          }
        });
      }

      this.initializedPlugins.add(pluginId);
      this.pluginStates.set(pluginId, PluginStatus.ACTIVE);
      pluginRegistry.setPluginState(pluginId, PluginStatus.ACTIVE);
      this.logger.info(`Plugin initialized: ${pluginId}`);
    } catch (error) {
      this.logger.error(`Failed to initialize plugin ${pluginId}`, { error });
      this.pluginStates.set(pluginId, PluginStatus.ERROR);
      pluginRegistry.setPluginState(pluginId, PluginStatus.ERROR);
      throw error;
    }
  }

  async getMetrics(pluginName: string, timeRange?: string): Promise<PluginMetrics | null> {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    if (!plugin.getPluginMetrics) {
      return null;
    }

    return plugin.getPluginMetrics(pluginName, timeRange);
  }
}

export const pluginManager = PluginManager.getInstance();

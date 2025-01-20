import { Logger } from '../logging/Logger';
import { Plugin, PluginMetrics, PluginStatus } from './types';
import { eventBus } from '../events/EventBus';

export class PluginManager {
  private static instance: PluginManager;
  private logger: Logger;
  private plugins: Map<string, Plugin>;
  private pluginStates: Map<string, PluginStatus>;
  private initializedPlugins: Set<string>;

  private constructor() {
    this.logger = new Logger('PluginManager');
    this.plugins = new Map();
    this.pluginStates = new Map();
    this.initializedPlugins = new Set();
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

    // Check dependencies
    if (plugin.dependencies?.required) {
      for (const [depId, version] of Object.entries(plugin.dependencies.required)) {
        if (!this.plugins.has(depId)) {
          throw new Error(`Missing required dependency: ${depId}`);
        }
      }
    }

    this.plugins.set(plugin.id, plugin);
    this.pluginStates.set(plugin.id, PluginStatus.INACTIVE);
    this.logger.info(`Registered plugin: ${plugin.name} (${plugin.id})`);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    // Check for dependent plugins
    const dependentPlugins = Array.from(this.plugins.values()).filter(
      p => p.dependencies?.required && p.dependencies.required[pluginId]
    );

    if (dependentPlugins.length > 0) {
      throw new Error(
        `Cannot unregister plugin ${pluginId} because it is required by ${dependentPlugins.map(p => p.id).join(', ')}`
      );
    }

    await this.stopPlugin(plugin);
    this.plugins.delete(pluginId);
    this.pluginStates.delete(pluginId);
    this.initializedPlugins.delete(pluginId);
    this.logger.info(`Unregistered plugin: ${pluginId}`);
  }

  async startPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not registered`);
    }

    if (plugin.dependencies?.required) {
      for (const [depId, version] of Object.entries(plugin.dependencies.required)) {
        if (!this.plugins.has(depId)) {
          throw new Error(`Required dependency ${depId} (${version}) not found for plugin ${pluginId}`);
        }
      }
    }

    if (plugin.start) {
      await plugin.start();
    }

    this.pluginStates.set(pluginId, PluginStatus.ACTIVE);
    this.logger.info(`Plugin started: ${pluginId}`);
  }

  async stopPlugin(plugin: Plugin): Promise<void> {
    // Check if any other plugins depend on this one
    const dependentPlugins = Array.from(this.plugins.values()).filter(
      p => p.dependencies?.required[plugin.id]
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
      this.logger.warn(`Plugin ${pluginId} is already initialized`);
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
          events: this.eventBus
        });
      }

      this.initializedPlugins.add(pluginId);
      this.pluginStates.set(pluginId, PluginStatus.ACTIVE);
      this.logger.info(`Plugin initialized: ${pluginId}`);
    } catch (error) {
      this.logger.error(`Failed to initialize plugin ${pluginId}`, { error });
      this.pluginStates.set(pluginId, PluginStatus.ERROR);
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

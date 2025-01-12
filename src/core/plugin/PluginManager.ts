import type { Plugin, PluginContext } from './types';
import type { Env } from 'hono/types';
import { pluginRegistry } from './registry';
import { Logger } from '../logging/Logger';

export class PluginManager {
  private static instance: PluginManager;
  private context: PluginContext<any>;
  private logger: Logger;
  
  private constructor() {
    this.context = {} as PluginContext<any>;
    this.logger = Logger.getInstance();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public initialize(context: PluginContext<any>): void {
    this.context = context;
  }

  private validatePluginMetadata(plugin: Plugin): void {
    const { metadata } = plugin;
    if (!metadata.name || typeof metadata.name !== 'string') {
      throw new Error('Plugin metadata must include a valid name');
    }
    if (!metadata.version || typeof metadata.version !== 'string') {
      throw new Error('Plugin metadata must include a valid version');
    }
    if (!metadata.description || typeof metadata.description !== 'string') {
      throw new Error('Plugin metadata must include a valid description');
    }
  }

  private async validateDependencies(plugin: Plugin): Promise<void> {
    const { metadata } = plugin;
    if (!metadata.dependencies?.length) return;

    const missingDeps = metadata.dependencies.filter(dep => !pluginRegistry.hasPlugin(dep));
    if (missingDeps.length > 0) {
      throw new Error(`Missing required dependency: ${missingDeps[0]}`);
    }

    if (metadata.optionalDependencies?.length) {
      metadata.optionalDependencies.forEach(dep => {
        if (!pluginRegistry.hasPlugin(dep)) {
          this.logger.warn(`Optional dependency ${dep} not found for plugin ${metadata.name}`);
        }
      });
    }
  }

  async registerPlugin(plugin: Plugin<any>): Promise<void> {
    try {
      this.validatePluginMetadata(plugin);
      await this.validateDependencies(plugin);

      this.logger.debug(`Starting initialization for plugin ${plugin.metadata.name}`);
      try {
        await Promise.race([
          (async () => {
            this.logger.debug(`Running initialize for plugin ${plugin.metadata.name}`);
            await plugin.initialize(this.context);
            this.logger.debug(`Completed initialize for plugin ${plugin.metadata.name}`);
          })(),
          new Promise((_, reject) => 
            setTimeout(() => {
              this.logger.error(`Plugin initialization timed out for ${plugin.metadata.name}`);
              reject(new Error('Plugin initialization timed out'));
            }, 30000)
          )
        ]);
      } catch (error) {
        throw new Error(`Failed to initialize plugin ${plugin.metadata.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      pluginRegistry.register(plugin);
      
      this.logger.info(`Plugin ${plugin.metadata.name} registered successfully`, {
        version: plugin.metadata.version,
        dependencies: plugin.metadata.dependencies,
        optionalDependencies: plugin.metadata.optionalDependencies
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to register plugin ${plugin.metadata.name}: ${errorMessage}`);
      throw error;
    }
  }

  async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = pluginRegistry.getPlugin(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} is not registered`);
    }

    // Check if other plugins depend on this one
    for (const dep of pluginRegistry.getAll()) {
      if (dep.metadata.dependencies?.includes(pluginName)) {
        throw new Error(`Cannot unregister ${pluginName}: ${dep.metadata.name} depends on it`);
      }
    }

    if (plugin.teardown) {
      await plugin.teardown();
    }

    pluginRegistry.unregister(pluginName);
    this.logger.info(`Plugin ${pluginName} unregistered successfully`);
  }

  getPlugin(name: string): Plugin | undefined {
    return pluginRegistry.getPlugin(name);
  }

  getAllPlugins(): Plugin[] {
    return pluginRegistry.getAll();
  }

  // For testing purposes
  clearPlugins(): void {
    pluginRegistry.clear();
  }
}

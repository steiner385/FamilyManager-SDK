import { EventBus } from '../events/EventBus';
import { logger } from '../utils/logger';
import { PluginContext, PluginMetadata, Plugin } from './types';
import type { Env } from 'hono/types';

export abstract class BasePlugin {
  private initialized: boolean = false;
  abstract readonly metadata: PluginMetadata;
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  async initialize(context: PluginContext<Env>): Promise<void> {
    if (this.initialized) {
      throw new Error(`Plugin ${this.metadata.name} already initialized`);
    }

    // Validate required dependencies
    if (this.metadata.dependencies) {
      for (const [depId] of this.metadata.dependencies) {
        if (!context.plugins?.hasPlugin(depId)) {
          throw new Error(`Required dependency not found: ${depId}`);
        }
      }
    }

    // Check optional dependencies
    if (this.metadata.optionalDependencies) {
      for (const [depId, version] of Object.entries(this.metadata.optionalDependencies)) {
        if (!context.plugins?.hasPlugin(depId)) {
          logger.warn(`Optional dependency not found: ${depId} (${version})`, {
            plugin: this.metadata.name,
            dependency: depId
          });
        }
      }
    }

    // Initialize plugin
    try {
      await this.onInitialize(context);
      this.initialized = true;

      // Publish initialization event
      await this.eventBus.emit({
        id: `plugin-init-${Date.now()}`,
        type: 'PLUGIN_INITIALIZED',
        channel: 'plugin',
        source: this.metadata.name,
        timestamp: Date.now(),
        data: {
          name: this.metadata.name,
          version: this.metadata.version
        }
      });

    } catch (error) {
      logger.error(`Failed to initialize plugin ${this.metadata.name}`, {
        error,
        plugin: this.metadata.name
      });
      throw error;
    }
  }

  async teardown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.onTeardown();
      this.initialized = false;

      // Publish teardown event
      await this.eventBus.emit({
        id: `plugin-teardown-${Date.now()}`,
        type: 'PLUGIN_TEARDOWN',
        channel: 'plugin',
        source: this.metadata.name,
        timestamp: Date.now(),
        data: {
          name: this.metadata.name,
          version: this.metadata.version
        }
      });

    } catch (error) {
      logger.error(`Failed to tear down plugin ${this.metadata.name}`, {
        error,
        plugin: this.metadata.name
      });
      throw error;
    }
  }

  async onError(error: Error): Promise<void> {
    logger.error(`Plugin ${this.metadata.name} error: ${error.message}`, {
      error,
      plugin: this.metadata.name
    });
  }

  async onDependencyChange(dependency: string): Promise<void> {
    logger.debug(`Dependency ${dependency} changed`, {
      plugin: this.metadata.name,
      dependency
    });
  }

  protected checkInitialized(): void {
    if (!this.initialized) {
      throw new Error(`Plugin ${this.metadata.name} not initialized`);
    }
  }

  protected abstract onInitialize(context: PluginContext<Env>): Promise<void>;
  protected abstract onTeardown(): Promise<void>;
}

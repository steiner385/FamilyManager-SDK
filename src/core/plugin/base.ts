import { EventBus } from '../events/EventBus';
import { logger } from '../utils/logger';
import { PluginContext, PluginMetadata } from './types';
import type { Env } from 'hono/types';

export abstract class BasePlugin {
  private initialized: boolean = false;
  abstract readonly metadata: PluginMetadata;

  async initialize(context: PluginContext<Env>): Promise<void> {
    if (this.initialized) {
      throw new Error(`Plugin ${this.metadata.name} already initialized`);
    }

    // Validate required dependencies
    if (this.metadata.dependencies) {
      for (const dep of this.metadata.dependencies) {
        if (!context.plugins.hasPlugin(dep)) {
          throw new Error(`Required dependency not found: ${dep}`);
        }
      }
    }

    // Check optional dependencies
    if (this.metadata.optionalDependencies) {
      for (const dep of this.metadata.optionalDependencies) {
        if (!context.plugins.hasPlugin(dep)) {
          logger.warn(`Optional dependency not found: ${dep}`, {
            plugin: this.metadata.name,
            dependency: dep
          });
        }
      }
    }

    // Initialize plugin
    try {
      await this.onInitialize(context);
      this.initialized = true;

      // Publish initialization event
      await EventBus.getInstance().publish('plugin', {
        type: 'PLUGIN_INITIALIZED',
        source: this.metadata.name,
        timestamp: Date.now(),
        metadata: {
          service: this.metadata.name,
          timestamp: Date.now()
        },
        payload: {
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
      await EventBus.getInstance().publish('plugin', {
        type: 'PLUGIN_TEARDOWN',
        source: this.metadata.name,
        timestamp: Date.now(),
        metadata: {
          service: this.metadata.name,
          timestamp: Date.now()
        },
        payload: {
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

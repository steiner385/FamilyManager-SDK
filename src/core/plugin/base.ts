import { Logger } from '../logging/Logger';
import { EventBus } from '../events/EventBus';
import { PluginContext, PluginMetadata, Plugin, PluginMetrics, PluginStatus } from './types';
import { pluginRegistry } from './registry';

export abstract class BasePlugin implements Plugin {
  protected logger: Logger;
  protected events: EventBus;
  protected initialized: boolean = false;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly version: string,
    public readonly description: string,
    public readonly metadata: PluginMetadata
  ) {
    this.logger = Logger.getInstance();
    this.events = EventBus.getInstance();
  }

  async initialize(context: PluginContext): Promise<void> {
    if (this.initialized) {
      throw new Error(`Plugin ${this.id} already initialized`);
    }

    // Validate required dependencies first
    if (this.metadata.dependencies) {
      for (const [depId, version] of Object.entries(this.metadata.dependencies)) {
        if (!context.plugins?.hasPlugin(depId)) {
          const error = `Required dependency not found: ${depId}`;
          this.logger.error(error);
          throw new Error(error);
        }
        this.logger.debug(`Validating dependency: ${depId} (${version})`);
      }
    }

    // Then handle optional dependencies
    if (this.metadata.optionalDependencies) {
      for (const [depId, version] of Object.entries(this.metadata.optionalDependencies)) {
        if (!context.plugins?.hasPlugin(depId)) {
          this.logger.warn(`Optional dependency not found: ${depId}`);
          continue;
        }
        this.logger.debug(`Initializing optional dependency: ${depId} (${version})`);
      }
    }

    await this.onInitialize(context);
    this.initialized = true;
    pluginRegistry.setPluginState(this.id, PluginStatus.INACTIVE);
    this.logger.info(`Plugin initialized: ${this.id}`);
  }

  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Plugin must be initialized before starting');
    }

    await this.onStart();
    pluginRegistry.setPluginState(this.id, PluginStatus.ACTIVE);
    this.logger.info(`Plugin started: ${this.id}`);
  }

  async stop(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    await this.onStop();
    pluginRegistry.setPluginState(this.id, PluginStatus.INACTIVE);
    this.logger.info(`Plugin stopped: ${this.id}`);
  }

  async onEnable(): Promise<void> {
    // Optional: Override in derived class
  }

  async onDisable(): Promise<void> {
    // Optional: Override in derived class
  }

  async teardown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    await this.onTeardown();
    this.initialized = false;
    pluginRegistry.setPluginState(this.id, PluginStatus.DISABLED);
    this.logger.info(`Plugin torn down: ${this.id}`);
  }

  getPluginMetrics(pluginName: string, timeRange?: string): Promise<PluginMetrics> {
    const state = pluginRegistry.getPluginState(this.id) || PluginStatus.INACTIVE;
    return Promise.resolve({
      id: this.id,
      name: this.name,
      version: this.version,
      status: state,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().heapUsed,
      eventCount: 0,
      errorCount: 0
    });
  }

  protected abstract onInitialize(context: PluginContext): Promise<void>;

  protected async onStart(): Promise<void> {
    // Optional: Override in derived class
  }

  protected async onStop(): Promise<void> {
    // Optional: Override in derived class
  }

  protected async onTeardown(): Promise<void> {
    // Optional: Override in derived class
  }
}

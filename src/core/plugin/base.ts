import { Logger } from '../logging/Logger';
import { EventBus } from '../events/EventBus';
import { PluginContext, PluginMetadata, Plugin, PluginMetrics, PluginStatus } from './types';

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
      return;
    }

    // Validate required dependencies
    if (this.metadata.dependencies) {
      for (const [depId, version] of Object.entries(this.metadata.dependencies)) {
        // Dependency validation would happen here
        this.logger.debug(`Validating dependency: ${depId} (${version})`);
      }
    }

    // Initialize optional dependencies
    if (this.metadata.optionalDependencies) {
      for (const [depId, version] of Object.entries(this.metadata.optionalDependencies)) {
        try {
          // Optional dependency initialization would happen here
          this.logger.debug(`Initializing optional dependency: ${depId} (${version})`);
        } catch (error) {
          this.logger.warn(`Failed to initialize optional dependency: ${depId}`, { error });
        }
      }
    }

    await this.onInitialize(context);
    this.initialized = true;
    this.logger.info(`Plugin initialized: ${this.id}`);
  }

  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Plugin must be initialized before starting');
    }

    await this.onStart();
    this.logger.info(`Plugin started: ${this.id}`);
  }

  async stop(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    await this.onStop();
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
    this.logger.info(`Plugin torn down: ${this.id}`);
  }

  getPluginMetrics(pluginName: string, timeRange?: string): Promise<PluginMetrics> {
    return Promise.resolve({
      id: this.id,
      name: this.name,
      version: this.version,
      status: PluginStatus.ACTIVE,
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

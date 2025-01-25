import type { PluginConfig, PluginHealthCheck } from '../types/plugin';
import type { Event } from '../events/types';
import { EventBus } from '../events/EventBus';
import { Logger } from '../logger';
import { ComponentRegistry } from './ComponentRegistry';
import { ComponentType } from 'react';

interface PluginContext {
  eventBus: EventBus;
  logger: Logger;
  config: any;
}

/**
 * Base plugin class that all plugins must extend
 */
export abstract class BasePlugin {
  public context: PluginContext;
  protected config: PluginConfig;
  private initialized: boolean = false;
  private started: boolean = false;
  protected logger: Logger;

  constructor(config: PluginConfig) {
    this.config = config;
    this.logger = new Logger(config.metadata.name);
    this.context = {
      eventBus: new EventBus(),
      logger: this.logger,
      config: {} // Initial empty config, will be set via updateConfig
    };

    // Subscribe to events
    if (config.events?.subscriptions) {
      for (const eventType of config.events.subscriptions) {
        this.context.eventBus.subscribe(eventType, this.handleEvent.bind(this));
      }
    }
  }

  /**
   * Initialize plugin
   */
  async init(): Promise<void> {
    if (this.initialized) {
      throw new Error('Plugin already initialized');
    }

    await this.onInit();
    this.initialized = true;
  }

  /**
   * Start plugin
   */
  async start(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Plugin not initialized');
    }
    if (this.started) {
      throw new Error('Plugin already started');
    }

    await this.onStart();
    this.started = true;
  }

  /**
   * Stop plugin
   */
  async stop(): Promise<void> {
    if (!this.started) {
      throw new Error('Plugin not started');
    }

    await this.onStop();
    await this.context.eventBus.stop();
    this.started = false;
  }

  /**
   * Update plugin configuration
   */
  async updateConfig(config: any): Promise<void> {
    // Validate and parse config
    const parsedConfig = this.config.config ? this.config.config.parse(config) : config;
    
    // Update context config
    this.context.config = parsedConfig;
    
    // Notify plugin of config change
    await this.onConfigChange?.(parsedConfig);
  }

  /**
   * Handle configuration changes (override in subclass)
   */
  protected async onConfigChange(config: any): Promise<void> {}

  /**
   * Get plugin health status
   */
  abstract getHealth(): Promise<PluginHealthCheck>;

  /**
   * Initialize plugin (override in subclass)
   */
  protected async onInit(): Promise<void> {}

  /**
   * Start plugin (override in subclass)
   */
  protected async onStart(): Promise<void> {}

  /**
   * Stop plugin (override in subclass)
   */
  protected async onStop(): Promise<void> {}

  /**
   * Handle events (override in subclass)
   */
  protected async handleEvent(event: Event): Promise<void> {}

  protected registerComponent(name: string, component: ComponentType): void {
    const registry = ComponentRegistry.getInstance()
    registry.register(name, component)
  }
}

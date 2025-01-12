import { BasePlugin } from '../../core/BasePlugin';
import type { PluginConfig, PluginHealthCheck } from '../../types/plugin';
import { Event } from '../../events/types';
import { z } from 'zod';

/**
 * Example plugin configuration schema
 */
const configSchema = z.object({
  greeting: z.string().min(1),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

type BasicPluginConfig = z.infer<typeof configSchema>;

/**
 * Example basic plugin that demonstrates core plugin functionality
 */
export class BasicPlugin extends BasePlugin {
  constructor() {
    // Define plugin configuration
    const config: PluginConfig = {
      id: 'basic-plugin',
      name: 'basic-plugin',
      version: '1.0.0',
      metadata: {
        id: 'basic-plugin',
        name: 'basic-plugin',
        version: '1.0.0',
        description: 'A basic example plugin',
        author: 'FamilyManager'
      }
    };

    super(config);
  }

  /**
   * Initialize plugin
   */
  async onInit(): Promise<void> {
    this.logger.info('Initializing basic plugin');
    
    // Access validated configuration
    const config = this.context.config as BasicPluginConfig;
    this.logger.info(`Configured with greeting: ${config.greeting}`);
  }

  /**
   * Start plugin
   */
  async onStart(): Promise<void> {
    this.logger.info('Starting basic plugin');

    // Publish initial greeting event
    await this.context.eventBus.publish(
      'basic-plugin.greeting',
      {
        message: (this.context.config as BasicPluginConfig).greeting
      }
    );
  }

  /**
   * Stop plugin
   */
  async onStop(): Promise<void> {
    this.logger.info('Stopping basic plugin');
  }

  /**
   * Handle configuration changes
   */
  async onConfigChange(config: BasicPluginConfig): Promise<void> {
    this.logger.info(`Updating configuration: ${JSON.stringify(config)}`);
    
    // Publish new greeting event
    await this.context.eventBus.publish(
      'basic-plugin.greeting',
      {
        message: config.greeting
      }
    );
  }

  /**
   * Handle events
   */
  protected async handleEvent(event: Event): Promise<void> {
    switch (event.type) {
      case 'user.created':
        this.logger.info('New user created', { userId: event.data?.userId });
        // Send greeting to new user
        await this.context.eventBus.publish(
          'basic-plugin.greeting',
          {
            message: (this.context.config as BasicPluginConfig).greeting,
            userId: event.data?.userId
          }
        );
        break;

      case 'family.updated':
        this.logger.info('Family updated', { familyId: event.data?.familyId });
        break;

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Custom health check implementation
   */
  async getHealth(): Promise<PluginHealthCheck> {
    try {
      // Example health check logic
      const config = this.context.config as BasicPluginConfig;
      const isHealthy = Boolean(config.greeting);

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: Date.now(),
        message: isHealthy ? 'Plugin is healthy' : 'Missing greeting configuration'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        message: 'Health check failed'
      };
    }
  }
}

// Example usage in a separate file
export async function runExample() {
  // Create plugin instance
  const plugin = new BasicPlugin();

  try {
    // Initialize with configuration
    plugin.context.config = {
      greeting: 'Hello from Basic Plugin!',
      logLevel: 'info'
    };

    // Initialize plugin
    await plugin.init();
    console.log('Plugin initialized');

    // Start plugin
    await plugin.start();
    console.log('Plugin started');

    // Update configuration
    await plugin.updateConfig({
      greeting: 'Updated greeting!',
      logLevel: 'debug'
    });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stop plugin
    await plugin.stop();
    console.log('Plugin stopped');
  } catch (error) {
    console.error('Plugin error:', error);
    throw error;
  }
}

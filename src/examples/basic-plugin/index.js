import { BasePlugin } from '../../core/BasePlugin';
import { z } from 'zod';
/**
 * Example plugin configuration schema
 */
const configSchema = z.object({
    greeting: z.string().min(1),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});
/**
 * Example basic plugin that demonstrates core plugin functionality
 */
export class BasicPlugin extends BasePlugin {
    constructor() {
        // Define plugin configuration
        const config = {
            id: 'basic-plugin',
            name: 'basic-plugin',
            version: '1.0.0',
            metadata: {
                id: 'basic-plugin',
                name: 'basic-plugin',
                version: '1.0.0',
                description: 'A basic example plugin',
                author: 'FamilyManager'
            },
            config: configSchema // Add schema for validation
        };
        super(config);
    }
    /**
     * Initialize plugin
     */
    async onInit() {
        this.logger.info('Initializing basic plugin');
        // Access validated configuration
        const config = this.context.config;
        this.logger.info(`Configured with greeting: ${config.greeting}`);
    }
    /**
     * Start plugin
     */
    async onStart() {
        this.logger.info('Starting basic plugin');
        // Publish initial greeting event
        await this.context.eventBus.publish('basic-plugin.greeting', {
            message: this.context.config.greeting
        });
    }
    /**
     * Stop plugin
     */
    async onStop() {
        this.logger.info('Stopping basic plugin');
    }
    /**
     * Handle configuration changes
     */
    async onConfigChange(config) {
        this.logger.info(`Updating configuration: ${JSON.stringify(config)}`);
        // Publish new greeting event
        await this.context.eventBus.publish('basic-plugin.greeting', {
            message: config.greeting
        });
    }
    /**
     * Handle events
     */
    async handleEvent(event) {
        switch (event.type) {
            case 'user.created':
                this.logger.info('New user created', { userId: event.data?.userId });
                // Send greeting to new user
                await this.context.eventBus.publish('basic-plugin.greeting', {
                    message: this.context.config.greeting,
                    userId: event.data?.userId
                });
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
    async getHealth() {
        try {
            // Example health check logic
            const config = this.context.config;
            const hasGreeting = Boolean(config.greeting);
            return {
                status: hasGreeting ? 'healthy' : 'degraded',
                timestamp: Date.now(),
                message: hasGreeting ? 'Plugin is healthy' : 'Missing greeting configuration',
                metrics: {
                    memory: {
                        current: 50,
                        trend: 0,
                        history: []
                    },
                    cpu: {
                        current: 30,
                        trend: 0,
                        history: []
                    },
                    responseTime: {
                        current: 100,
                        trend: 0,
                        history: []
                    }
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                timestamp: Date.now(),
                message: 'Health check failed',
                metrics: {
                    memory: {
                        current: 0,
                        trend: 0,
                        history: []
                    },
                    cpu: {
                        current: 0,
                        trend: 0,
                        history: []
                    },
                    responseTime: {
                        current: 0,
                        trend: 0,
                        history: []
                    }
                }
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
    }
    catch (error) {
        console.error('Plugin error:', error);
        throw error;
    }
}
//# sourceMappingURL=index.js.map
import { EventBus } from '../events/EventBus';
import { Logger } from '../logger';
import { ComponentRegistry } from './ComponentRegistry';
/**
 * Base plugin class that all plugins must extend
 */
export class BasePlugin {
    constructor(config) {
        this.initialized = false;
        this.started = false;
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
    async init() {
        if (this.initialized) {
            throw new Error('Plugin already initialized');
        }
        await this.onInit();
        this.initialized = true;
    }
    /**
     * Start plugin
     */
    async start() {
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
    async stop() {
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
    async updateConfig(config) {
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
    async onConfigChange(config) { }
    /**
     * Initialize plugin (override in subclass)
     */
    async onInit() { }
    /**
     * Start plugin (override in subclass)
     */
    async onStart() { }
    /**
     * Stop plugin (override in subclass)
     */
    async onStop() { }
    /**
     * Handle events (override in subclass)
     */
    async handleEvent(event) { }
    registerComponent(name, component) {
        const registry = ComponentRegistry.getInstance();
        registry.register(name, component);
    }
}
//# sourceMappingURL=BasePlugin.js.map
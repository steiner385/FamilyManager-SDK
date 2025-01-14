import type { PluginConfig, PluginHealthCheck } from '../types/plugin';
import type { Event } from '../events/types';
import { EventBus } from '../events/EventBus';
import { Logger } from '../logger';
import { ComponentType } from 'react';
interface PluginContext {
    eventBus: EventBus;
    logger: Logger;
    config: any;
}
/**
 * Base plugin class that all plugins must extend
 */
export declare abstract class BasePlugin {
    context: PluginContext;
    protected config: PluginConfig;
    private initialized;
    private started;
    protected logger: Logger;
    constructor(config: PluginConfig);
    /**
     * Initialize plugin
     */
    init(): Promise<void>;
    /**
     * Start plugin
     */
    start(): Promise<void>;
    /**
     * Stop plugin
     */
    stop(): Promise<void>;
    /**
     * Update plugin configuration
     */
    updateConfig(config: any): Promise<void>;
    /**
     * Handle configuration changes (override in subclass)
     */
    protected onConfigChange(config: any): Promise<void>;
    /**
     * Get plugin health status
     */
    abstract getHealth(): Promise<PluginHealthCheck>;
    /**
     * Initialize plugin (override in subclass)
     */
    protected onInit(): Promise<void>;
    /**
     * Start plugin (override in subclass)
     */
    protected onStart(): Promise<void>;
    /**
     * Stop plugin (override in subclass)
     */
    protected onStop(): Promise<void>;
    /**
     * Handle events (override in subclass)
     */
    protected handleEvent(event: Event): Promise<void>;
    protected registerComponent(name: string, component: ComponentType): void;
}
export {};
//# sourceMappingURL=BasePlugin.d.ts.map
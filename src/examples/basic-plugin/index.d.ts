import { BasePlugin } from '../../core/BasePlugin';
import type { PluginHealthCheck } from '../../types/plugin';
import { Event } from '../../events/types';
import { z } from 'zod';
/**
 * Example plugin configuration schema
 */
declare const configSchema: z.ZodObject<{
    greeting: z.ZodString;
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
}, "strip", z.ZodTypeAny, {
    greeting: string;
    logLevel: "info" | "warn" | "error" | "debug";
}, {
    greeting: string;
    logLevel?: "info" | "warn" | "error" | "debug" | undefined;
}>;
type BasicPluginConfig = z.infer<typeof configSchema>;
/**
 * Example basic plugin that demonstrates core plugin functionality
 */
export declare class BasicPlugin extends BasePlugin {
    constructor();
    /**
     * Initialize plugin
     */
    onInit(): Promise<void>;
    /**
     * Start plugin
     */
    onStart(): Promise<void>;
    /**
     * Stop plugin
     */
    onStop(): Promise<void>;
    /**
     * Handle configuration changes
     */
    onConfigChange(config: BasicPluginConfig): Promise<void>;
    /**
     * Handle events
     */
    protected handleEvent(event: Event): Promise<void>;
    /**
     * Custom health check implementation
     */
    getHealth(): Promise<PluginHealthCheck>;
}
export declare function runExample(): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map
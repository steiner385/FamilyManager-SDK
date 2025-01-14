export interface PluginHealth {
    status: 'healthy' | 'degraded' | 'error';
    lastCheck: number;
    error?: string;
    metrics: {
        uptime: number;
        memoryUsage: number;
        eventCount: number;
    };
}
export declare class PluginHealthMonitor {
    private static instance;
    private health;
    private constructor();
    static getInstance(): PluginHealthMonitor;
    updateHealth(pluginName: string, status: Partial<PluginHealth>): void;
    getHealth(pluginName: string): PluginHealth | undefined;
    getAllHealth(): Map<string, PluginHealth>;
    clearHealth(pluginName: string): void;
}
//# sourceMappingURL=health.d.ts.map
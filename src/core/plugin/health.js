import { logger } from '../../utils/logger';
export class PluginHealthMonitor {
    constructor() {
        this.health = new Map();
        // Private constructor for singleton
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new PluginHealthMonitor();
        }
        return this.instance;
    }
    updateHealth(pluginName, status) {
        const current = this.health.get(pluginName) || {
            status: 'healthy',
            lastCheck: Date.now(),
            metrics: { uptime: 0, memoryUsage: 0, eventCount: 0 }
        };
        this.health.set(pluginName, {
            ...current,
            ...status,
            lastCheck: Date.now()
        });
        logger.debug(`Updated health for plugin ${pluginName}`, status);
    }
    getHealth(pluginName) {
        return this.health.get(pluginName);
    }
    getAllHealth() {
        return new Map(this.health);
    }
    clearHealth(pluginName) {
        this.health.delete(pluginName);
    }
}
//# sourceMappingURL=health.js.map
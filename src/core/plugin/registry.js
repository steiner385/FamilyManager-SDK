import { Logger } from '../logging/Logger';
class PluginRegistry {
    constructor() {
        this.plugins = new Map();
        this.pluginStates = new Map();
        this.logger = Logger.getInstance();
    }
    register(plugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin ${plugin.id} is already registered`);
        }
        this.plugins.set(plugin.id, plugin);
        this.pluginStates.set(plugin.id, {
            isEnabled: true,
            status: 'started',
            isInitialized: false,
            error: null
        });
        this.logger.debug(`Registered plugin: ${plugin.name}`);
    }
    unregister(name) {
        this.plugins.delete(name);
        this.pluginStates.delete(name);
        this.logger.debug(`Unregistered plugin: ${name}`);
    }
    get(name) {
        return this.plugins.get(name);
    }
    getAll() {
        return Array.from(this.plugins.values());
    }
    hasPlugin(name) {
        return this.plugins.has(name);
    }
    getPlugin(name) {
        return this.plugins.get(name);
    }
    getPluginState(name) {
        return this.pluginStates.get(name) || {
            isEnabled: false,
            status: 'registered',
            isInitialized: false,
            error: null
        };
    }
    clear() {
        this.plugins.clear();
        this.pluginStates.clear();
        this.logger.debug('Cleared all plugins');
    }
}
PluginRegistry.instance = null;
export const pluginRegistry = new PluginRegistry();
export { PluginRegistry };
//# sourceMappingURL=registry.js.map
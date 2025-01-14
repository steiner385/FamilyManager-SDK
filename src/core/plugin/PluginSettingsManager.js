import { StatePersistenceManager } from '../state/StatePersistenceManager';
export class PluginSettingsManager {
    constructor() {
        this.persistenceManager = StatePersistenceManager.getInstance();
    }
    static getInstance() {
        if (!PluginSettingsManager.instance) {
            PluginSettingsManager.instance = new PluginSettingsManager();
        }
        return PluginSettingsManager.instance;
    }
    getSettings(pluginName) {
        return this.persistenceManager.retrieve(`plugin:${pluginName}:settings`) || {
            enabled: false,
            preferences: {},
            permissions: []
        };
    }
    updateSettings(pluginName, settings) {
        const currentSettings = this.getSettings(pluginName);
        const newSettings = {
            ...currentSettings,
            ...settings
        };
        this.persistenceManager.persist(`plugin:${pluginName}:settings`, newSettings);
    }
    clearSettings(pluginName) {
        this.persistenceManager.remove(`plugin:${pluginName}:settings`);
    }
    exportSettings() {
        const allSettings = {};
        // Implementation would iterate through all plugins and export their settings
        return allSettings;
    }
    importSettings(settings) {
        Object.entries(settings).forEach(([pluginName, settings]) => {
            this.updateSettings(pluginName, settings);
        });
    }
}
//# sourceMappingURL=PluginSettingsManager.js.map
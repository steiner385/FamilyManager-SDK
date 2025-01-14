interface PluginSettings {
    enabled: boolean;
    preferences: Record<string, any>;
    permissions: string[];
}
export declare class PluginSettingsManager {
    private static instance;
    private persistenceManager;
    private constructor();
    static getInstance(): PluginSettingsManager;
    getSettings(pluginName: string): PluginSettings;
    updateSettings(pluginName: string, settings: Partial<PluginSettings>): void;
    clearSettings(pluginName: string): void;
    exportSettings(): Record<string, PluginSettings>;
    importSettings(settings: Record<string, PluginSettings>): void;
}
export {};
//# sourceMappingURL=PluginSettingsManager.d.ts.map
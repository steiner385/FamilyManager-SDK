import { PluginConfigSchema, PluginConfig, ConfigValidationResult, ConfigMiddleware, ConfigEncryption } from './types';
export declare class ConfigManager {
    private static instance;
    private configs;
    private schemas;
    private middlewares;
    private encryption?;
    private eventBus;
    private constructor();
    private initializeEventBus;
    addMiddleware(middleware: ConfigMiddleware): void;
    setEncryption(encryption: ConfigEncryption): void;
    static getInstance(): ConfigManager;
    registerSchema(pluginName: string, schema: PluginConfigSchema): void;
    setConfig(pluginName: string, config: PluginConfig): Promise<ConfigValidationResult>;
    getConfig<T extends PluginConfig>(pluginName: string): T;
    private validateConfig;
    private mergeWithDefaults;
    clearConfig(pluginName: string): void;
    clearAll(): void;
}
//# sourceMappingURL=ConfigManager.d.ts.map
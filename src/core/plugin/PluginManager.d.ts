import { Plugin, PluginMetrics } from './types';
export declare class PluginManager {
    private static instance;
    private installedPlugins;
    private activePlugins;
    private initialized;
    private constructor();
    initialize(context?: any): void;
    clearPlugins(): void;
    static getInstance(): PluginManager;
    installPlugin(plugin: Plugin): Promise<void>;
    registerPlugin(plugin: Plugin, context?: any): Promise<void>;
    uninstallPlugin(pluginId: string): Promise<void>;
    initializePlugin(pluginId: string): Promise<void>;
    getPluginMetrics(pluginName: string, timeRange?: string): Promise<PluginMetrics>;
    isInitialized(pluginId: string): boolean;
    isPluginInstalled(pluginId: string): boolean;
    isPluginActive(pluginId: string): boolean;
    getPlugin(pluginId: string): Plugin | undefined;
    getAllPlugins(): Plugin[];
    static resetInstance(): void;
}
export declare const pluginManager: PluginManager;
//# sourceMappingURL=PluginManager.d.ts.map
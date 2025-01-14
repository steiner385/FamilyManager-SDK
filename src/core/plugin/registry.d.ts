import { Plugin, PluginState } from './types';
declare class PluginRegistry {
    private static instance;
    private plugins;
    private pluginStates;
    private logger;
    register(plugin: Plugin): void;
    unregister(name: string): void;
    get(name: string): Plugin | undefined;
    getAll(): Plugin[];
    hasPlugin(name: string): boolean;
    getPlugin(name: string): Plugin | undefined;
    getPluginState(name: string): PluginState;
    clear(): void;
}
export declare const pluginRegistry: PluginRegistry;
export { PluginRegistry };
export type { PluginState };
//# sourceMappingURL=registry.d.ts.map
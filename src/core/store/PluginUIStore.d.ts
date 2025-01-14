interface PluginUIState {
    visiblePlugins: Set<string>;
    pluginLayouts: Record<string, string>;
    pluginPreferences: Record<string, Record<string, unknown>>;
    setPluginVisibility: (pluginId: string, visible: boolean) => void;
    setPluginLayout: (pluginId: string, layoutId: string) => void;
    setPluginPreference: (pluginId: string, key: string, value: unknown) => void;
    resetPluginPreferences: (pluginId: string) => void;
    getPluginPreference: <T>(pluginId: string, key: string, defaultValue: T) => T;
}
export declare const usePluginUIStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<PluginUIState>, "setState"> & {
    setState(partial: PluginUIState | Partial<PluginUIState> | ((state: PluginUIState) => PluginUIState | Partial<PluginUIState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: PluginUIState | ((state: PluginUIState) => PluginUIState), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PluginUIState, {
            pluginLayouts: Record<string, string>;
            pluginPreferences: Record<string, Record<string, unknown>>;
            visiblePlugins: string[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PluginUIState) => void) => () => void;
        onFinishHydration: (fn: (state: PluginUIState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PluginUIState, {
            pluginLayouts: Record<string, string>;
            pluginPreferences: Record<string, Record<string, unknown>>;
            visiblePlugins: string[];
        }>>;
    };
}>;
export {};
//# sourceMappingURL=PluginUIStore.d.ts.map
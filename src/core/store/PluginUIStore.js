import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
export const usePluginUIStore = create()(devtools(persist((set, get) => ({
    visiblePlugins: new Set(),
    pluginLayouts: {},
    pluginPreferences: {},
    setPluginVisibility: (pluginId, visible) => set((state) => ({
        visiblePlugins: new Set(visible
            ? [...Array.from(state.visiblePlugins), pluginId]
            : Array.from(state.visiblePlugins).filter(id => id !== pluginId))
    })),
    setPluginLayout: (pluginId, layoutId) => set((state) => ({
        pluginLayouts: {
            ...state.pluginLayouts,
            [pluginId]: layoutId
        }
    })),
    setPluginPreference: (pluginId, key, value) => set((state) => ({
        pluginPreferences: {
            ...state.pluginPreferences,
            [pluginId]: {
                ...(state.pluginPreferences[pluginId] || {}),
                [key]: value
            }
        }
    })),
    resetPluginPreferences: (pluginId) => set((state) => ({
        pluginPreferences: {
            ...state.pluginPreferences,
            [pluginId]: {}
        }
    })),
    getPluginPreference: (pluginId, key, defaultValue) => {
        const state = get();
        const pluginPrefs = state.pluginPreferences[pluginId];
        return pluginPrefs?.[key] ?? defaultValue;
    }
}), {
    name: 'plugin-ui-storage',
    version: 1,
    partialize: (state) => ({
        pluginLayouts: state.pluginLayouts,
        pluginPreferences: state.pluginPreferences,
        visiblePlugins: Array.from(state.visiblePlugins)
    })
})));
//# sourceMappingURL=PluginUIStore.js.map
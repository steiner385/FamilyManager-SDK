import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface PluginUIState {
  visiblePlugins: Set<string>
  pluginLayouts: Record<string, string>
  pluginPreferences: Record<string, Record<string, unknown>>
  setPluginVisibility: (pluginId: string, visible: boolean) => void
  setPluginLayout: (pluginId: string, layoutId: string) => void
  setPluginPreference: (pluginId: string, key: string, value: unknown) => void
  resetPluginPreferences: (pluginId: string) => void
  getPluginPreference: <T>(pluginId: string, key: string, defaultValue: T) => T
}

export const usePluginUIStore = create<PluginUIState>()(
  devtools(
    persist(
      (set, get) => ({
        visiblePlugins: new Set(),
        pluginLayouts: {},
        pluginPreferences: {},
        
        setPluginVisibility: (pluginId, visible) =>
          set((state) => ({
            visiblePlugins: new Set(
              visible 
                ? [...Array.from(state.visiblePlugins), pluginId]
                : Array.from(state.visiblePlugins).filter(id => id !== pluginId)
            )
          })),

        setPluginLayout: (pluginId, layoutId) =>
          set((state) => ({
            pluginLayouts: {
              ...state.pluginLayouts,
              [pluginId]: layoutId
            }
          })),

        setPluginPreference: (pluginId, key, value) =>
          set((state) => ({
            pluginPreferences: {
              ...state.pluginPreferences,
              [pluginId]: {
                ...(state.pluginPreferences[pluginId] || {}),
                [key]: value
              }
            }
          })),

        resetPluginPreferences: (pluginId) =>
          set((state) => ({
            pluginPreferences: {
              ...state.pluginPreferences,
              [pluginId]: {}
            }
          })),

        getPluginPreference: <T>(pluginId: string, key: string, defaultValue: T): T => {
          const state = get()
          const pluginPrefs = state.pluginPreferences[pluginId]
          return (pluginPrefs?.[key] as T) ?? defaultValue
        }
      }),
      {
        name: 'plugin-ui-storage',
        version: 1,
        partialize: (state) => ({
          pluginLayouts: state.pluginLayouts,
          pluginPreferences: state.pluginPreferences,
          visiblePlugins: Array.from(state.visiblePlugins)
        })
      }
    )
  )
)

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface PluginUIState {
  visiblePlugins: Set<string>
  pluginLayouts: Record<string, string>
  pluginPreferences: Record<string, any>
  setPluginVisibility: (pluginId: string, visible: boolean) => void
  setPluginLayout: (pluginId: string, layoutId: string) => void
  setPluginPreference: (pluginId: string, key: string, value: any) => void
}

export const usePluginUIStore = create<PluginUIState>()(
  devtools(
    persist(
      (set) => ({
        visiblePlugins: new Set(),
        pluginLayouts: {},
        pluginPreferences: {},
        
        setPluginVisibility: (pluginId, visible) =>
          set((state) => ({
            visiblePlugins: new Set([
              ...Array.from(state.visiblePlugins).filter(id => id !== pluginId),
              ...(visible ? [pluginId] : [])
            ])
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
          }))
      }),
      {
        name: 'plugin-ui-storage'
      }
    )
  )
)

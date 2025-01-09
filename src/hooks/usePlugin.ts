import { useEffect, useState } from 'react'
import { Plugin, PluginManager } from '../core/plugin/PluginManager'

interface PluginState {
  plugin: Plugin | null
  isReady: boolean
  error: Error | null
}

export function usePlugin(pluginName: string): PluginState {
  const [state, setState] = useState<PluginState>({
    plugin: null,
    isReady: false,
    error: null
  })

  useEffect(() => {
    const manager = PluginManager.getInstance()
    const plugin = manager.getPlugin(pluginName)

    if (!plugin) {
      setState({
        plugin: null,
        isReady: false,
        error: new Error(`Plugin ${pluginName} not found`)
      })
      return
    }

    if (manager.isInitialized(pluginName)) {
      setState({
        plugin: plugin,
        isReady: true,
        error: null
      })
      return
    }

    async function initializePlugin() {
      try {
        await manager.initializePlugin(pluginName)
        const initializedPlugin = manager.getPlugin(pluginName)
        setState({
          plugin: initializedPlugin || null,
          isReady: true,
          error: null
        })
      } catch (error) {
        setState({
          plugin: null,
          isReady: false,
          error: error as Error
        })
      }
    }

    initializePlugin()
  }, [pluginName])

  return state
}

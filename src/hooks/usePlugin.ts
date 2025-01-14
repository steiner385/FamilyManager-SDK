import { useEffect, useState } from 'react'
import { Plugin } from '../types/plugin'
import { PluginManager } from '../core/plugin/PluginManager'

interface PluginHookState {
  plugin: Plugin | null
  isReady: boolean
  error: Error | null
}

export function usePlugin(pluginName: string): PluginHookState {
  const [state, setState] = useState<PluginHookState>({
    plugin: null,
    isReady: false,
    error: null
  })

  useEffect(() => {
    const manager = PluginManager.getInstance()
    
    async function initializePlugin() {
      try {
        const plugin = manager.getPlugin(pluginName)
        
        if (!plugin) {
          setState({
            plugin: null,
            isReady: false,
            error: new Error(`Plugin ${pluginName} not found`)
          })
          return
        }

        if (!manager.isInitialized(pluginName)) {
          await manager.initializePlugin(pluginName)
        }

        setState({
          plugin,
          isReady: true,
          error: null
        })
      } catch (error) {
        setState({
          plugin: null,
          isReady: false,
          error: error instanceof Error ? error : new Error('Failed to initialize plugin')
        })
      }
    }

    initializePlugin()
  }, [pluginName])

  return state
}

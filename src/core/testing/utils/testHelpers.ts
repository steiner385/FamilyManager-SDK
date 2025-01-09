import { ComponentType } from 'react'
import { Plugin } from '../../plugin/PluginManager'

interface MockPluginOptions {
  name: string
  version: string
  components?: Record<string, ComponentType>
  theme?: {
    colors?: Record<string, string>
    [key: string]: any
  }
  dependencies?: string[]
}

export function createMockPlugin(options: MockPluginOptions): Plugin {
  return {
    config: {
      name: options.name,
      version: options.version,
      dependencies: options.dependencies
    },
    async initialize() {
      // Register components if provided
      if (options.components) {
        const ComponentRegistry = (await import('../../registry/ComponentRegistry')).ComponentRegistry
        const registry = ComponentRegistry.getInstance()
        
        Object.entries(options.components).forEach(([name, component]) => {
          registry.register(name, component)
        })
      }

      // Apply theme if provided
      if (options.theme) {
        const ThemeManager = (await import('../../theme/ThemeManager')).ThemeManager
        const themeManager = ThemeManager.getInstance()
        themeManager.extendTheme(options.theme)
      }
    }
  }
}

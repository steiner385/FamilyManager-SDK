import { PluginManager } from '../../plugin/PluginManager'
import { ComponentRegistry } from '../../registry/ComponentRegistry'
import { ThemeManager } from '../../theme/ThemeManager'
import { createMockPlugin } from '../../testing/utils/testHelpers'
import { Theme } from '../../../types/base'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach } from '@jest/globals'

describe('Plugin System Integration', () => {
  let pluginManager: PluginManager
  let componentRegistry: ComponentRegistry
  let themeManager: ThemeManager

  beforeEach(() => {
    // Reset all singletons
    // @ts-ignore
    PluginManager.instance = null
    // @ts-ignore
    ComponentRegistry.instance = null
    // @ts-ignore
    ThemeManager.instance = null

pluginManager = PluginManager.getInstance()
pluginManager.initialize()
componentRegistry = ComponentRegistry.getInstance()
    themeManager = ThemeManager.getInstance()
  })

  it('handles complete plugin lifecycle', async () => {
    // Create test plugin with components and theme
    const mockPlugin = createMockPlugin({
      name: 'test-plugin',
      version: '1.0.0',
      components: {
        TestComponent: () => null
      },
      theme: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff',
          text: '#000000',
          custom: '#ff0000'
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          fontSize: {
            small: '12px',
            medium: '16px',
            large: '20px'
          }
        },
        spacing: {
          small: '8px',
          medium: '16px',
          large: '24px'
        }
      } satisfies Theme
    })

await pluginManager.registerPlugin(mockPlugin)
    const pluginId = `mock-${mockPlugin.name}`
    expect(pluginManager.isPluginInstalled(pluginId)).toBe(true)

    // Initialize plugin
    await pluginManager.initializePlugin(pluginId)
    expect(pluginManager.isInitialized(pluginId)).toBe(true)

    // Verify components are registered
    expect(componentRegistry.get('TestComponent')).toBeTruthy()

    // Verify theme is applied
    const currentTheme = themeManager.getCurrentTheme()
    expect(currentTheme.colors?.custom).toBe('#ff0000')

    // Uninstall plugin
    await pluginManager.uninstallPlugin(pluginId)
    expect(pluginManager.isPluginInstalled(pluginId)).toBe(false)
  })

  it('handles plugin dependencies correctly', async () => {
    const dependencyPlugin = createMockPlugin({
      name: 'dependency-plugin',
      version: '1.0.0'
    })

    const mainPlugin = createMockPlugin({
      name: 'main-plugin',
      version: '1.0.0',
      dependencies: ['dependency-plugin']
    })

    const depId = `mock-${dependencyPlugin.name}`
    const mainId = `mock-${mainPlugin.name}`

    await pluginManager.registerPlugin(dependencyPlugin)
    await pluginManager.initializePlugin(depId)

    await pluginManager.registerPlugin(mainPlugin)
    await pluginManager.initializePlugin(mainId)

    expect(pluginManager.isInitialized(mainId)).toBe(true)
  })
})

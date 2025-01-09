import { PluginManager } from '../../plugin/PluginManager'
import { ComponentRegistry } from '../../registry/ComponentRegistry'
import { ThemeManager } from '../../theme/ThemeManager'
import { createMockPlugin } from '../../testing/utils/testHelpers'

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
          custom: '#ff0000'
        }
      }
    })

    // Install plugin
    await pluginManager.installPlugin(mockPlugin)
    expect(pluginManager.isPluginInstalled('test-plugin')).toBe(true)

    // Initialize plugin
    await pluginManager.initializePlugin('test-plugin')
    expect(pluginManager.isInitialized('test-plugin')).toBe(true)

    // Verify components are registered
    expect(componentRegistry.get('TestComponent')).toBeTruthy()

    // Verify theme is applied
    const currentTheme = themeManager.getCurrentTheme()
    expect(currentTheme.colors?.custom).toBe('#ff0000')

    // Uninstall plugin
    await pluginManager.uninstallPlugin('test-plugin')
    expect(pluginManager.isPluginInstalled('test-plugin')).toBe(false)
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

    // Install dependency first
    await pluginManager.installPlugin(dependencyPlugin)
    await pluginManager.initializePlugin('dependency-plugin')

    // Install main plugin
    await pluginManager.installPlugin(mainPlugin)
    await pluginManager.initializePlugin('main-plugin')

    expect(pluginManager.isInitialized('main-plugin')).toBe(true)
  })
})

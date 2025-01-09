import { PluginManager, Plugin } from '../PluginManager'
import { createMockPlugin } from '../../testing/utils/testHelpers'

describe('PluginManager', () => {
  let manager: PluginManager

  beforeEach(() => {
    // Reset singleton instance
    // @ts-ignore - accessing private property for testing
    PluginManager.instance = null
    manager = PluginManager.getInstance()
  })

  describe('singleton', () => {
    it('maintains singleton instance', () => {
      const instance1 = PluginManager.getInstance()
      const instance2 = PluginManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('installPlugin', () => {
    const mockPlugin = createMockPlugin({
      name: 'test-plugin',
      version: '1.0.0'
    })

    it('installs plugin successfully', async () => {
      await manager.installPlugin(mockPlugin)
      expect(manager.isPluginInstalled('test-plugin')).toBe(true)
    })

    it('prevents duplicate installation', async () => {
      await manager.installPlugin(mockPlugin)
      await expect(manager.installPlugin(mockPlugin)).rejects.toThrow(
        'Plugin test-plugin is already installed'
      )
    })

    it('validates dependencies before installation', async () => {
      const pluginWithDeps = createMockPlugin({
        name: 'dependent-plugin',
        version: '1.0.0',
        dependencies: ['missing-plugin']
      })

      await expect(manager.installPlugin(pluginWithDeps)).rejects.toThrow(
        'Missing dependency: missing-plugin'
      )
    })
  })

  describe('initializePlugin', () => {
    const mockPlugin = createMockPlugin({
      name: 'test-plugin',
      version: '1.0.0'
    })

    beforeEach(async () => {
      await manager.installPlugin(mockPlugin)
    })

    it('initializes plugin successfully', async () => {
      await manager.initializePlugin('test-plugin')
      expect(manager.isInitialized('test-plugin')).toBe(true)
    })

    it('prevents duplicate initialization', async () => {
      await manager.initializePlugin('test-plugin')
      await manager.initializePlugin('test-plugin') // Should not throw
      expect(manager.isInitialized('test-plugin')).toBe(true)
    })

    it('throws error for non-existent plugin', async () => {
      await expect(manager.initializePlugin('non-existent')).rejects.toThrow(
        'Plugin non-existent not found'
      )
    })
  })

  describe('uninstallPlugin', () => {
    const mockPlugin = createMockPlugin({
      name: 'test-plugin',
      version: '1.0.0'
    })

    beforeEach(async () => {
      await manager.installPlugin(mockPlugin)
      await manager.initializePlugin('test-plugin')
    })

    it('uninstalls plugin successfully', async () => {
      await manager.uninstallPlugin('test-plugin')
      expect(manager.isPluginInstalled('test-plugin')).toBe(false)
      expect(manager.isInitialized('test-plugin')).toBe(false)
    })

    it('handles non-existent plugin gracefully', async () => {
      await manager.uninstallPlugin('non-existent') // Should not throw
    })
  })

  describe('dependency management', () => {
    it('detects circular dependencies', () => {
      const pluginA = createMockPlugin({
        name: 'plugin-a',
        version: '1.0.0',
        dependencies: ['plugin-b']
      })

      const pluginB = createMockPlugin({
        name: 'plugin-b',
        version: '1.0.0',
        dependencies: ['plugin-a']
      })

      // No plugins installed yet
      expect(manager.hasCircularDependency('plugin-a')).toBe(false)

      // Install plugins with circular dependency
      manager['plugins'].set('plugin-a', pluginA)
      manager['plugins'].set('plugin-b', pluginB)
      expect(manager.hasCircularDependency('plugin-a')).toBe(true)
    })

    it('validates version compatibility', () => {
      expect(manager.isVersionCompatible('1.2.3', '1.2.0')).toBe(true)
      expect(manager.isVersionCompatible('1.2.3', '1.3.0')).toBe(false)
      expect(manager.isVersionCompatible('2.0.0', '1.0.0')).toBe(false)
    })
  })
})

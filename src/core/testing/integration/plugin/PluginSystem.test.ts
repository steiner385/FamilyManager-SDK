import { MockPlugin, DependentMockPlugin, createMockPluginContext } from '../../plugin-helpers';
import { PluginManager } from '../../../../core/plugin/PluginManager';
import { pluginRegistry } from '../../../../core/plugin/registry';
import { EventBus } from '../../../../core/events/EventBus';

describe('Plugin System Integration', () => {
  let eventBus: EventBus;
  let pluginManager: PluginManager;
  let context: ReturnType<typeof createMockPluginContext>;

  beforeEach(async () => {
    eventBus = EventBus.getInstance();
    await eventBus.start();
    eventBus.registerChannel('plugin');
    pluginManager = PluginManager.getInstance();
    context = createMockPluginContext();
    pluginManager.initialize(context);
    pluginRegistry.clear();
  });

  afterEach(async () => {
    const plugins = pluginRegistry.getAll();
    for (const plugin of plugins.slice().reverse()) {
      await pluginManager.unregisterPlugin(plugin.metadata.name);
    }
    await eventBus.stop();
  });

  it('should handle plugin lifecycle', async () => {
    const mockPlugin = new MockPlugin();
    
    // Registration
    await pluginManager.registerPlugin(mockPlugin);
    expect(pluginRegistry.hasPlugin('mock-plugin')).toBe(true);
    expect(mockPlugin.initializeCalled).toBe(true);

    // Dependency resolution
    const dependentPlugin = new DependentMockPlugin();
    await pluginManager.registerPlugin(dependentPlugin);
    expect(pluginRegistry.hasPlugin('dependent-mock-plugin')).toBe(true);

    // Unregistration (in reverse dependency order)
    await pluginManager.unregisterPlugin('dependent-mock-plugin');
    await pluginManager.unregisterPlugin('mock-plugin');
    expect(pluginRegistry.hasPlugin('mock-plugin')).toBe(false);
    expect(mockPlugin.teardownCalled).toBe(true);
  });

  it('should prevent unregistering plugins with dependents', async () => {
    const mockPlugin = new MockPlugin();
    const dependentPlugin = new DependentMockPlugin();

    await pluginManager.registerPlugin(mockPlugin);
    await pluginManager.registerPlugin(dependentPlugin);

    // Should fail to unregister plugin with dependents
    await expect(pluginManager.unregisterPlugin('mock-plugin'))
      .rejects
      .toThrow('Cannot unregister mock-plugin: dependent-mock-plugin depends on it');

    // Should succeed after dependent is unregistered
    await pluginManager.unregisterPlugin('dependent-mock-plugin');
    await expect(pluginManager.unregisterPlugin('mock-plugin')).resolves.not.toThrow();
  });
});

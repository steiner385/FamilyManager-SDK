import { MockPlugin, DependentMockPlugin, createMockPluginContext } from '../../plugin-helpers';
import { pluginRegistry } from '../../../../src/core/plugin/registry';
import { PluginContext, PluginStatus, PluginMetadata } from '../../../../src/core/plugin/types';
import { BasePlugin } from '../../../../src/core/plugin/base';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('BasePlugin', () => {
  let mockPlugin: MockPlugin;
  let context: PluginContext;

  beforeEach(() => {
    mockPlugin = new MockPlugin();
    context = createMockPluginContext();
    pluginRegistry.clear();
    // Register the plugin before testing
    pluginRegistry.register(mockPlugin);
  });

  afterEach(() => {
    pluginRegistry.clear();
  });

  it('should initialize successfully', async () => {
    await mockPlugin.initialize(context);
    expect(mockPlugin.initializeCalled).toBe(true);
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
  });

  it('should teardown successfully', async () => {
    await mockPlugin.initialize(context);
    await mockPlugin.teardown();
    expect(mockPlugin.teardownCalled).toBe(true);
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.DISABLED);
  });

  it('should validate dependencies', async () => {
    const dependentPlugin = new DependentMockPlugin();
    // Register dependent plugin but not its dependency
    pluginRegistry.clear(); // Clear previous registrations
    pluginRegistry.register(dependentPlugin);
    
    // Should fail without required dependency
    await expect(dependentPlugin.initialize(context))
      .rejects
      .toThrow('Required dependency not found: mock-plugin');

    // Should succeed with required dependency
    pluginRegistry.register(mockPlugin);
    await mockPlugin.initialize(context);
    await expect(dependentPlugin.initialize(context)).resolves.not.toThrow();
  });

  it('should handle initialization errors', async () => {
    class ErrorPlugin extends BasePlugin {
      constructor() {
        const metadata: PluginMetadata = {
          id: 'error-plugin',
          name: 'error-plugin',
          version: '1.0.0',
          description: 'Plugin that throws on initialization'
        };
        super('error-plugin', 'error-plugin', '1.0.0', 'Plugin that throws on initialization', metadata);
      }

      protected async onInitialize(): Promise<void> {
        throw new Error('Initialization error');
      }

      protected async onTeardown(): Promise<void> {
        // Empty implementation
      }
    }

    const errorPlugin = new ErrorPlugin();
    pluginRegistry.clear(); // Clear previous registrations
    pluginRegistry.register(errorPlugin);
    await expect(errorPlugin.initialize(context))
      .rejects
      .toThrow('Initialization error');
  });

  it('should handle lifecycle events', async () => {
    // Initialize
    await mockPlugin.initialize(context);
    expect(mockPlugin.initializeCalled).toBe(true);
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);

    // Start
    await mockPlugin.start();
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.ACTIVE);

    // Stop
    await mockPlugin.stop();
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);

    // Teardown
    await mockPlugin.teardown();
    expect(mockPlugin.teardownCalled).toBe(true);
    expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.DISABLED);
  });

  it('should prevent multiple initializations', async () => {
    await mockPlugin.initialize(context);
    await expect(mockPlugin.initialize(context))
      .rejects
      .toThrow('Plugin mock-plugin already initialized');
  });

  it('should prevent starting without initialization', async () => {
    await expect(mockPlugin.start())
      .rejects
      .toThrow('Plugin must be initialized before starting');
  });
});

import { pluginRegistry } from '../../../../src/core/plugin/registry';
import { MockPlugin } from '../../plugin-helpers';
import { PluginStatus } from '../../../../src/core/plugin/types';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('PluginRegistry', () => {
  let mockPlugin: MockPlugin;

  beforeEach(() => {
    mockPlugin = new MockPlugin();
    pluginRegistry.clear();
  });

  it('should register a plugin', () => {
    pluginRegistry.register(mockPlugin);
    expect(pluginRegistry.getPlugin('mock-plugin')).toBe(mockPlugin);
  });

  it('should prevent duplicate registration', () => {
    pluginRegistry.register(mockPlugin);
    expect(() => pluginRegistry.register(mockPlugin))
      .toThrow('Plugin mock-plugin is already registered');
  });

  it('should unregister a plugin', () => {
    pluginRegistry.register(mockPlugin);
    pluginRegistry.unregister('mock-plugin');
    expect(pluginRegistry.getPlugin('mock-plugin')).toBeUndefined();
  });

  it('should list all plugins', () => {
    pluginRegistry.register(mockPlugin);
    const plugins = pluginRegistry.getAllPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0]).toBe(mockPlugin);
  });

  it('should check plugin existence', () => {
    expect(pluginRegistry.getPlugin('mock-plugin')).toBeUndefined();
    pluginRegistry.register(mockPlugin);
    expect(pluginRegistry.getPlugin('mock-plugin')).toBeDefined();
  });

  it('should clear all plugins', () => {
    pluginRegistry.register(mockPlugin);
    pluginRegistry.clear();
    expect(pluginRegistry.getAllPlugins()).toHaveLength(0);
  });

  it('should track plugin state', () => {
    pluginRegistry.register(mockPlugin);
    expect(pluginRegistry.getPluginState('mock-plugin')).toBe(PluginStatus.INACTIVE);
    pluginRegistry.setPluginState('mock-plugin', PluginStatus.ACTIVE);
    expect(pluginRegistry.getPluginState('mock-plugin')).toBe(PluginStatus.ACTIVE);
  });

  it('should get active plugins', () => {
    pluginRegistry.register(mockPlugin);
    expect(pluginRegistry.getActivePlugins()).toHaveLength(0);
    pluginRegistry.setPluginState('mock-plugin', PluginStatus.ACTIVE);
    expect(pluginRegistry.getActivePlugins()).toHaveLength(1);
  });
});

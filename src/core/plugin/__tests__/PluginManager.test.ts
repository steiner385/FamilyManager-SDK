import React from 'react';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PluginManager } from '../PluginManager';
import { Plugin, PluginRoute } from '../types';
import { logger } from '../../utils/logger';
import { routeRegistry } from '../../routing/RouteRegistry';

// Mock dependencies
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('../../routing/RouteRegistry', () => ({
  routeRegistry: {
    registerRoute: jest.fn(),
    unregisterRoute: jest.fn(),
  },
}));

describe('PluginManager', () => {
  let manager: PluginManager;
  const TestComponent = React.createElement('div');

  beforeEach(() => {
    // Reset singleton instance
    PluginManager.resetInstance();
    manager = PluginManager.getInstance();
    manager.clearPlugins();
    jest.clearAllMocks();
  });

  it('should maintain singleton instance', () => {
    const instance1 = PluginManager.getInstance();
    const instance2 = PluginManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('Initialization', () => {
    it('should initialize correctly', () => {
      manager.initialize();
      expect(logger.debug).toHaveBeenCalledWith('PluginManager initialized');
    });

    it('should handle multiple initialization attempts', () => {
      manager.initialize();
      manager.initialize();
      expect(logger.warn).toHaveBeenCalledWith('PluginManager already initialized');
    });

    it('should prevent plugin operations before initialization', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await expect(manager.registerPlugin(plugin)).rejects.toThrow(
        'PluginManager must be initialized before registering plugins'
      );
    });
  });

  describe('Plugin Registration', () => {
    beforeEach(() => {
      manager.initialize();
    });

    it('should register a plugin', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      expect(manager.isPluginInstalled('test-plugin')).toBe(true);
      expect(manager.isPluginActive('test-plugin')).toBe(false);
      expect(logger.info).toHaveBeenCalledWith('Registered plugin: Test Plugin (test-plugin)');
    });

    it('should prevent duplicate plugin registration', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      await expect(manager.registerPlugin(plugin)).rejects.toThrow(
        'Plugin test-plugin is already registered'
      );
    });

    it('should handle plugin dependencies', async () => {
      const dependency: Plugin = {
        id: 'dependency',
        name: 'Dependency',
        version: '1.0.0',
      };

      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        dependencies: ['dependency'],
      };

      await expect(manager.registerPlugin(plugin)).rejects.toThrow(
        'Missing required dependency: dependency'
      );

      await manager.registerPlugin(dependency);
      await manager.registerPlugin(plugin);

      expect(manager.isPluginInstalled('test-plugin')).toBe(true);
    });

    it('should register plugin routes', async () => {
      const route: PluginRoute = {
        path: '/test',
        component: TestComponent,
      };

      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        routes: [route],
      };

      await manager.registerPlugin(plugin);
      expect(routeRegistry.registerRoute).toHaveBeenCalledWith('test-plugin', route);
    });

    it('should handle plugin initialization', async () => {
      const initialize = jest.fn().mockImplementation(() => Promise.resolve()) as () => Promise<void>;
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        initialize,
      };

      await manager.registerPlugin(plugin);
      expect(initialize).not.toHaveBeenCalled();
      await manager.initializePlugin('test-plugin');
      expect(initialize).toHaveBeenCalled();
    });
  });

  describe('Plugin Unregistration', () => {
    beforeEach(() => {
      manager.initialize();
    });

    it('should uninstall a plugin', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      await manager.uninstallPlugin('test-plugin');

      expect(manager.isPluginInstalled('test-plugin')).toBe(false);
      expect(manager.isPluginActive('test-plugin')).toBe(false);
      expect(logger.info).toHaveBeenCalledWith('Unregistered plugin: test-plugin');
    });

    it('should prevent uninstalling non-existent plugin', async () => {
      await expect(manager.uninstallPlugin('non-existent')).rejects.toThrow(
        'Plugin non-existent is not registered'
      );
    });

    it('should prevent uninstalling plugin with dependents', async () => {
      const dependency: Plugin = {
        id: 'dependency',
        name: 'Dependency',
        version: '1.0.0',
      };

      const dependent: Plugin = {
        id: 'dependent',
        name: 'Dependent',
        version: '1.0.0',
        dependencies: ['dependency'],
      };

      await manager.registerPlugin(dependency);
      await manager.registerPlugin(dependent);

      await expect(manager.uninstallPlugin('dependency')).rejects.toThrow(
        'Cannot unregister plugin dependency because it is required by dependent'
      );
    });

    it('should handle plugin teardown', async () => {
      const teardown = jest.fn().mockImplementation(() => Promise.resolve()) as () => Promise<void>;
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        teardown,
      };

      await manager.registerPlugin(plugin);
      await manager.uninstallPlugin('test-plugin');

      expect(teardown).toHaveBeenCalled();
    });

    it('should unregister plugin routes', async () => {
      const route: PluginRoute = {
        path: '/test',
        component: TestComponent,
      };

      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        routes: [route],
      };

      await manager.registerPlugin(plugin);
      await manager.uninstallPlugin('test-plugin');

      expect(routeRegistry.unregisterRoute).toHaveBeenCalledWith('test-plugin', route);
    });
  });

  describe('Plugin State Management', () => {
    beforeEach(() => {
      manager.initialize();
    });

    it('should track plugin installation state', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      expect(manager.isPluginInstalled('test-plugin')).toBe(false);
      await manager.registerPlugin(plugin);
      expect(manager.isPluginInstalled('test-plugin')).toBe(true);
    });

    it('should track plugin active state', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      expect(manager.isPluginActive('test-plugin')).toBe(false);
      await manager.initializePlugin('test-plugin');
      expect(manager.isPluginActive('test-plugin')).toBe(true);
    });

    it('should handle plugin initialization state', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      await manager.initializePlugin('test-plugin');
      await manager.initializePlugin('test-plugin');
      await manager.initializePlugin('test-plugin');
      expect(logger.warn).toHaveBeenCalledWith('Plugin test-plugin is already initialized');
    });
  });

  describe('Plugin Information', () => {
    beforeEach(() => {
      manager.initialize();
    });

    it('should get plugin by id', async () => {
      const plugin: Plugin = {
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      };

      await manager.registerPlugin(plugin);
      const retrieved = manager.getPlugin('test-plugin');
      expect(retrieved).toEqual(plugin);
    });

    it('should get all plugins', async () => {
      const plugins: Plugin[] = [
        { id: 'plugin1', name: 'Plugin 1', version: '1.0.0' },
        { id: 'plugin2', name: 'Plugin 2', version: '1.0.0' },
        { id: 'plugin3', name: 'Plugin 3', version: '1.0.0' },
      ];

      for (const plugin of plugins) {
        await manager.registerPlugin(plugin);
      }

      const allPlugins = manager.getAllPlugins();
      expect(allPlugins).toHaveLength(plugins.length);
      expect(allPlugins).toEqual(expect.arrayContaining(plugins));
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      manager.initialize();
    });

    it('should clear all plugins', async () => {
      const plugins: Plugin[] = [
        { id: 'plugin1', name: 'Plugin 1', version: '1.0.0' },
        { id: 'plugin2', name: 'Plugin 2', version: '1.0.0' },
      ];

      for (const plugin of plugins) {
        await manager.registerPlugin(plugin);
      }

      manager.clearPlugins();
      expect(manager.getAllPlugins()).toHaveLength(0);
      expect(logger.debug).toHaveBeenCalledWith('Cleared all plugins');
    });
  });
});

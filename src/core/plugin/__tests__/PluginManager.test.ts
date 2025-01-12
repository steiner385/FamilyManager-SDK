import { PluginManager } from '../PluginManager';
import { Plugin, PluginContext, PluginRegistry } from '../types';
import { EventBus } from '../../events/EventBus';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

describe('PluginManager', () => {
  let pluginManager: PluginManager;
  let mockContext: PluginContext;
  
  beforeEach(() => {
    const app = new Hono();
    const prisma = {} as PrismaClient; // Mock prisma
    const eventBus = EventBus.getInstance();
    
    mockContext = {
      app,
      prisma,
      plugins: {} as PluginRegistry,
      config: {
        env: 'test'
      }
    };
    
    // Reset the singleton instances
    (PluginManager as any).instance = undefined;
    pluginManager = PluginManager.getInstance();
    pluginManager.clearPlugins(); // Clear any existing plugins
    pluginManager.initialize(mockContext);
  });

  describe('registerPlugin', () => {
    it('should register a valid plugin', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
          description: 'Test plugin'
        },
        initialize: jest.fn().mockResolvedValue(undefined)
      };

      await expect(pluginManager.registerPlugin(mockPlugin))
        .resolves.toBeUndefined();
      
      expect(mockPlugin.initialize).toHaveBeenCalledWith(mockContext);
      expect(pluginManager.getPlugin('test-plugin')).toBe(mockPlugin);
    });

    it('should throw error when registering duplicate plugin', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
          description: 'Test plugin'
        },
        initialize: jest.fn().mockResolvedValue(undefined)
      };

      await pluginManager.registerPlugin(mockPlugin);

      await expect(pluginManager.registerPlugin(mockPlugin))
        .rejects.toThrow('Plugin test-plugin is already registered');
    });

    it('should throw error when dependencies are missing', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'dependent-plugin',
          version: '1.0.0',
          description: 'Plugin with dependencies',
          dependencies: ['missing-plugin']
        },
        initialize: jest.fn()
      };

      await expect(pluginManager.registerPlugin(mockPlugin))
        .rejects.toThrow('Missing required dependency: missing-plugin');
    });
  });

  describe('unregisterPlugin', () => {
    it('should unregister an existing plugin', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'test-plugin-unregister',
          version: '1.0.0',
          description: 'Test plugin'
        },
        initialize: jest.fn().mockResolvedValue(undefined),
        teardown: jest.fn().mockResolvedValue(undefined)
      };

      await pluginManager.registerPlugin(mockPlugin);
      await pluginManager.unregisterPlugin('test-plugin-unregister');

      expect(mockPlugin.teardown).toHaveBeenCalled();
      expect(pluginManager.getPlugin('test-plugin-unregister')).toBeUndefined();
    });

    it('should throw error when unregistering non-existent plugin', async () => {
      await expect(pluginManager.unregisterPlugin('non-existent'))
        .rejects.toThrow('Plugin non-existent is not registered');
    });

    it('should throw error when plugin has dependents', async () => {
      const basePlugin: Plugin = {
        metadata: {
          name: 'base-plugin',
          version: '1.0.0',
          description: 'Base plugin'
        },
        initialize: jest.fn()
      };

      const dependentPlugin: Plugin = {
        metadata: {
          name: 'dependent-plugin',
          version: '1.0.0',
          description: 'Dependent plugin',
          dependencies: ['base-plugin']
        },
        initialize: jest.fn()
      };

      await pluginManager.registerPlugin(basePlugin);
      await pluginManager.registerPlugin(dependentPlugin);

      await expect(pluginManager.unregisterPlugin('base-plugin'))
        .rejects.toThrow('Cannot unregister base-plugin: dependent-plugin depends on it');
    });
  });

  describe('getAllPlugins', () => {
    it('should return all registered plugins', async () => {
      // Clear any existing plugins first
      (pluginManager as any).clearPlugins();
      
      const plugins = [
        {
          metadata: {
            name: 'plugin-1',
            version: '1.0.0',
            description: 'Plugin 1'
          },
          initialize: jest.fn()
        },
        {
          metadata: {
            name: 'plugin-2',
            version: '1.0.0',
            description: 'Plugin 2'
          },
          initialize: jest.fn()
        }
      ];

      await Promise.all(plugins.map(p => pluginManager.registerPlugin(p)));
      
      const allPlugins = pluginManager.getAllPlugins();
      expect(allPlugins).toHaveLength(2);
      expect(allPlugins).toContain(plugins[0]);
      expect(allPlugins).toContain(plugins[1]);
    });
  });
});

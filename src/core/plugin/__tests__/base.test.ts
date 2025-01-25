import { BasePlugin } from '../base';
import { EventBus } from '../../events/EventBus';
import { Logger } from '../../logging/Logger';
import { PluginContext, PluginMetadata, PluginStatus, Plugin } from '../types';
import { Event } from '../../events/types';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { PluginRegistry } from '../registry';

// Mock logger
jest.mock('../../logging/Logger', () => ({
  Logger: {
    getInstance: jest.fn()
  }
}));

// Mock EventBus
jest.mock('../../events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn()
  }
}));

// Mock PluginRegistry
jest.mock('../registry', () => {
  const mockRegistry = {
    register: jest.fn(),
    unregister: jest.fn(),
    getPlugin: jest.fn() as jest.MockedFunction<(id: string) => Plugin | undefined>,
    getPluginState: jest.fn() as jest.MockedFunction<(id: string) => PluginStatus | undefined>,
    setPluginState: jest.fn() as jest.MockedFunction<(id: string, state: PluginStatus) => void>,
    getAllPlugins: jest.fn() as jest.MockedFunction<() => Plugin[]>,
    getActivePlugins: jest.fn() as jest.MockedFunction<() => Plugin[]>,
    clear: jest.fn()
  };

  return {
    PluginRegistry: {
      getInstance: jest.fn().mockReturnValue(mockRegistry)
    },
    pluginRegistry: mockRegistry
  };
});

// Get mock instances
const mockPluginRegistry = (PluginRegistry.getInstance() as jest.MockedObject<PluginRegistry>);

// Create a proper mock Logger instance
const mockLoggerInstance = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn() as jest.MockedFunction<(message: string, meta?: Record<string, unknown>) => void>,
  error: jest.fn(),
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn()
  },
  safeLog: jest.fn(),
  setLogger: jest.fn()
} as unknown as Logger;

// Create a proper mock EventBus instance
const mockEventBusInstance = {
  subscribers: new Map(),
  stats: {
    totalEvents: 0,
    eventsPerSecond: 0,
    lastEventTimestamp: Date.now()
  },
  history: [],
  startTime: Date.now(),
  subscribe: jest.fn().mockImplementation(async () => {}),
  publish: jest.fn().mockImplementation(async () => {}),
  getStats: jest.fn().mockReturnValue({ totalEvents: 0, eventsPerSecond: 0, lastEventTimestamp: Date.now() }),
  clearHistory: jest.fn(),
  getHistory: jest.fn().mockReturnValue([]),
  stop: jest.fn().mockImplementation(async () => {})
} as unknown as EventBus;

// Set up mock returns
(Logger.getInstance as jest.Mock).mockReturnValue(mockLoggerInstance);
(EventBus.getInstance as jest.Mock).mockReturnValue(mockEventBusInstance);

class TestPlugin extends BasePlugin {
  protected async onInitialize(context: PluginContext): Promise<void> {
    // Test implementation
  }
}

describe('BasePlugin', () => {
  let plugin: TestPlugin;
  let mockContext: PluginContext;
  const mockMetadata: PluginMetadata = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'Test plugin',
    author: 'Test Author'
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset mock registry state
    mockPluginRegistry.getPluginState.mockReturnValue(PluginStatus.INACTIVE);
    mockPluginRegistry.getPlugin.mockImplementation((id: string): Plugin | undefined => {
      if (id === 'test-plugin') return plugin;
      if (id === 'test-dependency') return {
        id: 'test-dependency',
        name: 'Test Dependency',
        version: '1.0.0',
        metadata: {
          id: 'test-dependency',
          name: 'Test Dependency',
          version: '1.0.0'
        }
      } as Plugin;
      if (id === 'optional-dep') return {
        id: 'optional-dep',
        name: 'Optional Dependency',
        version: '1.0.0',
        metadata: {
          id: 'optional-dep',
          name: 'Optional Dependency',
          version: '1.0.0'
        }
      } as Plugin;
      return undefined;
    });

    // Create plugin instance
    plugin = new TestPlugin(
      'test-plugin',
      'Test Plugin',
      '1.0.0',
      'Test plugin for unit tests',
      mockMetadata
    );

    // Create mock context
    mockContext = {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      config: {
        name: 'Test Plugin',
        version: '1.0.0',
        description: 'Test plugin'
      },
      metadata: mockMetadata,
      logger: mockLoggerInstance,
      events: mockEventBusInstance,
      plugins: {
        hasPlugin: (id: string): boolean => mockPluginRegistry.getPlugin(id) !== undefined,
        getPlugin: (id: string): Plugin | undefined => mockPluginRegistry.getPlugin(id),
        getPluginState: (id: string): PluginStatus | undefined => mockPluginRegistry.getPluginState(id)
      }
    };
  });

  describe('initialization', () => {
    it('should initialize plugin successfully', async () => {
      await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
      expect(plugin['initialized']).toBe(true);
      expect(mockPluginRegistry.setPluginState).toHaveBeenCalledWith(plugin.id, PluginStatus.INACTIVE);
    });

    it('should handle dependencies', async () => {
      mockMetadata.dependencies = {
        'test-dependency': '1.0.0'
      };

      await plugin.initialize(mockContext);
      expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
        'Validating dependency: test-dependency (1.0.0)'
      );
    });

    it('should handle optional dependencies', async () => {
      // Create a new metadata without required dependencies
      const testMetadata = { ...mockMetadata };
      delete testMetadata.dependencies;
      testMetadata.optionalDependencies = {
        'optional-dep': '1.0.0'
      };

      // Create a new plugin instance with the test metadata
      const testPlugin = new TestPlugin(
        'test-plugin',
        'Test Plugin',
        '1.0.0',
        'Test plugin for unit tests',
        testMetadata
      );

      // Clear any previous mock calls
      jest.clearAllMocks();
      
      await testPlugin.initialize(mockContext);
      expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
        'Initializing optional dependency: optional-dep (1.0.0)'
      );
    });

    it('should prevent multiple initializations', async () => {
      await plugin.initialize(mockContext);
      await expect(plugin.initialize(mockContext))
        .rejects
        .toThrow('Plugin test-plugin already initialized');
    });
  });

  describe('lifecycle', () => {
    beforeEach(async () => {
      await plugin.initialize(mockContext);
    });

    it('should start plugin', async () => {
      await expect(plugin.start()).resolves.not.toThrow();
      expect(mockPluginRegistry.setPluginState).toHaveBeenCalledWith(plugin.id, PluginStatus.ACTIVE);
      expect(mockLoggerInstance.info).toHaveBeenCalledWith(
        'Plugin started: test-plugin'
      );
    });

    it('should prevent starting uninitialized plugin', async () => {
      const uninitializedPlugin = new TestPlugin(
        'uninitialized',
        'Uninitialized',
        '1.0.0',
        'Test plugin',
        { ...mockMetadata, id: 'uninitialized' }
      );
      await expect(uninitializedPlugin.start()).rejects.toThrow(
        'Plugin must be initialized before starting'
      );
    });

    it('should stop plugin', async () => {
      await plugin.start();
      await expect(plugin.stop()).resolves.not.toThrow();
      expect(mockPluginRegistry.setPluginState).toHaveBeenCalledWith(plugin.id, PluginStatus.INACTIVE);
      expect(mockLoggerInstance.info).toHaveBeenCalledWith(
        'Plugin stopped: test-plugin'
      );
    });

    it('should handle teardown', async () => {
      await plugin.start();
      await expect(plugin.teardown()).resolves.not.toThrow();
      expect(plugin['initialized']).toBe(false);
      expect(mockPluginRegistry.setPluginState).toHaveBeenCalledWith(plugin.id, PluginStatus.DISABLED);
      expect(mockLoggerInstance.info).toHaveBeenCalledWith(
        'Plugin torn down: test-plugin'
      );
    });

    it('should ignore stop when not initialized', async () => {
      const uninitializedPlugin = new TestPlugin(
        'uninitialized',
        'Uninitialized',
        '1.0.0',
        'Test plugin',
        { ...mockMetadata, id: 'uninitialized' }
      );
      // Clear any previous mock calls
      mockPluginRegistry.setPluginState.mockClear();
      await expect(uninitializedPlugin.stop()).resolves.not.toThrow();
      expect(mockPluginRegistry.setPluginState).not.toHaveBeenCalled();
    });

    it('should ignore teardown when not initialized', async () => {
      const uninitializedPlugin = new TestPlugin(
        'uninitialized',
        'Uninitialized',
        '1.0.0',
        'Test plugin',
        { ...mockMetadata, id: 'uninitialized' }
      );
      // Clear any previous mock calls
      mockPluginRegistry.setPluginState.mockClear();
      await expect(uninitializedPlugin.teardown()).resolves.not.toThrow();
      expect(mockPluginRegistry.setPluginState).not.toHaveBeenCalled();
    });
  });

  describe('metrics', () => {
    beforeEach(async () => {
      await plugin.initialize(mockContext);
      await plugin.start();
      mockPluginRegistry.getPluginState.mockReturnValue(PluginStatus.ACTIVE);
    });

    it('should return plugin metrics', async () => {
      const metrics = await plugin.getPluginMetrics('test-plugin');
      expect(metrics).toEqual({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
        status: PluginStatus.ACTIVE,
        uptime: expect.any(Number),
        memoryUsage: expect.any(Number),
        eventCount: 0,
        errorCount: 0
      });
    });

    it('should reflect current plugin state in metrics', async () => {
      await plugin.stop();
      mockPluginRegistry.getPluginState.mockReturnValue(PluginStatus.INACTIVE);
      const metrics = await plugin.getPluginMetrics('test-plugin');
      expect(metrics.status).toBe(PluginStatus.INACTIVE);
    });
  });
});

import { BasePlugin } from '../base';
import { EventBus } from '../../events/EventBus';
import { EventDeliveryStatus } from '../../events/types';
import { logger } from '../../utils/logger';
import { PluginContext, PluginMetadata } from '../types';
import type { Env } from 'hono/types';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('../../utils/logger');
jest.mock('../../events/EventBus');

class TestPlugin extends BasePlugin {
  readonly metadata: PluginMetadata = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin for unit tests',
    dependencies: [],
    optionalDependencies: []
  };

  protected async onInitialize(_context: PluginContext<Env>): Promise<void> {
    // Test initialization logic
  }

  protected async onTeardown(): Promise<void> {
    // Test teardown logic
  }
}

describe('BasePlugin', () => {
  let plugin: TestPlugin;
  let mockContext: PluginContext<Env>;
  let mockEventBus: DeepMockProxy<EventBus>;

  beforeAll(() => {
    mockEventBus = mockDeep<EventBus>();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.start.mockResolvedValue(undefined);
    mockEventBus.stop.mockResolvedValue(undefined);
    mockEventBus.restart.mockResolvedValue(undefined);
    mockEventBus.publish.mockResolvedValue({ status: EventDeliveryStatus.Success, errors: [] });
    mockEventBus.subscribe.mockImplementation(() => () => {});
    mockEventBus.unsubscribe.mockImplementation(() => {});
    mockEventBus.getChannels.mockReturnValue(['plugin']);
    mockEventBus.registerChannel.mockImplementation(() => {});

    // Set up the mock for EventBus.getInstance
    const EventBusMock = jest.requireMock('../../events/EventBus').EventBus;
    EventBusMock.getInstance = jest.fn().mockReturnValue(mockEventBus);
  });

  beforeEach(async () => {
    // Create new plugin instance
    plugin = new TestPlugin();
    
    // Create mock context
    mockContext = {
      logMetadata: {},
      plugins: {
        hasPlugin: jest.fn().mockReturnValue(true)
      }
    } as unknown as PluginContext<Env>;

    // Reset mock states
    jest.clearAllMocks();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.publish.mockResolvedValue({ status: EventDeliveryStatus.Success, errors: [] });

    // Reset EventBus mock
    const EventBusMock = jest.requireMock('../../events/EventBus').EventBus;
    EventBusMock.getInstance.mockReturnValue(mockEventBus);
  });

  afterEach(async () => {
    // Check if plugin exists and is initialized before teardown
    if (plugin && (plugin as any).initialized) {
      await plugin.teardown();
    }
  });

  describe('initialization', () => {
    it('should initialize plugin successfully', async () => {
      await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
      expect((plugin as any).initialized).toBe(true);
      expect(mockEventBus.publish).toHaveBeenCalledWith('plugin', expect.objectContaining({
        type: 'PLUGIN_INITIALIZED',
        source: 'test-plugin'
      }));
    });

    it('should fail initialization if required dependency is missing', async () => {
      plugin.metadata.dependencies = ['missing-plugin'];
      (mockContext.plugins.hasPlugin as jest.Mock).mockReturnValue(false);
      await expect(plugin.initialize(mockContext)).rejects.toThrow('Required dependency not found: missing-plugin');
    });

    it('should handle optional dependencies', async () => {
      plugin.metadata.optionalDependencies = ['optional-plugin'];
      (mockContext.plugins.hasPlugin as jest.Mock).mockReturnValue(false);
      await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Optional dependency not found: optional-plugin'),
        expect.any(Object)
      );
    });
  });

  describe('teardown', () => {
    it('should tear down plugin successfully', async () => {
      await plugin.initialize(mockContext);
      await expect(plugin.teardown()).resolves.not.toThrow();
      expect((plugin as any).initialized).toBe(false);
      expect(mockEventBus.publish).toHaveBeenCalledWith('plugin', expect.objectContaining({
        type: 'PLUGIN_TEARDOWN',
        source: 'test-plugin'
      }));
    });

    it('should handle teardown when not initialized', async () => {
      await expect(plugin.teardown()).resolves.not.toThrow();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle initialization errors', async () => {
      const error = new Error('Init error');
      jest.spyOn(plugin as any, 'onInitialize').mockRejectedValueOnce(error);
      await expect(plugin.initialize(mockContext)).rejects.toThrow(error);
      expect((plugin as any).initialized).toBe(false);
    });

    it('should handle teardown errors', async () => {
      await plugin.initialize(mockContext);
      const error = new Error('Teardown error');
      jest.spyOn(plugin as any, 'onTeardown').mockRejectedValueOnce(error);
      await expect(plugin.teardown()).rejects.toThrow(error);
    });

    it('should handle plugin errors', async () => {
      await plugin.initialize(mockContext);
      const error = new Error('Plugin error');
      await plugin.onError(error);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Plugin test-plugin error:'),
        expect.any(Object)
      );
    });
  });

  describe('dependency management', () => {
    it('should validate dependencies on initialization', async () => {
      plugin.metadata.dependencies = ['dep1', 'dep2'];
      await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
      expect(mockContext.plugins.hasPlugin).toHaveBeenCalledWith('dep1');
      expect(mockContext.plugins.hasPlugin).toHaveBeenCalledWith('dep2');
    });

    it('should handle dependency changes', async () => {
      await plugin.initialize(mockContext);
      await plugin.onDependencyChange('dep1');
      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Dependency dep1 changed'),
        expect.any(Object)
      );
    });
  });

  describe('validation', () => {
    it('should warn about missing optional dependencies', async () => {
      plugin.metadata.optionalDependencies = ['opt1', 'opt2'];
      (mockContext.plugins.hasPlugin as jest.Mock).mockReturnValue(false);
      await plugin.initialize(mockContext);
      expect(logger.warn).toHaveBeenCalledTimes(2);
    });

    it('should check initialization state', async () => {
      expect(() => (plugin as any).checkInitialized()).toThrow('Plugin test-plugin not initialized');
      await plugin.initialize(mockContext);
      expect(() => (plugin as any).checkInitialized()).not.toThrow();
      await plugin.teardown();
      expect(() => (plugin as any).checkInitialized()).toThrow('Plugin test-plugin not initialized');
    });
  });
});

import { BasePlugin } from '../base';
import { EventBus } from '../../events/EventBus';
import { EventDeliveryStatus } from '../../events/types';
import { logger } from '../../utils/logger';
import { PluginContext, PluginMetadata, PluginDependencyConfig } from '../types';
import type { Env } from 'hono/types';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { describe, it, expect, jest, beforeAll, beforeEach, afterEach } from '@jest/globals';

type HasPluginFn = (id: string) => boolean;

jest.mock('../../utils/logger');
jest.mock('../../events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn(),
  }
}));

class TestPlugin extends BasePlugin {
  readonly metadata: PluginMetadata = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin for unit tests',
    dependencies: {},
    optionalDependencies: {}
  };

  protected async onInitialize(_context: PluginContext<Env>): Promise<void> {
    // Test initialization logic
  }

  protected async onTeardown(): Promise<void> {
    // Test teardown logic
  }

  public async onError(error: Error): Promise<void> {
    this.logger.error(`Plugin ${this.metadata.id} error:`, { error });
  }

  public async onDependencyChange(dependencyId: string): Promise<void> {
    this.logger.debug(`Dependency ${dependencyId} changed`, { dependencyId });
  }

  protected checkInitialized(): void {
    if (!this.initialized) {
      throw new Error(`Plugin ${this.metadata.id} not initialized`);
    }
  }
}

describe('BasePlugin', () => {
  let plugin: TestPlugin;
  let mockContext: PluginContext<Env>;
  let mockEventBus: DeepMockProxy<EventBus>;
  let hasPluginMock: jest.MockedFunction<HasPluginFn>;

  beforeAll(() => {
    mockEventBus = mockDeep<EventBus>();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.start.mockResolvedValue(undefined);
    mockEventBus.stop.mockResolvedValue(undefined);
    mockEventBus.emit.mockImplementation(async (event) => {
      return EventDeliveryStatus.SUCCESS;
    });
    mockEventBus.subscribe.mockReturnValue('subscription-id');
    mockEventBus.unsubscribe.mockImplementation(() => {});
    mockEventBus.getChannels.mockReturnValue(['plugin']);
    mockEventBus.registerChannel.mockImplementation(() => {});

    // Set up the mock for EventBus.getInstance
    (EventBus.getInstance as jest.Mock).mockReturnValue(mockEventBus);
  });

  beforeEach(async () => {
    // Create new plugin instance
    plugin = new TestPlugin();
    
    // Create hasPlugin mock
    hasPluginMock = jest.fn().mockReturnValue(true) as jest.MockedFunction<HasPluginFn>;
    
    // Create mock context
    mockContext = {
      logMetadata: {},
      plugins: {
        hasPlugin: hasPluginMock
      }
    } as unknown as PluginContext<Env>;

    // Reset mock states
    jest.clearAllMocks();
    mockEventBus.getRunningState.mockReturnValue(true);
    mockEventBus.emit.mockResolvedValue(EventDeliveryStatus.SUCCESS);

    // Reset EventBus mock
    (EventBus.getInstance as jest.Mock).mockReturnValue(mockEventBus);
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
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
        type: 'PLUGIN_INITIALIZED',
        source: 'test-plugin'
      }));
    });

    it('should fail initialization if required dependency is missing', async () => {
      plugin.metadata.dependencies = { required: { 'missing-plugin': '1.0.0' } };
      hasPluginMock.mockReturnValue(false);
      await expect(plugin.initialize(mockContext)).rejects.toThrow('Required dependency not found: missing-plugin');
    });

    it('should handle optional dependencies', async () => {
      plugin.metadata.optionalDependencies = { 'optional-plugin': '1.0.0' };
      hasPluginMock.mockReturnValue(false);
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
      expect(mockEventBus.emit).toHaveBeenCalledWith(expect.objectContaining({
        type: 'PLUGIN_TEARDOWN',
        source: 'test-plugin'
      }));
    });

    it('should handle teardown when not initialized', async () => {
      await expect(plugin.teardown()).resolves.not.toThrow();
      expect(mockEventBus.emit).not.toHaveBeenCalled();
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
      plugin.metadata.dependencies = new PluginDependencyConfig({ 'dep1': '1.0.0', 'dep2': '1.0.0' });
      await expect(plugin.initialize(mockContext)).resolves.not.toThrow();
      expect(hasPluginMock).toHaveBeenCalledWith('dep1');
      expect(hasPluginMock).toHaveBeenCalledWith('dep2');
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
      plugin.metadata.optionalDependencies = { 'opt1': '1.0.0', 'opt2': '1.0.0' };
      hasPluginMock.mockReturnValue(false);
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

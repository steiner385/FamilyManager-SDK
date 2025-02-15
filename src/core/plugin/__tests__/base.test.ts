import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { MockPlugin, DependentMockPlugin, createMockPluginContext } from '../../../test-utils';
import { PluginStatus } from '../types';
import { EventBus } from '../../events/EventBus';
import { Logger } from '../../logging/Logger';
import { pluginRegistry } from '../registry';

// Mock the Logger module
jest.mock('../../logging/Logger', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  return {
    Logger: {
      getInstance: () => mockLogger
    }
  };
});

describe('BasePlugin', () => {
  let mockPlugin: MockPlugin;
  let context: ReturnType<typeof createMockPluginContext>;
  let eventBus: EventBus;
  let logger: ReturnType<typeof Logger.getInstance>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    EventBus.resetInstance();
    eventBus = EventBus.getInstance();
    mockPlugin = new MockPlugin();
    context = createMockPluginContext();
    logger = Logger.getInstance();
    pluginRegistry.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    pluginRegistry.clear();
  });

  describe('initialization', () => {
    it('should initialize correctly', async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      expect(mockPlugin.initializeCalled).toBe(true);
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
    });

    it('should prevent duplicate initialization', async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      await expect(mockPlugin.initialize(context))
        .rejects
        .toThrow('Plugin mock-plugin already initialized');
    });

    it('should validate required dependencies', async () => {
      const dependentPlugin = new DependentMockPlugin();
      pluginRegistry.register(dependentPlugin);

      // Should fail because the dependency isn't registered
      await expect(dependentPlugin.initialize(context))
        .rejects
        .toThrow('Required dependency not found: mock-plugin');

      // Register the dependency and try again
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      await dependentPlugin.initialize(context);
      expect(dependentPlugin.initializeCalled).toBe(true);
    });
  });

  describe('lifecycle', () => {
    beforeEach(async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
    });

    it('should handle start lifecycle', async () => {
      await mockPlugin.start();
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.ACTIVE);
    });

    it('should prevent starting uninitialized plugin', async () => {
      const newPlugin = new MockPlugin();
      await expect(newPlugin.start())
        .rejects
        .toThrow('Plugin must be initialized before starting');
    });

    it('should handle stop lifecycle', async () => {
      await mockPlugin.start();
      await mockPlugin.stop();
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
    });

    it('should handle teardown lifecycle', async () => {
      await mockPlugin.start();
      await mockPlugin.teardown();
      expect(mockPlugin.teardownCalled).toBe(true);
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.DISABLED);
    });

    it('should ignore stop/teardown when not initialized', async () => {
      const newPlugin = new MockPlugin();
      await newPlugin.stop();
      await newPlugin.teardown();
      expect(newPlugin.teardownCalled).toBe(false);
    });
  });

  describe('metrics', () => {
    beforeEach(() => {
      pluginRegistry.register(mockPlugin);
    });

    it('should provide plugin metrics', async () => {
      await mockPlugin.initialize(context);
      await mockPlugin.start();

      const metrics = await mockPlugin.getPluginMetrics(mockPlugin.id);
      expect(metrics).toEqual({
        id: mockPlugin.id,
        name: mockPlugin.name,
        version: mockPlugin.version,
        status: PluginStatus.ACTIVE,
        uptime: expect.any(Number),
        memoryUsage: expect.any(Number),
        eventCount: 0,
        errorCount: 0
      });
    });

    it('should handle metrics for inactive plugin', async () => {
      const metrics = await mockPlugin.getPluginMetrics(mockPlugin.id);
      expect(metrics.status).toBe(PluginStatus.INACTIVE);
    });
  });

  describe('error handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const errorPlugin = new MockPlugin();
      const errorMessage = 'Initialization failed';
      pluginRegistry.register(errorPlugin);

      // Mock the onInitialize method to throw an error
      jest.spyOn(errorPlugin as any, 'onInitialize').mockRejectedValue(new Error(errorMessage));

      // Attempt to initialize should fail
      await expect(errorPlugin.initialize(context))
        .rejects
        .toThrow(errorMessage);

      // Verify that error was logged
      expect(logger.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});

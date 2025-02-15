// Set up mocks before any imports
import { jest } from '@jest/globals';

// Mock logger instance that will be shared across all imports
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock Logger before anything else
jest.mock('../../../../src/core/logging/Logger', () => ({
  Logger: {
    getInstance: jest.fn(() => mockLogger)
  }
}));

// Now import everything else
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MockPlugin, DependentMockPlugin, createMockPluginContext } from '../../plugin-helpers';
import { PluginContext, PluginStatus } from '../../../../src/core/plugin/types';
import { Logger } from '../../../../src/core/logging/Logger';
import { EventBus } from '../../../../src/core/events/EventBus';
import { pluginRegistry } from '../../../../src/core/plugin/registry';

describe('BasePlugin', () => {
  let mockPlugin: MockPlugin;
  let context: PluginContext;
  let eventBus: EventBus;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    EventBus.resetInstance();
    eventBus = EventBus.getInstance();
    mockPlugin = new MockPlugin();
    context = createMockPluginContext();
    pluginRegistry.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    pluginRegistry.clear();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      expect(mockPlugin.initializeCalled).toBe(true);
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
      expect(mockLogger.info).toHaveBeenCalledWith(`Plugin initialized: ${mockPlugin.id}`);
    });

    it('should prevent duplicate initialization', async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      await expect(mockPlugin.initialize(context))
        .rejects
        .toThrow('Plugin mock-plugin already initialized');
    });

    it('should validate dependencies', async () => {
      const dependentPlugin = new DependentMockPlugin();
      pluginRegistry.register(dependentPlugin);

      // Should fail without required dependency
      await expect(dependentPlugin.initialize(context))
        .rejects
        .toThrow('Required dependency not found: mock-plugin');
      expect(mockLogger.error).toHaveBeenCalledWith('Required dependency not found: mock-plugin');

      // Should succeed with required dependency
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      await dependentPlugin.initialize(context);
      expect(dependentPlugin.initializeCalled).toBe(true);
      expect(pluginRegistry.getPluginState(dependentPlugin.id)).toBe(PluginStatus.INACTIVE);
    });
  });

  describe('lifecycle', () => {
    beforeEach(async () => {
      pluginRegistry.register(mockPlugin);
      await mockPlugin.initialize(context);
      jest.clearAllMocks(); // Clear initialization logs
    });

    it('should handle start lifecycle', async () => {
      await mockPlugin.start();
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.ACTIVE);
      expect(mockLogger.info).toHaveBeenCalledWith(`Plugin started: ${mockPlugin.id}`);
    });

    it('should handle stop lifecycle', async () => {
      await mockPlugin.start();
      jest.clearAllMocks(); // Clear start logs
      await mockPlugin.stop();
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
      expect(mockLogger.info).toHaveBeenCalledWith(`Plugin stopped: ${mockPlugin.id}`);
    });

    it('should handle teardown lifecycle', async () => {
      await mockPlugin.start();
      jest.clearAllMocks(); // Clear start logs
      await mockPlugin.teardown();
      expect(mockPlugin.teardownCalled).toBe(true);
      expect(pluginRegistry.getPluginState(mockPlugin.id)).toBe(PluginStatus.DISABLED);
      expect(mockLogger.info).toHaveBeenCalledWith(`Plugin torn down: ${mockPlugin.id}`);
    });

    it('should ignore stop when not initialized', async () => {
      const newPlugin = new MockPlugin();
      await newPlugin.stop();
      expect(mockLogger.info).not.toHaveBeenCalled();
    });

    it('should ignore teardown when not initialized', async () => {
      const newPlugin = new MockPlugin();
      await newPlugin.teardown();
      expect(mockPlugin.teardownCalled).toBe(false);
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle initialization errors', async () => {
      class ErrorPlugin extends MockPlugin {
        protected async onInitialize(): Promise<void> {
          throw new Error('Initialization error');
        }
      }

      const errorPlugin = new ErrorPlugin();
      pluginRegistry.register(errorPlugin);

      await expect(errorPlugin.initialize(context))
        .rejects
        .toThrow('Initialization error');
      expect(mockLogger.error).toHaveBeenCalledWith('Initialization error');
    });

    it('should handle unknown initialization errors', async () => {
      class ErrorPlugin extends MockPlugin {
        protected async onInitialize(): Promise<void> {
          // Testing non-Error object handling
          throw { custom: 'Unknown error' };
        }
      }

      const errorPlugin = new ErrorPlugin();
      pluginRegistry.register(errorPlugin);

      // Expect any error to be thrown (original error is re-thrown)
      await expect(errorPlugin.initialize(context))
        .rejects
        .toBeTruthy();
      
      // But the logger should receive the generic message
      expect(mockLogger.error).toHaveBeenCalledWith('Unknown error during initialization');
    });
  });

  describe('metrics', () => {
    it('should provide plugin metrics', async () => {
      pluginRegistry.register(mockPlugin);
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
      pluginRegistry.register(mockPlugin);
      const metrics = await mockPlugin.getPluginMetrics(mockPlugin.id);
      expect(metrics.status).toBe(PluginStatus.INACTIVE);
    });
  });
});

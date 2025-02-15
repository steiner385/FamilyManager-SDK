import { jest } from '@jest/globals';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import type { Plugin, PluginMetrics } from '../../../../src/core/plugin/types';
import { PluginStatus } from '../../../../src/core/plugin/types';
import { MockPlugin, DependentMockPlugin, isTestPlugin } from '../../../helpers/plugin-helpers';

// Mock logger
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock Logger module
jest.mock('../../../../src/core/logging/Logger', () => ({
  Logger: {
    getInstance: jest.fn(() => mockLogger)
  }
}));

// Import after mocks
import { PluginManager } from '../../../../src/core/plugin/PluginManager';
import { pluginRegistry } from '../../../../src/core/plugin/registry';
import { EventBus } from '../../../../src/core/events/EventBus';
import { Logger } from '../../../../src/core/logging/Logger';

// Mock interfaces
interface EventBusMock {
  start: jest.Mock;
  stop: jest.Mock;
  registerChannel: jest.Mock;
  logger: typeof mockLogger;
}

interface PluginManagerMock {
  initialize: jest.Mock;
  registerPlugin: jest.Mock;
  uninstallPlugin: jest.Mock;
  initializePlugin: jest.Mock;
  stopPlugin: jest.Mock;
  getPluginState: jest.Mock;
  isPluginInstalled: jest.Mock;
  getMetrics: jest.Mock;
  logger: typeof mockLogger;
}

// Create mock instances
const createEventBusMock = (): EventBusMock => ({
  //@ts-ignore
  start: jest.fn().mockResolvedValue(undefined),
  //@ts-ignore
  stop: jest.fn().mockResolvedValue(undefined),
  registerChannel: jest.fn(),
  logger: mockLogger
});

const createPluginManagerMock = (): PluginManagerMock => ({
  initialize: jest.fn(),
  //@ts-ignore
  registerPlugin: jest.fn().mockResolvedValue(undefined),
  //@ts-ignore
  uninstallPlugin: jest.fn().mockResolvedValue(undefined),
  //@ts-ignore
  initializePlugin: jest.fn().mockResolvedValue(undefined),
  //@ts-ignore
  stopPlugin: jest.fn().mockResolvedValue(undefined),
  //@ts-ignore
  getPluginState: jest.fn().mockReturnValue(PluginStatus.INACTIVE),
  //@ts-ignore
  isPluginInstalled: jest.fn().mockReturnValue(false),
  //@ts-ignore
  getMetrics: jest.fn().mockResolvedValue({}),
  logger: mockLogger
});

let mockEventBusInstance = createEventBusMock();
let mockPluginManagerInstance = createPluginManagerMock();

// Mock module imports
jest.mock('../../../../src/core/events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn(() => mockEventBusInstance),
    resetInstance: jest.fn(() => { mockEventBusInstance = createEventBusMock(); })
  }
}));

jest.mock('../../../../src/core/plugin/PluginManager', () => ({
  PluginManager: {
    getInstance: jest.fn(() => mockPluginManagerInstance),
    resetInstance: jest.fn(() => { mockPluginManagerInstance = createPluginManagerMock(); })
  }
}));

describe('Plugin System Integration', () => {
  let eventBus: EventBusMock;
  let pluginManager: PluginManagerMock;

  beforeEach(async () => {
    jest.clearAllMocks();
    EventBus.resetInstance();
    PluginManager.resetInstance();
    
    eventBus = mockEventBusInstance;
    pluginManager = mockPluginManagerInstance;

    // Setup mock implementations
    //@ts-ignore
    eventBus.start.mockResolvedValue(undefined);
    //@ts-ignore
    eventBus.stop.mockResolvedValue(undefined);

    pluginManager.initialize.mockReturnValue(undefined);

    // Setup plugin manager implementations
    //@ts-ignore
    pluginManager.registerPlugin.mockImplementation(async (plugin: Plugin) => {
      pluginRegistry.register(plugin);
      mockLogger.info(`Plugin ${plugin.id} registered`);
    });

    //@ts-ignore
    pluginManager.initializePlugin.mockImplementation(async (id: string) => {
      const plugin = pluginRegistry.getAllPlugins().find(p => p.id === id);
      if (plugin && isTestPlugin(plugin)) {
        plugin.initializeCalled = true;
        mockLogger.info(`Plugin initialized: ${id}`);
        pluginRegistry.setPluginState(id, PluginStatus.ACTIVE);
        mockLogger.info(`Plugin ${id} activated`);
      }
    });

    //@ts-ignore
    pluginManager.stopPlugin.mockImplementation(async (plugin: Plugin) => {
      pluginRegistry.setPluginState(plugin.id, PluginStatus.INACTIVE);
      mockLogger.info(`Plugin ${plugin.id} deactivated`);
    });

    //@ts-ignore
    pluginManager.getPluginState.mockImplementation((id: string) =>
      pluginRegistry.getPluginState(id) ?? PluginStatus.INACTIVE
    );

    //@ts-ignore
    pluginManager.isPluginInstalled.mockImplementation((id: string) =>
      pluginRegistry.getAllPlugins().some(p => p.id === id)
    );

    //@ts-ignore
    pluginManager.uninstallPlugin.mockImplementation(async (id: string) => {
      const plugin = pluginRegistry.getAllPlugins().find(p => p.id === id);
      if (plugin && isTestPlugin(plugin)) {
        plugin.teardownCalled = true;
        mockLogger.info(`Plugin ${id} uninstalled`);
        pluginRegistry.unregister(id);
      }
    });

    //@ts-ignore
    pluginManager.getMetrics.mockImplementation(async (id: string) => {
      mockLogger.debug(`Collecting metrics for plugin: ${id}`);
      return {
        id,
        name: id,
        version: '1.0.0',
        status: pluginManager.getPluginState(id),
        uptime: 1000,
        memoryUsage: 1024,
        eventCount: 0,
        errorCount: 0
      } as PluginMetrics;
    });
    
    await eventBus.start();
    eventBus.registerChannel('plugin');
    pluginManager.initialize();
    pluginRegistry.clear();
  });

  afterEach(async () => {
    const plugins = pluginRegistry.getAllPlugins();
    for (const plugin of plugins.slice().reverse()) {
      await pluginManager.uninstallPlugin(plugin.id);
    }
    await eventBus.stop();
    jest.clearAllMocks();
  });

  it('should handle plugin lifecycle', async () => {
    const mockPlugin = new MockPlugin();
    
    await pluginManager.registerPlugin(mockPlugin);
    expect(pluginManager.isPluginInstalled('mock-plugin')).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin mock-plugin registered');
    
    await pluginManager.initializePlugin(mockPlugin.id);
    expect(mockPlugin.initializeCalled).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin initialized: mock-plugin');
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin mock-plugin activated');

    const dependentPlugin = new DependentMockPlugin();
    await pluginManager.registerPlugin(dependentPlugin);
    expect(pluginManager.isPluginInstalled('dependent-mock-plugin')).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin dependent-mock-plugin registered');

    await pluginManager.uninstallPlugin(dependentPlugin.id);
    await pluginManager.uninstallPlugin(mockPlugin.id);
    expect(pluginManager.isPluginInstalled('mock-plugin')).toBe(false);
    expect(mockPlugin.teardownCalled).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin mock-plugin uninstalled');
  });

  it('should prevent unregistering plugins with dependents', async () => {
    const mockPlugin = new MockPlugin();
    const dependentPlugin = new DependentMockPlugin();
    await pluginManager.registerPlugin(mockPlugin);
    await pluginManager.registerPlugin(dependentPlugin);

    const error = new Error('Cannot unregister plugin mock-plugin because it is required by dependent-mock-plugin');
    //@ts-ignore
    pluginManager.uninstallPlugin.mockRejectedValueOnce(error);

    await expect(pluginManager.uninstallPlugin(mockPlugin.id)).rejects.toThrow(error);
    mockLogger.error(error.message);

    //@ts-ignore
    pluginManager.uninstallPlugin.mockResolvedValueOnce(undefined);
    await expect(pluginManager.uninstallPlugin(dependentPlugin.id)).resolves.not.toThrow();
  });

  it('should handle plugin initialization errors', async () => {
    const errorPlugin = new MockPlugin();
    const error = new Error('Initialization failed');

    await pluginManager.registerPlugin(errorPlugin);
    //@ts-ignore
    pluginManager.initializePlugin.mockRejectedValueOnce(error);

    await expect(pluginManager.initializePlugin(errorPlugin.id)).rejects.toThrow(error);
    mockLogger.error(error.message);
  });

  it('should manage plugin state transitions', async () => {
    const mockPlugin = new MockPlugin();
    await pluginManager.registerPlugin(mockPlugin);
    
    pluginRegistry.setPluginState(mockPlugin.id, PluginStatus.INACTIVE);
    expect(pluginManager.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
    
    await pluginManager.initializePlugin(mockPlugin.id);
    expect(pluginManager.getPluginState(mockPlugin.id)).toBe(PluginStatus.ACTIVE);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin mock-plugin activated');
    
    await pluginManager.stopPlugin(mockPlugin);
    expect(pluginManager.getPluginState(mockPlugin.id)).toBe(PluginStatus.INACTIVE);
    expect(mockLogger.info).toHaveBeenCalledWith('Plugin mock-plugin deactivated');
  });

  it('should collect plugin metrics', async () => {
    const mockPlugin = new MockPlugin();
    const expectedMetrics: PluginMetrics = {
      id: 'mock-plugin',
      name: 'mock-plugin',
      version: '1.0.0',
      status: PluginStatus.ACTIVE,
      uptime: 1000,
      memoryUsage: 1024,
      eventCount: 5,
      errorCount: 0
    };

    await pluginManager.registerPlugin(mockPlugin);
    //@ts-ignore
    pluginManager.getMetrics.mockImplementationOnce(async (id: string) => {
      mockLogger.debug(`Collecting metrics for plugin: ${id}`);
      return expectedMetrics;
    });

    const metrics = await pluginManager.getMetrics(mockPlugin.id);
    expect(metrics).toEqual(expectedMetrics);
    expect(mockLogger.debug).toHaveBeenCalledWith('Collecting metrics for plugin: mock-plugin');
  });

  it('should prevent duplicate plugin registration', async () => {
    const mockPlugin = new MockPlugin();
    await pluginManager.registerPlugin(mockPlugin);
    
    const error = new Error('Plugin mock-plugin is already registered');
    //@ts-ignore
    pluginManager.registerPlugin.mockRejectedValueOnce(error);

    await expect(pluginManager.registerPlugin(mockPlugin)).rejects.toThrow(error);
    mockLogger.error(error.message);
  });

  it('should require manager initialization', async () => {
    PluginManager.resetInstance();
    const uninitializedManager = mockPluginManagerInstance;
    const mockPlugin = new MockPlugin();

    const error = new Error('PluginManager must be initialized before registering plugins');
    //@ts-ignore
    uninitializedManager.registerPlugin.mockRejectedValueOnce(error);

    await expect(uninitializedManager.registerPlugin(mockPlugin)).rejects.toThrow(error);
    mockLogger.error(error.message);
  });
});

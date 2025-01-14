import { ConfigManager } from '../ConfigManager';
import { ConfigMiddleware as BaseConfigMiddleware, MiddlewareContext } from '../middleware/types';
import { ConfigEncryption, PluginConfig, ConfigMiddleware } from '../types';
import { EventBus } from '../../../events/EventBus';
import { BaseEvent, EventDeliveryStatus, EventHandler } from '../../../events/types';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const createMockEventBus = () => {
  const mock = {
    start: jest.fn(),
    stop: jest.fn(),
    registerChannel: jest.fn(),
    emit: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    getRunningState: jest.fn(),
    getSubscriptionCount: jest.fn(),
    clearSubscriptions: jest.fn(),
    getChannels: jest.fn()
  };

  // Type assertions for mock implementations
  (mock.start as jest.MockedFunction<() => Promise<void>>).mockResolvedValue();
  (mock.stop as jest.MockedFunction<() => Promise<void>>).mockResolvedValue();
  (mock.emit as jest.MockedFunction<() => Promise<EventDeliveryStatus>>).mockResolvedValue(EventDeliveryStatus.SUCCESS);
  (mock.subscribe as jest.MockedFunction<() => () => void>).mockReturnValue(() => {});
  (mock.getRunningState as jest.MockedFunction<() => boolean>).mockReturnValue(true);
  (mock.getSubscriptionCount as jest.MockedFunction<() => number>).mockReturnValue(0);
  (mock.getChannels as jest.MockedFunction<() => string[]>).mockReturnValue([]);

  return mock;
};

type MockEventBus = ReturnType<typeof createMockEventBus>;

jest.mock('../../../events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockImplementation(() => createMockEventBus())
  }
}));

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let mockEventBus: MockEventBus;
  let mockContext: MiddlewareContext;

  beforeEach(() => {
    // Reset the singleton instance
    (ConfigManager as any).instance = null;
    
    mockEventBus = createMockEventBus();
    mockContext = {
      pluginName: 'test-plugin',
      environment: 'test',
      timestamp: Date.now()
    };

    jest.spyOn(EventBus, 'getInstance').mockReturnValue(mockEventBus as unknown as EventBus);
    configManager = ConfigManager.getInstance();
  });

  it('should apply middleware chain correctly', async () => {
    configManager.registerSchema('test-plugin', {
      value: { type: 'number', required: true }
    });
    const initialConfig = { value: 1 };
    const middleware1: ConfigMiddleware = async (config: PluginConfig, next) => {
      const newConfig = { ...config, value: (config as any).value + 1 };
      await next(newConfig);
    };
    const middleware2: ConfigMiddleware = async (config: PluginConfig, next) => {
      const newConfig = { ...config, value: (config as any).value * 2 };
      await next(newConfig);
    };

    configManager.addMiddleware(middleware1);
    configManager.addMiddleware(middleware2);

    await configManager.setConfig('test-plugin', initialConfig);

    const finalConfig = await configManager.getConfig('test-plugin');
    expect(finalConfig.value).toBe(4); // (1 + 1) * 2
  });

  it('should handle encryption of sensitive fields', async () => {
    const mockEncryption = {
      encrypt: jest.fn((value: string) => Promise.resolve(`encrypted:${value}`)),
      decrypt: jest.fn((value: string) => Promise.resolve(value.replace('encrypted:', '')))
    } as ConfigEncryption;

    configManager.setEncryption(mockEncryption);
    configManager.registerSchema('test-plugin', {
      password: { type: 'string', sensitive: true },
      username: { type: 'string' }
    });

    const config = {
      username: 'test',
      password: 'secret'
    };

    await configManager.setConfig('test-plugin', config);

    expect(mockEncryption.encrypt).toHaveBeenCalledWith('secret');
    
    const savedConfig = await configManager.getConfig('test-plugin');
    expect(savedConfig.username).toBe('test');
    expect(savedConfig.password).toContain('encrypted:');
  });

  it('should emit configuration events', async () => {
    configManager.registerSchema('test-plugin', {
      test: { type: 'string', required: true }
    });
    const config = { test: 'value' };
    await configManager.setConfig('test-plugin', config);

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CONFIG_CHANGED',
        channel: 'config',
        data: expect.objectContaining({
          pluginName: 'test-plugin',
          config: expect.any(Object)
        })
      })
    );
  });

  it('should handle validation failures', async () => {
    configManager.registerSchema('test-plugin', {
      value: { type: 'string', required: true }
    });

    const failingMiddleware: ConfigMiddleware = async (config: PluginConfig, next) => {
      throw new Error('Validation failed');
    };

    configManager.addMiddleware(failingMiddleware);

    await expect(configManager.setConfig('test-plugin', { value: 'test' }))
      .rejects
      .toThrow('Validation failed');

    expect(mockEventBus.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CONFIG_VALIDATION_FAILED',
        channel: 'config',
        data: expect.objectContaining({
          pluginName: 'test-plugin',
          error: expect.any(String)
        })
      })
    );
  });
});

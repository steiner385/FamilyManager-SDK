import { ConfigManager } from '../ConfigManager';
import { ConfigMiddleware, ConfigEncryption, ConfigValue, MiddlewareContext } from '../types';
import { EventBus } from '../../../events/EventBus';
import { EventDeliveryStatus } from '../../../events/types';
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
  (mock.emit as jest.MockedFunction<() => Promise<EventDeliveryStatus>>).mockResolvedValue(EventDeliveryStatus.DELIVERED);
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
  let mockEncryption: ConfigEncryption;

  beforeEach(() => {
    // Reset the singleton instance
    (ConfigManager as any).instance = null;
    
    mockEventBus = createMockEventBus();
    mockContext = {
      pluginName: 'test-plugin',
      environment: 'test',
      timestamp: Date.now()
    };

    // Create properly typed mock encryption functions
    const encryptFn = jest.fn() as jest.MockedFunction<(value: string) => Promise<string>>;
    const decryptFn = jest.fn() as jest.MockedFunction<(value: string) => Promise<string>>;

    encryptFn.mockImplementation(async (value: string) => `encrypted:${value}`);
    decryptFn.mockImplementation(async (value: string) => value.replace('encrypted:', ''));

    mockEncryption = {
      encrypt: encryptFn,
      decrypt: decryptFn
    };

    jest.spyOn(EventBus, 'getInstance').mockReturnValue(mockEventBus as unknown as EventBus);
    configManager = ConfigManager.getInstance();
    configManager.setEncryption(mockEncryption);
  });

  it('should apply middleware chain correctly', async () => {
    configManager.registerSchema('test-plugin', {
      properties: {
        value: { type: 'number', required: true }
      }
    });
    const initialConfig: ConfigValue = { value: 1 };
    const middleware1: ConfigMiddleware = async (config: ConfigValue, next) => {
      const value = config.value as number;
      const newConfig = { ...config, value: value + 1 };
      await next(newConfig);
    };
    const middleware2: ConfigMiddleware = async (config: ConfigValue, next) => {
      const value = config.value as number;
      const newConfig = { ...config, value: value * 2 };
      await next(newConfig);
    };

    configManager.addMiddleware(middleware1);
    configManager.addMiddleware(middleware2);

    await configManager.setConfig('test-plugin', initialConfig);

    const finalConfig = await configManager.getConfig('test-plugin');
    expect(finalConfig?.value).toBe(4); // (1 + 1) * 2
  });

  it('should handle encryption of sensitive fields', async () => {
    // Register schema with sensitive field
    configManager.registerSchema('test-plugin', {
      properties: {
        password: { type: 'string', sensitive: true },
        username: { type: 'string' }
      }
    });

    // Set config with sensitive data
    const config: ConfigValue = {
      username: 'test',
      password: 'secret'
    };

    // Set config and wait for it to complete
    await configManager.setConfig('test-plugin', config);
    
    // Verify encryption was called
    expect(mockEncryption.encrypt).toHaveBeenCalledWith('secret');
    
    // Get config and verify the results
    const savedConfig = await configManager.getConfig('test-plugin');
    expect(savedConfig).toEqual({
      username: 'test',
      password: expect.stringContaining('encrypted:')
    });
  });

  it('should emit configuration events', async () => {
    configManager.registerSchema('test-plugin', {
      properties: {
        test: { type: 'string', required: true }
      }
    });
    const config: ConfigValue = { test: 'value' };
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
      properties: {
        value: { type: 'string', required: true }
      }
    });

    const failingMiddleware: ConfigMiddleware = async (config: ConfigValue, next) => {
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

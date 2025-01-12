import { ConfigManager } from '../ConfigManager';
import { ConfigMiddleware } from '../middleware/types';
import { ConfigEncryption } from '../security/types';
import { EventBus } from '../../../events/EventBus';

jest.mock('../../../events/EventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      start: jest.fn().mockResolvedValue(undefined),
      registerChannel: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    })
  }
}));

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    // Reset the singleton instance
    (ConfigManager as any).instance = null;
    
    mockEventBus = {
      start: jest.fn().mockResolvedValue(undefined),
      registerChannel: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    } as any;

    jest.spyOn(EventBus, 'getInstance').mockReturnValue(mockEventBus);
    configManager = ConfigManager.getInstance();
  });

  it('should apply middleware chain correctly', async () => {
    configManager.registerSchema('test-plugin', {
      value: { type: 'number', required: true }
    });
    const initialConfig = { value: 1 };
    const middleware1: ConfigMiddleware = async (config, next) => {
      config.value++;
      await next(config);
    };
    const middleware2: ConfigMiddleware = async (config, next) => {
      config.value *= 2;
      await next(config);
    };

    configManager.addMiddleware(middleware1);
    configManager.addMiddleware(middleware2);

    await configManager.setConfig('test-plugin', initialConfig);

    const finalConfig = await configManager.getConfig('test-plugin');
    expect(finalConfig.value).toBe(4); // (1 + 1) * 2
  });

  it('should handle encryption of sensitive fields', async () => {
    const mockEncryption: jest.Mocked<ConfigEncryption> = {
      encrypt: jest.fn().mockImplementation(value => Promise.resolve(`encrypted:${value}`)),
      decrypt: jest.fn().mockImplementation(value => Promise.resolve(value.replace('encrypted:', '')))
    };

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

    expect(mockEncryption.encrypt).toHaveBeenCalledWith(expect.stringContaining('secret'));
    
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

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'config',
      expect.objectContaining({
        type: 'config:config:changed',
        source: 'config-manager',
        payload: expect.objectContaining({
          pluginName: 'test-plugin',
          config: expect.any(Object)
        }),
        timestamp: expect.any(Number)
      })
    );
  });

  it('should handle validation failures', async () => {
    configManager.registerSchema('test-plugin', {
      value: { type: 'string', required: true }
    });

    const failingMiddleware: ConfigMiddleware = async (config, next) => {
      throw new Error('Validation failed');
    };

    configManager.addMiddleware(failingMiddleware);

    await expect(configManager.setConfig('test-plugin', { value: 'test' }))
      .rejects
      .toThrow('Validation failed');

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'config',
      expect.objectContaining({
        type: 'config:config:validation-failed',
        source: 'config-manager',
        payload: expect.objectContaining({
          pluginName: 'test-plugin',
          error: expect.any(Error)
        }),
        timestamp: expect.any(Number)
      })
    );
  });
});

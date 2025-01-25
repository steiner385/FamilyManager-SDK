import { Logger } from '../Logger';
import winston from 'winston';
import { jest } from '@jest/globals';

const npmLogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

function createMockWinstonLogger(): winston.Logger {
  const logger = {
    info: jest.fn() as unknown as winston.LeveledLogMethod,
    error: jest.fn() as unknown as winston.LeveledLogMethod,
    warn: jest.fn() as unknown as winston.LeveledLogMethod,
    debug: jest.fn() as unknown as winston.LeveledLogMethod,
    // Required Winston.Logger properties
    level: 'info',
    levels: npmLogLevels,
    format: winston.format.json(),
    transports: [],
    // Additional required properties
    silent: false,
    exitOnError: false,
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    close: jest.fn(),
    log: jest.fn() as unknown as winston.LeveledLogMethod,
    profile: jest.fn(),
    startTimer: jest.fn(),
    exceptions: {
      handle: jest.fn(),
      unhandle: jest.fn(),
      catcher: jest.fn(),
    },
    rejections: {
      handle: jest.fn(),
      unhandle: jest.fn(),
      catcher: jest.fn(),
    },
    query: jest.fn(),
    stream: jest.fn(),
    configure: jest.fn(),
  };

  // Cast the mock logger to winston.Logger type
  return new Proxy(logger, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      return jest.fn();
    }
  }) as unknown as winston.Logger;
}

describe('Logger', () => {
  let mockWinstonLogger: winston.Logger;

  beforeEach(() => {
    // Reset singleton instance
    Logger.resetInstance();

    // Create mock Winston logger
    mockWinstonLogger = createMockWinstonLogger();

    // Set the mock logger
    Logger.getInstance().setLogger(mockWinstonLogger);
  });

  describe('Singleton Pattern', () => {
    it('should maintain singleton instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = Logger.getInstance();
      Logger.resetInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Log Methods', () => {
    it('should log error messages', () => {
      const message = 'Test error';
      Logger.getInstance().error(message);
      expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, undefined);
    });

    it('should log error messages with metadata', () => {
      const message = 'Test error';
      const meta = { code: 500 };
      Logger.getInstance().error(message, meta);
      expect(mockWinstonLogger.error).toHaveBeenCalledWith(message, meta);
    });

    it('should log warn messages', () => {
      const message = 'Test warning';
      Logger.getInstance().warn(message);
      expect(mockWinstonLogger.warn).toHaveBeenCalledWith(message, undefined);
    });

    it('should log warn messages with metadata', () => {
      const message = 'Test warning';
      const meta = { code: 400 };
      Logger.getInstance().warn(message, meta);
      expect(mockWinstonLogger.warn).toHaveBeenCalledWith(message, meta);
    });

    it('should log info messages', () => {
      const message = 'Test info';
      Logger.getInstance().info(message);
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, undefined);
    });

    it('should log info messages with metadata', () => {
      const message = 'Test info';
      const meta = { user: 'test' };
      Logger.getInstance().info(message, meta);
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, meta);
    });

    it('should log debug messages', () => {
      const message = 'Test debug';
      Logger.getInstance().debug(message);
      expect(mockWinstonLogger.debug).toHaveBeenCalledWith(message, undefined);
    });

    it('should log debug messages with metadata', () => {
      const message = 'Test debug';
      const meta = { detail: 'test' };
      Logger.getInstance().debug(message, meta);
      expect(mockWinstonLogger.debug).toHaveBeenCalledWith(message, meta);
    });
  });

  describe('Metadata Handling', () => {
    it('should handle complex metadata objects', () => {
      const message = 'Test message';
      const meta = {
        error: new Error('Test error'),
        data: { nested: { value: 42 } },
        array: [1, 2, 3]
      };
      Logger.getInstance().info(message, meta);
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, meta);
    });

    it('should handle undefined metadata', () => {
      const message = 'Test message';
      Logger.getInstance().info(message);
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, undefined);
    });

    it('should handle empty metadata object', () => {
      const message = 'Test message';
      Logger.getInstance().info(message, {});
      expect(mockWinstonLogger.info).toHaveBeenCalledWith(message, {});
    });
  });

  describe('Winston Integration', () => {
    it('should create Winston logger with default configuration', () => {
      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();
      expect(createLoggerSpy).toHaveBeenCalled();
      createLoggerSpy.mockRestore();
    });

    it('should respect environment log level', () => {
      process.env.LOG_LEVEL = 'debug';
      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();
      expect(createLoggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug'
        })
      );
      createLoggerSpy.mockRestore();
      delete process.env.LOG_LEVEL;
    });

    it('should use info as default log level', () => {
      delete process.env.LOG_LEVEL;
      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();
      expect(createLoggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info'
        })
      );
      createLoggerSpy.mockRestore();
    });
  });

  describe('Custom Logger Injection', () => {
    it('should allow setting custom logger', () => {
      const customLogger = createMockWinstonLogger();
      Logger.getInstance().setLogger(customLogger);
      Logger.getInstance().info('test');
      expect(customLogger.info).toHaveBeenCalled();
    });

    it('should use injected logger for all log methods', () => {
      const customLogger = createMockWinstonLogger();
      Logger.getInstance().setLogger(customLogger);
      const message = 'test';
      Logger.getInstance().info(message);
      Logger.getInstance().error(message);
      Logger.getInstance().warn(message);
      Logger.getInstance().debug(message);
      expect(customLogger.info).toHaveBeenCalledWith(message, undefined);
      expect(customLogger.error).toHaveBeenCalledWith(message, undefined);
      expect(customLogger.warn).toHaveBeenCalledWith(message, undefined);
      expect(customLogger.debug).toHaveBeenCalledWith(message, undefined);
    });
  });

  describe('Error Cases', () => {
    it('should handle logging errors gracefully', () => {
      const errorLogger = createMockWinstonLogger();
      (errorLogger.info as jest.Mock).mockImplementation(() => {
        throw new Error('Logging failed');
      });
      Logger.getInstance().setLogger(errorLogger);
      expect(() => Logger.getInstance().info('test')).not.toThrow();
    });

    it('should handle invalid log levels gracefully', () => {
      process.env.LOG_LEVEL = 'invalid_level';
      expect(() => {
        Logger.resetInstance();
        Logger.getInstance();
      }).not.toThrow();
      delete process.env.LOG_LEVEL;
    });

    it('should handle invalid metadata gracefully', () => {
      const circularRef: any = {};
      circularRef.self = circularRef;
      expect(() => {
        Logger.getInstance().info('test', circularRef);
      }).not.toThrow();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid logging', () => {
      const logger = Logger.getInstance();
      for (let i = 0; i < 1000; i++) {
        logger.info(`Message ${i}`);
      }
      expect(mockWinstonLogger.info).toHaveBeenCalledTimes(1000);
    });

    it('should handle mixed log levels', () => {
      const logger = Logger.getInstance();
      logger.info('info message');
      logger.error('error message');
      logger.warn('warn message');
      logger.debug('debug message');
      expect(mockWinstonLogger.info).toHaveBeenCalledTimes(1);
      expect(mockWinstonLogger.error).toHaveBeenCalledTimes(1);
      expect(mockWinstonLogger.warn).toHaveBeenCalledTimes(1);
      expect(mockWinstonLogger.debug).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent logging', async () => {
      const logger = Logger.getInstance();
      const promises = Array(10).fill(null).map((_, i) =>
        Promise.all([
          logger.info(`Info ${i}`),
          logger.error(`Error ${i}`),
          logger.warn(`Warn ${i}`),
          logger.debug(`Debug ${i}`)
        ])
      );
      await Promise.all(promises);
      expect(mockWinstonLogger.info).toHaveBeenCalledTimes(10);
      expect(mockWinstonLogger.error).toHaveBeenCalledTimes(10);
      expect(mockWinstonLogger.warn).toHaveBeenCalledTimes(10);
      expect(mockWinstonLogger.debug).toHaveBeenCalledTimes(10);
    });
  });
});

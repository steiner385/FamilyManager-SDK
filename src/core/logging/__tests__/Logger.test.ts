import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import winston from 'winston';
import { Logger, LogLevel, LogMetadata } from '../Logger';

describe('Logger', () => {
  let mockWinstonLogger: jest.Mocked<winston.Logger>;

  beforeEach(() => {
    // Reset singleton instance
    Logger.resetInstance();

    // Create mock Winston logger
    mockWinstonLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<winston.Logger>;

    // Inject mock logger
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
    const testCases: Array<{ method: LogLevel; message: string }> = [
      { method: 'error', message: 'Error message' },
      { method: 'warn', message: 'Warning message' },
      { method: 'info', message: 'Info message' },
      { method: 'debug', message: 'Debug message' },
    ];

    testCases.forEach(({ method, message }) => {
      it(`should log ${method} messages`, () => {
        const logger = Logger.getInstance();
        logger[method](message);
        expect(mockWinstonLogger.log).toHaveBeenCalledWith(method, message, undefined);
      });

      it(`should log ${method} messages with metadata`, () => {
        const logger = Logger.getInstance();
        const metadata: LogMetadata = {
          userId: 'user123',
          familyId: 'family456',
          requestId: 'req789',
        };

        logger[method](message, metadata);
        expect(mockWinstonLogger.log).toHaveBeenCalledWith(method, message, metadata);
      });
    });
  });

  describe('Metadata Handling', () => {
    it('should handle complex metadata objects', () => {
      const logger = Logger.getInstance();
      const metadata: LogMetadata = {
        userId: 'user123',
        familyId: 'family456',
        requestId: 'req789',
        custom: {
          feature: 'test',
          environment: 'development',
          metrics: {
            duration: 123,
            memory: 456,
          },
        },
      };

      logger.info('Complex metadata test', metadata);
      expect(mockWinstonLogger.log).toHaveBeenCalledWith('info', 'Complex metadata test', metadata);
    });

    it('should handle undefined metadata', () => {
      const logger = Logger.getInstance();
      logger.info('No metadata');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith('info', 'No metadata', undefined);
    });

    it('should handle empty metadata object', () => {
      const logger = Logger.getInstance();
      logger.info('Empty metadata', {});
      expect(mockWinstonLogger.log).toHaveBeenCalledWith('info', 'Empty metadata', {});
    });
  });

  describe('Winston Integration', () => {
    it('should create Winston logger with default configuration', () => {
      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();

      expect(createLoggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: expect.any(String),
          format: expect.any(Object),
          transports: expect.any(Array),
        })
      );

      createLoggerSpy.mockRestore();
    });

    it('should respect environment log level', () => {
      const originalLogLevel = process.env.LOG_LEVEL;
      process.env.LOG_LEVEL = 'debug';

      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();

      expect(createLoggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug',
        })
      );

      process.env.LOG_LEVEL = originalLogLevel;
      createLoggerSpy.mockRestore();
    });

    it('should use info as default log level', () => {
      const originalLogLevel = process.env.LOG_LEVEL;
      delete process.env.LOG_LEVEL;

      const createLoggerSpy = jest.spyOn(winston, 'createLogger');
      Logger.resetInstance();
      Logger.getInstance();

      expect(createLoggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );

      process.env.LOG_LEVEL = originalLogLevel;
      createLoggerSpy.mockRestore();
    });
  });

  describe('Custom Logger Injection', () => {
    it('should allow setting custom logger', () => {
      const customLogger = {
        log: jest.fn(),
      } as unknown as winston.Logger;

      const logger = Logger.getInstance();
      logger.setLogger(customLogger);

      logger.info('Test message');
      expect(customLogger.log).toHaveBeenCalled();
      expect(mockWinstonLogger.log).not.toHaveBeenCalled();
    });

    it('should use injected logger for all log methods', () => {
      const customLogger = {
        log: jest.fn(),
      } as unknown as winston.Logger;

      const logger = Logger.getInstance();
      logger.setLogger(customLogger);

      logger.error('Error test');
      logger.warn('Warning test');
      logger.info('Info test');
      logger.debug('Debug test');

      expect(customLogger.log).toHaveBeenCalledTimes(4);
      expect(mockWinstonLogger.log).not.toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    it('should handle logging errors gracefully', () => {
      const errorLogger = {
        log: jest.fn().mockImplementation(() => {
          throw new Error('Logging error');
        }),
      } as unknown as winston.Logger;

      const logger = Logger.getInstance();
      logger.setLogger(errorLogger);

      expect(() => logger.error('Test error')).not.toThrow();
    });

    it('should handle invalid log levels gracefully', () => {
      const logger = Logger.getInstance();
      const invalidLog = (logger as any).log('invalid' as LogLevel, 'Test message');
      expect(invalidLog).toBeUndefined();
    });

    it('should handle invalid metadata gracefully', () => {
      const logger = Logger.getInstance();
      const circularRef: any = {};
      circularRef.self = circularRef;

      expect(() => logger.info('Test message', circularRef)).not.toThrow();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid logging', () => {
      const logger = Logger.getInstance();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        logger.info(`Message ${i}`);
      }

      expect(mockWinstonLogger.log).toHaveBeenCalledTimes(count);
    });

    it('should handle mixed log levels', () => {
      const logger = Logger.getInstance();
      const messages = [
        { level: 'error' as LogLevel, message: 'Error occurred' },
        { level: 'warn' as LogLevel, message: 'Warning state' },
        { level: 'info' as LogLevel, message: 'Info update' },
        { level: 'debug' as LogLevel, message: 'Debug data' },
      ];

      messages.forEach(({ level, message }) => {
        logger.log(level, message);
      });

      messages.forEach(({ level, message }, index) => {
        expect(mockWinstonLogger.log).toHaveBeenNthCalledWith(index + 1, level, message, undefined);
      });
    });

    it('should handle concurrent logging', async () => {
      const logger = Logger.getInstance();
      const count = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < count; i++) {
        promises.push(
          new Promise<void>((resolve) => {
            logger.info(`Concurrent message ${i}`);
            resolve();
          })
        );
      }

      await Promise.all(promises);
      expect(mockWinstonLogger.log).toHaveBeenCalledTimes(count);
    });
  });
});

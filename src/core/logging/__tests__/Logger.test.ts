import winston from 'winston';
import { Logger } from '../Logger';
import { LogLevel, LogMetadata } from '../types';

jest.mock('winston', () => {
  const mockFormat = {
    timestamp: jest.fn().mockReturnValue({
      type: 'timestamp',
      transform: jest.fn(),
      options: {},
      enabled: true
    }),
    json: jest.fn().mockReturnValue({
      type: 'json',
      transform: jest.fn(),
      options: {},
      enabled: true
    }),
    combine: jest.fn().mockImplementation((...args) => ({
      type: 'combined',
      transform: jest.fn(),
      options: {},
      enabled: true,
      formats: args
    })),
    colorize: jest.fn().mockReturnValue({
      type: 'colorize',
      transform: jest.fn(),
      options: {},
      enabled: true
    }),
    simple: jest.fn().mockReturnValue({
      type: 'simple',
      transform: jest.fn(),
      options: {},
      enabled: true
    })
  };

  const mockLogger = {
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  return {
    createLogger: jest.fn().mockReturnValue(mockLogger),
    format: mockFormat,
    transports: {
      Console: jest.fn().mockImplementation(() => ({
        format: mockFormat.combine(mockFormat.colorize(), mockFormat.simple())
      }))
    }
  };
});

describe('Logger', () => {
  let logger: Logger;
  let mockWinstonLogger: jest.Mocked<winston.Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    Logger.resetInstance();
    
    // Create a mock logger
    mockWinstonLogger = {
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<winston.Logger>;

    // Get logger instance with mock logger
    logger = Logger.getInstance(mockWinstonLogger);
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
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

    it('should allow custom logger injection', () => {
      const customLogger = { 
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      } as unknown as jest.Mocked<winston.Logger>;

      const loggerWithCustomLogger = Logger.getInstance(customLogger);
      
      loggerWithCustomLogger.info('test message');
      expect(customLogger.log).toHaveBeenCalledWith('info', 'test message', expect.objectContaining({
        timestamp: expect.any(Number)
      }));
    });

    it('should use custom logger when provided', () => {
      const customLogger = { 
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      } as unknown as jest.Mocked<winston.Logger>;

      const loggerWithCustomLogger = Logger.getInstance(customLogger);
      
      loggerWithCustomLogger.log('info', 'test message');
      expect(customLogger.log).toHaveBeenCalledWith('info', 'test message', expect.objectContaining({
        timestamp: expect.any(Number)
      }));
    });
  });

  describe('log levels', () => {
    const testCases: Array<{ level: LogLevel; method: 'debug' | 'info' | 'warn' | 'error' }> = [
      { level: 'debug', method: 'debug' },
      { level: 'info', method: 'info' },
      { level: 'warn', method: 'warn' },
      { level: 'error', method: 'error' }
    ];

    testCases.forEach(({ level, method }) => {
      it(`should log ${level} messages`, () => {
        const message = `test ${level} message`;
        const metadata = { context: 'test' };
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);

        logger[method](message, metadata);

        expect(mockWinstonLogger.log).toHaveBeenCalledWith(
          level,
          message,
          {
            timestamp: now,
            context: 'test'
          }
        );
      });
    });
  });

  describe('metadata handling', () => {
    it('should merge custom metadata with timestamp', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const metadata: Partial<LogMetadata> = {
        context: 'test',
        customField: 'value'
      };

      logger.info('test message', metadata);

      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        'info',
        'test message',
        {
          timestamp: now,
          context: 'test',
          customField: 'value'
        }
      );
    });

    it('should handle undefined metadata', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      logger.info('test message');

      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        'info',
        'test message',
        {
          timestamp: now
        }
      );
    });
  });

  describe('winston configuration', () => {
    it('should configure winston with correct options', () => {
      // Reset to use default logger
      Logger.resetInstance();

      const timestampFormat = {
        type: 'timestamp',
        transform: jest.fn(),
        options: {},
        enabled: true
      };

      const jsonFormat = {
        type: 'json',
        transform: jest.fn(),
        options: {},
        enabled: true
      };

      const combinedFormat = {
        type: 'combined',
        transform: jest.fn(),
        options: {},
        enabled: true,
        formats: [timestampFormat, jsonFormat]
      };

      (winston.format.timestamp as jest.Mock).mockReturnValueOnce(timestampFormat);
      (winston.format.json as jest.Mock).mockReturnValueOnce(jsonFormat);
      (winston.format.combine as jest.Mock).mockReturnValueOnce(combinedFormat);

      Logger.getInstance();

      expect(winston.createLogger).toHaveBeenCalledWith({
        level: expect.any(String),
        format: combinedFormat,
        transports: [expect.any(Object)]
      });

      expect(winston.format.combine).toHaveBeenCalledWith(
        timestampFormat,
        jsonFormat
      );

      expect(winston.format.timestamp).toHaveBeenCalled();
      expect(winston.format.json).toHaveBeenCalled();
      expect(winston.transports.Console).toHaveBeenCalled();
    });
  });
});

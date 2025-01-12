import { ConfigMiddleware } from '../types';
import { LogMetadata } from '../../../logging/types';
import { logger } from '../../../utils/logger';

export const loggingMiddleware: ConfigMiddleware = async (config, next) => {
  const startTime = Date.now();
  logger.debug('Processing configuration', {
    timestamp: Date.now(),
    level: 'debug',
    config
  });
  
  try {
    await next(config);
    logger.debug('Configuration processed successfully', {
      timestamp: Date.now(),
      level: 'debug',
      duration: Date.now() - startTime
    });
  } catch (error) {
    logger.error('Configuration processing failed', {
      timestamp: Date.now(),
      level: 'error',
      error,
      duration: Date.now() - startTime
    });
    throw error;
  }
};

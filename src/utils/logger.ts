import * as winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

import { TransformableInfo } from 'logform';

const logFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp, ...metadata } = info;
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    })
  ]
});

export type Logger = typeof logger;

export const createChildLogger = (context: string): Logger => {
  return logger.child({ context });
};

export default logger;

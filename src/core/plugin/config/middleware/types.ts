import { ConfigValue } from '../types';

export type NextFunction = (config: ConfigValue) => Promise<void>;

export interface MiddlewareContext {
  pluginName: string;
  environment: string;
  timestamp: number;
}

export type ConfigMiddleware = (
  config: ConfigValue,
  next: NextFunction,
  context: MiddlewareContext
) => Promise<void>;

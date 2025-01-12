import { PluginConfig } from '../types';

export type NextFunction = (config: PluginConfig) => Promise<void>;

export type ConfigMiddleware = (
  config: PluginConfig,
  next: NextFunction
) => Promise<void>;

export interface MiddlewareContext {
  pluginName: string;
  environment: string;
  timestamp: number;
}

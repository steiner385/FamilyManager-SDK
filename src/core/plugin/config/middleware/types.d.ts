import { PluginConfig } from '../types';
export type NextFunction = (config: PluginConfig) => Promise<void>;
export interface MiddlewareContext {
    pluginName: string;
    environment: string;
    timestamp: number;
}
export type ConfigMiddleware = (config: PluginConfig, next: NextFunction, context: MiddlewareContext) => Promise<void>;
//# sourceMappingURL=types.d.ts.map
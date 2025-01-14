import type { RouteConfig } from './types';
export declare class PluginRouter {
    private static routes;
    static registerRoutes(pluginName: string, routes: RouteConfig[]): void;
    static getRoutes(pluginName: string): RouteConfig[];
    static getAllRoutes(): RouteConfig[];
    static unregisterRoutes(pluginName: string): void;
}
//# sourceMappingURL=PluginRouter.d.ts.map
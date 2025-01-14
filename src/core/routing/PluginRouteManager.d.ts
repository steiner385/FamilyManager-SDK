import type { RouteConfig } from './types';
export declare class PluginRouteManager {
    private static instance;
    private routes;
    private globalMiddleware;
    static getInstance(): PluginRouteManager;
    registerPluginRoutes(pluginId: string, routes: RouteConfig[]): void;
    unregisterPluginRoutes(pluginId: string): void;
    addMiddleware(middleware: (route: RouteConfig) => boolean): void;
    getAllRoutes(): RouteConfig[];
    getFilteredRoutes(): RouteConfig[];
    getPluginRoutes(pluginId: string): RouteConfig[];
}
//# sourceMappingURL=PluginRouteManager.d.ts.map
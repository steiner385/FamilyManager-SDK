export interface Route {
    path: string;
    component: any;
    exact?: boolean;
    private?: boolean;
}
export declare class RouteRegistry {
    private static instance;
    private routes;
    private constructor();
    static getInstance(): RouteRegistry;
    registerRoute(pluginId: string, route: Route): void;
    getRoute(pluginId: string, path: string): Route | undefined;
    getAllRoutes(): Route[];
    unregisterRoute(pluginId: string, route: Route): void;
    clearRoutes(): void;
}
export declare const routeRegistry: RouteRegistry;
//# sourceMappingURL=RouteRegistry.d.ts.map
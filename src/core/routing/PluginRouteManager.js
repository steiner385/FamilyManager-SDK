export class PluginRouteManager {
    constructor() {
        this.routes = new Map();
        this.globalMiddleware = [];
    }
    static getInstance() {
        if (!PluginRouteManager.instance) {
            PluginRouteManager.instance = new PluginRouteManager();
        }
        return PluginRouteManager.instance;
    }
    registerPluginRoutes(pluginId, routes) {
        this.routes.set(pluginId, routes);
    }
    unregisterPluginRoutes(pluginId) {
        this.routes.delete(pluginId);
    }
    addMiddleware(middleware) {
        this.globalMiddleware.push(middleware);
    }
    getAllRoutes() {
        return Array.from(this.routes.values()).flat();
    }
    getFilteredRoutes() {
        return this.getAllRoutes().filter(route => this.globalMiddleware.every(middleware => middleware(route)));
    }
    getPluginRoutes(pluginId) {
        return this.routes.get(pluginId) || [];
    }
}
//# sourceMappingURL=PluginRouteManager.js.map
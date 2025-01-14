export class PluginRouter {
    static registerRoutes(pluginName, routes) {
        this.routes.set(pluginName, routes);
    }
    static getRoutes(pluginName) {
        return this.routes.get(pluginName) || [];
    }
    static getAllRoutes() {
        return Array.from(this.routes.values()).flat();
    }
    static unregisterRoutes(pluginName) {
        this.routes.delete(pluginName);
    }
}
PluginRouter.routes = new Map();
//# sourceMappingURL=PluginRouter.js.map
const { logger } = require('../utils/logger');

class RouteRegistry {
    constructor() {
        this.routes = new Map();
    }
    static getInstance() {
        if (!RouteRegistry.instance) {
            RouteRegistry.instance = new RouteRegistry();
        }
        return RouteRegistry.instance;
    }
    registerRoute(pluginId, route) {
        const key = `${pluginId}:${route.path}`;
        if (this.routes.has(key)) {
            logger.warn(`Route ${key} is already registered. Overwriting...`);
        }
        this.routes.set(key, route);
        logger.debug(`Registered route ${key}`);
    }
    getRoute(pluginId, path) {
        return this.routes.get(`${pluginId}:${path}`);
    }
    getAllRoutes() {
        return Array.from(this.routes.values());
    }
    unregisterRoute(pluginId, route) {
        const key = `${pluginId}:${route.path}`;
        if (!this.routes.has(key)) {
            logger.warn(`Route ${key} is not registered`);
            return;
        }
        this.routes.delete(key);
        logger.debug(`Unregistered route ${key}`);
    }
    clearRoutes() {
        this.routes.clear();
        logger.debug('Cleared all routes');
    }
}
RouteRegistry.instance = null;
const routeRegistry = RouteRegistry.getInstance();

module.exports = {
  RouteRegistry,
  routeRegistry
};

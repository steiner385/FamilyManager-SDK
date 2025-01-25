import { logger } from '../utils/logger';

export interface Route {
  path: string;
  component: any;
  exact?: boolean;
  private?: boolean;
}

export class RouteRegistry {
  private static instance: RouteRegistry | null = null;
  private routes: Map<string, Route>;

  private constructor() {
    this.routes = new Map();
  }

  static getInstance(): RouteRegistry {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry();
    }
    return RouteRegistry.instance;
  }

  registerRoute(pluginId: string, route: Route): void {
    const key = `${pluginId}:${route.path}`;
    if (this.routes.has(key)) {
      logger.warn(`Route ${key} is already registered. Overwriting...`);
    }
    this.routes.set(key, route);
    logger.debug(`Registered route ${key}`);
  }

  getRoute(pluginId: string, path: string): Route | undefined {
    return this.routes.get(`${pluginId}:${path}`);
  }

  getAllRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  unregisterRoute(pluginId: string, route: Route): void {
    const key = `${pluginId}:${route.path}`;
    if (!this.routes.has(key)) {
      logger.warn(`Route ${key} is not registered`);
      return;
    }
    this.routes.delete(key);
    logger.debug(`Unregistered route ${key}`);
  }

  clearRoutes(): void {
    this.routes.clear();
    logger.debug('Cleared all routes');
  }
}

export const routeRegistry = RouteRegistry.getInstance();

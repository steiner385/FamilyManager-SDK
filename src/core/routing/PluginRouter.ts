import type { RouteConfig } from './types';

export class PluginRouter {
  private static routes = new Map<string, RouteConfig[]>();

  static registerRoutes(pluginName: string, routes: RouteConfig[]) {
    this.routes.set(pluginName, routes);
  }

  static getRoutes(pluginName: string): RouteConfig[] {
    return this.routes.get(pluginName) || [];
  }

  static getAllRoutes(): RouteConfig[] {
    return Array.from(this.routes.values()).flat();
  }

  static unregisterRoutes(pluginName: string) {
    this.routes.delete(pluginName);
  }
}

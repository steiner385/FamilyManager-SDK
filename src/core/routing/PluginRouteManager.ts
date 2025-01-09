interface RouteConfig {
  path: string
  component: React.ComponentType
  meta?: {
    title?: string
    auth?: boolean
    permissions?: string[]
    layout?: React.ComponentType
  }
}

export class PluginRouteManager {
  private static instance: PluginRouteManager
  private routes = new Map<string, RouteConfig[]>()
  private globalMiddleware: ((route: RouteConfig) => boolean)[] = []

  static getInstance(): PluginRouteManager {
    if (!PluginRouteManager.instance) {
      PluginRouteManager.instance = new PluginRouteManager()
    }
    return PluginRouteManager.instance
  }

  registerPluginRoutes(pluginId: string, routes: RouteConfig[]) {
    this.routes.set(pluginId, routes)
  }

  unregisterPluginRoutes(pluginId: string) {
    this.routes.delete(pluginId)
  }

  addMiddleware(middleware: (route: RouteConfig) => boolean) {
    this.globalMiddleware.push(middleware)
  }

  getAllRoutes(): RouteConfig[] {
    return Array.from(this.routes.values()).flat()
  }

  getFilteredRoutes(): RouteConfig[] {
    return this.getAllRoutes().filter(route =>
      this.globalMiddleware.every(middleware => middleware(route))
    )
  }

  getPluginRoutes(pluginId: string): RouteConfig[] {
    return this.routes.get(pluginId) || []
  }
}

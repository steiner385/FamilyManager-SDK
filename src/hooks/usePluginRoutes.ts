import { useEffect, useState } from 'react';
import { PluginRouteManager } from '../core/routing/PluginRouteManager';
import type { RouteConfig } from '../core/routing/types';

export function usePluginRoutes(pluginId?: string): RouteConfig[] {
  const manager = PluginRouteManager.getInstance();
  const [routes, setRoutes] = useState<RouteConfig[]>(
    pluginId ? manager.getPluginRoutes(pluginId) : manager.getFilteredRoutes()
  );

  useEffect(() => {
    // Re-fetch routes when they might have changed
    setRoutes(
      pluginId ? manager.getPluginRoutes(pluginId) : manager.getFilteredRoutes()
    );
  }, [pluginId]);

  return routes;
}

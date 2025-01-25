import { useNavigate } from 'react-router-dom';
import { PluginRouter } from '../core/routing/PluginRouter';
import type { RouteConfig } from '../core/routing/types';

interface UsePluginNavigationResult {
  navigateToRoute: (path: string) => void;
  getRoutes: () => RouteConfig[];
}

export function usePluginNavigation(pluginName: string): UsePluginNavigationResult {
  const navigate = useNavigate();

  return {
    navigateToRoute: (path: string) => {
      const routes = PluginRouter.getRoutes(pluginName);
      const route = routes.find(r => r.path === path);
      if (route) {
        navigate(path);
      }
    },
    getRoutes: () => PluginRouter.getRoutes(pluginName),
  };
}

import type { RouteConfig } from '../core/routing/types';
interface UsePluginNavigationResult {
    navigateToRoute: (path: string) => void;
    getRoutes: () => RouteConfig[];
}
export declare function usePluginNavigation(pluginName: string): UsePluginNavigationResult;
export {};
//# sourceMappingURL=usePluginNavigation.d.ts.map
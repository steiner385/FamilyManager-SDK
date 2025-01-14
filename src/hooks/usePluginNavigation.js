import { useNavigate } from 'react-router-dom';
import { PluginRouter } from '../core/routing/PluginRouter';
export function usePluginNavigation(pluginName) {
    const navigate = useNavigate();
    return {
        navigateToRoute: (path) => {
            const routes = PluginRouter.getRoutes(pluginName);
            const route = routes.find(r => r.path === path);
            if (route) {
                navigate(path);
            }
        },
        getRoutes: () => PluginRouter.getRoutes(pluginName),
    };
}
//# sourceMappingURL=usePluginNavigation.js.map
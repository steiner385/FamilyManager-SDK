import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useComponentState } from '../hooks/useComponentState';
import { usePluginNavigation } from '../hooks/usePluginNavigation';
import { useAccessibility } from '../hooks/useAccessibility';
import { useAnalytics } from '../hooks/useAnalytics';
export function EnhancedComponent({ pluginName }) {
    const componentId = 'enhanced-component';
    // State management with persistence
    const [count, setCount] = useComponentState(componentId, 0, {
        persist: true,
        scope: 'local',
    });
    // Plugin navigation
    const { navigateToRoute, getRoutes } = usePluginNavigation(pluginName);
    // Accessibility
    const { enhanceElement } = useAccessibility(componentId, {
        ariaLabel: 'Enhanced component example',
        role: 'button',
    });
    // Analytics
    const { trackEvent } = useAnalytics(componentId);
    const handleClick = () => {
        setCount(prev => prev + 1);
        trackEvent('increment', { count: count + 1 });
    };
    return enhanceElement(_jsxs("div", { onClick: handleClick, children: [_jsx("h2", { children: "Enhanced Component" }), _jsxs("p", { children: ["Count: ", count] }), _jsx("nav", { children: getRoutes().map(route => (_jsx("button", { onClick: () => navigateToRoute(route.path), children: route.meta?.title }, route.path))) })] }));
}
//# sourceMappingURL=EnhancedComponent.js.map
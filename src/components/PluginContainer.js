import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePlugin } from '../hooks/usePlugin';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { LoadingSpinner } from './common/LoadingSpinner';
import ErrorBoundary from './common/ErrorBoundary';
export function PluginContainer({ pluginName, className = '' }) {
    const { plugin, isReady, error } = usePlugin(pluginName);
    const { pluginLayouts } = usePluginUIStore();
    if (error) {
        return (_jsxs("div", { className: "p-4 bg-red-50 text-red-700 rounded-md", role: "alert", children: [_jsx("h3", { className: "font-medium", children: "Plugin Error" }), _jsx("p", { className: "mt-1 text-sm", children: error.message })] }));
    }
    if (!isReady || !plugin) {
        return (_jsx("div", { className: "flex justify-center items-center p-4", children: _jsx(LoadingSpinner, { size: "medium", label: `Loading ${pluginName}` }) }));
    }
    const layoutId = pluginLayouts[plugin.id] || plugin.defaultLayout;
    return (_jsx(ErrorBoundary, { fallback: _jsx("div", { className: "p-4 bg-red-50 text-red-700 rounded-md", children: "Failed to render plugin content" }), children: _jsx("div", { className: className, "data-plugin-id": plugin.id, children: layoutId ? (_jsx("div", { className: "h-full", children: plugin.routes?.map(route => (_jsx(route.component, {}, route.path))) })) : (_jsx("div", { className: "p-4 text-gray-500", children: "No layout configured for this plugin" })) }) }));
}
//# sourceMappingURL=PluginContainer.js.map
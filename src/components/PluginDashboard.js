import { jsx as _jsx } from "react/jsx-runtime";
import { PluginManager } from '../core/plugin/PluginManager';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { PluginContainer } from './PluginContainer';
export function PluginDashboard() {
    const manager = PluginManager.getInstance();
    const { visiblePlugins } = usePluginUIStore();
    const plugins = Array.from(visiblePlugins)
        .map(name => manager.getPlugin(name))
        .filter((plugin) => {
        if (!plugin)
            return false;
        return ('id' in plugin &&
            'name' in plugin &&
            'status' in plugin &&
            'config' in plugin &&
            'state' in plugin &&
            'metadata' in plugin);
    });
    if (!plugins.length) {
        return (_jsx("div", { className: "p-4 text-gray-500 text-center", children: "No plugins are currently visible" }));
    }
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: plugins.map(plugin => (_jsx(PluginContainer, { pluginName: plugin.name, className: "h-full" }, plugin.id))) }));
}
//# sourceMappingURL=PluginDashboard.js.map
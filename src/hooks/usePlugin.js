import { useEffect, useState } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
export function usePlugin(pluginName) {
    const [state, setState] = useState({
        plugin: null,
        isReady: false,
        error: null
    });
    useEffect(() => {
        const manager = PluginManager.getInstance();
        async function initializePlugin() {
            try {
                const plugin = manager.getPlugin(pluginName);
                if (!plugin) {
                    setState({
                        plugin: null,
                        isReady: false,
                        error: new Error(`Plugin ${pluginName} not found`)
                    });
                    return;
                }
                if (!manager.isInitialized(pluginName)) {
                    await manager.initializePlugin(pluginName);
                }
                setState({
                    plugin,
                    isReady: true,
                    error: null
                });
            }
            catch (error) {
                setState({
                    plugin: null,
                    isReady: false,
                    error: error instanceof Error ? error : new Error('Failed to initialize plugin')
                });
            }
        }
        initializePlugin();
    }, [pluginName]);
    return state;
}
//# sourceMappingURL=usePlugin.js.map
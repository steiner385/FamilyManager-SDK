import { useState, useEffect } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
export function usePluginMetrics(pluginName, timeRange) {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!pluginName)
            return;
        const fetchMetrics = async () => {
            setIsLoading(true);
            try {
                const manager = PluginManager.getInstance();
                const plugin = manager.getPlugin(pluginName);
                if (!plugin || !plugin.getPluginMetrics) {
                    throw new Error(`Plugin ${pluginName} does not support metrics`);
                }
                const data = await plugin.getPluginMetrics(pluginName, timeRange);
                setMetrics(data);
            }
            catch (err) {
                setError(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [pluginName, timeRange]);
    return { metrics, isLoading, error };
}
//# sourceMappingURL=usePluginMetrics.js.map
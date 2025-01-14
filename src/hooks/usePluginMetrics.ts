import { useState, useEffect } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
import { PluginMetrics } from '../core/plugin/types';

export function usePluginMetrics(pluginName: string, timeRange: string) {
  const [metrics, setMetrics] = useState<PluginMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pluginName) return;

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
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [pluginName, timeRange]);

  return { metrics, isLoading, error };
}

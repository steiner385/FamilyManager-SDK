import { useEffect, useState } from 'react';
import { Plugin } from '../core/plugin/types';
import { pluginManager } from '../core/plugin/PluginManager';

export function usePlugin(pluginName: string): {
  plugin: Plugin | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPlugin = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const existingPlugin = pluginManager.getPlugin(pluginName);
        if (!existingPlugin) {
          throw new Error(`Plugin ${pluginName} not found`);
        }

        if (!pluginManager.isInitialized(pluginName)) {
          await pluginManager.registerPlugin(existingPlugin);
        }

        if (mounted) {
          setPlugin(existingPlugin);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load plugin'));
          setIsLoading(false);
        }
      }
    };

    loadPlugin();

    return () => {
      mounted = false;
    };
  }, [pluginName]);

  return { plugin, isLoading, error };
}

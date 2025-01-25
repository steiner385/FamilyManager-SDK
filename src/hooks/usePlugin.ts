import { useEffect, useState } from 'react';
import { Plugin } from '../core/plugin/types';
import { PluginManager } from '../core/plugin/PluginManager';

export function usePlugin(pluginId: string) {
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const manager = PluginManager.getInstance();
    
    const initializePlugin = async () => {
      try {
        const existingPlugin = manager.getPlugin(pluginId);
        
        if (!existingPlugin) {
          throw new Error(`Plugin ${pluginId} not found`);
        }

        if (!manager.isInitialized(pluginId)) {
          await manager.initializePlugin(pluginId);
        }

        setPlugin(existingPlugin);
        setIsReady(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load plugin'));
        setPlugin(null);
        setIsReady(false);
      }
    };

    if (manager.isInitialized(pluginId)) {
      const existingPlugin = manager.getPlugin(pluginId);
      if (existingPlugin) {
        setPlugin(existingPlugin);
        setIsReady(true);
        setError(null);
      } else {
        setError(new Error(`Plugin ${pluginId} not found`));
        setIsReady(false);
      }
    } else {
      initializePlugin();
    }
  }, [pluginId]);

  return { plugin, isReady, error };
}

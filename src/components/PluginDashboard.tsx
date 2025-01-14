import { Plugin } from '../types/plugin';
import { PluginManager } from '../core/plugin/PluginManager';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { PluginContainer } from './PluginContainer';

export function PluginDashboard() {
  const manager = PluginManager.getInstance();
  const { visiblePlugins } = usePluginUIStore();

  const plugins = Array.from(visiblePlugins)
    .map(name => manager.getPlugin(name))
    .filter((maybePlugin): maybePlugin is Plugin => {
      return maybePlugin !== undefined && 
             maybePlugin.config !== undefined &&
             maybePlugin.config.metadata !== undefined;
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plugins.map(plugin => (
        <PluginContainer
          key={plugin.id}
          pluginName={plugin.name}
          className="h-full"
        />
      ))}
    </div>
  );
}

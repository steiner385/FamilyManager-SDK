import { Plugin } from '../core/plugin/types';
import { PluginManager } from '../core/plugin/PluginManager';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { PluginContainer } from './PluginContainer';

export function PluginDashboard() {
  const manager = PluginManager.getInstance();
  const { visiblePlugins } = usePluginUIStore();

  const plugins = Array.from(visiblePlugins)
    .map(name => manager.getPlugin(name))
    .filter((plugin): plugin is Plugin => {
      if (!plugin) return false;
      return (
        'id' in plugin &&
        'name' in plugin &&
        'status' in plugin &&
        'config' in plugin &&
        'state' in plugin &&
        'metadata' in plugin
      );
    });

  if (!plugins.length) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No plugins are currently visible
      </div>
    );
  }

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

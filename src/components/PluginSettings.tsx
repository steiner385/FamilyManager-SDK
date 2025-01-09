import { usePlugin } from '../hooks/usePlugin';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { Card } from '../../components/common/Card';
import { Switch } from '../../components/common/Switch';
import { Select } from '../../components/common/Select';
import { PluginLayout, PluginPreference } from '../core/types';

interface PluginSettingsProps {
  pluginName: string;
}

export function PluginSettings({ pluginName }: PluginSettingsProps) {
  const { plugin } = usePlugin(pluginName);
  const { 
    visiblePlugins, 
    pluginLayouts,
    pluginPreferences,
    setPluginVisibility,
    setPluginLayout,
    setPluginPreference
  } = usePluginUIStore();

  if (!plugin) return null;

  const isVisible = visiblePlugins.has(pluginName);
  const currentLayout = pluginLayouts[pluginName];
  const preferences = pluginPreferences[pluginName] || {};
  const layouts = plugin.config.metadata.layouts || [];
  const pluginPrefs = plugin.config.metadata.preferences || [];

  return (
    <Card title={`${plugin.config.metadata.name} Settings`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Plugin</span>
          <Switch
            checked={isVisible}
            onChange={(checked) => setPluginVisibility(pluginName, checked)}
          />
        </div>

        {layouts.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <Select
              value={currentLayout || ''}
              onChange={(e) => setPluginLayout(pluginName, e.target.value)}
              options={layouts.map((layout: PluginLayout) => ({
                value: layout.id,
                label: layout.name
              }))}
            />
          </div>
        )}

        {pluginPrefs.map((pref: PluginPreference) => (
          <div key={pref.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {pref.label}
            </label>
            {pref.type === 'boolean' ? (
              <Switch
                checked={preferences[pref.key] ?? pref.defaultValue ?? false}
                onChange={(checked) => 
                  setPluginPreference(pluginName, pref.key, checked)
                }
              />
            ) : (
              <input
                type={pref.type === 'number' ? 'number' : 'text'}
                value={preferences[pref.key] ?? pref.defaultValue ?? ''}
                onChange={(e) => 
                  setPluginPreference(
                    pluginName, 
                    pref.key, 
                    pref.type === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

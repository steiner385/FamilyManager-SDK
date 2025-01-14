import { usePlugin } from '../hooks/usePlugin';
import { usePluginUIStore } from '../core/store/PluginUIStore';
import { Card } from './common/Card';
import { Switch } from './common/Switch';
import { Select } from './common/Select';
import { PluginLayout, PluginPreference } from '../core/plugin/types';
import { ChangeEvent } from 'react';

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
  const layouts = plugin.metadata.layouts || [];
  const pluginPrefs = plugin.metadata.preferences || [];

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPluginVisibility(pluginName, e.target.checked);
  };

  const handleLayoutChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPluginLayout(pluginName, e.target.value);
  };

  const handlePreferenceChange = (key: string, value: boolean | string | number) => {
    setPluginPreference(pluginName, key, value);
  };

  const handlePreferenceSwitchChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    handlePreferenceChange(key, e.target.checked);
  };

  const handlePreferenceInputChange = (key: string, type: 'number' | 'string') => (e: ChangeEvent<HTMLInputElement>) => {
    const value = type === 'number' ? Number(e.target.value) : e.target.value;
    handlePreferenceChange(key, value);
  };

  return (
    <Card title={`${plugin.name} Settings`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Plugin</span>
          <Switch
            checked={isVisible}
            onChange={handleSwitchChange}
          />
        </div>

        {layouts.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <Select
              value={currentLayout || ''}
              onChange={handleLayoutChange}
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
                onChange={handlePreferenceSwitchChange(pref.key)}
              />
            ) : (
              <input
                type={pref.type === 'number' ? 'number' : 'text'}
                value={preferences[pref.key] ?? pref.defaultValue ?? ''}
                onChange={handlePreferenceInputChange(pref.key, pref.type)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

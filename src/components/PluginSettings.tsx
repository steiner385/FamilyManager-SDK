import React, { useState, useCallback } from 'react';
import { Plugin, PluginLayout, PluginPreference } from '../core/plugin/types';
import { Switch } from './common/Switch';
import { Input } from './common/Input';
import { Select } from './common/Select';

interface PluginSettingsProps {
  plugin: Plugin;
  onLayoutChange?: (layoutId: string) => void;
  onPreferenceChange?: (key: string, value: unknown) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

type PreferenceValue = string | number | boolean;

export function PluginSettings({ plugin, onLayoutChange, onPreferenceChange }: PluginSettingsProps) {
  const [preferences, setPreferences] = useState<Record<string, PreferenceValue>>({});
  const layouts = plugin.metadata.layouts || [];
  const pluginPrefs = plugin.metadata.preferences || [];

  const handleLayoutChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const layoutId = event.target.value;
      onLayoutChange?.(layoutId);
    },
    [onLayoutChange]
  );

  const handlePreferenceSwitchChange = useCallback(
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setPreferences(prev => ({ ...prev, [key]: newValue }));
      onPreferenceChange?.(key, newValue);
    },
    [onPreferenceChange]
  );

  const handlePreferenceInputChange = useCallback(
    (key: string, type: 'string' | 'number') => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value: string | number = event.target.value;
      if (type === 'number') {
        value = parseFloat(value);
        if (isNaN(value)) return;
      }
      setPreferences(prev => ({ ...prev, [key]: value }));
      onPreferenceChange?.(key, value);
    },
    [onPreferenceChange]
  );

  const handlePreferenceSelectChange = useCallback(
    (key: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setPreferences(prev => ({ ...prev, [key]: value }));
      onPreferenceChange?.(key, value);
    },
    [onPreferenceChange]
  );

  const getPreferenceValue = (pref: PluginPreference): PreferenceValue => {
    const value = preferences[pref.key];
    if (value !== undefined) return value;
    return (pref.default as PreferenceValue) ?? getDefaultValue(pref.type);
  };

  const getDefaultValue = (type: string): PreferenceValue => {
    switch (type) {
      case 'boolean':
        return false;
      case 'number':
        return 0;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {layouts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Layout</label>
          <Select
            className="mt-1"
            value={plugin.defaultLayout || ''}
            onChange={handleLayoutChange}
            options={layouts.map((layout: PluginLayout) => ({
              value: layout.id,
              label: layout.name
            }))}
          />
        </div>
      )}

      {pluginPrefs.map((pref: PluginPreference) => (
        <div key={pref.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{pref.label}</label>
          {pref.type === 'boolean' && (
            <Switch
              checked={getPreferenceValue(pref) as boolean}
              onChange={handlePreferenceSwitchChange(pref.key)}
            />
          )}
          {(pref.type === 'string' || pref.type === 'number') && (
            <Input
              type={pref.type === 'number' ? 'number' : 'text'}
              value={String(getPreferenceValue(pref))}
              onChange={handlePreferenceInputChange(pref.key, pref.type)}
            />
          )}
          {pref.type === 'select' && pref.options && (
            <Select
              value={String(getPreferenceValue(pref))}
              onChange={handlePreferenceSelectChange(pref.key)}
              options={pref.options.map(opt => ({
                value: String(opt.value),
                label: opt.label
              }))}
            />
          )}
        </div>
      ))}
    </div>
  );
}

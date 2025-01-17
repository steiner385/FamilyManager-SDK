const { jsx: _jsx, jsxs: _jsxs } = require("react/jsx-runtime");
const { usePlugin } = require('../hooks/usePlugin');
const { usePluginUIStore } = require('../core/store/PluginUIStore');
const { Card } = require('./common/Card');
const { Switch } = require('./common/Switch');
const { Select } = require('./common/Select');

function PluginSettings({ pluginName }) {
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

    const handleSwitchChange = (e) => {
        setPluginVisibility(pluginName, e.target.checked);
    };

    const handleLayoutChange = (e) => {
        setPluginLayout(pluginName, e.target.value);
    };

    const handlePreferenceChange = (key, value) => {
        setPluginPreference(pluginName, key, value);
    };

    const handlePreferenceSwitchChange = (key) => (e) => {
        handlePreferenceChange(key, e.target.checked);
    };

    const handlePreferenceInputChange = (key, type) => (e) => {
        const value = type === 'number' ? Number(e.target.value) : e.target.value;
        handlePreferenceChange(key, value);
    };

    return _jsx(Card, { 
        title: `${plugin.name} Settings`, 
        children: _jsxs("div", { 
            className: "space-y-6", 
            children: [
                _jsxs("div", { 
                    className: "flex items-center justify-between", 
                    children: [
                        _jsx("span", { 
                            className: "text-sm font-medium text-gray-700", 
                            children: "Enable Plugin" 
                        }),
                        _jsx(Switch, { 
                            checked: isVisible, 
                            onChange: handleSwitchChange 
                        })
                    ]
                }),
                layouts.length > 0 && _jsxs("div", { 
                    children: [
                        _jsx("label", { 
                            className: "block text-sm font-medium text-gray-700 mb-1", 
                            children: "Layout" 
                        }),
                        _jsx(Select, { 
                            value: currentLayout || '', 
                            onChange: handleLayoutChange, 
                            options: layouts.map(layout => ({
                                value: layout.id,
                                label: layout.name
                            }))
                        })
                    ]
                }),
                pluginPrefs.map(pref => _jsxs("div", { 
                    children: [
                        _jsx("label", { 
                            className: "block text-sm font-medium text-gray-700 mb-1", 
                            children: pref.label 
                        }),
                        pref.type === 'boolean' ? 
                            _jsx(Switch, { 
                                checked: preferences[pref.key] ?? pref.defaultValue ?? false, 
                                onChange: handlePreferenceSwitchChange(pref.key) 
                            }) :
                            _jsx("input", { 
                                type: pref.type === 'number' ? 'number' : 'text',
                                value: preferences[pref.key] ?? pref.defaultValue ?? '',
                                onChange: handlePreferenceInputChange(pref.key, pref.type),
                                className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            })
                    ] 
                }, pref.key))
            ]
        })
    });
}

module.exports = PluginSettings;

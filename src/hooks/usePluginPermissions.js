const { useState, useEffect } = require('react');
const { PluginManager } = require('../core/plugin/PluginManager');
const { usePermissions } = require('./usePermissions');

function usePluginPermissions(pluginName) {
    const [permissions, setPermissions] = useState([]);
    const { hasPermission } = usePermissions();
    const manager = PluginManager.getInstance();

    useEffect(() => {
        const plugin = manager.getPlugin(pluginName);
        if (plugin?.permissions) {
            const grantedPermissions = plugin.permissions
                .filter(p => hasPermission(`plugin:${pluginName}:${p}`));
            setPermissions(grantedPermissions);
        }
    }, [pluginName, hasPermission]);

    const hasPluginPermission = (permission) => {
        return permissions.includes(permission);
    };

    return {
        permissions,
        hasPluginPermission
    };
}

module.exports = usePluginPermissions;

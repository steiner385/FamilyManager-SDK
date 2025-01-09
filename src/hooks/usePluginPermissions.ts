import { useState, useEffect } from 'react'
import { PluginManager } from '../core/plugin/PluginManager'
import { usePermissions } from '@/hooks/usePermissions'

export function usePluginPermissions(pluginName: string) {
  const [permissions, setPermissions] = useState<string[]>([])
  const { hasPermission } = usePermissions()
  const manager = PluginManager.getInstance()

  useEffect(() => {
    const plugin = manager.getPlugin(pluginName)
    if (plugin?.permissions) {
      const grantedPermissions = plugin.permissions
        .filter(p => hasPermission(`plugin:${pluginName}:${p.name}`))
        .map(p => p.name)
      setPermissions(grantedPermissions)
    }
  }, [pluginName, hasPermission])

  const hasPluginPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  return {
    permissions,
    hasPluginPermission
  }
}

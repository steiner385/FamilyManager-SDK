import { useEffect, useState } from 'react'
import { PluginRouteManager } from '../core/routing/PluginRouteManager'

export function usePluginRoutes(pluginId?: string) {
  const manager = PluginRouteManager.getInstance()
  const [routes, setRoutes] = useState(
    pluginId ? manager.getPluginRoutes(pluginId) : manager.getFilteredRoutes()
  )

  useEffect(() => {
    // Re-fetch routes when they might have changed
    setRoutes(
      pluginId ? manager.getPluginRoutes(pluginId) : manager.getFilteredRoutes()
    )
  }, [pluginId])

  return routes
}

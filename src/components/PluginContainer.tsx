import React from 'react'
import { usePlugin } from '../hooks/usePlugin'
import { usePluginUIStore } from '../core/store/PluginUIStore'
import { LoadingSpinner } from './common/LoadingSpinner'
import ErrorBoundary from './common/ErrorBoundary'

interface PluginContainerProps {
  pluginName: string
  className?: string
}

export function PluginContainer({ pluginName, className = '' }: PluginContainerProps) {
  const { plugin, isReady, error } = usePlugin(pluginName)
  const { pluginLayouts } = usePluginUIStore()

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md" role="alert">
        <h3 className="font-medium">Plugin Error</h3>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    )
  }

  if (!isReady || !plugin) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="medium" label={`Loading ${pluginName}`} />
      </div>
    )
  }

  const layoutId = pluginLayouts[plugin.id] || plugin.defaultLayout

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          Failed to render plugin content
        </div>
      }
    >
      <div className={className} data-plugin-id={plugin.id}>
        {layoutId ? (
          <div className="h-full">
            {plugin.routes?.map(route => (
              <route.component key={route.path} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-500">
            No layout configured for this plugin
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

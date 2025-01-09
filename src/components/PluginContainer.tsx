import { usePlugin } from '../hooks/usePlugin'
import { usePluginUIStore } from '../core/store/PluginUIStore'
import { DynamicLayout } from './DynamicLayout'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

interface PluginContainerProps {
  pluginName: string
  className?: string
}

export function PluginContainer({ pluginName, className = '' }: PluginContainerProps) {
  const { plugin, isReady, error } = usePlugin(pluginName)
  const { pluginLayouts } = usePluginUIStore()
  
  if (error) {
    return (
      <div className="p-4 bg-error-50 text-error-500 rounded-md">
        Failed to load plugin: {error.message}
      </div>
    )
  }

  if (!isReady) {
    return <LoadingSpinner className="m-4" />
  }

  const layoutId = pluginLayouts[pluginName] || plugin?.defaultLayout

  return (
    <div className={className}>
      {layoutId ? (
        <DynamicLayout layoutId={layoutId} />
      ) : (
        <div className="p-4 text-gray-500">
          No layout configured for this plugin
        </div>
      )}
    </div>
  )
}

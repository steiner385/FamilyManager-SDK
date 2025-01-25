import { useComponentState } from '../hooks/useComponentState'
import { usePluginNavigation } from '../hooks/usePluginNavigation'
import { useAccessibility } from '../hooks/useAccessibility'
import { useAnalytics } from '../hooks/useAnalytics'

interface Props {
  pluginName: string
}

export function EnhancedComponent({ pluginName }: Props) {
  const componentId = 'enhanced-component'

  // State management with persistence
  const [count, setCount] = useComponentState(componentId, 0, {
    persist: true,
    scope: 'local',
  })

  // Plugin navigation
  const { navigateToRoute, getRoutes } = usePluginNavigation(pluginName)

  // Accessibility
  const { enhanceElement } = useAccessibility(componentId, {
    ariaLabel: 'Enhanced component example',
    role: 'button',
  })

  // Analytics
  const { trackEvent } = useAnalytics(componentId)

  const handleClick = () => {
    setCount(prev => prev + 1)
    trackEvent('increment', { count: count + 1 })
  }

  return enhanceElement(
    <div onClick={handleClick}>
      <h2>Enhanced Component</h2>
      <p>Count: {count}</p>
      <nav>
        {getRoutes().map(route => (
          <button
            key={route.path}
            onClick={() => navigateToRoute(route.path)}
          >
            {route.meta?.title}
          </button>
        ))}
      </nav>
    </div>
  )
}

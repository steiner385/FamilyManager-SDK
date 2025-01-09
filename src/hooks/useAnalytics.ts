import { useCallback } from 'react'
import { AnalyticsTracker } from '../core/analytics/AnalyticsTracker'

export function useAnalytics(componentId: string) {
  const trackEvent = useCallback(
    (action: string, metadata?: Record<string, any>) => {
      AnalyticsTracker.trackComponentEvent(componentId, action, metadata)
    },
    [componentId]
  )

  return { trackEvent }
}

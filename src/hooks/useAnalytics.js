import { useCallback } from 'react';
import { AnalyticsTracker } from '../core/analytics/AnalyticsTracker';
export function useAnalytics(componentId) {
    const trackEvent = useCallback((action, metadata) => {
        AnalyticsTracker.trackComponentEvent(componentId, action, metadata);
    }, [componentId]);
    return { trackEvent };
}
//# sourceMappingURL=useAnalytics.js.map
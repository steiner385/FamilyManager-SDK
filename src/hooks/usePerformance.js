import { useEffect, useCallback } from 'react';
import { PerformanceMonitor } from '../core/performance/PerformanceMonitor';
export function usePerformance(componentId) {
    const monitor = PerformanceMonitor.getInstance();
    const trackMetric = useCallback((type, value, metadata) => {
        monitor.trackMetric(type, value, {
            ...metadata,
            componentId
        });
    }, [componentId]);
    const trackRender = useCallback(() => {
        trackMetric('render', performance.now());
    }, [trackMetric]);
    useEffect(() => {
        trackRender();
    }, [trackRender]);
    return {
        trackMetric,
        trackRender,
        getMetrics: monitor.getMetrics.bind(monitor)
    };
}
//# sourceMappingURL=usePerformance.js.map
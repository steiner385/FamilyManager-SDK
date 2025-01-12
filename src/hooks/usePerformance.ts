import { useEffect, useCallback } from 'react';
import { PerformanceMonitor } from '../core/performance/PerformanceMonitor';
import type { PerformanceMetric, TimeRange } from '../core/performance/types';

interface UsePerformanceResult {
  trackMetric: (type: string, value: number, metadata?: Record<string, any>) => void;
  trackRender: () => void;
  getMetrics: (filter?: (metric: PerformanceMetric) => boolean, timeRange?: TimeRange) => PerformanceMetric[];
}

export function usePerformance(componentId: string): UsePerformanceResult {
  const monitor = PerformanceMonitor.getInstance();

  const trackMetric = useCallback((
    type: string,
    value: number,
    metadata?: Record<string, any>
  ) => {
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

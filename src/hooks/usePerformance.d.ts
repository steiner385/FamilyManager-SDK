import type { PerformanceMetric, TimeRange } from '../core/performance/types';
interface UsePerformanceResult {
    trackMetric: (type: string, value: number, metadata?: Record<string, any>) => void;
    trackRender: () => void;
    getMetrics: (filter?: (metric: PerformanceMetric) => boolean, timeRange?: TimeRange) => PerformanceMetric[];
}
export declare function usePerformance(componentId: string): UsePerformanceResult;
export {};
//# sourceMappingURL=usePerformance.d.ts.map
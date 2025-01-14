import type { PerformanceMetric, TimeRange } from './types';
export declare class PerformanceMonitor {
    private static instance;
    private metrics;
    private subscribers;
    private readonly metricsLimit;
    static getInstance(): PerformanceMonitor;
    trackMetric(type: string, value: number, metadata?: Record<string, any>): void;
    subscribe(callback: (metric: PerformanceMetric) => void, filter?: (metric: PerformanceMetric) => boolean): () => void;
    private unsubscribe;
    private notifySubscribers;
    getMetrics(filter?: (metric: PerformanceMetric) => boolean, timeRange?: TimeRange): PerformanceMetric[];
    clearMetrics(): void;
}
//# sourceMappingURL=PerformanceMonitor.d.ts.map
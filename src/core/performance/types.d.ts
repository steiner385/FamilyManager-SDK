export interface PerformanceMetric {
    type: string;
    value: number;
    timestamp: number;
    metadata?: Record<string, any>;
}
export interface PerformanceSubscriber {
    callback: (metric: PerformanceMetric) => void;
    filter?: (metric: PerformanceMetric) => boolean;
}
export interface TimeRange {
    start: number;
    end: number;
}
//# sourceMappingURL=types.d.ts.map
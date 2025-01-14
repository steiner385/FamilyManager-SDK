export interface PerformanceMetrics {
    startTime: number;
    eventCount: number;
    errorCount: number;
    maxLatency: number;
    totalLatency: number;
    memoryUsage: NodeJS.MemoryUsage;
    MAX_LATENCY_MS: number;
    MIN_EVENTS_PER_SEC: number;
    MAX_ERROR_RATE: number;
    MAX_MEMORY_MB: number;
    trackEvent: (latencyMs: number) => void;
    trackError: () => void;
    reset: () => void;
}
declare global {
    var __PERFORMANCE_METRICS__: PerformanceMetrics | undefined;
}
export {};
//# sourceMappingURL=types.d.ts.map
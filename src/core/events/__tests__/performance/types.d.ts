export interface PerformanceMetrics {
    startTime: number;
    eventCount: number;
    errorCount: number;
    maxLatency: number;
    totalLatency: number;
    memoryUsage: ReturnType<typeof process.memoryUsage>;
    MAX_LATENCY_MS: number;
    MIN_EVENTS_PER_SEC: number;
    MAX_ERROR_RATE: number;
    MAX_MEMORY_MB: number;
    trackEvent: (latencyMs: number) => void;
    trackError: () => void;
    reset: () => void;
}
import '../../../events/performance/metrics';
export {};
//# sourceMappingURL=types.d.ts.map
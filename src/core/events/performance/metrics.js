const metrics = {
    startTime: Date.now(),
    eventCount: 0,
    errorCount: 0,
    maxLatency: 0,
    totalLatency: 0,
    memoryUsage: process.memoryUsage(),
    MAX_LATENCY_MS: 100,
    MIN_EVENTS_PER_SEC: 1000,
    MAX_ERROR_RATE: 0.01,
    MAX_MEMORY_MB: 512,
    trackEvent(latencyMs) {
        this.eventCount++;
        this.totalLatency += latencyMs;
        this.maxLatency = Math.max(this.maxLatency, latencyMs);
        this.memoryUsage = process.memoryUsage();
    },
    trackError() {
        this.errorCount++;
        this.memoryUsage = process.memoryUsage();
    },
    reset() {
        this.startTime = Date.now();
        this.eventCount = 0;
        this.errorCount = 0;
        this.maxLatency = 0;
        this.totalLatency = 0;
        this.memoryUsage = process.memoryUsage();
    }
};
// Initialize global metrics
global.__PERFORMANCE_METRICS__ = metrics;
export { metrics };
//# sourceMappingURL=metrics.js.map
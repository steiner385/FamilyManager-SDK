import { PerformanceMetrics } from '../__tests__/performance/types';

const metrics: PerformanceMetrics = {
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

  trackEvent(latencyMs: number) {
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
(global as any).__PERFORMANCE_METRICS__ = metrics;

export { metrics };

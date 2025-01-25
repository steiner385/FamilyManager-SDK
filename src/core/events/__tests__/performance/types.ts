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


import { describe, it, expect, beforeAll } from '@jest/globals';
import '../../../events/performance/metrics';

describe('Performance Types', () => {
  beforeAll(() => {
    // Reset metrics before tests
    global.__PERFORMANCE_METRICS__?.reset();
  });

  it('should define global performance metrics', () => {
    expect(global.__PERFORMANCE_METRICS__).toBeDefined();
    expect(global.__PERFORMANCE_METRICS__?.eventCount).toBe(0);
    expect(global.__PERFORMANCE_METRICS__?.errorCount).toBe(0);
  });
});

export {};

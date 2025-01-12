import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PerformanceMonitor } from '../PerformanceMonitor';
import type { PerformanceMetric, TimeRange } from '../types';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    // Reset singleton instance
    (PerformanceMonitor as any).instance = null;
    monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
    jest.clearAllMocks();
  });

  it('should maintain singleton instance', () => {
    const instance1 = PerformanceMonitor.getInstance();
    const instance2 = PerformanceMonitor.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('Metric Tracking', () => {
    it('should track metrics correctly', () => {
      const metric = {
        type: 'test-metric',
        value: 100,
        metadata: { test: true }
      };

      monitor.trackMetric(metric.type, metric.value, metric.metadata);
      const metrics = monitor.getMetrics();

      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toMatchObject(metric);
      expect(metrics[0].timestamp).toBeDefined();
    });

    it('should enforce metrics limit', () => {
      const limit = (monitor as any).metricsLimit;
      const extraMetrics = 10;

      // Add more metrics than the limit
      for (let i = 0; i < limit + extraMetrics; i++) {
        monitor.trackMetric('test', i);
      }

      const metrics = monitor.getMetrics();
      expect(metrics).toHaveLength(limit);
      
      // Verify we kept the most recent metrics
      const lastValue = metrics[metrics.length - 1].value;
      expect(lastValue).toBe(limit + extraMetrics - 1);
    });

    it('should handle metrics without metadata', () => {
      monitor.trackMetric('test', 100);
      const metrics = monitor.getMetrics();

      expect(metrics[0].metadata).toBeUndefined();
    });
  });

  describe('Subscription Management', () => {
    it('should notify subscribers of new metrics', () => {
      const callback = jest.fn();
      monitor.subscribe(callback);

      const metric = {
        type: 'test',
        value: 100
      };

      monitor.trackMetric(metric.type, metric.value);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining(metric));
    });

    it('should handle filtered subscriptions', () => {
      const callback = jest.fn();
      const filter = (metric: PerformanceMetric) => metric.value > 50;

      monitor.subscribe(callback, filter);

      monitor.trackMetric('test', 25);
      expect(callback).not.toHaveBeenCalled();

      monitor.trackMetric('test', 75);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscribers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      monitor.subscribe(callback1);
      monitor.subscribe(callback2);

      monitor.trackMetric('test', 100);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing', () => {
      const callback = jest.fn();
      const unsubscribe = monitor.subscribe(callback);

      monitor.trackMetric('test', 100);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      monitor.trackMetric('test', 200);
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called after unsubscribe
    });
  });

  describe('Metric Filtering', () => {
    beforeEach(() => {
      // Add some test metrics
      monitor.trackMetric('type1', 100);
      monitor.trackMetric('type2', 200);
      monitor.trackMetric('type1', 300);
    });

    it('should filter metrics by custom filter', () => {
      const filter = (metric: PerformanceMetric) => metric.type === 'type1';
      const metrics = monitor.getMetrics(filter);

      expect(metrics).toHaveLength(2);
      metrics.forEach(metric => {
        expect(metric.type).toBe('type1');
      });
    });

    it('should filter metrics by time range', () => {
      const now = Date.now();
      const timeRange: TimeRange = {
        start: now - 1000,
        end: now + 1000
      };

      // Add an old metric
      const oldMetric = {
        type: 'old',
        value: 100,
        timestamp: now - 2000
      };
      (monitor as any).metrics.push(oldMetric);

      const metrics = monitor.getMetrics(undefined, timeRange);
      expect(metrics).not.toContainEqual(expect.objectContaining({
        type: 'old',
        value: 100
      }));
    });

    it('should combine custom filter and time range', () => {
      const now = Date.now();
      const timeRange: TimeRange = {
        start: now - 1000,
        end: now + 1000
      };

      const filter = (metric: PerformanceMetric) => metric.value > 150;

      const metrics = monitor.getMetrics(filter, timeRange);
      metrics.forEach(metric => {
        expect(metric.value).toBeGreaterThan(150);
        expect(metric.timestamp).toBeGreaterThanOrEqual(timeRange.start);
        expect(metric.timestamp).toBeLessThanOrEqual(timeRange.end);
      });
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid metric tracking with subscriptions', () => {
      const callback = jest.fn();
      monitor.subscribe(callback);

      const count = 100;
      for (let i = 0; i < count; i++) {
        monitor.trackMetric('rapid-test', i);
      }

      expect(callback).toHaveBeenCalledTimes(count);
    });

    it('should handle multiple subscribers with different filters', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();

      monitor.subscribe(callback1, metric => metric.value < 50);
      monitor.subscribe(callback2, metric => metric.value >= 50);
      monitor.subscribe(callback3); // No filter

      monitor.trackMetric('test', 25);
      monitor.trackMetric('test', 75);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(2);
    });

    it('should maintain metric order', () => {
      const values = [1, 2, 3, 4, 5];
      values.forEach(value => monitor.trackMetric('ordered-test', value));

      const metrics = monitor.getMetrics();
      const retrievedValues = metrics.map(m => m.value);

      expect(retrievedValues).toEqual(values);
    });

    it('should handle complex metadata', () => {
      const complexMetadata = {
        user: {
          id: '123',
          roles: ['admin', 'user']
        },
        context: {
          environment: 'test',
          features: {
            enabled: ['feature1', 'feature2'],
            disabled: ['feature3']
          }
        },
        metrics: {
          counts: {
            success: 10,
            failure: 2
          }
        }
      };

      monitor.trackMetric('complex', 100, complexMetadata);
      const [metric] = monitor.getMetrics();

      expect(metric.metadata).toEqual(complexMetadata);
    });
  });

  describe('Cleanup', () => {
    it('should clear all metrics', () => {
      monitor.trackMetric('test1', 100);
      monitor.trackMetric('test2', 200);
      expect(monitor.getMetrics()).toHaveLength(2);

      monitor.clearMetrics();
      expect(monitor.getMetrics()).toHaveLength(0);
    });

    it('should maintain subscriptions after clearing metrics', () => {
      const callback = jest.fn();
      monitor.subscribe(callback);

      monitor.clearMetrics();
      monitor.trackMetric('test', 100);

      expect(callback).toHaveBeenCalled();
    });
  });
});

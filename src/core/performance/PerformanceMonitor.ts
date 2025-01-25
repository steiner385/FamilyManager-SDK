import type { PerformanceMetric, PerformanceSubscriber, TimeRange } from './types';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private subscribers: PerformanceSubscriber[] = [];
  private readonly metricsLimit = 10000;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackMetric(
    type: string,
    value: number,
    metadata?: Record<string, any>
  ) {
    const metric: PerformanceMetric = {
      type,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.metricsLimit) {
      this.metrics.shift();
    }

    this.notifySubscribers(metric);
  }

  subscribe(
    callback: (metric: PerformanceMetric) => void,
    filter?: (metric: PerformanceMetric) => boolean
  ) {
    const subscriber: PerformanceSubscriber = { callback, filter };
    this.subscribers.push(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  private unsubscribe(subscriber: PerformanceSubscriber) {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers(metric: PerformanceMetric) {
    this.subscribers.forEach(subscriber => {
      if (!subscriber.filter || subscriber.filter(metric)) {
        subscriber.callback(metric);
      }
    });
  }

  getMetrics(
    filter?: (metric: PerformanceMetric) => boolean,
    timeRange?: TimeRange
  ): PerformanceMetric[] {
    let filtered = filter ? this.metrics.filter(filter) : [...this.metrics];
    
    if (timeRange) {
      filtered = filtered.filter(metric => 
        metric.timestamp >= timeRange.start && 
        metric.timestamp <= timeRange.end
      );
    }

    return filtered;
  }

  clearMetrics() {
    this.metrics = [];
  }
}

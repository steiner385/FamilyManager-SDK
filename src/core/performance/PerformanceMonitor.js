export class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.subscribers = [];
        this.metricsLimit = 10000;
    }
    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }
    trackMetric(type, value, metadata) {
        const metric = {
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
    subscribe(callback, filter) {
        const subscriber = { callback, filter };
        this.subscribers.push(subscriber);
        return () => this.unsubscribe(subscriber);
    }
    unsubscribe(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }
    }
    notifySubscribers(metric) {
        this.subscribers.forEach(subscriber => {
            if (!subscriber.filter || subscriber.filter(metric)) {
                subscriber.callback(metric);
            }
        });
    }
    getMetrics(filter, timeRange) {
        let filtered = filter ? this.metrics.filter(filter) : [...this.metrics];
        if (timeRange) {
            filtered = filtered.filter(metric => metric.timestamp >= timeRange.start &&
                metric.timestamp <= timeRange.end);
        }
        return filtered;
    }
    clearMetrics() {
        this.metrics = [];
    }
}
//# sourceMappingURL=PerformanceMonitor.js.map
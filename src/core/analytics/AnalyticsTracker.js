export class AnalyticsTracker {
    static registerHandler(handler) {
        this.handlers.add(handler);
    }
    static trackEvent(event) {
        this.handlers.forEach(handler => handler(event));
    }
    static trackComponentEvent(componentId, action, metadata) {
        this.trackEvent({
            category: 'Component',
            action,
            label: componentId,
            metadata,
        });
    }
}
AnalyticsTracker.handlers = new Set();
//# sourceMappingURL=AnalyticsTracker.js.map
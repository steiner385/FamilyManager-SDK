export class AnalyticsManager {
    constructor() {
        this.providers = new Map();
        this.events = [];
        this.initialized = false;
    }
    static getInstance() {
        if (!AnalyticsManager.instance) {
            AnalyticsManager.instance = new AnalyticsManager();
        }
        return AnalyticsManager.instance;
    }
    async initialize() {
        if (this.initialized)
            return;
        // Initialize all providers
        await Promise.all(Array.from(this.providers.values())
            .map(provider => provider.initialize?.())
            .filter(Boolean));
        this.initialized = true;
    }
    registerProvider(name, provider) {
        this.providers.set(name, provider);
    }
    trackEvent(type, componentId, metadata) {
        const event = {
            type,
            componentId,
            timestamp: Date.now(),
            metadata
        };
        this.events.push(event);
        this.providers.forEach(provider => provider.trackEvent(event));
    }
    getEvents(componentId) {
        if (componentId) {
            return this.events.filter(e => e.componentId === componentId);
        }
        return this.events;
    }
}
//# sourceMappingURL=AnalyticsManager.js.map
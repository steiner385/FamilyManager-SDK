export class PluginMessageBus {
    constructor() {
        this.subscriptions = new Map();
        this.messageHistory = [];
        this.historyLimit = 1000;
    }
    static getInstance() {
        if (!PluginMessageBus.instance) {
            PluginMessageBus.instance = new PluginMessageBus();
        }
        return PluginMessageBus.instance;
    }
    publish(source, type, payload) {
        const message = {
            id: `${source}-${Date.now()}`,
            type,
            payload,
            timestamp: Date.now()
        };
        // Store in history
        this.messageHistory.push(message);
        if (this.messageHistory.length > this.historyLimit) {
            this.messageHistory.shift();
        }
        // Notify subscribers
        this.subscriptions.forEach(subs => {
            subs.forEach(sub => {
                if (!sub.filter || sub.filter(message)) {
                    sub.callback(message);
                }
            });
        });
    }
    subscribe(pluginId, callback, filter) {
        const subs = this.subscriptions.get(pluginId) || [];
        subs.push({ pluginId, callback, filter });
        this.subscriptions.set(pluginId, subs);
        return () => this.unsubscribe(pluginId, callback);
    }
    unsubscribe(pluginId, callback) {
        const subs = this.subscriptions.get(pluginId) || [];
        const filtered = subs.filter(sub => sub.callback !== callback);
        this.subscriptions.set(pluginId, filtered);
    }
    getHistory(filter) {
        return filter
            ? this.messageHistory.filter(filter)
            : [...this.messageHistory];
    }
}
//# sourceMappingURL=PluginMessageBus.js.map
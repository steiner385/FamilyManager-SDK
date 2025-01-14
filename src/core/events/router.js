export class EventRouter {
    constructor(config = {}) {
        this.isRunning = false;
        this.handlers = new Map();
        this.config = {
            maxSubscribers: config.maxSubscribers ?? 100,
            maxChannels: config.maxChannels ?? 50
        };
    }
    async start() {
        if (this.isRunning) {
            throw new Error('Router is already running');
        }
        this.isRunning = true;
    }
    async stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.handlers.clear();
        }
    }
    registerChannel(channel) {
        if (!this.isRunning) {
            throw new Error('Router is not running');
        }
        if (this.handlers.has(channel)) {
            throw new Error(`Channel ${channel} already exists`);
        }
        if (this.handlers.size >= this.config.maxChannels) {
            throw new Error('Maximum number of channels reached');
        }
        this.handlers.set(channel, new Set());
    }
    subscribe(channel, handler) {
        if (!this.isRunning) {
            throw new Error('Router is not running');
        }
        const handlers = this.handlers.get(channel);
        if (!handlers) {
            throw new Error(`Channel ${channel} not found`);
        }
        if (handlers.size >= this.config.maxSubscribers) {
            throw new Error('Maximum number of subscribers reached for channel');
        }
        handlers.add(handler);
        return () => {
            if (!this.isRunning) {
                return; // Silently ignore unsubscribe if router is stopped
            }
            const currentHandlers = this.handlers.get(channel);
            if (currentHandlers?.has(handler)) {
                currentHandlers.delete(handler);
            }
        };
    }
    async route(channel, event) {
        if (!this.isRunning) {
            throw new Error('Router is not running');
        }
        const handlers = this.handlers.get(channel);
        if (!handlers) {
            throw new Error(`Channel ${channel} not found`);
        }
        const errors = [];
        await Promise.all(Array.from(handlers).map(async (handler) => {
            try {
                await handler(event);
            }
            catch (error) {
                errors.push(error instanceof Error ? error : new Error(String(error)));
            }
        }));
        if (errors.length > 0) {
            throw new Error(`Route errors: ${errors.map(e => e.message).join(', ')}`);
        }
    }
    getRunningState() {
        return this.isRunning;
    }
    getChannels() {
        return Array.from(this.handlers.keys());
    }
}
//# sourceMappingURL=router.js.map
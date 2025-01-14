export class EventBatcher {
    constructor(config) {
        this.batch = [];
        this.timer = null;
        this.isRunning = false;
        this.config = config;
    }
    async start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.scheduleFlush();
    }
    async stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.batch.length > 0) {
            await this.flush();
        }
    }
    async addEvent(event) {
        if (!this.isRunning) {
            throw new Error('EventBatcher is not running');
        }
        this.batch.push(event);
        if (this.batch.length >= this.config.maxSize) {
            await this.flush();
        }
    }
    getBatchSize() {
        return this.batch.length;
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        // Reset timer with new interval if running
        if (this.isRunning && this.timer) {
            clearTimeout(this.timer);
            this.scheduleFlush();
        }
    }
    reset() {
        this.batch = [];
        if (this.timer) {
            clearTimeout(this.timer);
            this.scheduleFlush();
        }
    }
    async flush() {
        if (this.batch.length === 0)
            return;
        const eventsToProcess = [...this.batch];
        this.batch = [];
        try {
            await this.config.processBatch(eventsToProcess);
        }
        catch (error) {
            // Re-add events to batch on error
            this.batch = [...eventsToProcess, ...this.batch];
            throw error;
        }
        // Reschedule the flush timer
        if (this.timer) {
            clearTimeout(this.timer);
            this.scheduleFlush();
        }
    }
    scheduleFlush() {
        if (!this.isRunning)
            return;
        this.timer = setTimeout(async () => {
            await this.flush();
        }, this.config.flushInterval);
    }
}
//# sourceMappingURL=batch.js.map
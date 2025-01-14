import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';
export class EventIdentityManager {
    constructor(config = {}) {
        this.config = {
            expirationTime: config.expirationTime || 24 * 60 * 60 * 1000 // Default 24 hours
        };
        this.processedEvents = new Map();
        this.cleanupInterval = null;
        if (this.config.expirationTime) {
            this.startCleanup();
        }
    }
    generateId() {
        return randomUUID();
    }
    generateDeterministicId(input) {
        return createHash('sha256')
            .update(input)
            .digest('hex');
    }
    markProcessed(eventId) {
        this.processedEvents.set(eventId, {
            id: eventId,
            timestamp: Date.now()
        });
    }
    isProcessed(eventId) {
        const event = this.processedEvents.get(eventId);
        if (!event)
            return false;
        // Check expiration if configured
        if (this.config.expirationTime) {
            const now = Date.now();
            if (now - event.timestamp > this.config.expirationTime) {
                this.processedEvents.delete(eventId);
                return false;
            }
        }
        return true;
    }
    isDuplicate(eventId) {
        return this.isProcessed(eventId);
    }
    clear() {
        this.processedEvents.clear();
    }
    startCleanup() {
        // Run cleanup every 1/10th of expiration time or every hour, whichever is smaller
        const interval = Math.min(this.config.expirationTime / 10, 60 * 60 * 1000);
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [id, event] of this.processedEvents.entries()) {
                if (now - event.timestamp > this.config.expirationTime) {
                    this.processedEvents.delete(id);
                }
            }
        }, interval);
    }
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.clear();
    }
}
//# sourceMappingURL=identity.js.map
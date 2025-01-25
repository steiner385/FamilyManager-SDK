import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';

interface IdentityConfig {
  expirationTime?: number;  // Time in ms after which processed events are forgotten
}

interface ProcessedEvent {
  id: string;
  timestamp: number;
}

export class EventIdentityManager {
  private config: IdentityConfig;
  private processedEvents: Map<string, ProcessedEvent>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(config: IdentityConfig = {}) {
    this.config = {
      expirationTime: config.expirationTime || 24 * 60 * 60 * 1000 // Default 24 hours
    };
    this.processedEvents = new Map();
    this.cleanupInterval = null;

    if (this.config.expirationTime) {
      this.startCleanup();
    }
  }

  generateId(): string {
    return randomUUID();
  }

  generateDeterministicId(input: string): string {
    return createHash('sha256')
      .update(input)
      .digest('hex');
  }

  markProcessed(eventId: string): void {
    this.processedEvents.set(eventId, {
      id: eventId,
      timestamp: Date.now()
    });
  }

  isProcessed(eventId: string): boolean {
    const event = this.processedEvents.get(eventId);
    if (!event) return false;

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

  isDuplicate(eventId: string): boolean {
    return this.isProcessed(eventId);
  }

  clear(): void {
    this.processedEvents.clear();
  }

  private startCleanup(): void {
    // Run cleanup every 1/10th of expiration time or every hour, whichever is smaller
    const interval = Math.min(this.config.expirationTime! / 10, 60 * 60 * 1000);
    
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [id, event] of this.processedEvents.entries()) {
        if (now - event.timestamp > this.config.expirationTime!) {
          this.processedEvents.delete(id);
        }
      }
    }, interval);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

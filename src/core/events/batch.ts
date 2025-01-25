import { BaseEvent, EventDeliveryStatus } from './types';

interface BatchConfig {
  maxSize: number;
  flushInterval: number;
  processBatch: (events: BaseEvent[]) => Promise<{ status: EventDeliveryStatus; errors?: string[] }[] | void>;
}

export class EventBatcher {
  private config: BatchConfig;
  private batch: BaseEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config: BatchConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.scheduleFlush();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.batch.length > 0) {
      await this.flush();
    }
  }

  async addEvent(event: BaseEvent): Promise<void> {
    if (!this.isRunning) {
      throw new Error('EventBatcher is not running');
    }

    this.batch.push(event);

    if (this.batch.length >= this.config.maxSize) {
      await this.flush();
    }
  }

  getBatchSize(): number {
    return this.batch.length;
  }

  updateConfig(config: Partial<BatchConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reset timer with new interval if running
    if (this.isRunning && this.timer) {
      clearTimeout(this.timer);
      this.scheduleFlush();
    }
  }

  reset(): void {
    this.batch = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.scheduleFlush();
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length === 0) return;

    const eventsToProcess = [...this.batch];
    this.batch = [];

    try {
      await this.config.processBatch(eventsToProcess);
    } catch (error) {
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

  private scheduleFlush(): void {
    if (!this.isRunning) return;

    this.timer = setTimeout(async () => {
      await this.flush();
    }, this.config.flushInterval);
  }
}

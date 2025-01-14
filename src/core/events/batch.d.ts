import { BaseEvent, EventDeliveryStatus } from './types';
interface BatchConfig {
    maxSize: number;
    flushInterval: number;
    processBatch: (events: BaseEvent[]) => Promise<{
        status: EventDeliveryStatus;
        errors?: string[];
    }[] | void>;
}
export declare class EventBatcher {
    private config;
    private batch;
    private timer;
    private isRunning;
    constructor(config: BatchConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    addEvent(event: BaseEvent): Promise<void>;
    getBatchSize(): number;
    updateConfig(config: Partial<BatchConfig>): void;
    reset(): void;
    flush(): Promise<void>;
    private scheduleFlush;
}
export {};
//# sourceMappingURL=batch.d.ts.map
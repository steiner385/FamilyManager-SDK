import { BaseEvent, EventDeliveryStatus, EventHandler, EventBusConfig } from './types';
export declare class EventBus {
    private static instance;
    private subscriptions;
    private channels;
    private emitterConfig;
    private busConfig;
    private isRunning;
    private constructor();
    static getInstance(config?: EventBusConfig): EventBus;
    static resetInstance(): void;
    getRunningState(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    registerChannel(channel: string): void;
    subscribe<T>(channel: string, handler: EventHandler<T>): string;
    unsubscribe(subscriptionId: string): void;
    emit<T>(event: BaseEvent<T>): Promise<EventDeliveryStatus>;
    private deliverWithRetry;
    getSubscriptionCount(channel: string): number;
    clearSubscriptions(): void;
    getChannels(): string[];
}
export declare const eventBus: EventBus;
//# sourceMappingURL=EventBus.d.ts.map
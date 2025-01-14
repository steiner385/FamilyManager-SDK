import { BaseEvent, EventHandler } from './types';
interface RouterConfig {
    maxSubscribers?: number;
    maxChannels?: number;
}
export declare class EventRouter {
    private config;
    private isRunning;
    private handlers;
    constructor(config?: RouterConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    registerChannel(channel: string): void;
    subscribe<T>(channel: string, handler: EventHandler<T>): () => void;
    route<T>(channel: string, event: BaseEvent<T>): Promise<void>;
    getRunningState(): boolean;
    getChannels(): string[];
}
export {};
//# sourceMappingURL=router.d.ts.map
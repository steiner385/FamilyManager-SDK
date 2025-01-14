import { PoolConfig, PoolEvent, PooledEvent } from './types';
export declare class EventPool {
    private config;
    private pool;
    constructor(config: PoolConfig);
    private initialize;
    acquire(): PooledEvent | null;
    release(event: PooledEvent): void;
    createEvent<T>(data: PoolEvent<T>): PooledEvent<T> | null;
    acquireFromEvent<T>(baseEvent: PoolEvent<T>): PooledEvent<T> | null;
    clear(): void;
    destroy(): void;
    updateConfig(config: Partial<PoolConfig>): void;
    getStats(): {
        size: number;
        available: number;
        inUse: number;
        total: number;
    };
}
//# sourceMappingURL=pool.d.ts.map
type EventCallback = (...args: any[]) => void | Promise<void>;
export declare class ComponentEventEmitter {
    private events;
    on(event: string, callback: EventCallback): () => void;
    off(event: string, callback?: EventCallback): void;
    emit(event: string, ...args: any[]): void;
    emitAsync(event: string, ...args: any[]): Promise<void>;
    clear(): void;
}
export {};
//# sourceMappingURL=ComponentEventEmitter.d.ts.map
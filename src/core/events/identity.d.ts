interface IdentityConfig {
    expirationTime?: number;
}
export declare class EventIdentityManager {
    private config;
    private processedEvents;
    private cleanupInterval;
    constructor(config?: IdentityConfig);
    generateId(): string;
    generateDeterministicId(input: string): string;
    markProcessed(eventId: string): void;
    isProcessed(eventId: string): boolean;
    isDuplicate(eventId: string): boolean;
    clear(): void;
    private startCleanup;
    destroy(): void;
}
export {};
//# sourceMappingURL=identity.d.ts.map
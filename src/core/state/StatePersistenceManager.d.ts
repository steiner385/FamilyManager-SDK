interface PersistenceConfig {
    storage?: 'local' | 'session' | 'memory';
    version?: number;
    serialize?: (state: any) => string;
    deserialize?: (data: string) => any;
    migrate?: (state: any, version: number) => any;
}
export declare class StatePersistenceManager {
    private static instance;
    private memoryStorage;
    static getInstance(): StatePersistenceManager;
    persist(key: string, state: any, config?: PersistenceConfig): void;
    retrieve(key: string, config?: PersistenceConfig): any;
    remove(key: string, storage?: 'local' | 'session' | 'memory'): void;
}
export {};
//# sourceMappingURL=StatePersistenceManager.d.ts.map
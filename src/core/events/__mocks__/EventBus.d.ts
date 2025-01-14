export declare class EventBus {
    private static instance;
    private isRunning;
    private handlers;
    private startPromise;
    private logger;
    publish: jest.Mock<any, any, any>;
    getRunningState: jest.Mock<any, any, any>;
    registerChannel: jest.Mock<any, any, any>;
    start: jest.Mock<any, any, any>;
    stop: jest.Mock<any, any, any>;
    subscribe: jest.Mock<any, any, any>;
    ensureRunning: jest.Mock<any, any, any>;
    unsubscribe: jest.Mock<any, any, any>;
    getChannels: jest.Mock<any, any, any>;
    restart: jest.Mock<any, any, any>;
    static getInstance(): EventBus;
    static resetInstance(): void;
}
//# sourceMappingURL=EventBus.d.ts.map
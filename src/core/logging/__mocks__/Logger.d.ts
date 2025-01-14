export declare class Logger {
    private static instance;
    private logger;
    static getInstance(): Logger;
    error: jest.Mock<any, any, any>;
    warn: jest.Mock<any, any, any>;
    info: jest.Mock<any, any, any>;
    debug: jest.Mock<any, any, any>;
    setLogger: jest.Mock<any, any, any>;
    log: jest.Mock<any, any, any>;
}
//# sourceMappingURL=Logger.d.ts.map
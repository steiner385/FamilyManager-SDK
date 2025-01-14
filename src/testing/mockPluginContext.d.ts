export declare function mockPluginContext(overrides?: {}): {
    eventBus: {
        emit: jest.Mock<any, any, any>;
        subscribe: jest.Mock<any, any, any>;
        unsubscribe: jest.Mock<any, any, any>;
    };
    logger: {
        debug: jest.Mock<any, any, any>;
        info: jest.Mock<any, any, any>;
        warn: jest.Mock<any, any, any>;
        error: jest.Mock<any, any, any>;
    };
    config: {};
};
//# sourceMappingURL=mockPluginContext.d.ts.map
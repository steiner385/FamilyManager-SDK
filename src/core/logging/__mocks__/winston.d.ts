interface WinstonFormat {
    type: string;
    formats?: WinstonFormat[];
}
declare const winston: {
    createLogger: jest.Mock<any, any, any>;
    format: {
        timestamp: jest.Mock<any, any, any>;
        json: jest.Mock<any, any, any>;
        combine: jest.Mock<any, any, any>;
        colorize: jest.Mock<any, any, any>;
        simple: jest.Mock<any, any, any>;
    };
    transports: {
        Console: jest.Mock<any, any, any>;
    };
    __formats: {
        timestamp: WinstonFormat;
        json: WinstonFormat;
        combined: WinstonFormat;
    };
};
export default winston;
//# sourceMappingURL=winston.d.ts.map
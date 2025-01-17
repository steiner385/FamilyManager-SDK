const timestampFormat = { type: 'timestamp' };
const jsonFormat = { type: 'json' };
const combinedFormat = {
    type: 'combined',
    formats: [timestampFormat, jsonFormat]
};
const mockFormat = {
    timestamp: jest.fn().mockReturnValue(timestampFormat),
    json: jest.fn().mockReturnValue(jsonFormat),
    combine: jest.fn().mockReturnValue(combinedFormat),
    colorize: jest.fn().mockReturnValue({ type: 'colorize' }),
    simple: jest.fn().mockReturnValue({ type: 'simple' })
};
const mockLogger = {
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};
const winston = {
    createLogger: jest.fn().mockReturnValue(mockLogger),
    format: mockFormat,
    transports: {
        Console: jest.fn().mockImplementation(() => ({
            format: mockFormat.combine(mockFormat.colorize(), mockFormat.simple())
        }))
    },
    __formats: {
        timestamp: timestampFormat,
        json: jsonFormat,
        combined: combinedFormat
    }
};
export default winston;
//# sourceMappingURL=winston.js.map